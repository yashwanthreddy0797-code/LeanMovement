import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatSessionTime,
  todayWeekday,
  updateLiveSessionUrl,
} from "@/lib/portal/coach-queries";
import { ExternalLink, Play, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/schedule")({
  head: () => ({ meta: [{ title: "Live Schedule — Lean Kettlebell Coach" }] }),
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
    <div className="space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        eyebrow="Morning Mon · Wed · Fri · Evening Tue · Thu · Sat"
        title="Live schedule"
        description="Set your Zoom link for each live session. Changes save to Supabase and appear on every active member's dashboard automatically."
      />

      <LiveScheduleCalendar sessions={data.liveSessions} />

      <div>
        <SectionTitle eyebrow="Meeting links" title="Edit session URLs" />
        <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
          Update Google Meet or Zoom links for each recurring session below.
        </p>
      </div>

      <div className="space-y-5">
        {data.liveSessions.map((s) => {
          const isToday = s.day_of_week === todayWeekday();
          const draft = edits[s.id] ?? s.join_url;
          const dirty = edits[s.id] !== undefined && edits[s.id] !== s.join_url;

          return (
            <SoftCard
              key={s.id}
              className={isToday ? "border-accent ring-1 ring-accent/20" : ""}
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {s.day_of_week}
                    {isToday && <span className="ml-2 text-accent">· Today</span>}
                  </div>
                  <h2 className="mt-1 font-display text-2xl uppercase tracking-[0.04em]">{s.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatSessionTime(s.start_time)} · {s.duration_minutes} min · IST
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn"
                  >
                    <Play size={14} /> Host now
                  </a>
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn portal-btn-ghost"
                  >
                    <ExternalLink size={14} /> Test link
                  </a>
                </div>
              </div>

              <SectionTitle eyebrow="Join URL" title="Meeting link" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={draft}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  placeholder="https://meet.google.com/... or https://zoom.us/j/..."
                  className="flex-1 border border-border px-4 py-3 text-sm outline-none focus:border-accent"
                />
                <button
                  type="button"
                  disabled={!dirty || saving === s.id}
                  onClick={() => void save(s.id)}
                  className="portal-btn portal-btn-accent disabled:opacity-40"
                >
                  <Save size={15} />
                  {saving === s.id ? "Saving…" : "Save"}
                </button>
              </div>
            </SoftCard>
          );
        })}
      </div>
    </div>
  );
}
