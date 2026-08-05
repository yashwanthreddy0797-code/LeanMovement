import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { MemberActionButtons } from "@/components/portal/ActivateMemberButton";
import { PendingEnrollmentsPanel } from "@/components/portal/PendingEnrollmentsPanel";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatDate,
  membershipStatusLabel,
  PLAN_LABELS,
  statusChipClass,
} from "@/lib/portal/coach-queries";
import type { MembershipPlan } from "@/lib/supabase/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/portal/coach/members")({
  head: () => ({ meta: [{ title: "Members - Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <MembersPage />
    </CoachShell>
  ),
});

function MembersPage() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();
  const [q, setQ] = useState("");
  const coachId = session.user?.id;

  if (loading || !data) {
    return <PortalPageSkeleton />;
  }

  const members = data.members.filter((m) => m.role === "member");
  const filtered = members.filter(
    (m) =>
      (m.full_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5 sm:space-y-8">
      <PortalPageHeader
        title={`Members · ${members.length}`}
        description="Search and activate members."
        action={
          <div className="relative w-full sm:w-auto">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search members…"
              className="w-full border border-border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent sm:w-56"
            />
          </div>
        }
      />

      <PendingEnrollmentsPanel coachId={coachId} />

      {/* Mobile member cards */}
      <div className="space-y-2 md:hidden">
        {filtered.length === 0 ? (
          <div className="border border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
            No members found.
          </div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="border border-border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center bg-surface text-xs font-semibold text-accent">
                    {(m.full_name ?? m.email)[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{m.full_name ?? "-"}</div>
                    <div className="truncate text-xs text-muted-foreground">{m.email}</div>
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex px-2 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
                >
                  {membershipStatusLabel(m.membership?.status)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  {m.membership ? PLAN_LABELS[m.membership.plan as MembershipPlan] : "-"}
                </span>
                <span>Renews {formatDate(m.membership?.renews_at)}</span>
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <MemberActionButtons
                  coachId={coachId}
                  member={m}
                  onDone={() => void refresh()}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <SoftCard className="!p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-5 py-3 font-medium md:px-6">Member</th>
                <th className="px-5 py-3 font-medium md:px-6">Plan</th>
                <th className="px-5 py-3 font-medium md:px-6">Renews</th>
                <th className="px-5 py-3 font-medium md:px-6">Status</th>
                <th className="px-5 py-3 text-right font-medium md:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground md:px-6">
                    No members found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr key={m.id} className="border-t border-border hover:bg-surface">
                    <td className="px-5 py-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center bg-surface text-xs font-semibold text-accent">
                          {(m.full_name ?? m.email)[0]}
                        </div>
                        <div>
                          <div className="font-medium">{m.full_name ?? "-"}</div>
                          <div className="text-xs text-muted-foreground">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground/70 md:px-6">
                      {m.membership ? PLAN_LABELS[m.membership.plan as MembershipPlan] : "-"}
                    </td>
                    <td className="px-5 py-4 text-foreground/70 md:px-6">
                      {formatDate(m.membership?.renews_at)}
                    </td>
                    <td className="px-5 py-4 md:px-6">
                      <span
                        className={`inline-flex px-2 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
                      >
                        {membershipStatusLabel(m.membership?.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right md:px-6">
                      <MemberActionButtons
                        coachId={coachId}
                        member={m}
                        onDone={() => void refresh()}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SoftCard>
    </div>
  );
}
