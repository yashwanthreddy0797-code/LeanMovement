import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function KPICard({
  label, value, unit, delta, tone = "neutral",
}: {
  label: string; value: string; unit?: string; delta?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const Icon = tone === "up" ? ArrowUpRight : tone === "down" ? ArrowDownRight : Minus;
  const toneClass =
    tone === "up" ? "text-[#3F7A38] bg-[#EFF3EC]" :
    tone === "down" ? "text-[#3F5A3A] bg-[#EFF3EC]" :
    "text-[#6B6B66] bg-[#F2F0EB]";
  return (
    <div className="card-soft p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[#6B6B66]">{label}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="text-3xl font-serif text-[#1A1F1B]">{value}</div>
        {unit && <div className="text-xs text-[#6B6B66] font-medium">{unit}</div>}
      </div>
      {delta && (
        <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${toneClass}`}>
          <Icon size={12} /> {delta}
        </div>
      )}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">{eyebrow}</div>}
        <h2 className="text-2xl md:text-[28px]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ProgressRing({ value, target, label, unit }: { value: number; target: number; label: string; unit?: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const r = 38; const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} stroke="#EFE9DD" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r={r} stroke="var(--accent)" strokeWidth="8" fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="-mt-[68px] text-center">
        <div className="text-lg font-serif">{value}<span className="text-[10px] text-[#6B6B66] ml-0.5">{unit}</span></div>
        <div className="text-[10px] text-[#6B6B66]">of {target}{unit}</div>
      </div>
      <div className="mt-[40px] text-xs text-[#4C534A] font-medium">{label}</div>
    </div>
  );
}

export function SoftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-soft p-6 ${className}`}>{children}</div>;
}
