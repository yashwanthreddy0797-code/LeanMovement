import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { calendlyEmbedSrc, preloadCalendly } from "@/lib/calendly-preload";

/** Tall enough for month + time slots on desktop; grows via page_height events. */
const INITIAL_HEIGHT_PX = 1100;

function parseCalendlyHeight(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const payload = data as { event?: string; payload?: { height?: number | string } };
  if (payload.event !== "calendly.page_height") return null;
  const raw = payload.payload?.height;
  const n = typeof raw === "number" ? raw : Number.parseInt(String(raw ?? ""), 10);
  return Number.isFinite(n) && n > 200 ? n : null;
}

export function CalendlyInlineWidget({
  url,
  onScheduled,
}: {
  url: string;
  onScheduled?: () => void;
}) {
  const [height, setHeight] = useState(INITIAL_HEIGHT_PX);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const embedSrc = useMemo(() => {
    if (!url || typeof window === "undefined") return "";
    return calendlyEmbedSrc(url, window.location.hostname);
  }, [url]);

  useEffect(() => {
    preloadCalendly();
  }, []);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [embedSrc]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;

      if (event.data?.event === "calendly.event_scheduled") {
        onScheduled?.();
        return;
      }

      const next = parseCalendlyHeight(event.data);
      if (next != null) {
        setHeight(Math.max(INITIAL_HEIGHT_PX, next + 24));
        setLoaded(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onScheduled]);

  if (!embedSrc) return null;

  return (
    <div
      className="calendly-inline-host relative w-full overflow-hidden border border-border bg-white"
      style={{ minWidth: 320, height, minHeight: INITIAL_HEIGHT_PX }}
      aria-label="Book onboarding call"
    >
      {!loaded && !failed && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
          <Loader2 className="animate-spin text-accent" size={22} />
          <p className="text-sm text-muted-foreground">Loading booking calendar…</p>
        </div>
      )}

      {failed ? (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">Calendar is slow to load in this view.</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-btn portal-btn-accent"
          >
            Open Calendly in a new tab
          </a>
        </div>
      ) : (
        <iframe
          key={embedSrc}
          src={embedSrc}
          title="Book onboarding call"
          className="h-full w-full border-0"
          style={{ minHeight: height }}
          loading="eager"
          // Calendly needs scripts inside the frame; keep sandbox off.
          allow="payment *; microphone *; camera *; geolocation *"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
