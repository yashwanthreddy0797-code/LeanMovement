import { createFileRoute, Link } from "@tanstack/react-router";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useMemberOnboarding } from "@/hooks/useMemberOnboarding";
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
  const { data: onboarding, isLoading: onboardingLoading } = useMemberOnboarding(session.user?.id);

  if (isLoading || !content) {
    return <PortalPageSkeleton lines={4} />;
  }

  if (isError || !nextLiveSession) {
    return (
      <div className="card-soft p-8 text-center max-w-md mx-auto">
        <p className="text-sm text-[#737373]">We couldn&apos;t load your schedule. Try refreshing.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2.5 rounded-full bg-[#000000] text-white text-sm"
        >
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
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[#000000]">
        <div className="p-8 md:p-12 lg:p-14 text-white">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              {today} · {greet}
            </div>
            <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
          </div>

          <h1 className="mt-5 font-serif text-[42px] md:text-[52px] leading-[1.02] tracking-[-0.01em]">
            Welcome back,
            <br />
            <span className="text-white/85">{displayName}.</span>
          </h1>

          <p className="mt-5 text-white/70 text-[15px] leading-relaxed max-w-lg">
            Lean Kettlebell™ · {billing.planLabel} · {billing.statusLabel}
          </p>

          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/50 mb-2">
              <span>Sessions this month</span>
              <span className="text-white/80 font-medium">
                {content.sessionsThisMonth ?? 0}/{content.totalSessionsPerMonth ?? 12}
              </span>
            </div>
            <div className="h-[5px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-white/80 rounded-full transition-all duration-500"
                style={{ width: `${sessionPct}%` }}
              />
            </div>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={live.joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition shadow-lg shadow-black/20 ${
                live.liveState !== "later"
                  ? "bg-[var(--accent)] text-white hover:opacity-90"
                  : "bg-white/10 backdrop-blur text-white hover:bg-white/15 border border-white/15"
              }`}
            >
              <Radio size={14} />
              {live.liveState === "live" ? "Join live now" : "Next live session"}
            </a>
            <Link
              to="/portal/recordings"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-white/15 transition border border-white/15"
            >
              <Video size={14} /> Watch recordings
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
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

      <section className="grid lg:grid-cols-5 gap-5">
        <SoftCard className="lg:col-span-3 border-2 border-[#FEE2E2]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
                <Radio size={12} className="animate-pulse" /> Next live session
              </div>
              <h2 className="mt-3 font-serif text-3xl text-[#000000]">{live.title}</h2>
              <p className="mt-2 text-sm text-[#737373]">
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
            <Link
              to="/portal/live"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] text-sm hover:bg-[#FAFAFA]"
            >
              View schedule <ArrowRight size={14} />
            </Link>
          </div>
        </SoftCard>

        <div className="lg:col-span-2 card-soft p-6 flex flex-col">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">Foundations</div>
          <h3 className="mt-3 font-serif text-2xl">Book Foundations</h3>
          <p className="mt-2 text-sm text-[#737373] flex-1">
            60-min technique session before your first live class.
          </p>
          {onboarding?.foundations_completed_at ? (
            <p className="mt-4 text-xs text-[#2E7D32] font-medium">
              Completed {formatPortalDate(onboarding.foundations_completed_at)}
            </p>
          ) : calendlyUrl ? (
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
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
            <Link to="/portal/live" className="text-xs text-[#E11D2A] font-medium hover:underline inline-flex items-center gap-1">
              Full schedule <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="grid md:grid-cols-3 gap-4">
          {weeklySchedule.map((s) => (
            <div
              key={s.day}
              className={`card-soft p-5 ${s.isToday ? "ring-2 ring-[#FEE2E2] bg-[#FFFBFB]" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">{s.day}</span>
                {s.isToday && <LiveSessionBadge liveState={s.liveState ?? "later"} className="!text-[9px]" />}
              </div>
              <h3 className="mt-2 font-display text-xl uppercase">{s.title}</h3>
              <p className="mt-2 text-xs text-[#737373]">{s.focus}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[#404040]">
                <Calendar size={12} /> {s.time} · {s.date}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <SoftCard>
          <SectionTitle eyebrow="Library" title="Recent recordings" />
          <div className="space-y-3">
            {recordings.slice(0, 3).map((r) => (
              <Link
                key={r.id}
                to="/portal/recordings"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#FAFAFA] transition"
              >
                <div className="w-16 h-12 rounded-lg bg-[#111] overflow-hidden shrink-0">
                  <img src={r.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{r.title}</div>
                  <div className="text-[11px] text-[#737373]">
                    {r.date} · {r.duration}
                  </div>
                </div>
                <Play size={16} className="text-[#737373] shrink-0" />
              </Link>
            ))}
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="On-demand" title="Kettlebell circuits" />
          <div className="space-y-3">
            {circuits.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                to="/portal/workouts"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAFAFA] transition"
              >
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-[11px] text-[#737373]">
                    {c.duration} · {c.difficulty}
                  </div>
                </div>
                <Dumbbell size={16} className="text-[#737373]" />
              </Link>
            ))}
          </div>
        </SoftCard>
      </section>

      <section className="card-soft p-6 bg-gradient-to-br from-[#E8F5E9] to-white border-[#C8E6C9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366] grid place-items-center text-white shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <h3 className="font-serif text-xl">{whatsAppCommunity.groupName}</h3>
              <p className="mt-1 text-sm text-[#737373]">
                Questions, accountability, progress sharing
                {onboarding?.whatsapp_joined && " · You're in the group"}
              </p>
            </div>
          </div>
          <Link
            to="/portal/community"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-medium hover:opacity-90 shrink-0"
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
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{k}</div>
      <div className="mt-1.5 text-sm text-white/95 font-medium leading-snug">{v}</div>
    </div>
  );
}
