import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortalSession } from "@/lib/portal/session";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { formatInr, formatPortalDate, membershipSummary } from "@/lib/portal/member-format";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/portal/payments")({
  head: () => ({ meta: [{ title: "Billing - LEANMOVEMENT Portal" }] }),
  component: Payments,
});

function Payments() {
  const session = usePortalSession();
  const billing = membershipSummary(session.membership);
  const membership = session.membership;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PortalPageHeader title="Billing" description="Your plan and renewal." />

      <SoftCard className="border-0 !bg-foreground text-background !p-5 sm:!p-6">
        <div className="text-xs uppercase tracking-[0.14em] text-background/55">Current plan</div>
        <div className="mt-2 font-display text-2xl uppercase tracking-[0.04em]">{billing.planLabel}</div>
        <div className="mt-1 text-sm text-background/70">{billing.price}</div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Status</dt>
            <dd className="mt-1 font-medium">{billing.statusLabel}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Renews</dt>
            <dd className="mt-1 font-medium">{billing.renewsOn}</dd>
          </div>
          {membership?.started_at && (
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Member since</dt>
              <dd className="mt-1 font-medium">{formatPortalDate(membership.started_at)}</dd>
            </div>
          )}
          {membership?.amount_inr && (
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Last payment</dt>
              <dd className="mt-1 font-medium">{formatInr(membership.amount_inr)}</dd>
            </div>
          )}
        </dl>

        <Link
          to="/portal/checkout"
          className={`portal-btn mt-6 inline-flex gap-2 ${
            !billing.isActive || membership?.status === "past_due"
              ? "!bg-background !text-foreground"
              : "portal-btn-ghost !border-background/20 !text-background"
          }`}
        >
          {!billing.isActive || membership?.status === "past_due" ? "Renew membership" : "Manage billing"}
          <ExternalLink size={14} />
        </Link>
      </SoftCard>
    </div>
  );
}
