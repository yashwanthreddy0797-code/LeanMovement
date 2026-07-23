import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
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
      <PortalPageHeader
        eyebrow="Billing"
        title="Membership & payments"
        description="Your Lean Kettlebell™ plan, renewal date, and payment history."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <SoftCard className="border-0 !bg-foreground text-background lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-background/60">Current plan</div>
              <div className="mt-2 font-display text-3xl uppercase tracking-[0.04em]">Lean Kettlebell™</div>
              <div className="mt-1 text-sm text-background/70">
                {billing.planLabel} · {billing.price}
                {membership?.plan === "monthly" && "/month"}
                {membership?.plan === "quarterly" && "/quarter"}
              </div>
            </div>
            <span
              className={`chip shrink-0 ${
                billing.isActive ? "bg-emerald-50 text-emerald-800" : "bg-accent/15 text-accent"
              }`}
            >
              {billing.statusLabel}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-background/60">Renews on</div>
              <div className="mt-1 font-medium">{billing.renewsOn}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-background/60">Member since</div>
              <div className="mt-1 font-medium">{billing.memberSince}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-background/60">Product</div>
              <div className="mt-1 font-medium">12 live sessions / month</div>
            </div>
          </div>
          {!billing.isActive || membership?.status === "past_due" ? (
            <div className="mt-8">
              <Link to="/portal/checkout" className="portal-btn !bg-background !text-foreground hover:!bg-background/90">
                Renew membership <ExternalLink size={14} />
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                to="/portal/checkout"
                className="portal-btn portal-btn-ghost !border-background/20 !text-background hover:!bg-background/10"
              >
                Manage / renew early <ExternalLink size={14} />
              </Link>
            </div>
          )}
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Payment method" title="Razorpay" />
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-12 place-items-center bg-accent text-xs font-semibold text-white">
              RZP
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {membership?.razorpay_subscription_id ? "Auto-pay enabled" : "Card / UPI at checkout"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {membership?.razorpay_subscription_id
                  ? "Razorpay will charge monthly · cancel anytime"
                  : membership?.razorpay_payment_id
                    ? `Last payment · ${membership.razorpay_payment_id.slice(0, 12)}…`
                    : "Pay on join · renew each month"}
              </div>
            </div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
            30-day cycles with a 4-day grace window after renews_at. You&apos;ll be reminded ~3 days before renewal.
          </p>
        </SoftCard>
      </div>

      <div>
        <SectionTitle eyebrow="History" title="Invoices" />
        <SoftCard className="!p-0 overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No payments recorded yet. Complete enrollment to see your first invoice.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="px-4 py-3 font-medium sm:px-6">Reference</th>
                    <th className="px-4 py-3 font-medium sm:px-6">Date</th>
                    <th className="px-4 py-3 font-medium sm:px-6">Amount</th>
                    <th className="px-4 py-3 font-medium sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-border">
                      <td className="px-4 py-4 font-mono text-xs text-foreground sm:px-6">{inv.id}</td>
                      <td className="px-4 py-4 text-foreground/70 sm:px-6">{inv.date}</td>
                      <td className="px-4 py-4 font-medium text-foreground sm:px-6">{inv.amount}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                          <CheckCircle2 size={13} /> {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SoftCard>
      </div>

      <SoftCard className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <CreditCard size={20} className="mt-0.5 shrink-0 text-accent" />
          <div>
            <h3 className="font-medium">Need help with billing?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact support for plan changes, refunds, or payment issues.
            </p>
          </div>
        </div>
        <Link to="/contact" className="portal-btn portal-btn-ghost shrink-0">
          Contact support
        </Link>
      </SoftCard>
    </div>
  );
}
