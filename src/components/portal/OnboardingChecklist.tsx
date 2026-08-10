import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  ChevronRight,
  Circle,
  Clock,
  ClipboardList,
  Calendar,
  CalendarDays,
  MessageCircle,
  Lock,
} from "lucide-react";
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

type StepStatus = "done" | "pending" | "next" | "todo" | "locked";

type SetupStep = {
  id: string;
  label: string;
  detail: string;
  status: StepStatus;
  to?: string;
  href?: string;
  cta?: string;
  icon: LucideIcon;
  onOpen?: () => void;
};

const STATUS_LABEL: Record<StepStatus, string | null> = {
  done: "Done",
  pending: "Booked",
  next: "Up next",
  todo: null,
  locked: "Locked",
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
  // Schedule is assigned automatically for members — treat as done once they're in flow.
  const sessionsDone = Boolean(
    onboarding?.sessions_selected_at || (onboarding?.session_ids?.length ?? 0) >= 3 || intakeDone,
  );

  if (intakeDone && onboardingDone && whatsappDone && sessionsDone) return null;

  const steps: SetupStep[] = [
    {
      id: "questionnaire",
      label: "Questionnaire",
      detail: intakeDone
        ? "Saved — your coach has your goals and background"
        : "Goals, training history, schedule — about 3 minutes",
      status: intakeDone ? "done" : "todo",
      to: "/portal/intake",
      cta: intakeDone ? "View answers" : "Start questionnaire",
      icon: ClipboardList,
    },
    {
      id: "onboarding",
      label: onboardingDone
        ? "Onboarding call"
        : onboardingBooked
          ? "Onboarding call"
          : "Book onboarding call",
      detail: !intakeDone
        ? "Finish the questionnaire first"
        : onboardingDone
          ? `Completed ${formatPortalDate(onboarding?.foundations_completed_at)}`
          : onboardingBooked
            ? `Booked ${formatPortalDate(onboarding?.foundations_booked_at)} · Zoom link is in your email`
            : "30-min Zoom with your coach before the first live class",
      status: !intakeDone
        ? "locked"
        : onboardingDone
          ? "done"
          : onboardingBooked
            ? "pending"
            : "todo",
      to: intakeDone && !onboardingDone ? "/portal/book-onboarding" : undefined,
      cta: onboardingBooked ? "Reschedule" : onboardingDone ? undefined : "Pick a time",
      icon: Calendar,
    },
    {
      id: "sessions",
      label: "Weekly schedule",
      detail: sessionsDone
        ? formatSelectedSessions(onboarding?.session_ids ?? []) ||
          "Tue / Thu / Sat · 6:00–7:00 AM IST"
        : "Tue / Thu / Sat · 6:00–7:00 AM IST — assigned automatically",
      status: sessionsDone ? "done" : "todo",
      to: "/portal/live",
      cta: "View schedule",
      icon: CalendarDays,
    },
    {
      id: "whatsapp",
      label: "WhatsApp community",
      detail: whatsappDone
        ? "You're in — questions and accountability"
        : "Join for accountability, questions, and progress",
      status: whatsappDone ? "done" : "todo",
      href: whatsappUrl || undefined,
      cta: "Open WhatsApp",
      icon: MessageCircle,
      onOpen: onOpenWhatsApp,
    },
  ];

  // Mark the first actionable incomplete step as "Up next"
  const nextId = steps.find((s) => s.status === "todo" && (s.to || s.href))?.id;
  const ranked = steps.map((step) =>
    step.id === nextId && step.status === "todo" ? { ...step, status: "next" as const } : step,
  );

  const doneCount = ranked.filter((s) => s.status === "done" || s.status === "pending").length;
  const total = ranked.length;
  const progress = Math.round((doneCount / total) * 100);
  const nextStep = ranked.find((s) => s.status === "next");

  return (
    <SoftCard className="!p-0 overflow-hidden">
      <div className="border-b border-border px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg uppercase tracking-[0.06em] sm:text-xl">
              Finish setup
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {nextStep
                ? `Next: ${nextStep.label.toLowerCase()}`
                : intakeDone
                  ? "Almost there — finish the last step when you’re ready."
                  : "Start with the questionnaire, then book your call."}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-sm tracking-[0.04em] text-foreground">
              {doneCount}/{total}
            </p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">done</p>
          </div>
        </div>
        <div
          className="mt-3 h-1 overflow-hidden bg-border"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Setup progress"
        >
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-border">
        {ranked.map((step) => (
          <SetupStepRow key={step.id} step={step} />
        ))}
      </ul>
    </SoftCard>
  );
}

function SetupStepRow({ step }: { step: SetupStep }) {
  const clickable = Boolean((step.to || step.href) && step.status !== "locked");
  const statusLabel = STATUS_LABEL[step.status];
  const showCta = Boolean(step.cta && clickable && step.status !== "done");

  const content = (
    <>
      <StatusIcon status={step.status} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p
            className={`text-sm font-medium ${
              step.status === "locked" || step.status === "done"
                ? "text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {step.label}
          </p>
          {statusLabel && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                step.status === "done"
                  ? "bg-accent/10 text-accent"
                  : step.status === "pending"
                    ? "bg-accent/10 text-accent"
                    : step.status === "next"
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
              }`}
            >
              {statusLabel}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{step.detail}</p>
        {showCta && (
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            <step.icon size={13} strokeWidth={2} />
            {step.cta}
          </span>
        )}
        {step.status === "done" && step.cta && clickable && (
          <span className="mt-1.5 inline-flex text-xs text-muted-foreground underline-offset-2 group-hover:underline">
            {step.cta}
          </span>
        )}
      </div>
      {clickable ? (
        <ChevronRight
          size={16}
          className={`mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 ${
            step.status === "next" || step.status === "pending"
              ? "text-accent"
              : "text-muted-foreground/50"
          }`}
        />
      ) : step.status === "locked" ? (
        <Lock size={14} className="mt-0.5 shrink-0 text-border" />
      ) : null}
    </>
  );

  const rowClass = `group flex w-full items-start gap-3 px-4 py-3.5 text-left sm:px-5 sm:py-4 transition-colors ${
    step.status === "next" ? "bg-accent/[0.04]" : ""
  } ${clickable ? "hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50" : ""}`;

  if (step.to && clickable) {
    return (
      <li>
        <Link to={step.to} className={rowClass}>
          {content}
        </Link>
      </li>
    );
  }

  if (step.href && clickable) {
    return (
      <li>
        <a
          href={step.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => step.onOpen?.()}
          className={rowClass}
        >
          {content}
        </a>
      </li>
    );
  }

  return <li className={rowClass}>{content}</li>;
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
        <Check size={12} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
        <Clock size={11} strokeWidth={2.5} />
      </span>
    );
  }
  if (status === "next") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-border">
        <Circle size={8} className="fill-current" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground/35">
      <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
    </span>
  );
}
