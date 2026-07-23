import { Check, Loader2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { useWeeklySessionActions } from "@/hooks/useWeeklySessions";
import { SESSIONS_TO_PICK, formatSelectedSessions } from "@/lib/sessions";

type WeeklyData = {
  ok: true;
  weekLabel: string;
  pickedIds: string[];
  attendedSlotIds: string[];
  attendedCount: number;
  picksComplete: boolean;
  slots: Array<{
    slotId: string;
    day: string;
    focus: string;
    timeLabel: string;
    brief: string;
    joinUrl: string | null;
    liveState: "live" | "soon" | "later";
    attended: boolean;
    attendedAt: string | null;
  }>;
};

export function WeeklySessionsPanel({
  userId,
  data,
  loading,
  onRefresh,
}: {
  userId: string;
  data: WeeklyData | null | undefined;
  loading?: boolean;
  onRefresh: () => void;
}) {
  const { joinSession } = useWeeklySessionActions(userId);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const pickedIds = data?.pickedIds ?? [];

  const handleJoin = async (slotId: string, joinUrl: string | null) => {
    if (!joinUrl) {
      toast.error("Zoom link not available yet");
      return;
    }

    setJoiningId(slotId);
    try {
      const result = await joinSession(slotId);
      if (!result.ok) {
        toast.error(result.message ?? "Could not record attendance");
        return;
      }
      window.open(joinUrl, "_blank", "noopener,noreferrer");
      onRefresh();
    } finally {
      setJoiningId(null);
    }
  };

  if (loading || !data) {
    return (
      <section className="card-soft p-6 md:p-8">
        <div className="flex items-center gap-3 text-base text-muted-foreground">
          <Loader2 size={16} className="animate-spin text-accent" />
          Loading your weekly schedule…
        </div>
      </section>
    );
  }

  return (
    <section className="card-soft overflow-hidden !p-0">
      <div className="border-b border-border bg-background px-6 py-5 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">
              <span className="h-px w-5 bg-accent" />
              This week
            </p>
            <h2 className="font-display text-2xl uppercase tracking-[0.06em] md:text-3xl">
              Your live sessions
            </h2>
            <p className="mt-2 text-base text-muted-foreground">{data.weekLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em]">
            <StatPill label="Sessions" value={`${SESSIONS_TO_PICK}/week`} />
            <StatPill label="Attended" value={`${data.attendedCount}/${SESSIONS_TO_PICK}`} accent />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Tue / Thu / Sat · 6:00–7:00 AM IST. Your program includes all three live sessions every week.
        </p>

        <div className="mt-6 space-y-3">
          {data.slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`border p-4 md:p-5 ${
                slot.attended ? "border-accent/30 bg-accent/[0.04]" : "border-border bg-background/60"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg uppercase tracking-[0.06em] md:text-xl">
                      {slot.day} · {slot.focus}
                    </p>
                    {slot.attended ? (
                      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-accent">
                        <Check size={12} /> Attended
                      </span>
                    ) : (
                      <LiveSessionBadge liveState={slot.liveState} />
                    )}
                  </div>
                  <p className="mt-1.5 text-base text-muted-foreground">
                    {slot.timeLabel} · {slot.brief}
                  </p>
                </div>

                {!slot.attended && slot.joinUrl && (
                  <button
                    type="button"
                    disabled={joiningId === slot.slotId}
                    onClick={() => void handleJoin(slot.slotId, slot.joinUrl)}
                    className={`portal-btn shrink-0 gap-2 ${
                      slot.liveState === "live" || slot.liveState === "soon"
                        ? "portal-btn-accent"
                        : ""
                    }`}
                  >
                    {joiningId === slot.slotId ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Video size={14} />
                    )}
                    {slot.liveState === "live" ? "Join Zoom live" : "Open Zoom link"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{formatSelectedSessions(pickedIds)}</p>
      </div>
    </section>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <span
      className={`border px-3 py-1.5 ${
        accent ? "border-accent/30 bg-accent/5 text-accent" : "border-border text-muted-foreground"
      }`}
    >
      {label} · <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}
