import { createHmac, timingSafeEqual } from "node:crypto";
import type { MembershipPlan } from "@/lib/supabase/types";
import { PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};

type RazorpaySubscription = {
  id: string;
  status: string;
  plan_id: string;
};

function getCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured");
  }
  return { keyId, keySecret };
}

function authHeader(keyId: string, keySecret: string) {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret = process.env.RAZORPAY_KEY_SECRET,
) {
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/** Subscription checkout signature: payment_id|subscription_id */
export function verifySubscriptionPaymentSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string,
  secret = process.env.RAZORPAY_KEY_SECRET,
) {
  if (!secret) return false;
  const expected = createHmac("sha256", secret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(rawBody: string, signature: string, secret?: string) {
  const webhookSecret = secret ?? process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return false;
  const expected = createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function createRazorpayOrder(input: {
  amountInr: number;
  receipt: string;
  notes: Record<string, string>;
}) {
  const { keyId, keySecret } = getCredentials();
  const amountPaise = Math.round(input.amountInr * 100);

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: authHeader(keyId, keySecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay order failed: ${detail}`);
  }

  const order = (await response.json()) as RazorpayOrder;
  return { order, keyId, amountPaise };
}

/** Process-local cache so we don't create a new Razorpay plan on every checkout. */
let cachedMonthlyPlanId: string | null = null;

/** Ensure a monthly plan exists — uses env plan id or creates one via API. */
export async function ensureMonthlyPlanId() {
  if (process.env.RAZORPAY_PLAN_ID_MONTHLY) {
    return process.env.RAZORPAY_PLAN_ID_MONTHLY;
  }
  if (cachedMonthlyPlanId) return cachedMonthlyPlanId;

  const { keyId, keySecret } = getCredentials();
  const amountPaise = Math.round(PROGRAM_AMOUNT_INR * 100);

  const response = await fetch("https://api.razorpay.com/v1/plans", {
    method: "POST",
    headers: {
      Authorization: authHeader(keyId, keySecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      period: "monthly",
      interval: 1,
      item: {
        name: "LEANMOVEMENT Lean Program",
        amount: amountPaise,
        currency: "INR",
        description: "Live strength & endurance coaching — monthly. Cancel anytime.",
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    // If subscriptions/plans not enabled on account, caller falls back to one-time
    throw new Error(`Razorpay plan create failed: ${detail}`);
  }

  const plan = (await response.json()) as { id: string };
  cachedMonthlyPlanId = plan.id;
  return plan.id;
}

export async function createRazorpaySubscription(input: {
  planId: string;
  notes: Record<string, string>;
  totalCount?: number;
}) {
  const { keyId, keySecret } = getCredentials();

  const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
    method: "POST",
    headers: {
      Authorization: authHeader(keyId, keySecret),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: input.planId,
      // Razorpay requires a finite cycle count; checkout UI shows an end date from this.
      // Members can still cancel anytime (portal / coach / Razorpay) — billing stops after cancel.
      total_count: input.totalCount ?? 120,
      customer_notify: 1,
      notes: input.notes,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay subscription failed: ${detail}`);
  }

  const subscription = (await response.json()) as RazorpaySubscription;
  return { subscription, keyId };
}

export async function fetchRazorpayPayment(paymentId: string) {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: authHeader(keyId, keySecret) },
  });
  if (!response.ok) return null;
  return (await response.json()) as {
    status: string;
    order_id?: string;
    amount: number;
    notes?: Record<string, string>;
  };
}

export async function fetchRazorpaySubscription(subscriptionId: string) {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`https://api.razorpay.com/v1/subscriptions/${subscriptionId}`, {
    headers: { Authorization: authHeader(keyId, keySecret) },
  });
  if (!response.ok) return null;
  return (await response.json()) as RazorpaySubscription & {
    notes?: Record<string, string>;
  };
}

export function membershipRenewalIso(plan: MembershipPlan) {
  const renews = new Date();
  if (plan === "quarterly") renews.setMonth(renews.getMonth() + 3);
  else renews.setMonth(renews.getMonth() + 1);
  return renews.toISOString();
}

export function subscriptionsEnabled() {
  // Explicit off, or test keys (test accounts often lack recurring/subscriptions).
  if (process.env.RAZORPAY_SUBSCRIPTIONS === "0") return false;
  if ((process.env.RAZORPAY_KEY_ID ?? "").startsWith("rzp_test_")) return false;
  return true;
}
