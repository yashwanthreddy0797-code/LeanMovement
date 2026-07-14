import { createFileRoute } from "@tanstack/react-router";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { LiveJoinButton, LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle } from "@/components/portal/ui";
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
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Train live</div>
        <h1 className="text-4xl md:text-5xl font-serif">Live sessions</h1>
        <p className="mt-2 text-[#737373] max-w-xl">
          Three coached sessions per week. Join live — all sessions are recorded if you miss one.
        </p>
      </div>

      <div
        className={`card-soft p-6 md:p-8 border-0 text-white ${
          isSessionActive
            ? "bg-gradient-to-br from-[#E11D2A] to-[#1a1a1a] ring-2 ring-[#FEE2E2]"
            : "bg-gradient-to-br from-[#000000] to-[#1a1a1a]"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
                Up next
              </span>
              <LiveSessionBadge liveState={live.liveState} minutesUntilStart={live.minutesUntilStart} />
            </div>
            <h2 className="mt-3 font-serif text-3xl">{live.title}</h2>
            <p className="mt-2 text-white/70 text-sm">
              {live.day}, {live.date} · {live.time} · {live.duration}
            </p>
            <p className="mt-1 text-white/50 text-xs">With {live.coach}</p>
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
        <div className="space-y-4">
          {weeklySchedule.map((s) => (
            <div
              key={`${s.day}-${s.time}`}
              className={`card-soft p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                s.isToday ? "ring-2 ring-[#FEE2E2]" : ""
              }`}
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] grid place-items-center shrink-0">
                  <Calendar size={22} className="text-[var(--accent)]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">
                      {s.day} · {s.date}
                    </span>
                    {s.isToday && (
                      <LiveSessionBadge liveState={s.liveState ?? "later"} minutesUntilStart={live.minutesUntilStart} />
                    )}
                  </div>
                  <h3 className="mt-1 font-serif text-2xl">{s.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-[#404040]">
                  <Clock size={14} /> {s.time}
                </div>
                <a
                  href={s.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-5 py-2.5 rounded-full text-sm font-medium ${
                    s.liveState === "live" || s.liveState === "soon"
                      ? "bg-[#E11D2A] text-white hover:opacity-90"
                      : "bg-[#000000] text-white hover:bg-[#111]"
                  }`}
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
