import { useEffect, useId, useRef, useState } from "react";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
/** Tall enough for month + time slots on desktop; grows via page_height events. */
const INITIAL_HEIGHT_PX = 1100;

function loadCalendlyScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();

  const existing = document.querySelector(`script[src="${CALENDLY_SCRIPT}"]`);
  if (existing) {
    return new Promise((resolve) => {
      if (window.Calendly) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Calendly"));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useId().replace(/:/g, "");
  const [height, setHeight] = useState(INITIAL_HEIGHT_PX);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;

      if (event.data?.event === "calendly.event_scheduled") {
        onScheduled?.();
        return;
      }

      const next = parseCalendlyHeight(event.data);
      if (next != null) {
        // Extra padding so the footer / timezone row isn't clipped
        setHeight(Math.max(INITIAL_HEIGHT_PX, next + 24));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onScheduled]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !url) return;

    let cancelled = false;
    el.innerHTML = "";

    void loadCalendlyScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.Calendly) return;
        window.Calendly.initInlineWidget({
          url,
          parentElement: containerRef.current,
        });

        // Calendly injects an iframe — force it to fill the resized parent
        const iframe = containerRef.current.querySelector("iframe");
        if (iframe) {
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.border = "0";
          iframe.setAttribute("title", "Book onboarding call");
        }
      })
      .catch(() => {
        /* parent page can show fallback */
      });

    return () => {
      cancelled = true;
    };
  }, [url, widgetId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const iframe = el.querySelector("iframe");
    if (iframe) {
      iframe.style.height = "100%";
    }
  }, [height]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-host w-full border border-border bg-white"
      style={{ minWidth: 320, height, minHeight: INITIAL_HEIGHT_PX }}
      aria-label="Book onboarding call"
    />
  );
}
