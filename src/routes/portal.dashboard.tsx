import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { KPICard, SectionTitle, SoftCard, ProgressRing } from "@/components/portal/ui";
import {
  clientProfile, kpis, weightTrend, workoutToday, meals,
  nutritionTargets, nutritionConsumed, messages,
} from "@/lib/portal/data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Flame, Trophy, Play, Calendar, Quote, ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — LeanMovement Portal" }] }),
  component: () => <ClientShell><Dashboard /></ClientShell>,
});

function Dashboard() {
  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const pct = Math.round((clientProfile.dayNumber / clientProfile.totalDays) * 100);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const kcalPct = Math.round((nutritionConsumed.kcal / nutritionTargets.kcal) * 100);

  return (
    <div className="space-y-12">
      {/* ===== Editorial hero ===== */}
      <section className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[#000000]">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* Copy side */}
          <div className="relative z-10 p-8 md:p-12 lg:p-14 text-white">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              {today} · {greet}
            </div>

            <h1 className="mt-5 font-serif text-[42px] md:text-[58px] leading-[1.02] tracking-[-0.01em]">
              Welcome back,<br />
              <span className="italic text-white/85">{clientProfile.name}.</span>
            </h1>

            <p className="mt-5 text-white/70 text-[15px] leading-relaxed max-w-md">
              Day {clientProfile.dayNumber} of {clientProfile.totalDays} — you've shown up {pct}% of the way to your transformation. Discipline is becoming identity.
            </p>

            <div className="mt-8 max-w-md">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/50 mb-2">
                <span>Program progress</span>
                <span className="text-white/80 font-medium">{pct}%</span>
              </div>
              <div className="h-[5px] bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[var(--accent)] to-white/80 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/portal/workouts" className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-3 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg shadow-black/20">
                <Play size={14} fill="currentColor" /> Start today's session
              </Link>
              <Link to="/portal/checkin" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-white/15 transition border border-white/15">
                <Calendar size={14} /> Weekly check-in
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md">
              <HeroStat k="Program" v={clientProfile.program.split(" — ")[0]} />
              <HeroStat k="Coach" v={clientProfile.coach} />
              <HeroStat k="Renews" v={clientProfile.membershipRenewsOn.split(",")[0]} />
            </div>
          </div>

          {/* Right side — stats */}
          <div className="relative h-[300px] lg:h-auto min-h-[420px] bg-[#0a0a0a] flex flex-col justify-center p-8 md:p-12">
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-black/30 w-[180px]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">Streak</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl text-[#000000]">14</span>
                <span className="text-xs text-[#737373]">days</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-[var(--accent)] font-medium">
                <Flame size={11} fill="currentColor" /> Personal best
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-md">
              <HeroStat k="Program" v={clientProfile.program.split(" — ")[0]} />
              <HeroStat k="Coach" v={clientProfile.coach} />
              <HeroStat k="Renews" v={clientProfile.membershipRenewsOn.split(",")[0]} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KPIs ===== */}
      <section>
        <SectionTitle
          eyebrow="Today's snapshot"
          title="Your numbers"
          action={<Link to="/portal/progress" className="text-xs text-[#E11D2A] font-medium hover:underline inline-flex items-center gap-1">View progress <ArrowRight size={14} /></Link>}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => <KPICard key={k.label} {...k} />)}
        </div>
      </section>

      {/* ===== Trend + Today's workout ===== */}
      <section className="grid lg:grid-cols-5 gap-5">
        <SoftCard className="lg:col-span-3">
          <SectionTitle eyebrow="10-week trend" title="Weight journey" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={weightTrend}>
                <defs>
                  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E11D2A" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#E11D2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E5", background: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="w" stroke="#E11D2A" strokeWidth={2.5} fill="url(#w)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[#737373]">Starting <span className="text-[#000000] font-medium">87.0kg</span></span>
            <span className="text-[#737373]">Current <span className="text-[#000000] font-medium">78.4kg</span></span>
            <span className="text-[var(--accent)] font-medium">−8.6kg</span>
          </div>
        </SoftCard>

        {/* Workout card */}
        <div className="lg:col-span-2 card-soft overflow-hidden flex flex-col">
          <div className="relative h-44 overflow-hidden bg-[#111] flex items-end p-4">
            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] uppercase tracking-[0.18em] text-[#000000] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Today
            </div>
            <div className="text-white">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">{workoutToday.duration} · {workoutToday.exercises.length} exercises</div>
              <div className="font-serif text-xl mt-0.5 leading-tight">{workoutToday.title}</div>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <div className="space-y-2.5 flex-1">
              {workoutToday.exercises.slice(0, 4).map((e) => (
                <div key={e.name} className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-2 ${e.done ? "text-[#A3A3A3] line-through" : "text-[#000000]"}`}>
                    <span className={`w-4 h-4 rounded-full border ${e.done ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[#E5E5E5]"}`} />
                    {e.name}
                  </span>
                  <span className="text-[11px] text-[#737373] font-medium">{e.sets}×{e.reps}</span>
                </div>
              ))}
            </div>
            <Link to="/portal/workouts" className="mt-5 inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#000000] text-white text-xs font-medium hover:bg-[#111111] transition">
              Open today's session <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Nutrition + Coach + Milestone row ===== */}
      <section className="grid lg:grid-cols-3 gap-5">
        {/* Nutrition card */}
        <div className="card-soft overflow-hidden">
          <div className="p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373]">Today's nutrition</div>
            <div className="mt-1.5 font-serif text-2xl text-[#000000]">{nutritionConsumed.kcal}<span className="text-sm text-[#737373] font-sans"> / {nutritionTargets.kcal} kcal</span></div>
            <div className="mt-3 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)]" style={{ width: `${kcalPct}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
              <Macro label="P" v={nutritionConsumed.p} t={nutritionTargets.p} />
              <Macro label="C" v={nutritionConsumed.c} t={nutritionTargets.c} />
              <Macro label="F" v={nutritionConsumed.f} t={nutritionTargets.f} />
            </div>
          </div>
          <Link to="/portal/nutrition" className="block px-5 py-3 text-xs text-[#E11D2A] font-medium hover:bg-[#FAFAFA] transition border-t border-[var(--border)]">
            Log meals →
          </Link>
        </div>

        {/* Coach message */}
        <div className="card-soft p-6 bg-gradient-to-br from-white to-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E11D2A] to-[#E11D2A] grid place-items-center text-white text-sm font-semibold">AK</div>
            <div>
              <div className="text-sm font-medium text-[#000000]">{clientProfile.coach}</div>
              <div className="text-[11px] text-[#737373]">Your coach · online</div>
            </div>
          </div>
          <Quote size={22} className="mt-5 text-[#FCA5A5]" />
          <p className="mt-2 text-[15px] text-[#000000] leading-relaxed">{messages[2].text}</p>
          <div className="mt-4 text-[11px] text-[#737373]">{messages[2].time} today</div>
          <Link to="/portal/messages" className="mt-5 inline-flex items-center gap-1 text-xs text-[#E11D2A] font-medium hover:underline">
            Open conversation <ArrowRight size={13} />
          </Link>
        </div>

        {/* Milestone */}
        <div className="card-soft p-6 bg-[#000000] text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--accent)]/20 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
              <Sparkles size={12} /> Milestone unlocked
            </div>
            <div className="mt-4 font-serif text-5xl leading-none">8.6<span className="text-2xl text-white/60"> kg</span></div>
            <div className="mt-2 text-sm text-white/70">down since you started</div>

            <div className="mt-7 pt-5 border-t border-white/10 flex items-center gap-3">
              <Trophy size={16} className="text-[var(--accent)]" />
              <div className="text-[13px] text-white/80">Top 8% of {clientProfile.program.split(" — ")[0]} clients this month.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Hydration / sleep mini progress ===== */}
      <section className="card-soft p-7">
        <SectionTitle eyebrow="Daily targets" title="Today's rings" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProgressRing value={2.8} target={3.5} label="Hydration" unit="L" />
          <ProgressRing value={7.4} target={8} label="Sleep" unit="h" />
          <ProgressRing value={9200} target={10000} label="Steps" />
          <ProgressRing value={55} target={60} label="Training" unit="m" />
        </div>
      </section>
    </div>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/45">{k}</div>
      <div className="mt-1.5 text-sm text-white/95 font-medium leading-snug">{v}</div>
    </div>
  );
}

function Macro({ label, v, t }: { label: string; v: number; t: number }) {
  const pct = Math.min(100, Math.round((v / t) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[#737373] font-medium">{label}</span>
        <span className="text-[#000000]">{v}<span className="text-[#A3A3A3]">g</span></span>
      </div>
      <div className="mt-1 h-1 bg-[#F5F5F5] rounded-full overflow-hidden">
        <div className="h-full bg-[#E11D2A]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
