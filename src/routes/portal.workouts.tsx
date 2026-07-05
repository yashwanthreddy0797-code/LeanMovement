import { createFileRoute } from "@tanstack/react-router";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
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
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">On-demand library</div>
        <h1 className="text-4xl md:text-5xl font-serif">Kettlebell circuits</h1>
        <p className="mt-2 text-[#737373] max-w-xl">
          Five circuits for travel days, extra conditioning, or when you can&apos;t make live.
        </p>
      </div>

      <div className="space-y-5">
        {circuits.map((c, i) => (
          <div key={c.id} className="card-soft overflow-hidden">
            <div className="grid md:grid-cols-12 gap-0">
              <div className="md:col-span-1 bg-[#000000] text-white grid place-items-center py-6 md:py-0">
                <span className="font-display text-2xl">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="md:col-span-11 p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl uppercase tracking-tight">{c.name}</h2>
                    <p className="mt-2 text-sm text-[#737373] max-w-lg">{c.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip">{c.duration}</span>
                    <span className="chip">{c.rounds}</span>
                    <span className="chip">{c.difficulty}</span>
                  </div>
                </div>
                <ul className="mt-6 grid sm:grid-cols-2 gap-2">
                  {c.exercises.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-[#404040]">
                      <Dumbbell size={14} className="text-[var(--accent)] shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
                {c.videoUrl && (
                  <a
                    href={c.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#000000] text-white text-sm font-medium hover:bg-[#111]"
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
        <p className="text-sm text-[#737373] leading-relaxed">
          Circuits complement your three weekly live sessions — not replace them.
        </p>
      </SoftCard>
    </div>
  );
}
