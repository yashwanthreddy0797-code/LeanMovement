import { createFileRoute } from "@tanstack/react-router";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { COACH } from "@/lib/lean-kettlebell";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/portal/live")({
  head: () => ({ meta: [{ title: "Live Sessions - Lean Kettlebell Portal" }] }),
  component: LiveSessions,
});

function LiveSessions() {
  const { content, isLoading, nextLiveSession, weeklySchedule } = usePortalPageContent();

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
        description="Your weekly schedule and Zoom links."
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

      <div>
        <h2 className="mb-3 font-display text-lg uppercase tracking-[0.06em] sm:mb-4 sm:text-xl">
          Your week
        </h2>
        <div className="space-y-px bg-border">
          {weeklySchedule.map((s) => (
            <div
              key={`${s.day}-${s.time}`}
              className={`flex flex-col gap-3 bg-white px-4 py-4 sm:gap-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:px-6 ${
                s.isToday ? "ring-1 ring-inset ring-accent" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                    {s.day} · {s.date}
                  </span>
                  {s.isToday && (
                    <LiveSessionBadge
                      liveState={s.liveState ?? "later"}
                      minutesUntilStart={live.minutesUntilStart}
                    />
                  )}
                </div>
                <h3 className="mt-1 font-display text-lg uppercase tracking-[0.04em] sm:text-xl">
                  {s.title}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70 md:hidden">
                  <Clock size={14} /> {s.time}
                </div>
              </div>
              <div className="flex w-full shrink-0 items-center gap-3 md:w-auto">
                <div className="hidden items-center gap-1.5 text-sm text-foreground/70 md:flex">
                  <Clock size={14} /> {s.time}
                </div>
                <a
                  href={s.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    s.liveState === "live" || s.liveState === "soon"
                      ? "portal-btn portal-btn-accent w-full md:w-auto"
                      : "portal-btn w-full md:w-auto"
                  }
                >
                  {s.liveState === "live" || s.liveState === "soon" ? "Join now" : "Join Zoom"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
