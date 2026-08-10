import { PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";
import {
  fetchRazorpayPayment,
  fetchRazorpayPlan,
  fetchRazorpaySubscription,
  razorpayUnixToIso,
} from "@/lib/razorpay.server";
import { isRazorpayConfigured } from "@/lib/supabase/server";
import type { Membership, MembershipStatus } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Admin = SupabaseClient<Database>;

const STALE_MARKETING_AMOUNTS = new Set([5999, 9999, 14999]);
const MONTHLY_RENEW_SANITY_DAYS = 45;

export type MemberBillingDetails = {
  planLabel: string;
  planPeriod: string;
  priceInr: number;
  status: MembershipStatus | string;
  renewsAt: string | null;
  memberSince: string | null;
  lastPaymentAmountInr: number | null;
  lastPaymentAt: string | null;
  subscriptionId: string | null;
  paymentId: string | null;
  source: "razorpay" | "local";
  razorpaySynced: boolean;
};

function mapSubscriptionStatus(status: string): MembershipStatus {
  switch (status) {
    case "active":
    case "authenticated":
    case "activated":
      return "active";
    case "pending":
    case "halted":
    case "paused":
      return "past_due";
    case "cancelled":
      return "cancelled";
    case "completed":
    case "expired":
      return "expired";
    default:
      return "active";
  }
}

function cleanPlanLabel(name?: string | null) {
  if (!name?.trim()) return "Lean Movement";
  return (
    name
      .replace(/^LEANMOVEMENT\s+/i, "")
      .replace(/\s*-\s*monthly.*/i, "")
      .trim() || "Lean Movement"
  );
}

function saneLocalRenewsAt(membership: Membership | null, planPeriod: string): string | null {
  const renewsAt = membership?.renews_at ?? null;
  if (!renewsAt) return null;
  if (planPeriod !== "monthly") return renewsAt;

  const daysAhead = (new Date(renewsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000);
  // Old coach/seed rows used +365 days — don't show that as a monthly renewal.
  if (daysAhead > MONTHLY_RENEW_SANITY_DAYS) {
    const base = membership?.started_at ? new Date(membership.started_at) : new Date();
    const next = new Date(base);
    next.setMonth(next.getMonth() + 1);
    while (next.getTime() < Date.now()) {
      next.setMonth(next.getMonth() + 1);
    }
    return next.toISOString();
  }
  return renewsAt;
}

function resolveLocalPriceInr(membership: Membership | null) {
  const amount = membership?.amount_inr;
  if (amount == null || amount <= 0 || STALE_MARKETING_AMOUNTS.has(amount)) {
    return PROGRAM_AMOUNT_INR;
  }
  return amount;
}

export async function resolveMemberBillingDetails(
  admin: Admin,
  membership: Membership | null,
): Promise<MemberBillingDetails> {
  const planPeriod = membership?.plan === "quarterly" ? "quarterly" : "monthly";
  let planLabel = "Lean Movement";
  let priceInr = resolveLocalPriceInr(membership);
  let status: MembershipStatus | string = membership?.status ?? "pending";
  let renewsAt = saneLocalRenewsAt(membership, planPeriod);
  let memberSince = membership?.started_at ?? null;
  let lastPaymentAmountInr: number | null = null;
  let lastPaymentAt: string | null = null;
  let source: "razorpay" | "local" = "local";
  let razorpaySynced = false;

  const subscriptionId = membership?.razorpay_subscription_id ?? null;
  const paymentId = membership?.razorpay_payment_id ?? null;

  if (isRazorpayConfigured() && subscriptionId) {
    try {
      const sub = await fetchRazorpaySubscription(subscriptionId);
      if (sub) {
        source = "razorpay";
        status = mapSubscriptionStatus(sub.status);
        renewsAt =
          razorpayUnixToIso(sub.charge_at) ?? razorpayUnixToIso(sub.current_end) ?? renewsAt;
        memberSince =
          razorpayUnixToIso(sub.current_start) && !memberSince
            ? razorpayUnixToIso(sub.current_start)
            : memberSince;

        if (sub.plan_id) {
          const plan = await fetchRazorpayPlan(sub.plan_id);
          if (plan?.item) {
            priceInr = Math.round(plan.item.amount / 100);
            planLabel = cleanPlanLabel(plan.item.name);
          }
        }
      }
    } catch (err) {
      console.warn("[billing] subscription fetch failed", err);
    }
  }

  if (isRazorpayConfigured() && paymentId) {
    try {
      const payment = await fetchRazorpayPayment(paymentId);
      if (payment && (payment.status === "captured" || payment.status === "authorized")) {
        source = "razorpay";
        lastPaymentAmountInr = Math.round(payment.amount / 100);
        lastPaymentAt = razorpayUnixToIso(payment.created_at);
        // One-time checkout: charged amount is the source of truth for plan price.
        if (!subscriptionId && lastPaymentAmountInr > 0) {
          priceInr = lastPaymentAmountInr;
        }
      }
    } catch (err) {
      console.warn("[billing] payment fetch failed", err);
    }
  }

  if (!lastPaymentAmountInr && priceInr > 0 && membership?.status === "active") {
    lastPaymentAmountInr = priceInr;
  }

  // Keep Supabase in sync when Razorpay returned fresher truth.
  if (source === "razorpay" && membership?.user_id) {
    const patch: Record<string, unknown> = {};
    if (priceInr > 0 && membership.amount_inr !== priceInr) {
      patch.amount_inr = priceInr;
    }
    if (renewsAt && membership.renews_at !== renewsAt) {
      patch.renews_at = renewsAt;
    }
    if (
      (status === "active" ||
        status === "past_due" ||
        status === "cancelled" ||
        status === "expired") &&
      membership.status !== status
    ) {
      patch.status = status;
    }

    if (Object.keys(patch).length > 0) {
      const { error } = await admin
        .from("memberships")
        .update(patch)
        .eq("user_id", membership.user_id);
      if (error) {
        console.warn("[billing] membership sync failed", error.message);
      } else {
        razorpaySynced = true;
      }
    }
  } else if (
    membership?.user_id &&
    (STALE_MARKETING_AMOUNTS.has(membership.amount_inr ?? 0) ||
      (membership.renews_at && membership.renews_at !== renewsAt && renewsAt))
  ) {
    // Correct obvious seed/stale local rows even without Razorpay ids.
    const patch: Record<string, unknown> = {
      amount_inr: priceInr,
      plan: "monthly",
    };
    if (renewsAt) patch.renews_at = renewsAt;
    const { error } = await admin
      .from("memberships")
      .update(patch)
      .eq("user_id", membership.user_id);
    if (!error) razorpaySynced = true;
  }

  return {
    planLabel,
    planPeriod,
    priceInr,
    status,
    renewsAt,
    memberSince,
    lastPaymentAmountInr,
    lastPaymentAt,
    subscriptionId,
    paymentId,
    source,
    razorpaySynced,
  };
}
