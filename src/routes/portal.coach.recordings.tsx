import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
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
  head: () => ({ meta: [{ title: "Recordings - Lean Kettlebell Coach" }] }),
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
      } else if (result.inserted > 0 || result.updated > 0) {
        toast.success(result.message ?? `Synced recordings`);
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
        title="Recordings"
        description="Sync Zoom cloud videos or add a link manually. Members see them for 7 days."
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
              {syncing ? "Syncing…" : "Sync Zoom"}
            </button>
            <button type="button" onClick={() => setShowForm(true)} className="portal-btn">
              <Plus size={15} /> Add
            </button>
          </div>
        }
      />

      {!zoomConfigured && (
        <div className="border border-border bg-white px-5 py-4 text-sm text-muted-foreground">
          Zoom sync needs env vars on Vercel (
          <code className="text-xs">ZOOM_ACCOUNT_ID</code>,{" "}
          <code className="text-xs">ZOOM_CLIENT_ID</code>,{" "}
          <code className="text-xs">ZOOM_CLIENT_SECRET</code>,{" "}
          <code className="text-xs">ZOOM_HOST_EMAIL</code>
          ) plus <code className="text-xs">supabase/recordings-zoom-sync.sql</code>.
        </div>
      )}

      {showForm && (
        <SoftCard className="!p-5 md:!p-6">
          <h2 className="mb-4 font-display text-xl uppercase tracking-[0.06em]">Add recording</h2>
          <form onSubmit={(e) => void submit(e)} className="max-w-xl space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monday Morning - Mar 3"
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
                <tr className="bg-surface text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Recorded</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.recordings.map((r) => {
                  const expired =
                    Boolean(r.expires_at) && new Date(r.expires_at as string) <= new Date();
                  return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-5 py-4">
                      <div className="font-medium">{r.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {r.source === "zoom" ? "Zoom" : "Manual"}
                        {expired ? " · Expired" : ""}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-foreground/70">{r.session_type}</td>
                    <td className="px-5 py-4 text-foreground/70">{formatDate(r.recorded_at)}</td>
                    <td className="space-x-3 px-5 py-4 text-right">
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SoftCard>
    </div>
  );
}
