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
          amount?: number;
          notes?: Record<string, string>;
        };
      };
      subscription?: {
        entity?: {
          id?: string;
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

  const event = payload.event ?? "";

  // Recurring charge / first subscription payment
  if (
    event === "payment.captured" ||
    event === "subscription.charged" ||
    event === "subscription.activated"
  ) {
    const payment = payload.payload?.payment?.entity;
    const subscription = payload.payload?.subscription?.entity;

    const notes = payment?.notes ?? subscription?.notes ?? {};
    const userId = notes.user_id;
    const email = notes.email;
    const plan = toMembershipPlan(notes.plan ?? "monthly");
    const paymentId = payment?.id ?? `sub_${subscription?.id ?? Date.now()}`;
    const kind = notes.kind === "renewal" ? "renewal" : "initial";

    if (!userId || !email) {
      if (subscription?.id) {
        const { data: m } = await admin
          .from("memberships")
          .select("user_id")
          .eq("razorpay_subscription_id", subscription.id)
          .maybeSingle();
        if (m?.user_id) {
          const { data: profile } = await admin
            .from("profiles")
            .select("email")
            .eq("id", m.user_id)
            .maybeSingle();
          if (profile?.email) {
            await activateMembershipForUser(admin, {
              userId: m.user_id,
              email: profile.email,
              plan,
              paymentId,
              amountInr: payment?.amount ? Math.round(payment.amount / 100) : undefined,
              subscriptionId: subscription.id,
              kind: "renewal",
            });
            return { status: 200 as const, body: { ok: true, message: "Renewal activated via subscription" } };
          }
        }
      }
      return { status: 400 as const, body: { ok: false, message: "Missing user notes on payment" } };
    }

    await activateMembershipForUser(admin, {
      userId,
      email,
      plan,
      paymentId,
      amountInr: payment?.amount ? Math.round(payment.amount / 100) : undefined,
      subscriptionId: subscription?.id ?? notes.subscription_id,
      kind,
    });

    return { status: 200 as const, body: { ok: true, message: "Membership activated" } };
  }

  if (event === "subscription.halted" || event === "subscription.cancelled") {
    const subscription = payload.payload?.subscription?.entity;
    if (subscription?.id) {
      await admin
        .from("memberships")
        .update({ status: "past_due" })
        .eq("razorpay_subscription_id", subscription.id)
        .eq("status", "active");
    }
    return { status: 200 as const, body: { ok: true, message: "Subscription marked past_due" } };
  }

  return {
    status: 200 as const,
    body: { ok: true, message: `Ignored event: ${event}` },
  };
}
