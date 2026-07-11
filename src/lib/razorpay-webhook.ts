import { toMembershipPlan } from "@/lib/enrollment/plans";
import { activateMembershipForUser } from "@/lib/membership/activate";
import { verifyWebhookSignature } from "@/lib/razorpay.server";
import { getSupabaseAdmin, isRazorpayConfigured } from "@/lib/supabase/server";

/** Process a raw Razorpay webhook POST body + signature header */
export async function processRazorpayWebhook(rawBody: string, signature: string | null) {
  if (!isRazorpayConfigured()) {
    return { status: 503 as const, body: { ok: false, message: "Razorpay not configured" } };
  }
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    return { status: 503 as const, body: { ok: false, message: "Webhook secret not configured" } };
  }
  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return { status: 401 as const, body: { ok: false, message: "Invalid webhook signature" } };
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return { status: 503 as const, body: { ok: false, message: "Supabase admin not configured" } };
  }

  let payload: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          status?: string;
          notes?: Record<string, string>;
        };
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { status: 400 as const, body: { ok: false, message: "Invalid JSON" } };
  }

  if (payload.event !== "payment.captured") {
    return {
      status: 200 as const,
      body: { ok: true, message: `Ignored event: ${payload.event}` },
    };
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment?.id || !payment.order_id) {
    return { status: 400 as const, body: { ok: false, message: "Missing payment data" } };
  }

  const userId = payment.notes?.user_id;
  const email = payment.notes?.email;
  const plan = toMembershipPlan(payment.notes?.plan ?? "monthly");

  if (!userId || !email) {
    return { status: 400 as const, body: { ok: false, message: "Missing user notes on payment" } };
  }

  const { data: membership } = await admin
    .from("memberships")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  if (membership?.status === "active") {
    return { status: 200 as const, body: { ok: true, message: "Already active" } };
  }

  await activateMembershipForUser(admin, {
    userId,
    email,
    plan,
    paymentId: payment.id,
  });

  return { status: 200 as const, body: { ok: true, message: "Membership activated" } };
}
