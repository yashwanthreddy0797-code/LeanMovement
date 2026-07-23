import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { ActivateMemberButton } from "@/components/portal/ActivateMemberButton";
import { CoachRegistrationAlerts } from "@/components/portal/CoachRegistrationAlerts";
import { CoachContactInbox } from "@/components/portal/CoachContactInbox";
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
    return <PortalPageSkeleton lines={4} />;
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
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-10 pb-20 lg:pb-0">
      <section className="overflow-hidden border border-border bg-[#0F1217] text-background">
        <div className="p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/55">
              <span className="h-1.5 w-1.5 bg-accent" />
              Coach console · {today}
            </p>
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl uppercase leading-[0.92] tracking-[0.04em] text-background sm:text-5xl md:text-[3.5rem]">
            Operations,
            <br />
            <span className="text-background/80">{coachName.split(" ")[0]}.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-background/65">
            Members · registrations · live calendar · recordings. Run the week from here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/portal/coach/members" className="portal-btn portal-btn-accent inline-flex gap-2">
              <UserPlus size={14} /> Manage members
            </Link>
            {nextSession && (
              <a
                href={nextSession.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-btn portal-btn-ghost !border-background/20 !text-background hover:!bg-background/10"
              >
                <Radio size={14} /> {isToday ? "Host today" : "Next session"}
              </a>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-background/15 pt-8 md:grid-cols-4">
            <HeroStat k="Active" v={String(stats.activeMembers)} />
            <HeroStat k="Pending" v={String(stats.pendingMembers)} />
            <HeroStat k="Est. MRR" v={formatInr(stats.mrrInr)} />
            <HeroStat k="Renewals (14d)" v={String(stats.expiringSoon)} />
          </div>
        </div>
      </section>

      <CoachRegistrationAlerts coachId={coachId} />
      <CoachContactInbox coachId={coachId} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Foundations due", value: String(stats.foundationsPending), sub: "not completed" },
          { label: "WhatsApp pending", value: String(stats.whatsappPending), sub: "not joined" },
          { label: "Pending approval", value: String(stats.pendingMembers), sub: "awaiting activate" },
          { label: "Renewals (14d)", value: String(stats.expiringSoon), sub: "action needed" },
        ].map((k) => (
          <div key={k.label} className="card-soft p-5">
            <div className="eyebrow !gap-0">{k.label}</div>
            <div className="mt-2 font-display text-2xl tracking-[0.04em] text-foreground">{k.value}</div>
            <div className="mt-1 text-xs text-accent">{k.sub}</div>
          </div>
        ))}
      </div>

      {nextSession && (
        <SoftCard className="overflow-hidden border-0 !bg-foreground !p-0 text-background">
          <div className="flex flex-col justify-between gap-6 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Radio size={12} className={isToday ? "animate-pulse" : ""} />
                {isToday ? "Today's session" : "Next live session"}
              </div>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] md:text-4xl">
                {nextSession.title}
              </h2>
              <p className="mt-2 text-sm text-background/70">
                {nextSession.day_of_week} · {formatSessionTime(nextSession.start_time)} ·{" "}
                {nextSession.duration_minutes} min
              </p>
              <p className="mt-1 text-xs text-background/50">{nextSession.focus}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href={nextSession.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="portal-btn portal-btn-accent"
              >
                <Play size={16} fill="currentColor" /> Host session
              </a>
              <Link
                to="/portal/coach/schedule"
                className="portal-btn portal-btn-ghost !border-background/20 !text-background hover:!bg-background/10"
              >
                Edit links
              </Link>
            </div>
          </div>
        </SoftCard>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <SoftCard>
          <SectionTitle
            eyebrow="Needs action"
            title="Pending members"
            action={
              <Link to="/portal/coach/members" className="text-xs text-accent hover:underline">
                All members
              </Link>
            }
          />
          {pendingMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending members — all caught up.</p>
          ) : (
            <div className="space-y-3">
              {pendingMembers.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3 border border-border bg-surface p-3">
                  <div className="grid h-9 w-9 place-items-center bg-foreground text-xs font-semibold text-background">
                    {(m.full_name ?? m.email)[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{m.full_name ?? m.email}</div>
                    <div className="text-[11px] text-muted-foreground">{m.email}</div>
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
            eyebrow="Morning · Evening"
            title="Weekly schedule"
            action={
              <Link to="/portal/coach/schedule" className="text-xs text-accent hover:underline">
                Manage
              </Link>
            }
          />
          <div className="space-y-px bg-border">
            {liveSessions.map((s) => {
              const isSessionToday = s.day_of_week === todayWeekday();
              return (
                <div
                  key={s.id}
                  className={`flex items-center justify-between gap-4 bg-white p-4 ${
                    isSessionToday ? "ring-1 ring-inset ring-accent" : ""
                  }`}
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {s.day_of_week}
                      {isSessionToday && <span className="ml-2 text-accent">· Today</span>}
                    </div>
                    <div className="mt-0.5 text-sm font-medium">{s.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatSessionTime(s.start_time)} · {s.duration_minutes} min
                    </div>
                  </div>
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-medium text-accent hover:underline"
                  >
                    Open link
                  </a>
                </div>
              );
            })}
          </div>
        </SoftCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SoftCard className="lg:col-span-2">
          <SectionTitle
            eyebrow="Membership"
            title="Recent members"
            action={
              <Link
                to="/portal/coach/members"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Member</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-muted-foreground">
                      No members yet. Share /join to enroll.
                    </td>
                  </tr>
                ) : (
                  recentMembers.map((m) => (
                    <tr key={m.id} className="border-t border-border">
                      <td className="px-6 py-4">
                        <div className="font-medium">{m.full_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {m.membership ? PLAN_LABELS[m.membership.plan] : "—"}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{formatDate(m.created_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-[11px] font-medium ${statusChipClass(m.membership?.status)}`}
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
                    className="text-accent hover:underline"
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
                    className="text-accent hover:underline"
                  >
                    Foundations Calendly →
                  </a>
                </li>
              )}
              <li className="text-muted-foreground">
                Cohort: {siteConfig.cohort_start_date ?? "Not set"}
              </li>
            </ul>
            <Link to="/portal/coach/settings" className="mt-4 inline-block text-[11px] text-accent hover:underline">
              Edit portal settings →
            </Link>
          </SoftCard>

          <SoftCard>
            <SectionTitle
              eyebrow="Library"
              title="Recordings"
              action={
                <Link to="/portal/coach/recordings" className="text-xs text-accent hover:underline">
                  Manage
                </Link>
              }
            />
            {recordings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recordings yet.</p>
            ) : (
              <ul className="space-y-2">
                {recordings.slice(0, 3).map((r) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm">
                    <Video size={14} className="shrink-0 text-muted-foreground" />
                    <span className="truncate">{r.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </SoftCard>

          {stats.pendingMembers > 0 && (
            <SoftCard className="border-accent/40 bg-accent/5">
              <div className="flex gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <div className="text-sm font-medium">
                    {stats.pendingMembers} member{stats.pendingMembers > 1 ? "s" : ""} waiting
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Activate manually if a member paid offline.
                  </p>
                </div>
              </div>
            </SoftCard>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
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
              className="group bg-white p-5 transition-colors hover:bg-surface"
            >
              <Icon size={20} className="text-accent" />
              <div className="mt-3 text-sm font-medium group-hover:text-accent">{item.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.14em] text-background/45">{k}</div>
      <div className="mt-1 text-sm font-medium text-background/85">{v}</div>
    </div>
  );
}
