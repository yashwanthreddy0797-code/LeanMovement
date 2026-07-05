import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { planAmountInr, toMembershipPlan } from "@/lib/enrollment/plans";
import { getSupabaseAdmin, isRazorpayConfigured } from "@/lib/supabase/server";

/** Returns whether Razorpay is configured — checkout UI uses this */
export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    razorpayEnabled: isRazorpayConfigured(),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
  };
});

/** Checkout page — plan, amount, and manual payment details for pending members */
export const getMemberCheckout = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return { ok: false as const, message: "Server not configured" };
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", data.userId)
      .maybeSingle();

    if (profileError || !profile) {
      return { ok: false as const, message: "Account not found" };
    }

    const { data: membership } = await admin
      .from("memberships")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();

    const { data: configRows } = await admin.from("site_config").select("key, value");
    const config = Object.fromEntries((configRows ?? []).map((r) => [r.key, r.value]));

    const plan = membership?.plan ?? "monthly";
    const amountInr = membership?.amount_inr ?? planAmountInr(plan);

    return {
      ok: true as const,
      email: profile.email,
      fullName: profile.full_name,
      plan,
      amountInr,
      status: membership?.status ?? "pending",
      razorpayEnabled: isRazorpayConfigured(),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
      paymentUpi: config.payment_upi_id ?? process.env.PAYMENT_UPI_ID ?? null,
      paymentInstructions:
        config.payment_instructions ??
        process.env.PAYMENT_INSTRUCTIONS ??
        "Pay via UPI or bank transfer. Share the payment screenshot with your coach on WhatsApp.",
      supportWhatsapp: config.support_whatsapp ?? config.whatsapp_invite_url ?? null,
    };
  });

/** Razorpay webhook stub — wire when client has account */
export const handleRazorpayWebhook = createServerFn({ method: "POST" })
  .inputValidator(z.object({ event: z.string(), payload: z.record(z.unknown()) }))
  .handler(async ({ data }) => {
    if (!isRazorpayConfigured()) {
      return { ok: false, message: "Razorpay not configured" };
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      return { ok: false, message: "Supabase admin not configured" };
    }

    // TODO: verify webhook signature with RAZORPAY_WEBHOOK_SECRET
    // TODO: on payment.captured / subscription.activated → activate membership by email

    return { ok: true, received: data.event, message: "Webhook handler ready — implement verification" };
  });

/** Activate membership after manual payment or webhook */
export const activateMembershipByEmail = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email(), plan: z.string().optional() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false, message: "Server not configured" };

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    if (!profile) return { ok: false, message: "User not found" };

    const plan = toMembershipPlan(data.plan ?? "monthly");

    const { error } = await admin
      .from("memberships")
      .update({
        status: "active",
        plan,
        started_at: new Date().toISOString(),
        amount_inr: planAmountInr(plan),
      })
      .eq("user_id", profile.id);

    if (error) return { ok: false, message: error.message };
    return { ok: true };
  });
