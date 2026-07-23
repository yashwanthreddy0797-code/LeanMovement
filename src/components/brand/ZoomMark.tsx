import { cn } from "@/lib/utils";

type ZoomMarkProps = {
  /** icon = camera only · lockup = icon + Zoom wordmark */
  variant?: "icon" | "lockup";
  /** brand = Zoom blue · light = white · muted = soft on light UI */
  tone?: "brand" | "light" | "muted";
  size?: "sm" | "md";
  className?: string;
  /** Optional label after the mark, e.g. "live sessions" */
  label?: string;
};

const SIZE = {
  sm: { icon: 14, text: "text-[11px]", gap: "gap-1.5" },
  md: { icon: 18, text: "text-sm", gap: "gap-2" },
} as const;

const TONE = {
  brand: "text-[#0B5CFF]",
  light: "text-white",
  muted: "text-foreground/55",
} as const;

/** Official-style Zoom camera mark — transparent, no plate/background. */
function ZoomIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M0 13.5A7.5 7.5 0 0 1 7.5 6h23A7.5 7.5 0 0 1 38 13.5v21A7.5 7.5 0 0 1 30.5 42h-23A7.5 7.5 0 0 1 0 34.5v-21Z" />
      <path d="M41.2 17.1 48 12.5v23l-6.8-4.6a2.4 2.4 0 0 1-1.1-2V19.1c0-.9.5-1.7 1.1-2Z" />
    </svg>
  );
}

/**
 * Zoom brand lockup for live-call trust signals.
 * No background, badge, or pill — icon + wordmark only.
 */
export function ZoomMark({
  variant = "lockup",
  tone = "brand",
  size = "sm",
  className,
  label,
}: ZoomMarkProps) {
  const s = SIZE[size];
  const color = TONE[tone];

  return (
    <span
      className={cn("inline-flex items-center", s.gap, color, className)}
      role="img"
      aria-label={label ? `Zoom ${label}` : "Zoom"}
    >
      <ZoomIcon size={s.icon} />
      {variant === "lockup" && (
        <span className={cn("font-semibold tracking-tight leading-none", s.text)}>Zoom</span>
      )}
      {label ? (
        <span
          className={cn(
            "font-medium leading-none tracking-wide",
            s.text,
            tone === "brand" && "text-foreground/60",
            tone === "light" && "text-white/70",
            tone === "muted" && "text-foreground/45",
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
