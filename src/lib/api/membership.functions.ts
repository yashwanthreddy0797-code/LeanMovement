import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { planAmountInr, toMembershipPlan, PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";
import { activateMembershipForUser } from "@/lib/membership/activate";
import { runMembershipLifecycleJob } from "@/lib/membership/renewal";
import {
  createRazorpayOrder,
  createRazorpaySubscription,
  ensureMonthlyPlanId,
  fetchRazorpayPayment,
  fetchRazorpaySubscription,
  subscriptionsEnabled,
  verifyPaymentSignature,
  verifySubscriptionPaymentSignature,
} from "@/lib/razorpay.server";
import { getSupabaseAdmin, isRazorpayConfigured } from "@/lib/supabase/server";
import type { MembershipPlan } from "@/lib/supabase/types";

export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  return {
    razorpayEnabled: isRazorpayConfigured(),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? null,
    amountInr: PROGRAM_AMOUNT_INR,
    subscriptionsPreferred: subscriptionsEnabled(),
  };
});

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
      renewsAt: membership?.renews_at ?? null,
      subscriptionId: membership?.razorpay_subscription_id ?? null,
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

async function createCheckoutForUser(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  profile: { id: string; email: string; full_name: string | null },
  opts?: { forceOneTime?: boolean; kind?: "initial" | "renewal" },
) {
  const { data: membership } = await admin
    .from("memberships")
    .select("plan, amount_inr, status, razorpay_subscription_id")
    .eq("user_id", profile.id)
    .maybeSingle();

  const plan = (membership?.plan ?? "monthly") as MembershipPlan;
  const amountInr = membership?.amount_inr ?? planAmountInr(plan);
  const kind = opts?.kind ?? (membership?.status === "active" ? "renewal" : "initial");

  // Prefer Razorpay Subscriptions for autopay when available
  if (!opts?.forceOneTime && subscriptionsEnabled()) {
    try {
      const planId = await ensureMonthlyPlanId();
      const { subscription, keyId } = await createRazorpaySubscription({
        planId,
        notes: {
          user_id: profile.id,
          email: profile.email,
          plan,
          kind,
        },
      });

      await admin
        .from("memberships")
        .update({ razorpay_subscription_id: subscription.id })
        .eq("user_id", profile.id);

      await admin
        .from("enrollment_intents")
        .update({
          payment_method: "razorpay",
          updated_at: new Date().toISOString(),
        })
        .eq("email", profile.email);

      return {
        ok: true as const,
        mode: "subscription" as const,
        subscriptionId: subscription.id,
        orderId: null as string | null,
        amountPaise: Math.round(amountInr * 100),
        amountInr,
        currency: "INR",
        keyId,
        plan,
        email: profile.email,
        fullName: profile.full_name,
        kind,
      };
    } catch (err) {
      console.warn("[razorpay] subscription unavailable, falling back to order:", err);
    }
  }

  const { order, keyId, amountPaise } = await createRazorpayOrder({
    amountInr,
    receipt: `lk_${profile.id.slice(0, 8)}_${Date.now()}`,
    notes: {
      user_id: profile.id,
      email: profile.email,
      plan,
      kind,
    },
  });

  await admin
    .from("enrollment_intents")
    .update({
      payment_method: "razorpay",
      razorpay_order_id: order.id,
      updated_at: new Date().toISOString(),
    })
    .eq("email", profile.email);

  return {
    ok: true as const,
    mode: "order" as const,
    subscriptionId: null as string | null,
    orderId: order.id,
    amountPaise,
    amountInr,
    currency: "INR",
    keyId,
    plan,
    email: profile.email,
    fullName: profile.full_name,
    kind,
  };
}

/** Create Razorpay order or subscription for registration / renewal */
export const createMemberRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      forceOneTime: z.boolean().optional(),
      kind: z.enum(["initial", "renewal"]).optional(),
    }),
  )
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

    try {
      return await createCheckoutForUser(admin, profile, {
        forceOneTime: data.forceOneTime,
        kind: data.kind,
      });
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Could not create payment",
      };
    }
  });

/** Verify Razorpay payment (order or subscription) and activate / renew */
export const verifyMemberRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      razorpay_order_id: z.string().optional(),
      razorpay_subscription_id: z.string().optional(),
      razorpay_payment_id: z.string().min(1),
      razorpay_signature: z.string().min(1),
      kind: z.enum(["initial", "renewal"]).optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!isRazorpayConfigured()) {
      return { ok: false as const, message: "Razorpay not configured" };
    }

    const isSubscription = Boolean(data.razorpay_subscription_id);

    if (isSubscription) {
      const valid = verifySubscriptionPaymentSignature(
        data.razorpay_payment_id,
        data.razorpay_subscription_id!,
        data.razorpay_signature,
      );
      if (!valid) {
        return { ok: false as const, message: "Payment verification failed" };
      }
    } else {
      if (!data.razorpay_order_id) {
        return { ok: false as const, message: "Missing order id" };
      }
      const valid = verifyPaymentSignature(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature,
      );
      if (!valid) {
        return { ok: false as const, message: "Payment verification failed" };
      }
    }

    const payment = await fetchRazorpayPayment(data.razorpay_payment_id);
    if (!payment) {
      return { ok: false as const, message: "Payment not found" };
    }
    if (!isSubscription && payment.order_id !== data.razorpay_order_id) {
      return { ok: false as const, message: "Payment order mismatch" };
    }
    if (payment.status !== "captured" && payment.status !== "authorized") {
      return { ok: false as const, message: "Payment not completed" };
    }

    if (isSubscription) {
      const sub = await fetchRazorpaySubscription(data.razorpay_subscription_id!);
      if (!sub) {
        return { ok: false as const, message: "Subscription not found" };
      }
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

    const plan = (membership?.plan ?? "monthly") as MembershipPlan;
    const amountInr = membership?.amount_inr ?? Math.round(payment.amount / 100);
    const kind =
      data.kind ??
      (membership?.status === "active" || membership?.status === "past_due" ? "renewal" : "initial");

    try {
      const result = await activateMembershipForUser(admin, {
        userId: profile.id,
        email: profile.email,
        plan,
        paymentId: data.razorpay_payment_id,
        amountInr,
        subscriptionId: data.razorpay_subscription_id,
        kind,
      });
      return {
        ok: true as const,
        alreadyActive: Boolean(result.alreadyProcessed),
        kind,
      };
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Could not activate membership",
      };
    }
  });

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

/** Cron: past_due / expired + renewal reminder queue. Protect with CRON_SECRET. */
export const runMembershipCron = createServerFn({ method: "POST" })
  .inputValidator(z.object({ secret: z.string() }))
  .handler(async ({ data }) => {
    const expected = process.env.CRON_SECRET;
    if (!expected || data.secret !== expected) {
      return { ok: false as const, message: "Unauthorized" };
    }
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };
    const result = await runMembershipLifecycleJob(admin);
    return { ok: true as const, ...result };
  });
