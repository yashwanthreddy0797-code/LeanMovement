import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { addRecording, deleteRecording, formatDate } from "@/lib/portal/coach-queries";
import {
  coachSyncZoomRecordings,
  getZoomSyncStatus,
} from "@/lib/api/zoom-recordings.functions";
import { Plus, RefreshCw, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/recordings")({
  head: () => ({ meta: [{ title: "Recordings — Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <RecordingsPage />
    </CoachShell>
  ),
});

function RecordingsPage() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();
  const coachId = session.user?.id;
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [sessionType, setSessionType] = useState("Morning");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [zoomConfigured, setZoomConfigured] = useState(false);

  useEffect(() => {
    void getZoomSyncStatus().then((s) => setZoomConfigured(s.configured));
  }, []);

  if (loading || !data) {
    return <PortalPageSkeleton />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      toast.error("Title and video URL required");
      return;
    }
    setSubmitting(true);
    const { error } = await addRecording(coachId, {
      title: title.trim(),
      session_type: sessionType,
      video_url: videoUrl.trim(),
    });
    setSubmitting(false);
    if (error) toast.error(error);
    else {
      toast.success("Recording added");
      setTitle("");
      setVideoUrl("");
      setShowForm(false);
      void refresh();
    }
  };

  const syncZoom = async () => {
    if (!coachId) return;
    setSyncing(true);
    try {
      const result = await coachSyncZoomRecordings({
        data: { coachId, daysBack: 14 },
      });
      if (!result.ok) {
        toast.error(result.message ?? "Zoom sync failed");
      } else if (result.inserted > 0) {
        toast.success(result.message ?? `Added ${result.inserted} recording(s)`);
        void refresh();
      } else {
        toast.message(result.message ?? "No new recordings");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Zoom sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this recording?")) return;
    const { error } = await deleteRecording(coachId, id);
    if (error) toast.error(error);
    else {
      toast.success("Recording deleted");
      void refresh();
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        eyebrow="Library"
        title="Session recordings"
        description="Zoom cloud recordings sync automatically. You can also add YouTube/Vimeo links manually."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void syncZoom()}
              disabled={syncing || !zoomConfigured}
              className="portal-btn portal-btn-ghost disabled:opacity-50"
              title={
                zoomConfigured
                  ? "Pull latest Zoom cloud recordings"
                  : "Add Zoom API env vars on Vercel first"
              }
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync from Zoom"}
            </button>
            <button type="button" onClick={() => setShowForm(true)} className="portal-btn">
              <Plus size={15} /> Add manually
            </button>
          </div>
        }
      />

      {!zoomConfigured && (
        <SoftCard className="border-accent/20 bg-accent/[0.03]">
          <p className="text-sm text-foreground/80">
            Zoom auto-sync is not configured yet. Add{" "}
            <code className="bg-surface px-1 text-xs">ZOOM_ACCOUNT_ID</code>,{" "}
            <code className="bg-surface px-1 text-xs">ZOOM_CLIENT_ID</code>,{" "}
            <code className="bg-surface px-1 text-xs">ZOOM_CLIENT_SECRET</code>, and{" "}
            <code className="bg-surface px-1 text-xs">ZOOM_HOST_EMAIL</code> in Vercel, then run{" "}
            <code className="bg-surface px-1 text-xs">supabase/recordings-zoom-sync.sql</code> in
            Supabase.
          </p>
        </SoftCard>
      )}

      {showForm && (
        <SoftCard>
          <SectionTitle eyebrow="New" title="Add session recording" />
          <form onSubmit={(e) => void submit(e)} className="max-w-xl space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monday Morning — Mar 3"
                className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Session type
              </span>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Foundations</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Video URL (YouTube / Vimeo / Zoom share)
              </span>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
                required
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="portal-btn portal-btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="portal-btn portal-btn-accent disabled:opacity-50">
                {submitting ? "Saving…" : "Save recording"}
              </button>
            </div>
          </form>
        </SoftCard>
      )}

      <SoftCard className="!p-0 overflow-hidden">
        {data.recordings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Video size={32} className="mx-auto mb-3 opacity-40" />
            <p>No recordings yet. Sync from Zoom after a live class, or add manually.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="px-4 py-3 font-medium sm:px-6">Title</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Type</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Source</th>
                  <th className="px-4 py-3 font-medium sm:px-6">Recorded</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recordings.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-4 font-medium sm:px-6">{r.title}</td>
                    <td className="px-4 py-4 text-foreground/70 sm:px-6">{r.session_type}</td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="chip">{r.source === "zoom" ? "Zoom" : "Manual"}</span>
                    </td>
                    <td className="px-4 py-4 text-foreground/70 sm:px-6">{formatDate(r.recorded_at)}</td>
                    <td className="space-x-3 px-4 py-4 text-right sm:px-6">
                      <a
                        href={r.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Preview
                      </a>
                      <button
                        type="button"
                        onClick={() => void remove(r.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SoftCard>
    </div>
  );
}
