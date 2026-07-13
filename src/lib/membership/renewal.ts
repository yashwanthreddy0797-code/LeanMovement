import type { SupabaseClient } from "@supabase/supabase-js";
import { planAmountInr } from "@/lib/enrollment/plans";
import { MEMBERSHIP_GRACE_DAYS, RENEWAL_REMINDER_DAYS_BEFORE, addDays } from "@/lib/membership/access";
import { membershipRenewalIso } from "@/lib/razorpay.server";
import type { MembershipPlan } from "@/lib/supabase/types";

type Admin = SupabaseClient;

const PAYMENT_LEDGER_PREFIX = "payment:";

/** Idempotent payment ledger in site_config (no DB migration required). */
export async function recordVerifiedPayment(
  admin: Admin,
  input: {
    paymentId: string;
    userId: string;
    email: string;
    amountInr: number;
    orderId?: string | null;
    subscriptionId?: string | null;
    kind: "initial" | "renewal";
  },
) {
  const key = `${PAYMENT_LEDGER_PREFIX}${input.paymentId}`;
  const { data: existing } = await admin.from("site_config").select("key").eq("key", key).maybeSingle();
  if (existing) return { duplicate: true as const };

  await admin.from("site_config").upsert({
    key,
    value: JSON.stringify({
      ...input,
      verified_at: new Date().toISOString(),
    }),
    updated_at: new Date().toISOString(),
  });

  return { duplicate: false as const };
}

export async function extendMembershipRenewal(
  admin: Admin,
  input: {
    userId: string;
    plan: MembershipPlan;
    paymentId: string;
    amountInr?: number;
    subscriptionId?: string | null;
  },
) {
  const amountInr = input.amountInr ?? planAmountInr(input.plan);
  const renewsAt = membershipRenewalIso(input.plan);
  const now = new Date().toISOString();

  const patch: Record<string, unknown> = {
    status: "active",
    plan: input.plan,
    amount_inr: amountInr,
    renews_at: renewsAt,
    razorpay_payment_id: input.paymentId,
    cancelled_at: null,
  };
  if (input.subscriptionId) {
    patch.razorpay_subscription_id = input.subscriptionId;
  }

  const { data: existing } = await admin
    .from("memberships")
    .select("started_at")
    .eq("user_id", input.userId)
    .maybeSingle();

  if (!existing?.started_at) {
    patch.started_at = now;
  }

  const { error } = await admin.from("memberships").update(patch).eq("user_id", input.userId);
  if (error) throw new Error(error.message);

  return { renewsAt };
}

/** Daily job: mark past_due / expired and list members needing renewal reminder. */
export async function runMembershipLifecycleJob(admin: Admin) {
  const now = new Date();
  const { data: rows, error } = await admin
    .from("memberships")
    .select("user_id, status, renews_at, razorpay_subscription_id")
    .in("status", ["active", "past_due"]);

  if (error) throw new Error(error.message);

  let markedPastDue = 0;
  let markedExpired = 0;
  const reminderUserIds: string[] = [];

  for (const row of rows ?? []) {
    if (!row.renews_at) continue;
    const renews = new Date(row.renews_at);
    const graceEnd = addDays(renews, MEMBERSHIP_GRACE_DAYS);

    if (row.status === "active" && now > renews) {
      await admin.from("memberships").update({ status: "past_due" }).eq("user_id", row.user_id);
      markedPastDue += 1;
    }

    if (
      (row.status === "past_due" || (row.status === "active" && now > renews)) &&
      now > graceEnd
    ) {
      await admin
        .from("memberships")
        .update({ status: "expired" })
        .eq("user_id", row.user_id);
      markedExpired += 1;
      continue;
    }

    const msUntil = renews.getTime() - now.getTime();
    const daysUntil = msUntil / (24 * 60 * 60 * 1000);
    if (
      row.status === "active" &&
      daysUntil <= RENEWAL_REMINDER_DAYS_BEFORE &&
      daysUntil >= 0
    ) {
      reminderUserIds.push(row.user_id);
    }
  }

  // Persist reminder queue for coach dashboard
  if (reminderUserIds.length) {
    await admin.from("site_config").upsert({
      key: "renewal_reminders",
      value: JSON.stringify({
        updated_at: now.toISOString(),
        user_ids: reminderUserIds,
      }),
      updated_at: now.toISOString(),
    });
  }

  return { markedPastDue, markedExpired, reminderCount: reminderUserIds.length, reminderUserIds };
}

export { MEMBERSHIP_GRACE_DAYS, RENEWAL_REMINDER_DAYS_BEFORE };
