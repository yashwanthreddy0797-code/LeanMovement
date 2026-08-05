import { Link } from "@tanstack/react-router";
import { CreditCard, Mail } from "lucide-react";
import type { Membership } from "@/lib/supabase/types";
import { formatPlanLabel, membershipSummary } from "@/lib/portal/member-format";
import { getMembershipAccess } from "@/lib/membership/access";

export function MembershipPaywall({
  membership,
  userEmail,
}: {
  membership: Membership | null;
  mode: "supabase" | "demo";
  userEmail?: string | null;
}) {
  const summary = membershipSummary(membership);
  const access = getMembershipAccess(membership);
  const isPending = membership?.status === "pending" || !membership;
  const payTo = isPending ? "/join" : "/portal/checkout";

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full card-soft p-8 md:p-10 text-center">
        <div className="w-14 h-14 bg-surface border border-border grid place-items-center mx-auto">
          <CreditCard size={24} className="text-accent" />
        </div>

        <h2 className="mt-6 font-display text-3xl uppercase tracking-[0.04em] text-foreground">
          {isPending ? "Payment required" : "Renew membership"}
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {isPending
            ? "Complete secure payment on the join page to unlock live sessions and your calendar."
            : access.inGrace
              ? "Your 30-day cycle ended. You have a few grace days - renew now to keep coaching uninterrupted."
              : "Your membership has ended. Renew to continue live coaching with me."}
        </p>

        {userEmail && (
          <div className="mt-5 bg-surface border border-border px-4 py-3 text-sm">
            <span className="text-muted-foreground">Signed in as </span>
            <span className="font-medium text-foreground">{userEmail}</span>
            {membership && (
              <span className="text-muted-foreground">
                {" "}
                · {formatPlanLabel(membership.plan)} · {summary.price}/mo
              </span>
            )}
          </div>
        )}

        <Link
          to={payTo}
          search={isPending ? { plan: "standard", email: userEmail ?? "", name: "" } : undefined}
          className="portal-btn mt-8 w-full"
        >
          {isPending ? `Pay ${summary.price}` : `Renew ${summary.price}`}
        </Link>

        <Link
          to="/contact"
          className="portal-btn-ghost portal-btn mt-3 w-full"
        >
          <Mail size={14} /> Contact support
        </Link>
      </div>
    </div>
  );
}
