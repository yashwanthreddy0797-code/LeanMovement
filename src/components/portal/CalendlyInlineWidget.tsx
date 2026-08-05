import { useEffect, useId, useRef } from "react";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

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

export function CalendlyInlineWidget({
  url,
  onScheduled,
}: {
  url: string;
  onScheduled?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!onScheduled) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com") return;
      if (event.data?.event === "calendly.event_scheduled") {
        onScheduled();
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
      })
      .catch(() => {
        /* parent page can show fallback */
      });

    return () => {
      cancelled = true;
    };
  }, [url, widgetId]);

  return (
    <div
      ref={containerRef}
      className="min-h-[min(72vh,720px)] w-full overflow-hidden border border-border bg-white"
      aria-label="Book onboarding call"
    />
  );
}
