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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-[0.14em] font-semibold ${
        isLive
          ? "bg-accent text-white"
          : "bg-surface text-accent border border-border"
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
      ? "px-8 py-4"
      : "px-5 py-2.5";

  return (
    <div className={`flex flex-col items-stretch sm:items-end gap-2 shrink-0 ${className}`}>
      <LiveSessionBadge liveState={liveState} minutesUntilStart={minutesUntilStart} />
      <a
        href={joinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${isActive ? "portal-btn-accent portal-btn" : "portal-btn"} ${sizeClass}`}
      >
        {isActive ? "Join live now" : "Open session link"}
      </a>
    </div>
  );
}
