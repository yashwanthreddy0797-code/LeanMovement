import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientShell } from "@/components/portal/ClientShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { workoutToday } from "@/lib/portal/data";
import { Check, Play, Timer } from "lucide-react";

export const Route = createFileRoute("/portal/workouts")({
  head: () => ({ meta: [{ title: "Workouts — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><Workouts /></ClientShell>,
});

function Workouts() {
  const [exercises, setExercises] = useState(workoutToday.exercises);
  const done = exercises.filter((e) => e.done).length;
  const pct = Math.round((done / exercises.length) * 100);
  const toggle = (name: string) => setExercises((ex) => ex.map((e) => e.name === name ? { ...e, done: !e.done } : e));

  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Today · Tuesday</div>
        <h1 className="text-4xl md:text-5xl">{workoutToday.title}</h1>
        <p className="mt-2 text-[#737373]">{workoutToday.exercises.length} exercises · {workoutToday.duration} · Designed by Arjun Kapoor</p>
      </div>

      <div className="card-soft p-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[#404040] font-medium">Completion</span>
          <span className="text-[#E11D2A]">{done} / {exercises.length} done · {pct}%</span>
        </div>
        <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#E11D2A] to-[#FCA5A5] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {exercises.map((e, i) => (
          <div key={e.name} className={`card-soft p-5 flex items-center gap-5 transition ${e.done ? "opacity-60" : ""}`}>
            <button onClick={() => toggle(e.name)}
              className={`w-10 h-10 rounded-full border-2 grid place-items-center transition ${e.done ? "bg-[#E11D2A] border-[#E11D2A] text-white" : "border-[#D7D2C7] text-[#737373] hover:border-[#E11D2A]"}`}>
              {e.done ? <Check size={18} /> : <span className="text-sm font-semibold">{i + 1}</span>}
            </button>

            <div className="aspect-video w-32 hidden sm:block rounded-xl bg-gradient-to-br from-[#000000] to-[#E11D2A] relative overflow-hidden grid place-items-center">
              <Play className="text-white/80" size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-medium text-[#000000] truncate">{e.name}</div>
              <div className="text-xs text-[#737373] mt-0.5">Demonstration video · 38s</div>
            </div>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <Stat label="Sets" value={String(e.sets)} />
              <Stat label="Reps" value={e.reps} />
              <Stat label="Rest" value={e.rest} icon={<Timer size={12} />} />
            </div>
          </div>
        ))}
      </div>

      <SoftCard>
        <SectionTitle eyebrow="Coming up" title="This week's split" />
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
          {["Push","Pull","Legs","Rest","Upper","Lower","Conditioning"].map((d, i) => (
            <div key={d} className={`py-4 rounded-xl ${i === 0 ? "bg-[#FEE2E2] text-[#000000] font-semibold" : "bg-white border border-[var(--border)] text-[#737373]"}`}>
              <div className="text-[10px] uppercase tracking-widest">Day {i+1}</div>
              <div className="mt-1">{d}</div>
            </div>
          ))}
        </div>
      </SoftCard>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-[#A3A3A3] flex items-center gap-1 justify-center">{icon}{label}</div>
      <div className="text-sm font-medium text-[#000000]">{value}</div>
    </div>
  );
}
