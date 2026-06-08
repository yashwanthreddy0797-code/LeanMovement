import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { weightTrend, waistTrend } from "@/lib/portal/data";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/portal/progress")({
  head: () => ({ meta: [{ title: "Progress — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><Progress /></ClientShell>,
});

const photos = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=600&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=70&auto=format&fit=crop",
];

const timeline = [
  { wk: "Week 1", note: "Baseline measurements taken. Starting strong." },
  { wk: "Week 3", note: "First 3kg down. Sleep improved to 7h+." },
  { wk: "Week 6", note: "Bench press +12.5kg. Body fat -3%." },
  { wk: "Week 10", note: "8.6kg lost. Energy levels unreal." },
];

function Progress() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">Progress center</div>
        <h1 className="text-4xl md:text-5xl">Your transformation, measured.</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <SoftCard>
          <SectionTitle eyebrow="Weight" title="Weekly trend" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={weightTrend}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6F8F6A" stopOpacity={0.35} /><stop offset="100%" stopColor="#6F8F6A" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} width={32} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8E4DC", background: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="w" stroke="#6F8F6A" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Body fat %" title="Composition trend" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <LineChart data={weightTrend}>
                <XAxis dataKey="d" stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8E4DC", background: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="bf" stroke="#A77B2C" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>

        <SoftCard className="lg:col-span-2">
          <SectionTitle eyebrow="Waist circumference" title="Inches lost" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer>
              <AreaChart data={waistTrend}>
                <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1A1F1B" stopOpacity={0.18} /><stop offset="100%" stopColor="#1A1F1B" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="d" stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9A9A95" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E8E4DC", background: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="#1A1F1B" strokeWidth={2.5} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>
      </div>

      <div>
        <SectionTitle eyebrow="Photo journal" title="Before & after" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((p, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#EFE9DD] relative group">
              <img src={p} alt={`Progress week ${i * 3 + 1}`} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-xs font-medium">Week {i * 3 + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle eyebrow="Milestones" title="Progress timeline" />
        <div className="card-soft p-6">
          <ol className="relative border-l-2 border-[#EFE9DD] ml-2 space-y-6">
            {timeline.map((t, i) => (
              <li key={i} className="pl-6 relative">
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#6F8F6A] border-4 border-white" />
                <div className="text-xs uppercase tracking-[0.18em] text-[#3F5A3A] font-medium">{t.wk}</div>
                <div className="text-[#1A1F1B] mt-0.5">{t.note}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
