import { createFileRoute } from "@tanstack/react-router";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { Video } from "lucide-react";

export const Route = createFileRoute("/portal/recordings")({
  head: () => ({ meta: [{ title: "Recordings — Lean Kettlebell Portal" }] }),
  component: Recordings,
});

function Recordings() {
  const { content, isLoading, recordings } = usePortalPageContent();

  if (isLoading || !content) {
    return <PortalPageSkeleton />;
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Catch up anytime</div>
        <h1 className="text-4xl md:text-5xl font-serif">Session recordings</h1>
        <p className="mt-2 text-[#737373] max-w-xl">
          Missed a live session? Every class is recorded. Watch on your schedule.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {recordings.map((r) => (
          <article key={r.id} className="card-soft overflow-hidden">
            <div className="relative aspect-video bg-[#111] overflow-hidden">
              <iframe
                src={r.videoUrl}
                title={r.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <span className="chip">{r.type}</span>
              <h3 className="mt-3 font-medium text-[#000000]">{r.title}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#737373]">
                <Video size={12} /> {r.date} · {r.duration}
              </div>
            </div>
          </article>
        ))}
      </div>

      {recordings.length === 0 && (
        <SoftCard className="text-center text-sm text-[#737373]">
          <p>No recordings yet. Your coach will add them after live sessions.</p>
        </SoftCard>
      )}
    </div>
  );
}
