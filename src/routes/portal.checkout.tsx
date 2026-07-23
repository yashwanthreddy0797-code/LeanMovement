import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Loader2, MessageCircle } from "lucide-react";
import {
  createMemberRazorpayOrder,
  getMemberCheckout,
  verifyMemberRazorpayPayment,
} from "@/lib/api/membership.functions";
import { formatInr, formatPlanLabel } from "@/lib/portal/member-format";
import { getMembershipAccess } from "@/lib/membership/access";
import { usePortalSession } from "@/lib/portal/session";
import { openRazorpayCheckout, loadRazorpayScript, preloadRazorpayScript } from "@/lib/razorpay/checkout-client";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/checkout")({
  head: () => ({ meta: [{ title: "Pay — LEANMOVEMENT Portal" }] }),
  component: PortalCheckout,
});

type CheckoutData = Extract<Awaited<ReturnType<typeof getMemberCheckout>>, { ok: true }>;

function PortalCheckout() {
  const router = useRouter();
  const session = usePortalSession();
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const access = getMembershipAccess(session.membership);
  const needsPay =
    !session.hasActiveMembership || access.needsRenewal || access.inGrace ||
    session.membership?.status === "past_due" ||
    session.membership?.status === "expired";

  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  useEffect(() => {
    if (session.loading) return;
    if (!session.user?.id) {
      setLoading(false);
      return;
    }
    // Fully paid & not near renewal → dashboard
    if (session.hasActiveMembership && !access.needsRenewal && !access.inGrace) {
      window.location.replace("/portal/dashboard");
      return;
    }

    void getMemberCheckout({ data: { userId: session.user.id } })
      .then((result) => {
        if (!result.ok) setError(result.message ?? "Could not load");
        else setCheckout(result);
      })
      .catch(() => setError("Could not load checkout"))
      .finally(() => setLoading(false));
  }, [
    session.loading,
    session.user?.id,
    session.hasActiveMembership,
    access.needsRenewal,
    access.inGrace,
  ]);

  const payWithRazorpay = async () => {
    if (!session.user?.id || !checkout) return;

    setPaying(true);
    const kind =
      checkout.status === "pending" ? "initial" : ("renewal" as const);

    try {
      const [order] = await Promise.all([
        createMemberRazorpayOrder({
          data: { userId: session.user.id, kind },
        }),
        loadRazorpayScript(),
      ]);
      if (!order.ok) {
        toast.error(order.message ?? "Could not start payment");
        return;
      }

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "LEANMOVEMENT",
        description: `Lean Program · ${formatPlanLabel(order.plan)} · cancel anytime`,
        order_id: order.orderId ?? undefined,
        subscription_id: order.subscriptionId ?? undefined,
        prefill: {
          email: order.email,
          name: order.fullName ?? undefined,
        },
        theme: { color: "#E11D2A" },
        onSuccess: async (response) => {
          const verified = await verifyMemberRazorpayPayment({
            data: {
              userId: session.user!.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              kind,
            },
          });

          if (!verified.ok) {
            toast.error(verified.message ?? "Payment verification failed");
            return;
          }

          toast.success(kind === "renewal" ? "Renewal successful" : "Payment successful — welcome");
          await router.navigate({ to: "/portal/dashboard" });
          window.location.reload();
        },
        onDismiss: () => {
          toast.message("Payment cancelled");
        },
      });
    } catch (err) {
      if (err instanceof Error && err.message !== "Payment cancelled") {
        toast.error(err.message || "Payment failed");
      }
    } finally {
      setPaying(false);
    }
  };

  if (session.loading || loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (!needsPay && session.hasActiveMembership) return null;

  if (error || !checkout) {
    return (
      <div className="card-soft mx-auto max-w-md p-8 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "Could not load checkout"}</p>
        <Link to="/portal/dashboard" className="mt-4 inline-block text-sm text-accent">
          ← Back
        </Link>
      </div>
    );
  }

  const isRenewal = checkout.status !== "pending";

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-20 lg:pb-0">
      <Link
        to="/portal/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="card-soft p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {isRenewal ? "Renewal due" : "Amount due"}
        </div>
        <div className="mt-2 font-display text-5xl tracking-[0.04em] text-foreground">
          {formatInr(checkout.amountInr)}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Lean Program · {formatPlanLabel(checkout.plan)} / month
        </div>
        {access.inGrace && access.graceEndsAt && (
          <p className="mt-3 text-xs text-accent">
            Grace period ends {access.graceEndsAt.toLocaleDateString("en-IN")}
          </p>
        )}
        <p className="mt-4 text-xs text-muted-foreground">{checkout.email}</p>
      </div>

      {checkout.razorpayEnabled ? (
        <div className="card-soft space-y-3 p-6">
          <button
            type="button"
            disabled={paying}
            onClick={() => void payWithRazorpay()}
            className="portal-btn portal-btn-accent w-full disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CreditCard size={16} /> {isRenewal ? "Renew with Razorpay" : "Pay with Razorpay"}
              </>
            )}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            UPI, cards, net banking · Auto-pay when Razorpay subscription is available
          </p>
        </div>
      ) : (
        <div className="card-soft space-y-4 p-6">
          <p className="text-sm leading-relaxed text-foreground/70">{checkout.paymentInstructions}</p>
          {checkout.paymentUpi && (
            <div className="bg-surface p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">UPI</div>
              <div className="mt-1 font-mono text-lg">{checkout.paymentUpi}</div>
            </div>
          )}
        </div>
      )}

      {checkout.supportWhatsapp && !checkout.razorpayEnabled && (
        <a
          href={checkout.supportWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="portal-btn portal-btn-accent flex w-full"
        >
          <MessageCircle size={16} /> Send payment proof on WhatsApp
        </a>
      )}
    </div>
  );
}
