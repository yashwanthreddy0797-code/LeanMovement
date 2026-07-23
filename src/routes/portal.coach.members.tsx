import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { MemberActionButtons } from "@/components/portal/ActivateMemberButton";
import { PendingEnrollmentsPanel } from "@/components/portal/PendingEnrollmentsPanel";
import { CoachRegistrationAlerts } from "@/components/portal/CoachRegistrationAlerts";
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
  head: () => ({ meta: [{ title: "Members — Lean Kettlebell Coach" }] }),
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
    <div className="space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        eyebrow="Lean Kettlebell™"
        title={`Members · ${members.length}`}
        description="Activate members after offline payment, track plans and renewals. Razorpay auto-activates online payments later."
        action={
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search members…"
              className="w-56 border border-border bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent"
            />
          </div>
        }
      />

      <CoachRegistrationAlerts coachId={coachId} />
      <PendingEnrollmentsPanel coachId={coachId} />

      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        {[
          { label: "Active", count: members.filter((m) => m.membership?.status === "active").length },
          { label: "Pending", count: members.filter((m) => m.membership?.status === "pending").length },
          { label: "Expired", count: members.filter((m) => m.membership?.status === "expired").length },
          { label: "Past due", count: members.filter((m) => m.membership?.status === "past_due").length },
        ].map((s) => (
          <div key={s.label} className="bg-white p-4">
            <div className="eyebrow !gap-0">{s.label}</div>
            <div className="mt-1 font-display text-2xl tracking-[0.04em]">{s.count}</div>
          </div>
        ))}
      </div>

      <SoftCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Renews</th>
                <th className="px-6 py-3 font-medium">Onboarding</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No members found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const onboardingDone =
                    m.onboarding?.foundations_completed_at && m.onboarding?.whatsapp_joined;
                  return (
                    <tr key={m.id} className="border-t border-border hover:bg-surface">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-8 w-8 place-items-center bg-surface text-xs font-semibold text-accent">
                            {(m.full_name ?? m.email)[0]}
                          </div>
                          <div>
                            <div className="font-medium">{m.full_name ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {m.membership ? PLAN_LABELS[m.membership.plan as MembershipPlan] : "—"}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{formatDate(m.created_at)}</td>
                      <td className="px-6 py-4 text-foreground/70">
                        {formatDate(m.membership?.renews_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[11px] ${onboardingDone ? "text-emerald-700" : "text-amber-700"}`}
                        >
                          {onboardingDone
                            ? "Complete"
                            : !m.onboarding?.foundations_completed_at
                              ? "Foundations due"
                              : "WhatsApp pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
                        >
                          {membershipStatusLabel(m.membership?.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <MemberActionButtons
                          coachId={coachId}
                          member={m}
                          onDone={() => void refresh()}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </SoftCard>
    </div>
  );
}
