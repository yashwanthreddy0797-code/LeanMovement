import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { ProgressRing, SectionTitle, SoftCard } from "@/components/portal/ui";
import { meals, nutritionConsumed, nutritionTargets } from "@/lib/portal/data";

export const Route = createFileRoute("/portal/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><Nutrition /></ClientShell>,
});

function Nutrition() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Today's nutrition</div>
        <h1 className="text-4xl md:text-5xl">Fuel with intent.</h1>
      </div>

      <SoftCard>
        <div className="flex flex-wrap items-center justify-around gap-8 py-3">
          <ProgressRing label="Calories" unit="" value={nutritionConsumed.kcal} target={nutritionTargets.kcal} />
          <ProgressRing label="Protein (g)" unit="" value={nutritionConsumed.p} target={nutritionTargets.p} />
          <ProgressRing label="Carbs (g)" unit="" value={nutritionConsumed.c} target={nutritionTargets.c} />
          <ProgressRing label="Fat (g)" unit="" value={nutritionConsumed.f} target={nutritionTargets.f} />
        </div>
      </SoftCard>

      <div>
        <SectionTitle eyebrow="Today's plan" title="Your meals" />
        <div className="grid sm:grid-cols-2 gap-5">
          {meals.map((m) => (
            <div key={m.type} className="card-soft overflow-hidden">
              <div className="aspect-[16/9] bg-[#F5F5F5] overflow-hidden">
                <img src={m.img} alt={m.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="chip">{m.type}</span>
                  <span className="text-xs text-[#737373]">{m.kcal} kcal</span>
                </div>
                <div className="mt-3 text-[15px] font-medium text-[#000000]">{m.title}</div>
                <div className="mt-3 flex gap-4 text-xs text-[#404040]">
                  <span><b className="text-[#000000]">{m.p}g</b> protein</span>
                  <span><b className="text-[#000000]">{m.c}g</b> carbs</span>
                  <span><b className="text-[#000000]">{m.f}g</b> fat</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SoftCard>
        <SectionTitle eyebrow="Hydration" title="Water intake" />
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`flex-1 h-16 rounded-xl border ${i < 6 ? "bg-[#DCE7D5] border-[#FCA5A5]" : "bg-white border-[var(--border)]"}`} />
          ))}
        </div>
        <div className="mt-3 text-xs text-[#737373]">6 of 8 glasses · 1.5L to go</div>
      </SoftCard>
    </div>
  );
}
