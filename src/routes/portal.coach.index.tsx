import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { CoachRegistrationAlerts } from "@/components/portal/CoachRegistrationAlerts";
import { CoachContactInbox } from "@/components/portal/CoachContactInbox";
import {
  formatSessionTime,
  getNextLiveSession,
  todayWeekday,
} from "@/lib/portal/coach-queries";
import { ArrowRight, Play, Radio, UserPlus } from "lucide-react";

export const Route = createFileRoute("/portal/coach/")({
  head: () => ({ meta: [{ title: "Coach - LEANMOVEMENT" }] }),
  component: () => (
    <CoachShell>
      <CoachDashboard />
    </CoachShell>
  ),
});

function CoachDashboard() {
  const session = usePortalSession();
  const { data, loading } = useCoachData();

  if (loading || !data) {
    return <PortalPageSkeleton lines={3} />;
  }

  const { stats, liveSessions } = data;
  const nextSession = getNextLiveSession(liveSessions);
  const isToday = nextSession?.day_of_week === todayWeekday();
  const coachId = session.user?.id;
  const firstName = (session.profile?.full_name ?? session.user?.name ?? "Coach").split(" ")[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="border border-border bg-[#0F1217] p-5 text-background sm:p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-background/45">Coach home</p>
        <h1 className="mt-2 font-display text-2xl uppercase tracking-[0.04em] sm:text-3xl">
          {firstName}
        </h1>
        <p className="mt-2 text-sm text-background/60">
          {stats.activeMembers} active
          {stats.pendingMembers > 0 ? ` · ${stats.pendingMembers} pending activation` : ""}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/portal/coach/members" className="portal-btn portal-btn-accent inline-flex gap-2">
            <UserPlus size={14} />
            Members
          </Link>
          <Link
            to="/portal/coach/onboarding"
            className="portal-btn portal-btn-ghost !border-background/20 !text-background"
          >
            Onboarding
          </Link>
          <Link
            to="/portal/coach/schedule"
            className="portal-btn portal-btn-ghost !border-background/20 !text-background"
          >
            Schedule
          </Link>
        </div>
      </section>

      <CoachRegistrationAlerts coachId={coachId} />
      <CoachContactInbox coachId={coachId} />

      {(stats.onboardingPending > 0 || stats.whatsappPending > 0) && (
        <Link
          to="/portal/coach/onboarding"
          className="flex items-center justify-between gap-3 border border-border bg-white px-4 py-3"
        >
          <p className="text-sm">
            {stats.onboardingPending > 0 && `${stats.onboardingPending} onboarding`}
            {stats.onboardingPending > 0 && stats.whatsappPending > 0 ? " · " : ""}
            {stats.whatsappPending > 0 && `${stats.whatsappPending} WhatsApp`}
            {(stats.onboardingPending > 0 || stats.whatsappPending > 0) && " pending"}
          </p>
          <ArrowRight size={14} className="shrink-0 text-accent" />
        </Link>
      )}

      {nextSession && (
        <div className="border border-border bg-foreground p-5 text-background sm:p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-accent">
            <Radio size={12} className={isToday ? "animate-pulse" : ""} />
            {isToday ? "Today" : "Next session"}
          </div>
          <h2 className="mt-2 font-display text-xl uppercase tracking-[0.04em]">{nextSession.title}</h2>
          <p className="mt-1 text-sm text-background/65">
            {nextSession.day_of_week} · {formatSessionTime(nextSession.start_time)} ·{" "}
            {nextSession.duration_minutes} min
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={nextSession.join_url}
              target="_blank"
              rel="noopener noreferrer"
              className="portal-btn portal-btn-accent"
            >
              <Play size={14} fill="currentColor" /> Host
            </a>
            <Link
              to="/portal/coach/schedule"
              className="portal-btn portal-btn-ghost !border-background/20 !text-background"
            >
              Edit schedule
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
