import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { planAmountInr, toMembershipPlan } from "@/lib/enrollment/plans";
import { activateMembershipForUser } from "@/lib/membership/activate";
import {
  createRazorpayOrder,
  fetchRazorpayPayment,
  verifyPaymentSignature,
} from "@/lib/razorpay.server";
import { getSupabaseAdmin, isRazorpayConfigured } from "@/lib/supabase/server";
import type { MembershipPlan } from "@/lib/supabase/types";

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

/** Create a Razorpay order for the logged-in member */
export const createMemberRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    if (!isRazorpayConfigured()) {
      return { ok: false as const, message: "Razorpay not configured" };
    }

    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const { data: profile } = await admin
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile) return { ok: false as const, message: "Account not found" };

    const { data: membership } = await admin
      .from("memberships")
      .select("plan, amount_inr, status")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (membership?.status === "active") {
      return { ok: false as const, message: "Membership already active" };
    }

    const plan = (membership?.plan ?? "monthly") as MembershipPlan;
    const amountInr = membership?.amount_inr ?? planAmountInr(plan);

    try {
      const { order, keyId, amountPaise } = await createRazorpayOrder({
        amountInr,
        receipt: `lk_${profile.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          user_id: profile.id,
          email: profile.email,
          plan,
        },
      });

      const { error: intentError } = await admin
        .from("enrollment_intents")
        .update({
          payment_method: "razorpay",
          razorpay_order_id: order.id,
          updated_at: new Date().toISOString(),
        })
        .eq("email", profile.email);
      if (intentError) {
        console.warn("[razorpay] enrollment_intents update:", intentError.message);
      }

      return {
        ok: true as const,
        orderId: order.id,
        amountPaise,
        amountInr,
        currency: "INR",
        keyId,
        plan,
        email: profile.email,
        fullName: profile.full_name,
      };
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Could not create payment order",
      };
    }
  });

/** Verify Razorpay payment signature and activate membership */
export const verifyMemberRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    if (!isRazorpayConfigured()) {
      return { ok: false as const, message: "Razorpay not configured" };
    }

    const valid = verifyPaymentSignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature,
    );
    if (!valid) {
      return { ok: false as const, message: "Payment verification failed" };
    }

    const payment = await fetchRazorpayPayment(data.razorpay_payment_id);
    if (!payment || payment.order_id !== data.razorpay_order_id) {
      return { ok: false as const, message: "Payment not found" };
    }
    if (payment.status !== "captured" && payment.status !== "authorized") {
      return { ok: false as const, message: "Payment not completed" };
    }

    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const { data: profile } = await admin
      .from("profiles")
      .select("id, email")
      .eq("id", data.userId)
      .maybeSingle();

    if (!profile) return { ok: false as const, message: "Account not found" };

    const { data: membership } = await admin
      .from("memberships")
      .select("plan, amount_inr, status")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (membership?.status === "active") {
      return { ok: true as const, alreadyActive: true as const };
    }

    const plan = (membership?.plan ?? "monthly") as MembershipPlan;
    const amountInr = membership?.amount_inr ?? Math.round(payment.amount / 100);

    try {
      await activateMembershipForUser(admin, {
        userId: profile.id,
        email: profile.email,
        plan,
        paymentId: data.razorpay_payment_id,
        amountInr,
      });
      return { ok: true as const, alreadyActive: false as const };
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Could not activate membership",
      };
    }
  });

/** Razorpay webhook — prefer POST /api/razorpay/webhook (server.ts) */
export const handleRazorpayWebhook = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      rawBody: z.string(),
      signature: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { processRazorpayWebhook } = await import("@/lib/razorpay-webhook");
    const result = await processRazorpayWebhook(data.rawBody, data.signature);
    return result.body;
  });

/** Activate membership after manual payment (coach fallback) */
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

    try {
      await activateMembershipForUser(admin, {
        userId: profile.id,
        email: data.email,
        plan,
        paymentId: `manual_${Date.now()}`,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : "Activation failed" };
    }
  });
