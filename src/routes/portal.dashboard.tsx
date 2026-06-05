import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { KPICard, SectionTitle, SoftCard } from "@/components/portal/ui";
import { clientProfile, kpis, weightTrend, workoutToday } from "@/lib/portal/data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — APEX Portal" }] }),
  component: () => <ClientShell><Dashboard /></ClientShell>,
});

function Dashboard() {
  const hours = new Date().getHours();
  const greet = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
  const pct = Math.round((clientProfile.dayNumber / clientProfile.totalDays) * 100);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="card-soft p-7 md:p-9 bg-gradient-to-br from-white to-[#F4F1EA] relative overflow-hidden">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66]">{greet}</div>
        <h1 className="mt-2 text-4xl md:text-5xl text-[#1A1F1B]">
          {greet}, {clientProfile.name} <span className="inline-block animate-[wave_2s_ease-in-out_infinite] origin-bottom-right">👋</span>
        </h1>
        <p className="mt-3 text-[#4C534A] text-[15px] max-w-2xl">You're on day {clientProfile.dayNumber} of {clientProfile.totalDays}. Keep showing up — your future self is watching.</p>

        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HeroStat label="Current Program" value={clientProfile.program} />
          <HeroStat label="Goal" value={clientProfile.goal} />
          <HeroStat label="Coach" value={clientProfile.coach} />
          <HeroStat label="Membership" value={clientProfile.membership} sub={`Renews ${clientProfile.membershipRenewsOn}`} />
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between text-xs text-[#4C534A] mb-2">
            <span>Day {clientProfile.dayNumber} of {clientProfile.totalDays}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 bg-[#EFE9DD] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#6F8F6A] to-[#B5C7AF]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div>
        <SectionTitle eyebrow="Today's snapshot" title="Your numbers" action={
          <Link to="/portal/progress" className="text-xs text-[#3F5A3A] font-medium hover:underline inline-flex items-center gap-1">View progress <ArrowRight size={14} /></Link>
        } />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k) => <KPICard key={k.label} {...k} />)}
        </div>
      </div>

      {/* Two cards */}
      <div className="grid lg:grid-cols-3 gap-5">
        <SoftCard className="lg:col-span-2">
          <SectionTitle eyebrow="10-week trend" title="Weight journey" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={weightTrend}>
                <defs>
                  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6F8F6A" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6F8F6A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8E4DC", background: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="w" stroke="#6F8F6A" strokeWidth={2.5} fill="url(#w)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Today" title="Workout" />
          <div className="text-sm font-medium text-[#1A1F1B]">{workoutToday.title}</div>
          <div className="text-xs text-[#6B6B66]">{workoutToday.exercises.length} exercises · {workoutToday.duration}</div>
          <div className="mt-4 space-y-2">
            {workoutToday.exercises.slice(0, 4).map((e) => (
              <div key={e.name} className="flex items-center justify-between text-sm">
                <span className={e.done ? "line-through text-[#9A9A95]" : "text-[#1A1F1B]"}>{e.name}</span>
                <span className="text-xs text-[#6B6B66]">{e.sets}×{e.reps}</span>
              </div>
            ))}
          </div>
          <Link to="/portal/workouts" className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-[#3F5A3A] hover:underline">
            Open today's session <ArrowRight size={13} />
          </Link>
        </SoftCard>
      </div>

      {/* Motivational strip */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card-soft p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF3EC] grid place-items-center"><Flame className="text-[#3F5A3A]" /></div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#6B6B66]">Workout streak</div>
            <div className="text-2xl font-serif">14 days <span className="text-xs text-[#6B6B66] font-sans">— personal best</span></div>
          </div>
        </div>
        <div className="card-soft p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FBF2DC] grid place-items-center"><Trophy className="text-[#A77B2C]" /></div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[#6B6B66]">Milestone unlocked</div>
            <div className="text-2xl font-serif">8.6 kg down</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes wave { 0%,60%,100% { transform: rotate(0); } 10%,30% { transform: rotate(14deg); } 20% { transform: rotate(-8deg); } 40% { transform: rotate(-4deg); } 50% { transform: rotate(10deg); } }`}</style>
    </div>
  );
}

function HeroStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-[var(--border)]">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#6B6B66]">{label}</div>
      <div className="mt-1.5 text-sm font-medium text-[#1A1F1B] leading-snug">{value}</div>
      {sub && <div className="text-[11px] text-[#6B6B66] mt-1">{sub}</div>}
    </div>
  );
}
