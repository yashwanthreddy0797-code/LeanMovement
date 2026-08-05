import { Check, Loader2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LiveSessionBadge } from "@/components/portal/LiveSessionBanner";
import { useWeeklySessionActions } from "@/hooks/useWeeklySessions";
import { SESSIONS_TO_PICK } from "@/lib/sessions";

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
      <section className="card-soft !p-4 sm:p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 size={16} className="animate-spin text-accent" />
          Loading your weekly schedule…
        </div>
      </section>
    );
  }

  return (
    <section className="card-soft overflow-hidden !p-0">
      <div className="flex items-end justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5 sm:py-4 md:px-6">
        <div className="min-w-0">
          <h2 className="font-display text-lg uppercase tracking-[0.06em] sm:text-xl md:text-2xl">
            This week
          </h2>
          <p className="mt-0.5 truncate text-sm text-muted-foreground sm:mt-1">{data.weekLabel}</p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {data.attendedCount}/{SESSIONS_TO_PICK}
          </span>
        </p>
      </div>

      <div className="divide-y divide-border">
        {data.slots.map((slot) => (
          <div
            key={slot.slotId}
            className={`flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 md:px-6 ${
              slot.attended ? "bg-accent/[0.03]" : "bg-white"
            }`}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-base uppercase tracking-[0.05em] sm:text-lg">
                  {slot.day} · {slot.focus}
                </p>
                {slot.attended ? (
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-accent">
                    <Check size={12} /> Done
                  </span>
                ) : (
                  <LiveSessionBadge liveState={slot.liveState} />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {slot.timeLabel}
                {slot.brief ? ` · ${slot.brief}` : ""}
              </p>
            </div>

            {!slot.attended && slot.joinUrl && (
              <button
                type="button"
                disabled={joiningId === slot.slotId}
                onClick={() => void handleJoin(slot.slotId, slot.joinUrl)}
                className={`portal-btn w-full gap-2 sm:w-auto sm:shrink-0 ${
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
                {slot.liveState === "live" ? "Join live" : "Open Zoom"}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
