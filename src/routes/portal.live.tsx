import { createFileRoute } from "@tanstack/react-router";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { COACH } from "@/lib/lean-kettlebell";
import { Calendar, Clock } from "lucide-react";

export const Route = createFileRoute("/portal/live")({
  head: () => ({ meta: [{ title: "Live Sessions — Lean Kettlebell Portal" }] }),
  component: LiveSessions,
});

function LiveSessions() {
  const { content, isLoading, nextLiveSession, weeklySchedule, liveSessions } = usePortalPageContent();

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
    <div className="space-y-10">
      <PortalPageHeader
        eyebrow="Train live"
        title="Live sessions"
        description="Three coached sessions per week. Join live — all sessions are recorded if you miss one."
      />

      <div
        className={`card-soft border-0 p-6 text-background md:p-8 ${
          isSessionActive ? "bg-accent ring-2 ring-accent/30" : "bg-foreground"
        }`}
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-background/70">
                Up next
              </span>
              <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.04em]">{live.title}</h2>
            <p className="mt-2 text-sm text-background/70">
              {live.day}, {live.date} · {live.time} · {live.duration}
            </p>
            <p className="mt-1 text-xs text-background/50">With {live.coach}</p>
          </div>
          <LiveJoinButton
            joinUrl={live.joinUrl}
            liveState={live.liveState}
            minutesUntilStart={live.minutesUntilStart}
          />
        </div>
      </div>

      <LiveScheduleCalendar sessions={liveSessions} />

      <div>
        <SectionTitle eyebrow="Weekly" title="Your schedule" />
        <div className="space-y-px bg-border">
          {weeklySchedule.map((s) => (
            <div
              key={`${s.day}-${s.time}`}
              className={`flex flex-col justify-between gap-4 bg-white p-6 md:flex-row md:items-center md:p-8 ${
                s.isToday ? "ring-1 ring-inset ring-accent" : ""
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="grid h-14 w-14 shrink-0 place-items-center bg-accent/10">
                  <Calendar size={22} className="text-accent" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.day} · {s.date}
                    </span>
                    {s.isToday && (
                      <LiveSessionBadge
                        liveState={s.liveState ?? "later"}
                        minutesUntilStart={live.minutesUntilStart}
                      />
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-2xl uppercase tracking-[0.04em]">{s.title}</h3>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                  <Clock size={14} /> {s.time}
                </div>
                <a
                  href={s.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    s.liveState === "live" || s.liveState === "soon"
                      ? "portal-btn portal-btn-accent"
                      : "portal-btn"
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
