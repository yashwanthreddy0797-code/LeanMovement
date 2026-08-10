import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Check, Circle, ClipboardList, Calendar, CalendarDays, MessageCircle } from "lucide-react";
import { SoftCard } from "@/components/portal/ui";
import { formatPortalDate } from "@/lib/portal/member-format";
import { formatSelectedSessions } from "@/lib/sessions";

type OnboardingRow =
  | {
      foundations_booked_at?: string | null;
      foundations_completed_at: string | null;
      whatsapp_joined?: boolean | null;
      session_ids?: string[] | null;
      sessions_selected_at?: string | null;
    }
  | null
  | undefined;

type SetupStep = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  pending?: boolean;
  locked?: boolean;
  to?: string;
  href?: string;
  cta?: string;
  icon?: LucideIcon;
  onOpen?: () => void;
};

export function OnboardingChecklist({
  onboarding,
  intakeComplete,
  whatsappUrl,
  loading,
  onOpenWhatsApp,
}: {
  onboarding: OnboardingRow;
  intakeComplete?: boolean;
  calendlyUrl?: string | null;
  whatsappUrl?: string | null;
  loading?: boolean;
  onBookFoundations?: () => void | Promise<void>;
  onOpenWhatsApp?: () => void;
}) {
  if (loading) return null;

  const intakeDone = Boolean(intakeComplete);
  const onboardingDone = Boolean(onboarding?.foundations_completed_at);
  const onboardingBooked = Boolean(onboarding?.foundations_booked_at) && !onboardingDone;
  const whatsappDone = Boolean(onboarding?.whatsapp_joined);
  const sessionsDone = Boolean(
    onboarding?.sessions_selected_at && (onboarding?.session_ids?.length ?? 0) >= 3,
  );

  if (intakeDone && onboardingDone && whatsappDone && sessionsDone) return null;

  const steps: SetupStep[] = [
    {
      id: "questionnaire",
      label: intakeDone ? "Questionnaire" : "Complete questionnaire",
      detail: intakeDone
        ? "Saved — your coach has your goals and background"
        : "Goal, training history, schedule — takes about 3 minutes",
      done: intakeDone,
      to: "/portal/intake",
      cta: intakeDone ? "View / update" : "Fill questionnaire",
      icon: ClipboardList,
    },
    {
      id: "onboarding",
      label: onboardingDone
        ? "Onboarding call"
        : onboardingBooked
          ? "Onboarding call booked"
          : "Book onboarding call",
      detail: !intakeDone
        ? "Complete your questionnaire first"
        : onboardingDone
          ? `Completed ${formatPortalDate(onboarding?.foundations_completed_at)}`
          : onboardingBooked
            ? `Booked ${formatPortalDate(onboarding?.foundations_booked_at)} — check email for Zoom`
            : "30-min Zoom call with your coach before your first live class",
      done: onboardingDone,
      pending: onboardingBooked,
      locked: !intakeDone,
      to: intakeDone && !onboardingDone ? "/portal/book-onboarding" : undefined,
      cta: onboardingBooked ? "View / reschedule" : "Pick a time",
      icon: Calendar,
    },
    {
      id: "sessions",
      label: "Weekly schedule",
      detail: sessionsDone
        ? formatSelectedSessions(onboarding?.session_ids ?? [])
        : "Tue / Thu / Sat · 6:00–7:00 AM IST — assigned automatically",
      done: sessionsDone,
      to: "/portal/live",
      cta: "View schedule",
      icon: CalendarDays,
    },
    {
      id: "whatsapp",
      label: "Join WhatsApp community",
      detail: whatsappDone ? "You're in the group" : "Accountability, questions, and progress",
      done: whatsappDone,
      href: whatsappUrl || undefined,
      cta: whatsappDone ? "Open WhatsApp" : "Open WhatsApp",
      icon: MessageCircle,
      onOpen: onOpenWhatsApp,
    },
  ];

  return (
    <SoftCard className="!p-4 sm:!p-5 md:!p-6">
      <h2 className="font-display text-lg uppercase tracking-[0.06em] sm:text-xl">Finish setup</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {intakeDone
          ? "Tap any step anytime — finish when you’re ready."
          : "Start with the questionnaire — then book your onboarding call."}
      </p>
      <ul className="mt-5 space-y-1">
        {steps.map((step) => (
          <SetupStepRow key={step.id} step={step} />
        ))}
      </ul>
    </SoftCard>
  );
}

function SetupStepRow({ step }: { step: SetupStep }) {
  const content = (
    <>
      {step.done ? (
        <Check size={15} className="mt-0.5 shrink-0 text-accent" />
      ) : (
        <Circle
          size={15}
          className={`mt-0.5 shrink-0 ${
            step.pending ? "text-accent" : step.locked ? "text-border" : "text-muted-foreground"
          }`}
        />
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            step.locked ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {step.label}
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
        {step.cta && (step.to || step.href) && !step.locked && (
          <span className="mt-1.5 inline-flex items-center gap-1 type-link !text-accent">
            {step.icon && <step.icon size={12} />}
            {step.cta} →
          </span>
        )}
      </div>
    </>
  );

  const rowClass =
    "flex w-full items-start gap-3 border-t border-border px-1 py-3 text-left first:border-0 first:pt-0 last:pb-0 transition-colors";

  if (step.to && !step.locked) {
    return (
      <li>
        <Link
          to={step.to}
          className={`${rowClass} -mx-1 rounded-sm hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
        >
          {content}
        </Link>
      </li>
    );
  }

  if (step.href && !step.locked) {
    return (
      <li>
        <a
          href={step.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => step.onOpen?.()}
          className={`${rowClass} -mx-1 rounded-sm hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
        >
          {content}
        </a>
      </li>
    );
  }

  return <li className={rowClass}>{content}</li>;
}
