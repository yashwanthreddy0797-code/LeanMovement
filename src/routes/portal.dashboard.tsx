import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { WeeklySessionsPanel } from "@/components/portal/WeeklySessionsPanel";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle } from "@/components/portal/ui";
import { useMemberOnboarding } from "@/hooks/useMemberOnboarding";
import { useWeeklySessions } from "@/hooks/useWeeklySessions";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { memberProfile, whatsAppCommunity } from "@/lib/portal/member-data";
import { formatPortalDate, membershipSummary } from "@/lib/portal/member-format";
import { usePortalSession } from "@/lib/portal/session";
import { COACH } from "@/lib/lean-kettlebell";
import {
  ArrowRight,
  Calendar,
  Play,
  Radio,
  Video,
  MessageCircle,
  Dumbbell,
} from "lucide-react";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LEANMOVEMENT Portal" }] }),
  component: Dashboard,
});

function Dashboard() {
  const session = usePortalSession();
  const { content, isLoading, isError, nextLiveSession, weeklySchedule, recordings, circuits, siteConfig } =
    usePortalPageContent();
  const { data: onboarding, isLoading: onboardingLoading, refetch: refetchOnboarding } =
    useMemberOnboarding(session.user?.id);
  const {
    data: weeklySessions,
    isLoading: weeklyLoading,
    refetch: refetchWeekly,
  } = useWeeklySessions(session.user?.id);

  if (isLoading || !content) {
    return <PortalPageSkeleton lines={4} />;
  }

  if (isError || !nextLiveSession) {
    return (
      <div className="card-soft mx-auto max-w-md p-8 text-center">
        <p className="type-body mx-auto">We couldn&apos;t load your schedule. Try refreshing.</p>
        <button type="button" onClick={() => window.location.reload()} className="portal-btn mt-5">
          Refresh
        </button>
      </div>
    );
  }

  const live = {
    liveState: "later" as const,
    minutesUntilStart: 0,
    joinUrl: "#",
    title: "Live session",
    day: "",
    date: "",
    time: "",
    type: "",
    coach: COACH.name,
    duration: "45 min",
    ...nextLiveSession,
  };

  const whatsappUrl = siteConfig.whatsappInviteUrl || whatsAppCommunity.inviteUrl;
  const calendlyUrl = siteConfig.foundationsCalendlyUrl;
  const billing = membershipSummary(session.membership);
  const displayName = session.user?.name ?? memberProfile.name;
  const sessionPct = Math.min(
    100,
    Math.round(((content.sessionsThisMonth ?? 0) / (content.totalSessionsPerMonth || 12)) * 100),
  );

  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-10">
      {session.user?.id && (
        <WeeklySessionsPanel
          userId={session.user.id}
          data={weeklySessions && "ok" in weeklySessions && weeklySessions.ok ? weeklySessions : null}
          loading={weeklyLoading}
          onRefresh={() => {
            void refetchWeekly();
            void refetchOnboarding();
          }}
        />
      )}

      {/* Welcome hero — marketing-style dark band */}
      <section className="overflow-hidden border border-border bg-foreground text-background">
        <div className="p-8 md:p-10 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-background/55">
              <span className="h-1.5 w-1.5 bg-accent" />
              {today} · {greet}
            </p>
            <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl uppercase leading-[0.92] tracking-[0.04em] text-background sm:text-5xl md:text-[3.5rem]">
            Welcome back,
            <br />
            <span className="text-background/80">{displayName}.</span>
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-background/60 md:text-[0.9375rem]">
            Lean Kettlebell™ · {billing.planLabel} · {billing.statusLabel}
          </p>

          <div className="mt-8 max-w-md">
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-background/45">
              <span>Sessions this month</span>
              <span className="font-medium text-background/75">
                {content.sessionsThisMonth ?? 0}/{content.totalSessionsPerMonth ?? 12}
              </span>
            </div>
            <div className="h-[3px] overflow-hidden bg-background/15">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${sessionPct}%` }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={live.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`portal-btn inline-flex gap-2 ${
                live.liveState !== "later" ? "portal-btn-accent" : "!bg-background/10 !text-background hover:!bg-background/15"
              }`}
            >
              <Radio size={14} />
              {live.liveState === "live" ? "Join live now" : "Next live session"}
            </a>
            <Link
              to="/portal/recordings"
              className="portal-btn portal-btn-ghost !border-background/20 !text-background hover:!bg-background/10"
            >
              <Video size={14} /> Watch recordings
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-background/15 pt-8 md:grid-cols-4">
            <HeroStat k="Membership" v="Lean Kettlebell™" />
            <HeroStat k="Plan" v={billing.planLabel} />
            <HeroStat k="Renews" v={billing.renewsOn} />
            <HeroStat k="Member since" v={billing.memberSince} />
          </div>
        </div>
      </section>

      <OnboardingChecklist
        onboarding={onboarding}
        calendlyUrl={calendlyUrl}
        whatsappUrl={whatsappUrl}
        loading={onboardingLoading}
      />

      <section className="grid gap-px bg-border lg:grid-cols-5">
        <div className="bg-white p-6 lg:col-span-3 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-accent">
                <Radio size={12} className="animate-pulse" /> Next live session
              </p>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-foreground">
                {live.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {live.day} · {live.date} · {live.time}
              </p>
            </div>
            <span className="chip">{live.type}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <LiveJoinButton
              joinUrl={live.joinUrl}
              liveState={live.liveState}
              minutesUntilStart={live.minutesUntilStart}
              size="sm"
            />
            <Link to="/portal/live" className="portal-btn portal-btn-ghost text-xs">
              View schedule <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col bg-white p-6 lg:col-span-2 lg:p-8">
          <p className="eyebrow !gap-0">Foundations</p>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.06em]">Book Foundations</h3>
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            60-min technique session before your first live class.
          </p>
          {onboarding?.foundations_completed_at ? (
            <p className="mt-4 text-xs font-medium text-foreground/70">
              Completed {formatPortalDate(onboarding.foundations_completed_at)}
            </p>
          ) : calendlyUrl ? (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.12em] text-accent hover:text-foreground"
            >
              Book on Calendly <ArrowRight size={13} />
            </a>
          ) : null}
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="This week"
          title="Live schedule"
          action={
            <Link
              to="/portal/live"
              className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.12em] text-accent hover:text-foreground"
            >
              Full schedule <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="grid gap-px bg-border md:grid-cols-2 xl:grid-cols-3">
          {weeklySchedule.map((s) => (
            <div
              key={`${s.day}-${s.time}`}
              className={`bg-white p-5 ${s.isToday ? "ring-1 ring-inset ring-accent" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.day}</span>
                {s.isToday && (
                  <LiveSessionBadge liveState={s.liveState ?? "later"} className="!text-[9px]" />
                )}
              </div>
              <h3 className="mt-2 font-display text-lg uppercase tracking-[0.06em]">{s.title}</h3>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                  <Calendar size={12} /> {s.time}
                </div>
                <a
                  href={s.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium uppercase tracking-[0.1em] text-accent hover:text-foreground"
                >
                  Join Zoom
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-px bg-border lg:grid-cols-2">
        <div className="bg-white p-6">
          <SectionTitle eyebrow="Library" title="Recent recordings" />
          <div className="space-y-1">
            {recordings.slice(0, 3).map((r) => (
              <Link
                key={r.id}
                to="/portal/recordings"
                className="flex items-center gap-4 border-t border-border py-3 transition first:border-0 hover:bg-surface"
              >
                <div className="h-12 w-16 shrink-0 overflow-hidden bg-foreground">
                  <img src={r.thumbnail} alt="" className="h-full w-full object-cover opacity-80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {r.date} · {r.duration}
                  </div>
                </div>
                <Play size={16} className="shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white p-6">
          <SectionTitle eyebrow="On-demand" title="Kettlebell circuits" />
          <div className="space-y-1">
            {circuits.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                to="/portal/workouts"
                className="flex items-center justify-between border-t border-border py-3 transition first:border-0 hover:bg-surface"
              >
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.duration} · {c.difficulty}
                  </div>
                </div>
                <Dumbbell size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#25D366] text-white">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-display text-xl uppercase tracking-[0.06em]">
                {whatsAppCommunity.groupName}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Questions, accountability, progress sharing
                {onboarding?.whatsapp_joined && " · You're in the group"}
              </p>
            </div>
          </div>
          <Link
            to="/portal/community"
            className="inline-flex shrink-0 items-center justify-center bg-[#25D366] px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90"
          >
            Open community
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-background/45">{k}</div>
      <div className="mt-1.5 text-sm font-medium leading-snug text-background/95">{v}</div>
    </div>
  );
}
