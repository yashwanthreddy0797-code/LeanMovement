import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { WeeklySessionsPanel } from "@/components/portal/WeeklySessionsPanel";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { useMarkWhatsAppJoined, useMemberOnboarding } from "@/hooks/useMemberOnboarding";
import { isIntakeComplete, useMemberIntake } from "@/hooks/useMemberIntake";
import { useWeeklySessions } from "@/hooks/useWeeklySessions";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { whatsAppCommunity } from "@/lib/portal/member-data";
import { usePortalSession } from "@/lib/portal/session";
import { resolveOnboardingCalendlyUrl } from "@/lib/calendly";
import { COACH } from "@/lib/lean-kettlebell";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Radio } from "lucide-react";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard - LEANMOVEMENT Portal" }] }),
  component: Dashboard,
});

function Dashboard() {
  const session = usePortalSession();
  const navigate = useNavigate();
  const { isLoading, isError, nextLiveSession, siteConfig } = usePortalPageContent();
  const {
    data: onboarding,
    isLoading: onboardingLoading,
    refetch: refetchOnboarding,
  } = useMemberOnboarding(session.user?.id);
  const markWhatsAppJoined = useMarkWhatsAppJoined(session.user?.id);
  const { data: intakeResult, isLoading: intakeLoading } = useMemberIntake(session.user?.id);
  const intakeComplete = isIntakeComplete(intakeResult?.intake);
  const {
    data: weeklySessions,
    isLoading: weeklyLoading,
    refetch: refetchWeekly,
  } = useWeeklySessions(session.user?.id);

  const calendlyUrl = resolveOnboardingCalendlyUrl(siteConfig.foundationsCalendlyUrl);

  // Keep the first-step flow: new members still land on the questionnaire.
  // Later steps stay on the dashboard as clickable Finish setup items.
  useEffect(() => {
    if (!session.user?.id || intakeLoading || !isSupabaseConfigured()) return;
    if (intakeComplete) return;
    if (intakeResult && "needsMigration" in intakeResult && intakeResult.needsMigration) return;
    void navigate({ to: "/portal/intake" });
  }, [session.user?.id, intakeLoading, intakeResult, intakeComplete, navigate]);

  if (isLoading) {
    return <PortalPageSkeleton lines={3} />;
  }

  if (isError || !nextLiveSession) {
    return (
      <div className="card-soft mx-auto max-w-md p-6 text-center sm:p-8">
        <p className="type-body mx-auto">
          {isError
            ? "Could not load your schedule. Refresh and try again."
            : "Live schedule is not set up yet. Check back soon or message your coach."}
        </p>
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
    time: "",
    coach: COACH.name,
    duration: "45 min",
    ...nextLiveSession,
  };

  const whatsappUrl = siteConfig.whatsappInviteUrl || whatsAppCommunity.inviteUrl;
  const firstName = (session.user?.name ?? "Member").split(" ")[0];
  const isLiveSoon = live.liveState === "live" || live.liveState === "soon";

  return (
    <div className={`space-y-5 sm:space-y-6 ${isLiveSoon ? "pb-16 lg:pb-0" : ""}`}>
      <section className="border border-border bg-foreground p-5 text-background sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
        </div>
        <h1 className="mt-3 font-display text-2xl uppercase tracking-[0.04em] sm:text-3xl">
          {firstName}, your next session
        </h1>
        <p className="mt-2 text-sm text-background/70">
          {live.day} · {live.time} · {live.duration}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={live.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`portal-btn inline-flex gap-2 ${
              isLiveSoon ? "portal-btn-accent" : "!bg-background/10 !text-background"
            }`}
          >
            <Radio size={14} />
            {live.liveState === "live" ? "Join live" : "Open Zoom"}
          </a>
          <Link
            to="/portal/live"
            className="portal-btn portal-btn-ghost !border-background/20 !text-background"
          >
            Full schedule
          </Link>
        </div>
      </section>

      <OnboardingChecklist
        onboarding={onboarding}
        intakeComplete={intakeComplete}
        calendlyUrl={calendlyUrl}
        whatsappUrl={whatsappUrl}
        loading={onboardingLoading || intakeLoading}
        onOpenWhatsApp={() => {
          if (!onboarding?.whatsapp_joined) {
            void markWhatsAppJoined.mutateAsync().catch(() => undefined);
          }
        }}
      />

      {session.user?.id && (
        <WeeklySessionsPanel
          userId={session.user.id}
          data={
            weeklySessions && "ok" in weeklySessions && weeklySessions.ok ? weeklySessions : null
          }
          loading={weeklyLoading}
          onRefresh={() => {
            void refetchWeekly();
            void refetchOnboarding();
          }}
        />
      )}

      {isLiveSoon && (
        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-accent bg-accent p-3 lg:hidden">
          <a
            href={live.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-btn flex w-full !bg-white !text-accent"
          >
            <Radio size={14} /> Join live
          </a>
        </div>
      )}
    </div>
  );
}
