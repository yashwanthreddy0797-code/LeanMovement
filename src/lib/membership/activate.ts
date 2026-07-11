import { planAmountInr } from "@/lib/enrollment/plans";
import { membershipRenewalIso } from "@/lib/razorpay.server";
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
  },
) {
  const amountInr = input.amountInr ?? planAmountInr(input.plan);
  const now = new Date().toISOString();

  const { error: membershipError } = await admin
    .from("memberships")
    .update({
      status: "active",
      plan: input.plan,
      amount_inr: amountInr,
      started_at: now,
      renews_at: membershipRenewalIso(input.plan),
      razorpay_payment_id: input.paymentId,
    })
    .eq("user_id", input.userId);

  if (membershipError) throw new Error(membershipError.message);

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
    // enrollment_intents table may not exist on older DBs — membership activation still counts
    console.warn("[activateMembership] enrollment_intents update:", intentError.message);
  }

  await admin.from("onboarding").upsert({ user_id: input.userId });
}
