import { createFileRoute } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { coachRevenue, coachSignups } from "@/lib/portal/data";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export const Route = createFileRoute("/portal/coach/analytics")({
  head: () => ({ meta: [{ title: "Analytics — LEANMOVEMENT Coach" }] }),
  component: () => <CoachShell><Analytics /></CoachShell>,
});

const retention = [
  { name: "3 months", v: 92 }, { name: "6 months", v: 84 },
  { name: "12 months", v: 71 }, { name: "18 months", v: 58 },
];

const programs = [
  { name: "Lean Transformation", v: 64, c: "#E11D2A" },
  { name: "Fat Loss", v: 48, c: "#A77B2C" },
  { name: "Muscle Gain", v: 39, c: "#000000" },
  { name: "Hybrid Athlete", v: 22, c: "#FCA5A5" },
  { name: "Lean & Strong", v: 18, c: "#EFC988" },
];

function Analytics() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Studio analytics</div>
        <h1 className="text-4xl md:text-5xl">How the business is performing.</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Revenue YTD", v: "₹62.5L", d: "+34% YoY" },
          { l: "Retention 6mo", v: "84%", d: "+6 pts" },
          { l: "Transform success", v: "91%", d: "Goal hit rate" },
          { l: "Avg LTV", v: "₹2.1L", d: "Per client" },
        ].map((k) => (
          <div key={k.l} className="card-soft p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#737373]">{k.l}</div>
            <div className="mt-2 text-2xl font-serif">{k.v}</div>
            <div className="text-[11px] text-[#E11D2A] mt-1">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SoftCard>
          <SectionTitle eyebrow="Revenue growth" title="Last 6 months" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <BarChart data={coachRevenue}>
                <CartesianGrid stroke="#F5F5F5" vertical={false} />
                <XAxis dataKey="m" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} width={32} tickFormatter={(v) => `${v}L`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E5", background: "#fff", fontSize: 12 }} formatter={(v: number) => [`₹${v}L`, "Revenue"]} />
                <Bar dataKey="r" radius={[8, 8, 0, 0]} fill="#E11D2A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Monthly signups" title="New clients" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <BarChart data={coachSignups}>
                <CartesianGrid stroke="#F5F5F5" vertical={false} />
                <XAxis dataKey="m" stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5E5", background: "#fff", fontSize: 12 }} />
                <Bar dataKey="n" radius={[8, 8, 0, 0]} fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Cohort retention" title="Active by tenure" />
          <div className="space-y-3 mt-2">
            {retention.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-xs mb-1.5"><span className="text-[#404040]">{r.name}</span><span className="font-medium">{r.v}%</span></div>
                <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#E11D2A] to-[#FCA5A5]" style={{ width: `${r.v}%` }} /></div>
              </div>
            ))}
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Active programs" title="Distribution" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={programs} dataKey="v" nameKey="name" cx="40%" cy="50%" innerRadius={48} outerRadius={88} paddingAngle={2}>
                  {programs.map((p) => <Cell key={p.name} fill={p.c} />)}
                </Pie>
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>
      </div>
    </div>
  );
}
