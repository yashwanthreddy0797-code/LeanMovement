import { createHmac, timingSafeEqual } from "node:crypto";
import type { MembershipPlan } from "@/lib/supabase/types";

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
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

export async function fetchRazorpayPayment(paymentId: string) {
  const { keyId, keySecret } = getCredentials();
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: authHeader(keyId, keySecret) },
  });
  if (!response.ok) return null;
  return (await response.json()) as { status: string; order_id: string; amount: number };
}

export function membershipRenewalIso(plan: MembershipPlan) {
  const renews = new Date();
  if (plan === "quarterly") renews.setMonth(renews.getMonth() + 3);
  else renews.setMonth(renews.getMonth() + 1);
  return renews.toISOString();
}
