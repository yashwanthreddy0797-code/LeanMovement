import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { usePortalSession } from "@/lib/portal/session";
import { formatInr, formatPortalDate, membershipSummary } from "@/lib/portal/member-format";
import { CheckCircle2, CreditCard, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/portal/payments")({
  head: () => ({ meta: [{ title: "Payments — LEANMOVEMENT Portal" }] }),
  component: Payments,
});

function Payments() {
  const session = usePortalSession();
  const billing = membershipSummary(session.membership);
  const membership = session.membership;

  const invoices = membership?.started_at
    ? [
        {
          id: membership.razorpay_payment_id ?? `LK-${membership.id.slice(0, 8).toUpperCase()}`,
          date: formatPortalDate(membership.started_at),
          amount: formatInr(membership.amount_inr),
          status: billing.isActive ? "Paid" : billing.statusLabel,
        },
      ]
    : [];

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Billing</div>
        <h1 className="text-4xl md:text-5xl font-serif">Membership & payments</h1>
        <p className="mt-2 text-[#737373] max-w-xl">
          Your Lean Kettlebell™ plan, renewal date, and payment history.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <SoftCard className="lg:col-span-2 bg-gradient-to-br from-[#000000] to-[#2D3A2A] text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Current plan</div>
              <div className="mt-2 text-3xl font-serif">Lean Kettlebell™</div>
              <div className="mt-1 text-white/70 text-sm">
                {billing.planLabel} · {billing.price}
                {membership?.plan === "monthly" && "/month"}
                {membership?.plan === "quarterly" && "/quarter"}
              </div>
            </div>
            <span
              className={`chip shrink-0 ${
                billing.isActive
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : "bg-[#FEE2E2] text-[var(--accent)]"
              }`}
            >
              {billing.statusLabel}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Renews on</div>
              <div className="mt-1 font-medium">{billing.renewsOn}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Member since</div>
              <div className="mt-1 font-medium">{billing.memberSince}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Product</div>
              <div className="mt-1 font-medium">12 live sessions / month</div>
            </div>
          </div>
          {!billing.isActive || membership?.status === "past_due" ? (
            <div className="mt-8">
              <Link
                to="/portal/checkout"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-[#000000] text-sm font-medium hover:bg-white/90"
              >
                Renew membership <ExternalLink size={14} />
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                to="/portal/checkout"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 border border-white/20"
              >
                Manage / renew early <ExternalLink size={14} />
              </Link>
            </div>
          )}
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Payment method" title="Razorpay" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#E11D2A] to-[#B91C1C] grid place-items-center text-white text-xs font-semibold">
              RZP
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {membership?.razorpay_subscription_id ? "Auto-pay enabled" : "Card / UPI at checkout"}
              </div>
              <div className="text-[11px] text-[#737373]">
                {membership?.razorpay_subscription_id
                  ? "Razorpay will charge monthly · cancel anytime"
                  : membership?.razorpay_payment_id
                    ? `Last payment · ${membership.razorpay_payment_id.slice(0, 12)}…`
                    : "Pay on join · renew each month"}
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs text-[#737373] leading-relaxed">
            30-day cycles with a 4-day grace window after renews_at. You&apos;ll be reminded ~3 days before renewal.
          </p>
        </SoftCard>
      </div>

      <div>
        <SectionTitle eyebrow="History" title="Invoices" />
        <SoftCard className="!p-0 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#737373]">
              No payments recorded yet. Complete enrollment to see your first invoice.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#737373] bg-[#FAFAF6]">
                  <th className="px-6 py-3 font-medium">Reference</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-[var(--border)]">
                    <td className="px-6 py-4 font-mono text-xs text-[#000000]">{inv.id}</td>
                    <td className="px-6 py-4 text-[#404040]">{inv.date}</td>
                    <td className="px-6 py-4 text-[#000000] font-medium">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-xs text-[#2E7D32]">
                        <CheckCircle2 size={13} /> {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SoftCard>
      </div>

      <SoftCard className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <CreditCard size={20} className="text-[var(--accent)] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Need help with billing?</h3>
            <p className="mt-1 text-sm text-[#737373]">
              Contact support for plan changes, refunds, or payment issues.
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="shrink-0 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm hover:bg-[#FAFAFA]"
        >
          Contact support
        </Link>
      </SoftCard>
    </div>
  );
}
