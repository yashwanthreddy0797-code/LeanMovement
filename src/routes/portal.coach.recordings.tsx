import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { addRecording, deleteRecording, formatDate } from "@/lib/portal/coach-queries";
import { Plus, Trash2, Video } from "lucide-react";
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
  const [sessionType, setSessionType] = useState("Strength");
  const [videoUrl, setVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading || !data) {
    return <p className="text-sm text-[#737373]">Loading recordings…</p>;
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
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Library</div>
          <h1 className="text-4xl md:text-5xl font-serif">Session recordings</h1>
          <p className="mt-2 text-[#737373] max-w-xl">
            Upload YouTube or Vimeo embed URLs so members can catch up on missed sessions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#000000] text-white text-sm font-medium hover:bg-[#111111]"
        >
          <Plus size={15} /> Add recording
        </button>
      </div>

      {showForm && (
        <SoftCard>
          <SectionTitle eyebrow="New" title="Add session recording" />
          <form onSubmit={(e) => void submit(e)} className="space-y-4 max-w-xl">
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-1.5">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Monday Strength — Mar 3"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm outline-none focus:border-[#FCA5A5]"
                required
              />
            </label>
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-1.5">
                Session type
              </span>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm outline-none focus:border-[#FCA5A5]"
              >
                <option>Strength</option>
                <option>Conditioning</option>
                <option>Hybrid</option>
                <option>Foundations</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-1.5">
                Video URL (YouTube embed)
              </span>
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] text-sm outline-none focus:border-[#FCA5A5]"
                required
              />
            </label>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#E11D2A] text-white text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save recording"}
              </button>
            </div>
          </form>
        </SoftCard>
      )}

      <SoftCard className="!p-0 overflow-hidden">
        {data.recordings.length === 0 ? (
          <div className="p-12 text-center text-[#737373]">
            <Video size={32} className="mx-auto mb-3 opacity-40" />
            <p>No recordings yet. Add your first session recording above.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#737373] bg-[#FAFAF6]">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Recorded</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recordings.map((r) => (
                <tr key={r.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4 font-medium">{r.title}</td>
                  <td className="px-6 py-4 text-[#404040]">{r.session_type}</td>
                  <td className="px-6 py-4 text-[#404040]">{formatDate(r.recorded_at)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <a
                      href={r.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#E11D2A] hover:underline"
                    >
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={() => void remove(r.id)}
                      className="text-xs text-[#737373] hover:text-[#E11D2A] inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SoftCard>
    </div>
  );
}
