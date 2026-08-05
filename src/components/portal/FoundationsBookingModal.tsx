import { Calendar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { COACH } from "@/lib/lean-kettlebell";

const DISMISS_KEY = "lm-foundations-modal-dismissed";

type Props = {
  open: boolean;
  calendlyUrl: string;
  coachName?: string;
  onBook: () => void | Promise<void>;
  onDismiss: () => void;
};

export function FoundationsBookingModal({
  open,
  calendlyUrl,
  coachName = COACH.name.split(" ")[0],
  onBook,
  onDismiss,
}: Props) {
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleBook = async () => {
    setBooking(true);
    try {
      await onBook();
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="foundations-booking-title"
        className="relative z-10 w-full max-w-md border border-border bg-background p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-3 top-3 p-2 text-muted-foreground transition hover:text-foreground"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center bg-accent/10 text-accent">
          <Calendar size={20} />
        </div>

        <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-accent">Next step</p>
        <h2
          id="foundations-booking-title"
          className="mt-2 font-display text-2xl uppercase tracking-[0.06em] sm:text-[1.75rem]"
        >
          Book your onboarding call
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          30 minutes on Zoom with {coachName} — goals, technique basics, and how live sessions work.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={booking || !calendlyUrl}
            onClick={() => void handleBook()}
            className="portal-btn portal-btn-accent flex-1 disabled:opacity-50"
          >
            {booking ? "Opening…" : "Book on Calendly"}
          </button>
          <button type="button" onClick={onDismiss} className="portal-btn portal-btn-ghost flex-1">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

export function wasFoundationsModalDismissed(userId: string) {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(`${DISMISS_KEY}:${userId}`) === "1";
}

export function dismissFoundationsModal(userId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${DISMISS_KEY}:${userId}`, "1");
}
