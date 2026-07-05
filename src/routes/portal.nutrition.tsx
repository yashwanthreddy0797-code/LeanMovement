import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { nutritionFramework } from "@/lib/portal/member-data";

export const Route = createFileRoute("/portal/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition Framework — LEANMOVEMENT Portal" }] }),
  component: Nutrition,
});

function Nutrition() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Not meal plans</div>
        <h1 className="text-4xl md:text-5xl font-serif">Nutrition framework</h1>
        <p className="mt-2 text-[#737373] max-w-xl">
          How lean people eat — calorie and protein targets, flexible dieting, and real-life guides.
        </p>
      </div>

      <SoftCard className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] text-white border-0">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Calorie target</div>
            <div className="mt-2 font-serif text-4xl">{nutritionFramework.calorieTarget}</div>
            <div className="text-sm text-white/60">kcal / day</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Protein target</div>
            <div className="mt-2 font-serif text-4xl">{nutritionFramework.proteinTarget}g</div>
            <div className="text-sm text-white/60">{nutritionFramework.proteinPerKg}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Approach</div>
            <div className="mt-2 font-serif text-2xl">Flexible</div>
            <div className="text-sm text-white/60">No banned foods</div>
          </div>
        </div>
      </SoftCard>

      <div>
        <SectionTitle eyebrow="Your playbook" title="Framework guides" />
        <div className="grid md:grid-cols-2 gap-5 mt-2">
          {nutritionFramework.sections.map((s) => (
            <div key={s.title} className="card-soft p-6 md:p-8">
              <h3 className="font-display text-xl uppercase tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-[#737373] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
