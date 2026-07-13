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
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] grid place-items-center mx-auto">
          <CreditCard size={24} className="text-[var(--accent)]" />
        </div>

        <h2 className="mt-6 font-serif text-3xl text-[#000000]">
          {isPending ? "Payment required" : "Renew membership"}
        </h2>

        <p className="mt-3 text-sm text-[#737373] leading-relaxed">
          {isPending
            ? "Complete secure payment on the join page to unlock live sessions and your calendar."
            : access.inGrace
              ? "Your 30-day cycle ended. You have a few grace days — renew now to keep coaching uninterrupted."
              : "Your membership has ended. Renew to continue live coaching with your coach."}
        </p>

        {userEmail && (
          <div className="mt-5 rounded-xl bg-[#FAFAFA] px-4 py-3 text-sm">
            <span className="text-[#737373]">Signed in as </span>
            <span className="font-medium text-[#000000]">{userEmail}</span>
            {membership && (
              <span className="text-[#737373]">
                {" "}
                · {formatPlanLabel(membership.plan)} · {summary.price}/mo
              </span>
            )}
          </div>
        )}

        <Link
          to={payTo}
          search={isPending ? { plan: "standard", email: userEmail ?? "", name: "" } : undefined}
          className="mt-8 inline-flex w-full items-center justify-center px-6 py-3.5 rounded-full bg-[#000000] text-white text-sm font-medium hover:bg-[#111]"
        >
          {isPending ? `Pay ${summary.price}` : `Renew ${summary.price}`}
        </Link>

        <Link
          to="/contact"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[var(--border)] text-sm hover:bg-[#FAFAFA]"
        >
          <Mail size={14} /> Contact support
        </Link>
      </div>
    </div>
  );
}
