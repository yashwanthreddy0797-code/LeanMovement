import { createFileRoute } from "@tanstack/react-router";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { Dumbbell, Play } from "lucide-react";

export const Route = createFileRoute("/portal/workouts")({
  head: () => ({ meta: [{ title: "Circuits — Lean Kettlebell Portal" }] }),
  component: Circuits,
});

function Circuits() {
  const { content, isLoading, circuits } = usePortalPageContent();

  if (isLoading || !content) {
    return <PortalPageSkeleton />;
  }

  return (
    <div className="space-y-10">
      <PortalPageHeader
        eyebrow="On-demand library"
        title="Kettlebell circuits"
        description="Five circuits for travel days, extra conditioning, or when you can't make live."
      />

      <div className="space-y-px bg-border">
        {circuits.map((c, i) => (
          <div key={c.id} className="overflow-hidden bg-white">
            <div className="grid gap-0 md:grid-cols-12">
              <div className="grid place-items-center bg-foreground py-6 text-background md:col-span-1 md:py-0">
                <span className="font-display text-2xl tracking-[0.04em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-6 md:col-span-11 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-[0.04em]">{c.name}</h2>
                    <p className="mt-2 max-w-lg text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{c.duration}</span>
                    <span className="chip">{c.rounds}</span>
                    <span className="chip">{c.difficulty}</span>
                  </div>
                </div>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {c.exercises.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-foreground/70">
                      <Dumbbell size={14} className="shrink-0 text-accent" />
                      {ex}
                    </li>
                  ))}
                </ul>
                {c.videoUrl && (
                  <a
                    href={c.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn mt-6"
                  >
                    <Play size={14} fill="currentColor" /> Watch demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SoftCard>
        <SectionTitle eyebrow="Between lives" title="When to use circuits" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Circuits complement your three weekly live sessions — not replace them.
        </p>
      </SoftCard>
    </div>
  );
}
