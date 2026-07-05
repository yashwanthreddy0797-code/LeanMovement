import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { LiveScheduleCalendar } from "@/components/portal/LiveScheduleCalendar";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
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
    return <p className="text-sm text-[#737373]">Loading schedule…</p>;
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
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">
          Mon · Wed · Sat
        </div>
        <h1 className="text-4xl md:text-5xl font-serif">Live schedule</h1>
        <p className="mt-2 text-[#737373] max-w-2xl">
          Set your Google Meet or Zoom links for each session. Changes save to Supabase and appear
          on every member&apos;s dashboard and Live Sessions page automatically.
        </p>
      </div>

      <LiveScheduleCalendar sessions={data.liveSessions} />

      <div>
        <SectionTitle eyebrow="Meeting links" title="Edit session URLs" />
        <p className="text-sm text-[#737373] mb-5 max-w-2xl">
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
              className={isToday ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/20" : ""}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">
                    {s.day_of_week}
                    {isToday && <span className="ml-2 text-[#E11D2A]">· Today</span>}
                  </div>
                  <h2 className="mt-1 font-serif text-2xl">
                    {s.title} — {s.session_type}
                  </h2>
                  <p className="text-sm text-[#737373] mt-1">
                    {formatSessionTime(s.start_time)} · {s.duration_minutes} min · {s.focus}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] text-white text-xs font-medium hover:bg-[#111111]"
                  >
                    <Play size={14} /> Host now
                  </a>
                  <a
                    href={s.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-xs hover:bg-[#FAFAF6]"
                  >
                    <ExternalLink size={14} /> Test link
                  </a>
                </div>
              </div>

              <SectionTitle eyebrow="Join URL" title="Meeting link" />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={draft}
                  onChange={(e) => setEdits((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  placeholder="https://meet.google.com/... or https://zoom.us/j/..."
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] text-sm outline-none focus:border-[#FCA5A5]"
                />
                <button
                  type="button"
                  disabled={!dirty || saving === s.id}
                  onClick={() => void save(s.id)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E11D2A] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40"
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
