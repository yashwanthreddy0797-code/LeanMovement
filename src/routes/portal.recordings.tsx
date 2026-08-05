import { createFileRoute } from "@tanstack/react-router";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { classifyRecordingUrl } from "@/lib/portal/recording-player";
import { ExternalLink, Video } from "lucide-react";

export const Route = createFileRoute("/portal/recordings")({
  head: () => ({ meta: [{ title: "Recordings - Lean Kettlebell Portal" }] }),
  component: Recordings,
});

function Recordings() {
  const { content, isLoading, recordings } = usePortalPageContent();

  if (isLoading || !content) {
    return <PortalPageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Recordings"
        description="Available for 7 days after each live session."
      />

      {recordings.length === 0 ? (
        <div className="border border-border bg-white px-6 py-12 text-center text-sm text-muted-foreground">
          No recordings yet. They appear here after live Zoom sessions.
        </div>
      ) : (
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {recordings.map((r) => {
            const player = classifyRecordingUrl(r.videoUrl);
            return (
              <article key={r.id} className="overflow-hidden bg-white">
                <div className="relative aspect-video overflow-hidden bg-foreground">
                  {player.kind === "embed" ? (
                    <iframe
                      src={player.src}
                      title={r.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={player.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-black via-black/80 to-black/60 p-6 text-center text-white hover:opacity-95"
                    >
                      <Video size={28} className="text-accent" />
                      <span className="font-display text-xl uppercase tracking-[0.08em]">
                        {player.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-white/55">
                        Opens in new tab <ExternalLink size={11} />
                      </span>
                    </a>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-foreground">{r.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {r.type} · {r.date} · {r.duration}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
