import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { coachKPIs, coachClients, coachCheckins, coachRevenue } from "@/lib/portal/data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Plus } from "lucide-react";

export const Route = createFileRoute("/portal/coach/")({
  head: () => ({ meta: [{ title: "Coach Overview — APEX" }] }),
  component: () => <CoachShell><Overview /></CoachShell>,
});

function Overview() {
  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">Good morning, Arjun</div>
          <h1 className="text-4xl md:text-5xl">Studio overview</h1>
        </div>
        <Link to="/portal/coach/clients" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B]">
          <Plus size={15} /> Add new client
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {coachKPIs.map((k) => (
          <div key={k.label} className="card-soft p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B66]">{k.label}</div>
            <div className="mt-2 text-2xl font-serif text-[#1A1F1B]">{k.value}</div>
            <div className="mt-1 text-[11px] text-[#3F5A3A]">{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <SoftCard className="lg:col-span-2">
          <SectionTitle eyebrow="Last 6 months" title="Revenue" action={<Link to="/portal/coach/analytics" className="text-xs text-[#3F5A3A] inline-flex items-center gap-1 hover:underline">Analytics <ArrowRight size={13} /></Link>} />
          <div className="h-72 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={coachRevenue}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6F8F6A" stopOpacity={0.35} /><stop offset="100%" stopColor="#6F8F6A" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} width={32} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8E4DC", background: "#fff", fontSize: 12 }} formatter={(v: number) => [`₹${v}L`, "Revenue"]} />
                <Area type="monotone" dataKey="r" stroke="#6F8F6A" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Awaiting review" title="Today's check-ins" action={<Link to="/portal/coach/checkins" className="text-xs text-[#3F5A3A] hover:underline">View all</Link>} />
          <div className="space-y-3">
            {coachCheckins.filter(c => c.status === "Pending").map((c) => (
              <div key={c.client} className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF6]">
                <div className="w-9 h-9 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs font-semibold">{c.client[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.client}</div>
                  <div className="text-[11px] text-[#6B6B66]">{c.weight} · sleep {c.sleep}h · mood {c.mood}</div>
                </div>
                <button className="text-[11px] px-2.5 py-1 rounded-full bg-[#1A1F1B] text-white">Review</button>
              </div>
            ))}
          </div>
        </SoftCard>
      </div>

      <div>
        <SectionTitle eyebrow="Recently joined" title="New clients" action={<Link to="/portal/coach/clients" className="text-xs text-[#3F5A3A] hover:underline">All clients</Link>} />
        <SoftCard className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#6B6B66] bg-[#FAFAF6]">
                <th className="px-6 py-3 font-medium">Client</th>
                <th className="px-6 py-3 font-medium">Program</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {coachClients.slice(0, 5).map((c) => (
                <tr key={c.name} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4 font-medium text-[#1A1F1B]">{c.name}</td>
                  <td className="px-6 py-4 text-[#4C534A]">{c.program}</td>
                  <td className="px-6 py-4 text-[#4C534A]">{c.join}</td>
                  <td className="px-6 py-4"><span className="chip">{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SoftCard>
      </div>
    </div>
  );
}
