import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, Star } from "lucide-react";

export function NewMemberStar({
  label = "Newly subscribed",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex shrink-0 items-center text-accent ${className}`}
    >
      <Star size={14} className="fill-current" />
    </span>
  );
}

export function KPICard({
  label,
  value,
  unit,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  tone?: "up" | "down" | "neutral";
}) {
  const Icon = tone === "up" ? ArrowUpRight : tone === "down" ? ArrowDownRight : Minus;
  const toneClass =
    tone === "up" || tone === "down"
      ? "text-accent bg-accent/10"
      : "text-muted-foreground bg-surface";

  return (
    <div className="card-soft p-5">
      <div className="eyebrow !gap-0">{label}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="font-display text-3xl tracking-[0.04em] text-foreground">{value}</div>
        {unit && <div className="text-xs text-muted-foreground font-medium">{unit}</div>}
      </div>
      {delta && (
        <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${toneClass}`}>
          <Icon size={12} /> {delta}
        </div>
      )}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="eyebrow mb-2">
            <span className="h-px w-5 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl uppercase tracking-[0.06em] md:text-[1.75rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function PortalPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div className="max-w-xl min-w-0">
        {eyebrow && (
          <p className="eyebrow mb-1.5 sm:mb-2">
            <span className="h-px w-5 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[1.75rem] uppercase tracking-[0.04em] sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}

export function ProgressRing({
  value,
  target,
  label,
  unit,
}: {
  value: number;
  target: number;
  label: string;
  unit?: string;
}) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const r = 38;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} stroke="var(--border)" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke="var(--accent)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="square"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="-mt-[68px] text-center">
        <div className="font-display text-lg tracking-[0.04em]">
          {value}
          <span className="ml-0.5 text-xs text-muted-foreground">{unit}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          of {target}
          {unit}
        </div>
      </div>
      <div className="mt-[40px] text-xs font-medium text-foreground/70">{label}</div>
    </div>
  );
}

export function SoftCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-soft p-6 ${className}`}>{children}</div>;
}
