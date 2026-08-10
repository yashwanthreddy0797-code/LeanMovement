import { planAmountInr } from "@/lib/enrollment/plans";
import { sendWelcomeEmailAfterPayment } from "@/lib/email/welcome-mail.server";
import { recordVerifiedPayment, extendMembershipRenewal } from "@/lib/membership/renewal";
import { pushCoachRegistrationAlert } from "@/lib/coach-notify";
import { getEnrollmentFromSiteConfig } from "@/lib/enrollment/store";
import { fetchRazorpaySubscription, razorpayUnixToIso } from "@/lib/razorpay.server";
import { DEFAULT_SESSION_IDS, getWeekStartDate } from "@/lib/sessions";
import type { MembershipPlan } from "@/lib/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Admin = SupabaseClient<Database>;

export async function activateMembershipForUser(
  admin: Admin,
  input: {
    userId: string;
    email: string;
    plan: MembershipPlan;
    paymentId: string;
    amountInr?: number;
    subscriptionId?: string | null;
    kind?: "initial" | "renewal";
  },
) {
  const amountInr = input.amountInr ?? planAmountInr(input.plan);
  const kind = input.kind ?? "initial";

  const ledger = await recordVerifiedPayment(admin, {
    paymentId: input.paymentId,
    userId: input.userId,
    email: input.email,
    amountInr,
    subscriptionId: input.subscriptionId,
    kind,
  });

  if (ledger.duplicate && kind === "initial") {
    const { data: m } = await admin
      .from("memberships")
      .select("status")
      .eq("user_id", input.userId)
      .maybeSingle();
    if (m?.status === "active") return { alreadyProcessed: true as const };
  }

  let renewsAt: string | null = null;
  if (input.subscriptionId) {
    try {
      const sub = await fetchRazorpaySubscription(input.subscriptionId);
      renewsAt = razorpayUnixToIso(sub?.charge_at) ?? razorpayUnixToIso(sub?.current_end) ?? null;
    } catch (err) {
      console.warn("[activateMembership] subscription renews_at fetch failed", err);
    }
  }

  await extendMembershipRenewal(admin, {
    userId: input.userId,
    plan: input.plan,
    paymentId: input.paymentId,
    amountInr,
    subscriptionId: input.subscriptionId,
    renewsAt,
  });

  const now = new Date().toISOString();
  const { error: intentError } = await admin
    .from("enrollment_intents")
    .update({
      status: "account_created",
      payment_method: "razorpay",
      payment_confirmed_at: now,
      razorpay_payment_id: input.paymentId,
      updated_at: now,
    })
    .eq("email", input.email)
    .in("status", ["pending_payment", "account_created"]);

  if (intentError) {
    console.warn("[activateMembership] enrollment_intents update:", intentError.message);
  }

  await admin.from("onboarding").upsert({
    user_id: input.userId,
    session_ids: DEFAULT_SESSION_IDS,
    sessions_selected_at: now,
  });

  const weekStart = getWeekStartDate();
  await admin.from("member_weekly_picks").upsert(
    {
      user_id: input.userId,
      week_start: weekStart,
      session_ids: DEFAULT_SESSION_IDS,
      updated_at: now,
    },
    { onConflict: "user_id,week_start" },
  );

  if (kind === "initial" && !ledger.duplicate) {
    const config = await getEnrollmentFromSiteConfig(admin, input.email);
    const { data: profile } = await admin
      .from("profiles")
      .select("full_name")
      .eq("id", input.userId)
      .maybeSingle();

    try {
      await pushCoachRegistrationAlert(admin, {
        email: input.email,
        full_name: profile?.full_name ?? config?.full_name ?? input.email,
        phone: config?.phone ?? null,
        amount_inr: amountInr,
        session_ids: config?.session_ids?.length ? config.session_ids : DEFAULT_SESSION_IDS,
      });
    } catch (err) {
      console.warn("[activateMembership] coach alert failed", err);
    }

    try {
      const welcome = await sendWelcomeEmailAfterPayment({
        email: input.email,
        fullName: profile?.full_name ?? config?.full_name ?? input.email.split("@")[0],
        amountInr,
      });
      if (!welcome.ok) {
        console.warn("[activateMembership] welcome email skipped:", welcome.error);
      }
    } catch (err) {
      console.warn("[activateMembership] welcome email failed", err);
    }
  }

  return { alreadyProcessed: false as const };
}
