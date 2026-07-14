import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { COACH } from "@/lib/lean-kettlebell";
import type { Onboarding } from "@/lib/supabase/types";

type OnboardingChecklistProps = {
  onboarding: Onboarding | null | undefined;
  calendlyUrl?: string;
  whatsappUrl?: string;
  loading?: boolean;
};

const steps = [
  {
    key: "foundations_booked",
    label: "Book Foundations session",
    hint: "60-min technique session before your first live class",
    hrefKey: "calendly" as const,
  },
  {
    key: "foundations_completed",
    label: "Complete Foundations",
    hint: `Swing, clean, press, and breathing mechanics with ${COACH.name.split(" ")[0]}`,
    hrefKey: "calendly" as const,
  },
  {
    key: "whatsapp_joined",
    label: "Join WhatsApp community",
    hint: "Accountability, questions, and schedule updates",
    hrefKey: "whatsapp" as const,
  },
  {
    key: "first_live",
    label: "Attend your first live session",
    hint: "Morning Mon/Wed/Fri · Evening Tue/Thu/Sat — join from Live Sessions",
    hrefKey: "live" as const,
  },
] as const;

function isStepDone(key: (typeof steps)[number]["key"], onboarding: Onboarding | null | undefined) {
  if (!onboarding) return false;
  if (key === "foundations_booked") return Boolean(onboarding.foundations_booked_at);
  if (key === "foundations_completed") return Boolean(onboarding.foundations_completed_at);
  if (key === "whatsapp_joined") return onboarding.whatsapp_joined;
  if (key === "first_live") {
    return Boolean(onboarding.foundations_completed_at && onboarding.whatsapp_joined);
  }
  return false;
}

export function OnboardingChecklist({
  onboarding,
  calendlyUrl,
  whatsappUrl,
  loading,
}: OnboardingChecklistProps) {
  if (loading) {
    return (
      <div className="card-soft p-6 animate-pulse">
        <div className="h-4 w-32 bg-[#F5F5F5] rounded" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-[#FAFAFA] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const completed = steps.filter((s) => isStepDone(s.key, onboarding)).length;
  const allDone = completed === steps.length;

  if (allDone) return null;

  return (
    <div className="card-soft p-6 md:p-8 border-2 border-[#FEE2E2]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Getting started
          </div>
          <h3 className="mt-2 font-serif text-2xl">Your onboarding checklist</h3>
          <p className="mt-1 text-sm text-[#737373]">
            {completed} of {steps.length} complete — finish these to get the most from membership
          </p>
        </div>
        <span className="chip shrink-0">{completed}/{steps.length}</span>
      </div>

      <ul className="mt-6 space-y-3">
        {steps.map((step) => {
          const done = isStepDone(step.key, onboarding);
          const href =
            step.hrefKey === "calendly"
              ? calendlyUrl
              : step.hrefKey === "whatsapp"
                ? whatsappUrl
                : "/portal/live";

          return (
            <li
              key={step.key}
              className={`flex items-start gap-3 p-3.5 rounded-xl ${
                done ? "bg-[#F5F5F5]/80" : "bg-[#FFFBFB]"
              }`}
            >
              {done ? (
                <CheckCircle2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
              ) : (
                <Circle size={18} className="text-[#D4D4D4] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${done ? "text-[#737373] line-through" : ""}`}>
                  {step.label}
                </div>
                {!done && <p className="mt-0.5 text-xs text-[#737373]">{step.hint}</p>}
              </div>
              {!done && href && (
                step.hrefKey === "live" ? (
                  <Link
                    to="/portal/live"
                    className="shrink-0 text-xs text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Go <ArrowRight size={12} />
                  </Link>
                ) : (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs text-[var(--accent)] font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Open <ArrowRight size={12} />
                  </a>
                )
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
