import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Loader2, MessageCircle } from "lucide-react";
import {
  createMemberRazorpayOrder,
  getMemberCheckout,
  verifyMemberRazorpayPayment,
} from "@/lib/api/membership.functions";
import { formatInr, formatPlanLabel } from "@/lib/portal/member-format";
import { usePortalSession } from "@/lib/portal/session";
import { toast } from "sonner";

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay"));
    document.body.appendChild(script);
  });
  return Boolean(window.Razorpay);
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
    };
  }
}

async function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { email?: string; name?: string };
  theme?: { color?: string };
  onSuccess: (response: RazorpayHandlerResponse) => void | Promise<void>;
  onDismiss?: () => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) throw new Error("Could not load Razorpay checkout");

  const { onSuccess, onDismiss, ...rest } = options;

  return new Promise<void>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      ...rest,
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          await onSuccess(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  });
}

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

  useEffect(() => {
    if (session.loading) return;
    if (!session.user?.id) {
      setLoading(false);
      return;
    }
    if (session.hasActiveMembership) {
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
  }, [session.loading, session.user?.id, session.hasActiveMembership]);

  const payWithRazorpay = async () => {
    if (!session.user?.id || !checkout) return;

    setPaying(true);
    try {
      const order = await createMemberRazorpayOrder({ data: { userId: session.user.id } });
      if (!order.ok) {
        toast.error(order.message ?? "Could not start payment");
        return;
      }

      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "LEANMOVEMENT",
        description: `Lean Kettlebell™ · ${formatPlanLabel(order.plan)}`,
        order_id: order.orderId,
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
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          });

          if (!verified.ok) {
            toast.error(verified.message ?? "Payment verification failed");
            return;
          }

          toast.success("Payment successful — welcome to the portal");
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
    return <p className="text-sm text-[#737373]">Loading…</p>;
  }

  if (session.hasActiveMembership) return null;

  if (error || !checkout) {
    return (
      <div className="card-soft p-8 text-center max-w-md mx-auto">
        <p className="text-sm text-[#737373]">{error ?? "Could not load checkout"}</p>
        <Link to="/portal/dashboard" className="mt-4 inline-block text-sm text-[var(--accent)]">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-20 lg:pb-0">
      <Link
        to="/portal/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#000000]"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="card-soft p-8 text-center">
        <div className="text-[10px] uppercase tracking-[0.24em] text-[#737373]">Amount due</div>
        <div className="mt-2 font-display text-5xl text-[#000000]">{formatInr(checkout.amountInr)}</div>
        <div className="mt-1 text-sm text-[#737373]">
          Lean Kettlebell™ · {formatPlanLabel(checkout.plan)}
        </div>
        <p className="mt-4 text-xs text-[#737373]">{checkout.email}</p>
      </div>

      {checkout.razorpayEnabled ? (
        <div className="card-soft p-6 space-y-3">
          <button
            type="button"
            disabled={paying}
            onClick={() => void payWithRazorpay()}
            className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {paying ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CreditCard size={16} /> Pay with Razorpay
              </>
            )}
          </button>
          <p className="text-xs text-center text-[#737373]">
            UPI, cards, and net banking · Secured by Razorpay
          </p>
        </div>
      ) : (
        <div className="card-soft p-6 space-y-4">
          <p className="text-sm text-[#404040] leading-relaxed">{checkout.paymentInstructions}</p>
          {checkout.paymentUpi && (
            <div className="rounded-xl bg-[#FAFAFA] p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">UPI</div>
              <div className="mt-1 font-mono text-lg">{checkout.paymentUpi}</div>
            </div>
          )}
          <p className="text-xs text-[#737373] text-center">
            Send payment screenshot on WhatsApp — your coach activates access within a few hours.
          </p>
        </div>
      )}

      {checkout.supportWhatsapp && !checkout.razorpayEnabled && (
        <a
          href={checkout.supportWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:opacity-90"
        >
          <MessageCircle size={16} /> Send payment proof on WhatsApp
        </a>
      )}
    </div>
  );
}
