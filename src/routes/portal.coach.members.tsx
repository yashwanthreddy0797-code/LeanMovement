import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { MemberActionButtons } from "@/components/portal/ActivateMemberButton";
import { PendingEnrollmentsPanel } from "@/components/portal/PendingEnrollmentsPanel";
import { CoachRegistrationAlerts } from "@/components/portal/CoachRegistrationAlerts";
import { SoftCard } from "@/components/portal/ui";
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
    return <p className="text-sm text-[#737373]">Loading members…</p>;
  }

  const members = data.members.filter((m) => m.role === "member");
  const filtered = members.filter(
    (m) =>
      (m.full_name ?? "").toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">
            Lean Kettlebell™
          </div>
          <h1 className="text-4xl md:text-5xl font-serif">
            Members{" "}
            <span className="text-[#A3A3A3] text-2xl">· {members.length}</span>
          </h1>
          <p className="mt-2 text-[#737373] max-w-xl">
            Activate members after offline payment, track plans and renewals. Razorpay auto-activates online payments
            later.
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members…"
            className="pl-9 pr-4 py-2.5 rounded-2xl border border-[var(--border)] bg-white text-sm outline-none w-56 focus:border-[#FCA5A5]"
          />
        </div>
      </div>

      <CoachRegistrationAlerts coachId={coachId} />
      <PendingEnrollmentsPanel coachId={coachId} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active", count: members.filter((m) => m.membership?.status === "active").length },
          { label: "Pending", count: members.filter((m) => m.membership?.status === "pending").length },
          { label: "Expired", count: members.filter((m) => m.membership?.status === "expired").length },
          { label: "Past due", count: members.filter((m) => m.membership?.status === "past_due").length },
        ].map((s) => (
          <div key={s.label} className="card-soft p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#737373]">{s.label}</div>
            <div className="mt-1 text-2xl font-serif">{s.count}</div>
          </div>
        ))}
      </div>

      <SoftCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#737373] bg-[#FAFAF6]">
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Renews</th>
                <th className="px-6 py-3 font-medium">Onboarding</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#737373]">
                    No members found.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const onboardingDone =
                    m.onboarding?.foundations_completed_at && m.onboarding?.whatsapp_joined;
                  return (
                    <tr key={m.id} className="border-t border-[var(--border)] hover:bg-[#FAFAF6]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#F5F5F5] text-[#E11D2A] grid place-items-center text-xs font-semibold">
                            {(m.full_name ?? m.email)[0]}
                          </div>
                          <div>
                            <div className="font-medium">{m.full_name ?? "—"}</div>
                            <div className="text-xs text-[#737373]">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#404040]">
                        {m.membership ? PLAN_LABELS[m.membership.plan as MembershipPlan] : "—"}
                      </td>
                      <td className="px-6 py-4 text-[#404040]">{formatDate(m.created_at)}</td>
                      <td className="px-6 py-4 text-[#404040]">
                        {formatDate(m.membership?.renews_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[11px] ${onboardingDone ? "text-[#2E7D32]" : "text-[#E65100]"}`}
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
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
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
