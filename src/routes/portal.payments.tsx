import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Loader2 } from "lucide-react";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useMemberBilling } from "@/hooks/useMemberBilling";
import { formatInr, formatMembershipStatus, formatPortalDate } from "@/lib/portal/member-format";
import { usePortalSession } from "@/lib/portal/session";
import { PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";

export const Route = createFileRoute("/portal/payments")({
  head: () => ({ meta: [{ title: "Billing - LEANMOVEMENT Portal" }] }),
  component: Payments,
});

function Payments() {
  const session = usePortalSession();
  const { data, isLoading, isFetching, isError } = useMemberBilling(
    session.user?.id,
    session.membership,
  );

  const billing = data && "ok" in data && data.ok ? data.billing : null;
  const priceInr = billing?.priceInr ?? session.membership?.amount_inr ?? PROGRAM_AMOUNT_INR;
  const status = billing?.status ?? session.membership?.status ?? "pending";
  const statusLabel = formatMembershipStatus(status);
  const isActive = status === "active";
  const needsRenew = !isActive || status === "past_due";
  const planPeriodLabel = billing?.planPeriod === "quarterly" ? "every 3 months" : "per month";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PortalPageHeader title="Billing" description="Your plan and renewal from Razorpay." />

      <SoftCard className="border-0 !bg-foreground text-background !p-5 sm:!p-6">
        {(isLoading || (isFetching && !billing)) && (
          <div className="mb-4 inline-flex items-center gap-2 text-sm text-background/60">
            <Loader2 size={14} className="animate-spin" /> Loading billing from Razorpay…
          </div>
        )}

        {isError && !billing && (
          <p className="mb-4 text-sm text-background/70">
            Could not refresh live billing. Showing your saved membership details.
          </p>
        )}

        <div className="text-xs uppercase tracking-[0.14em] text-background/55">Current plan</div>
        <div className="mt-2 font-display text-2xl uppercase tracking-[0.04em]">
          {billing?.planLabel ?? "Lean Movement"}
        </div>
        <div className="mt-1 text-sm text-background/70">
          {formatInr(priceInr)} <span className="text-background/45">· {planPeriodLabel}</span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Status</dt>
            <dd className="mt-1 font-medium">{statusLabel}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">
              {isActive ? "Renews" : "Renewal"}
            </dt>
            <dd className="mt-1 font-medium">{formatPortalDate(billing?.renewsAt)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Member since</dt>
            <dd className="mt-1 font-medium">
              {formatPortalDate(billing?.memberSince ?? session.membership?.started_at)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.12em] text-background/55">Last payment</dt>
            <dd className="mt-1 font-medium">
              {billing?.lastPaymentAmountInr != null
                ? formatInr(billing.lastPaymentAmountInr)
                : formatInr(priceInr)}
              {billing?.lastPaymentAt ? (
                <span className="mt-0.5 block text-xs font-normal text-background/55">
                  {formatPortalDate(billing.lastPaymentAt)}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>

        {billing?.source === "razorpay" && (
          <p className="mt-4 text-xs text-background/45">Synced from Razorpay</p>
        )}

        <Link
          to="/portal/checkout"
          className={`portal-btn mt-6 inline-flex gap-2 ${
            needsRenew
              ? "!bg-background !text-foreground"
              : "portal-btn-ghost !border-background/20 !text-background"
          }`}
        >
          {needsRenew ? "Renew membership" : "Manage billing"}
          <ExternalLink size={14} />
        </Link>
      </SoftCard>
    </div>
  );
}
