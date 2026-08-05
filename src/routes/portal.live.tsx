import { createFileRoute } from "@tanstack/react-router";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { COACH } from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/portal/live")({
  head: () => ({ meta: [{ title: "Live Sessions - LEANMOVEMENT Portal" }] }),
  component: LiveSessions,
});

function LiveSessions() {
  const { content, isLoading, nextLiveSession, liveSessions } = usePortalPageContent();

  if (isLoading || !content || !nextLiveSession) {
    return <PortalPageSkeleton />;
  }

  const live = {
    liveState: "later" as const,
    minutesUntilStart: 0,
    joinUrl: "#",
    title: "Live session",
    day: "",
    date: "",
    time: "",
    duration: "45 min",
    coach: COACH.name,
    type: "",
    ...nextLiveSession,
  };

  const isSessionActive = live.liveState === "live" || live.liveState === "soon";

  return (
    <div className="space-y-5 sm:space-y-8">
      <PortalPageHeader
        title="Live sessions"
        description="Your schedule in month or week view — tap a day for Zoom links."
      />

      <div
        className={`border p-4 text-background sm:p-6 md:p-8 ${
          isSessionActive ? "border-accent bg-accent" : "border-border bg-foreground"
        }`}
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-background/70 sm:text-xs">
                Up next
              </span>
              <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
            </div>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.04em] sm:text-3xl">
              {live.title}
            </h2>
            <p className="mt-1.5 text-sm text-background/70 sm:mt-2">
              {live.day}, {live.date} · {live.time} · {live.duration}
            </p>
          </div>
          <LiveJoinButton
            joinUrl={live.joinUrl}
            liveState={live.liveState}
            minutesUntilStart={live.minutesUntilStart}
          />
        </div>
      </div>

      <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:overflow-visible sm:px-0">
        <LiveScheduleCalendar sessions={liveSessions} variant="member" />
      </div>
    </div>
  );
}
