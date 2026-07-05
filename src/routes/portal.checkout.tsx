import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, MessageCircle } from "lucide-react";
import { getMemberCheckout } from "@/lib/api/membership.functions";
import { formatInr, formatPlanLabel } from "@/lib/portal/member-format";
import { usePortalSession } from "@/lib/portal/session";

export const Route = createFileRoute("/portal/checkout")({
  head: () => ({ meta: [{ title: "Pay — LEANMOVEMENT Portal" }] }),
  component: PortalCheckout,
});

type CheckoutData = Extract<Awaited<ReturnType<typeof getMemberCheckout>>, { ok: true }>;

function PortalCheckout() {
  const session = usePortalSession();
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
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
        <div className="card-soft p-6">
          <button
            type="button"
            disabled
            className="w-full py-3.5 rounded-xl bg-[#E11D2A] text-white text-sm font-medium opacity-60 cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <CreditCard size={16} /> Pay with Razorpay — wiring in progress
          </button>
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

      {checkout.supportWhatsapp && (
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
