import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatSessionTime,
  todayWeekday,
  updateLiveSessionUrl,
} from "@/lib/portal/coach-queries";
import { Play, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/schedule")({
  head: () => ({ meta: [{ title: "Live Schedule - Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <SchedulePage />
    </CoachShell>
  ),
});

function SchedulePage() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();
  const coachId = session.user?.id;
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  if (loading || !data) {
    return <PortalPageSkeleton />;
  }

  const save = async (id: string) => {
    const url = edits[id];
    if (!url?.trim()) {
      toast.error("Enter a valid join URL");
      return;
    }
    setSaving(id);
    const { error } = await updateLiveSessionUrl(coachId, id, url.trim());
    setSaving(null);
    if (error) toast.error(error);
    else {
      toast.success("Session link updated");
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      void refresh();
    }
  };

  return (
    <div className="space-y-5 sm:space-y-8">
      <PortalPageHeader
        title="Live schedule"
        description="Update Zoom links once - they sync to every member's dashboard."
      />

      <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:overflow-visible sm:px-0">
        <LiveScheduleCalendar sessions={data.liveSessions} />
      </div>

      <SoftCard className="!p-0 overflow-hidden">
        <div className="border-b border-border px-4 py-3.5 sm:px-5 sm:py-4 md:px-6">
          <h2 className="font-display text-lg uppercase tracking-[0.06em] sm:text-xl">Meeting links</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a Zoom or Google Meet URL for each recurring session.
          </p>
        </div>

        <div className="divide-y divide-border">
          {data.liveSessions.map((s) => {
            const isToday = s.day_of_week === todayWeekday();
            const draft = edits[s.id] ?? s.join_url;
            const dirty = edits[s.id] !== undefined && edits[s.id] !== s.join_url;

            return (
              <div
                key={s.id}
                className={`px-4 py-4 sm:px-5 sm:py-5 md:px-6 ${isToday ? "bg-accent/[0.03]" : "bg-white"}`}
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                      {s.day_of_week}
                      {isToday && <span className="ml-2 text-accent">· Today</span>}
                    </div>
                    <h3 className="mt-0.5 text-sm font-medium">{s.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatSessionTime(s.start_time)} · {s.duration_minutes} min
                    </p>
                  </div>
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn w-full sm:w-auto sm:shrink-0"
                  >
                    <Play size={14} /> Host
                  </a>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={draft}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="https://zoom.us/j/… or meet.google.com/…"
                    className="min-w-0 flex-1 border border-border px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    disabled={!dirty || saving === s.id}
                    onClick={() => void save(s.id)}
                    className="portal-btn portal-btn-accent w-full disabled:opacity-40 sm:w-auto"
                  >
                    <Save size={14} />
                    {saving === s.id ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SoftCard>
    </div>
  );
}
