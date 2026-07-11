import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { ActivateMemberButton } from "@/components/portal/ActivateMemberButton";
import {
  formatDate,
  formatInr,
  formatSessionTime,
  getNextLiveSession,
  membershipStatusLabel,
  PLAN_LABELS,
  statusChipClass,
  todayWeekday,
} from "@/lib/portal/coach-queries";
import {
  ArrowRight,
  Calendar,
  Play,
  Radio,
  UserPlus,
  Users,
  Wallet,
  AlertCircle,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/portal/coach/")({
  head: () => ({ meta: [{ title: "Coach Dashboard — Lean Kettlebell" }] }),
  component: () => (
    <CoachShell>
      <CoachDashboard />
    </CoachShell>
  ),
});

function CoachDashboard() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();

  if (loading || !data) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-sm text-[#737373]">
        Loading coach dashboard…
      </div>
    );
  }

  const { stats, liveSessions, members, recordings, siteConfig } = data;
  const nextSession = getNextLiveSession(liveSessions);
  const isToday = nextSession?.day_of_week === todayWeekday();
  const pendingMembers = members.filter(
    (m) => m.role === "member" && m.membership?.status === "pending",
  );
  const recentMembers = members
    .filter((m) => m.role === "member")
    .slice(0, 6);

  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const coachName = session.profile?.full_name ?? session.user?.name ?? "Coach";
  const coachId = session.user?.id;

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">
            {greet}, {coachName.split(" ")[0]}
          </div>
          <h1 className="text-4xl md:text-5xl font-serif">Lean Kettlebell™</h1>
          <p className="mt-2 text-[#737373] max-w-xl">
            Manage members, live sessions, and onboarding for your kettlebell membership.
          </p>
        </div>
        <Link
          to="/portal/coach/members"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#000000] text-white text-sm font-medium hover:bg-[#111111]"
        >
          <UserPlus size={15} /> Manage members
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Active members", value: String(stats.activeMembers), sub: "paying & live" },
          { label: "Pending approval", value: String(stats.pendingMembers), sub: "awaiting activate" },
          { label: "Est. MRR", value: formatInr(stats.mrrInr), sub: "monthly recurring" },
          { label: "Renewals (14d)", value: String(stats.expiringSoon), sub: "action needed" },
          { label: "Foundations due", value: String(stats.foundationsPending), sub: "not completed" },
          { label: "WhatsApp pending", value: String(stats.whatsappPending), sub: "not joined" },
        ].map((k) => (
          <div key={k.label} className="card-soft p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#737373]">{k.label}</div>
            <div className="mt-2 text-2xl font-serif text-[#000000]">{k.value}</div>
            <div className="mt-1 text-[11px] text-[#E11D2A]">{k.sub}</div>
          </div>
        ))}
      </div>

      {nextSession && (
        <SoftCard className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] text-white border-0 !p-0 overflow-hidden">
          <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                <Radio size={12} className={isToday ? "animate-pulse" : ""} />
                {isToday ? "Today's session" : "Next live session"}
              </div>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                {nextSession.title} — {nextSession.session_type}
              </h2>
              <p className="mt-2 text-white/70 text-sm">
                {nextSession.day_of_week} · {formatSessionTime(nextSession.start_time)} ·{" "}
                {nextSession.duration_minutes} min
              </p>
              <p className="mt-1 text-white/50 text-xs">{nextSession.focus}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={nextSession.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90"
              >
                <Play size={16} fill="currentColor" /> Host session
              </a>
              <Link
                to="/portal/coach/schedule"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white text-sm hover:bg-white/10"
              >
                Edit links
              </Link>
            </div>
          </div>
        </SoftCard>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <SoftCard>
          <SectionTitle
            eyebrow="Needs action"
            title="Pending members"
            action={
              <Link to="/portal/coach/members" className="text-xs text-[#E11D2A] hover:underline">
                All members
              </Link>
            }
          />
          {pendingMembers.length === 0 ? (
            <p className="text-sm text-[#737373]">No pending members — all caught up.</p>
          ) : (
            <div className="space-y-3">
              {pendingMembers.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF6]"
                >
                  <div className="w-9 h-9 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold">
                    {(m.full_name ?? m.email)[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{m.full_name ?? m.email}</div>
                    <div className="text-[11px] text-[#737373]">{m.email}</div>
                  </div>
                  <ActivateMemberButton
                    coachId={coachId}
                    member={m}
                    onDone={() => void refresh()}
                    compact
                  />
                </div>
              ))}
            </div>
          )}
        </SoftCard>

        <SoftCard>
          <SectionTitle
            eyebrow="Mon · Wed · Sat"
            title="Weekly schedule"
            action={
              <Link to="/portal/coach/schedule" className="text-xs text-[#E11D2A] hover:underline">
                Manage
              </Link>
            }
          />
          <div className="space-y-3">
            {liveSessions.map((s) => {
              const isSessionToday = s.day_of_week === todayWeekday();
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
                    isSessionToday
                      ? "border-[var(--accent)] bg-[#FEE2E2]/30"
                      : "border-[var(--border)] bg-[#FAFAF6]"
                  }`}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#737373]">
                      {s.day_of_week}
                      {isSessionToday && (
                        <span className="ml-2 text-[#E11D2A]">· Today</span>
                      )}
                    </div>
                    <div className="text-sm font-medium mt-0.5">
                      {s.title} — {s.session_type}
                    </div>
                    <div className="text-[11px] text-[#737373]">
                      {formatSessionTime(s.start_time)} · {s.duration_minutes} min
                    </div>
                  </div>
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#E11D2A] font-medium hover:underline shrink-0"
                  >
                    Open link
                  </a>
                </div>
              );
            })}
          </div>
        </SoftCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <SoftCard className="lg:col-span-2">
          <SectionTitle
            eyebrow="Membership"
            title="Recent members"
            action={
              <Link
                to="/portal/coach/members"
                className="text-xs text-[#E11D2A] inline-flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#737373] bg-[#FAFAF6]">
                  <th className="px-6 py-3 font-medium">Member</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-[#737373]">
                      No members yet. Share /join to enroll.
                    </td>
                  </tr>
                ) : (
                  recentMembers.map((m) => (
                    <tr key={m.id} className="border-t border-[var(--border)]">
                      <td className="px-6 py-4">
                        <div className="font-medium">{m.full_name ?? "—"}</div>
                        <div className="text-xs text-[#737373]">{m.email}</div>
                      </td>
                      <td className="px-6 py-4 text-[#404040]">
                        {m.membership ? PLAN_LABELS[m.membership.plan] : "—"}
                      </td>
                      <td className="px-6 py-4 text-[#404040]">{formatDate(m.created_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
                        >
                          {membershipStatusLabel(m.membership?.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SoftCard>

        <div className="space-y-5">
          <SoftCard>
            <SectionTitle eyebrow="Quick links" title="Portal config" />
            <ul className="space-y-3 text-sm">
              {siteConfig.whatsapp_invite_url && (
                <li>
                  <a
                    href={siteConfig.whatsapp_invite_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E11D2A] hover:underline"
                  >
                    WhatsApp group →
                  </a>
                </li>
              )}
              {siteConfig.foundations_calendly_url && (
                <li>
                  <a
                    href={siteConfig.foundations_calendly_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E11D2A] hover:underline"
                  >
                    Foundations Calendly →
                  </a>
                </li>
              )}
              <li className="text-[#737373]">
                Cohort: {siteConfig.cohort_start_date ?? "Not set"}
              </li>
            </ul>
            <Link
              to="/portal/coach/settings"
              className="mt-4 inline-block text-[11px] text-[#E11D2A] hover:underline"
            >
              Edit portal settings →
            </Link>
          </SoftCard>

          <SoftCard>
            <SectionTitle
              eyebrow="Library"
              title="Recordings"
              action={
                <Link to="/portal/coach/recordings" className="text-xs text-[#E11D2A] hover:underline">
                  Manage
                </Link>
              }
            />
            {recordings.length === 0 ? (
              <p className="text-sm text-[#737373]">No recordings yet.</p>
            ) : (
              <ul className="space-y-2">
                {recordings.slice(0, 3).map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm">
                    <Video size={14} className="text-[#737373] shrink-0" />
                    <span className="truncate">{r.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </SoftCard>

          {stats.pendingMembers > 0 && (
            <SoftCard className="border-[#FCA5A5] bg-[#FEE2E2]/20">
              <div className="flex gap-3">
                <AlertCircle size={18} className="text-[#E11D2A] shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">
                    {stats.pendingMembers} member{stats.pendingMembers > 1 ? "s" : ""} waiting
                  </div>
                  <p className="text-xs text-[#737373] mt-1">
                    Activate manually if a member paid offline.
                  </p>
                </div>
              </div>
            </SoftCard>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Members", to: "/portal/coach/members" as const },
          { icon: Calendar, label: "Schedule", to: "/portal/coach/schedule" as const },
          { icon: Video, label: "Recordings", to: "/portal/coach/recordings" as const },
          { icon: Wallet, label: "Payments", to: "/portal/coach/settings" as const },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="card-soft p-5 hover:border-[#FCA5A5] transition-colors group"
            >
              <Icon size={20} className="text-[#E11D2A]" />
              <div className="mt-3 text-sm font-medium group-hover:text-[#E11D2A]">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
