import { Radio } from "lucide-react";
import type { SessionLiveState } from "@/lib/portal/live-session";

type LiveSessionBannerProps = {
  liveState: SessionLiveState;
  minutesUntilStart?: number;
  className?: string;
};

export function LiveSessionBadge({ liveState, minutesUntilStart, className = "" }: LiveSessionBannerProps) {
  if (liveState === "later") return null;

  const isLive = liveState === "live";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-semibold ${
        isLive
          ? "bg-[var(--accent)] text-white"
          : "bg-[#FEE2E2] text-[var(--accent)]"
      } ${className}`}
    >
      <Radio size={11} className={isLive ? "animate-pulse" : ""} />
      {isLive ? "Live now" : `Starts in ${minutesUntilStart ?? "—"} min`}
    </span>
  );
}

type LiveJoinButtonProps = {
  joinUrl: string;
  liveState: SessionLiveState;
  minutesUntilStart?: number;
  size?: "sm" | "lg";
  className?: string;
};

export function LiveJoinButton({
  joinUrl,
  liveState,
  minutesUntilStart,
  size = "lg",
  className = "",
}: LiveJoinButtonProps) {
  const isActive = liveState === "live" || liveState === "soon";
  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-sm"
      : "px-5 py-2.5 text-sm";

  return (
    <div className={`flex flex-col items-stretch sm:items-end gap-2 shrink-0 ${className}`}>
      <LiveSessionBadge liveState={liveState} minutesUntilStart={minutesUntilStart} />
      <a
        href={joinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition ${
          isActive
            ? "bg-[var(--accent)] text-white hover:opacity-90 shadow-lg shadow-black/10"
            : "bg-[#000000] text-white hover:bg-[#111]"
        } ${sizeClass}`}
      >
        {isActive ? "Join live now" : "Open session link"}
      </a>
    </div>
  );
}
