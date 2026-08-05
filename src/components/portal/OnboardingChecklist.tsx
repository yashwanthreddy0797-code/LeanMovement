import { Link } from "@tanstack/react-router";
import { Check, Circle, ClipboardList } from "lucide-react";
import { SoftCard } from "@/components/portal/ui";
import { formatPortalDate } from "@/lib/portal/member-format";
import { formatSelectedSessions } from "@/lib/sessions";

type OnboardingRow = {
  foundations_booked_at?: string | null;
  foundations_completed_at: string | null;
  whatsapp_joined?: boolean | null;
  session_ids?: string[] | null;
  sessions_selected_at?: string | null;
} | null | undefined;

export function OnboardingChecklist({
  onboarding,
  intakeComplete,
  calendlyUrl,
  whatsappUrl,
  loading,
  onBookFoundations,
}: {
  onboarding: OnboardingRow;
  intakeComplete?: boolean;
  calendlyUrl?: string | null;
  whatsappUrl?: string | null;
  loading?: boolean;
  onBookFoundations?: () => void | Promise<void>;
}) {
  if (loading) return null;

  const intakeDone = Boolean(intakeComplete);
  const foundationsDone = Boolean(onboarding?.foundations_completed_at);
  const foundationsBooked = Boolean(onboarding?.foundations_booked_at) && !foundationsDone;
  const whatsappDone = Boolean(onboarding?.whatsapp_joined);
  const sessionsDone = Boolean(
    onboarding?.sessions_selected_at && (onboarding?.session_ids?.length ?? 0) >= 3,
  );

  if (intakeDone && foundationsDone && whatsappDone && sessionsDone) return null;

  const canBookFoundations = intakeDone && !foundationsDone && !foundationsBooked;

  const steps = [
    {
      id: "intake",
      label: intakeDone ? "Your profile" : "Complete your profile",
      detail: intakeDone
        ? "Saved — your coach has your goals and background"
        : "Goal, training history, schedule — takes about 3 minutes",
      done: intakeDone,
      pending: false,
      to: !intakeDone ? "/portal/intake" : undefined,
      cta: "Fill in profile",
    },
    {
      id: "foundations",
      label: foundationsDone
        ? "Foundations session"
        : foundationsBooked
          ? "Foundations booked"
          : "Book Foundations session",
      detail: !intakeDone
        ? "Complete your profile first"
        : foundationsDone
          ? `Completed ${formatPortalDate(onboarding?.foundations_completed_at)}`
          : foundationsBooked
            ? `Booked ${formatPortalDate(onboarding?.foundations_booked_at)} - coach will confirm`
            : "60-min technique call with me before your first live class",
      done: foundationsDone,
      pending: foundationsBooked,
      href: canBookFoundations && calendlyUrl ? calendlyUrl : undefined,
      cta: "Book on Calendly",
      onCta: canBookFoundations ? onBookFoundations : undefined,
      locked: !intakeDone,
    },
    {
      id: "sessions",
      label: "Weekly schedule",
      detail: sessionsDone
        ? formatSelectedSessions(onboarding?.session_ids ?? [])
        : "Tue / Thu / Sat · 6:00–7:00 AM IST - assigned automatically",
      done: sessionsDone,
    },
    {
      id: "whatsapp",
      label: "Join WhatsApp community",
      detail: whatsappDone ? "You're in the group" : "Accountability, questions, and progress",
      done: whatsappDone,
      href: !whatsappDone && whatsappUrl ? whatsappUrl : undefined,
      cta: "Open WhatsApp",
    },
  ];

  return (
    <SoftCard className="!p-4 sm:!p-5 md:!p-6">
      <h2 className="font-display text-lg uppercase tracking-[0.06em] sm:text-xl">Finish setup</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {intakeDone
          ? "Book your Foundations call — then you're ready for live classes."
          : "Start with your profile — then book Foundations."}
      </p>
      <ul className="mt-5 space-y-3">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex items-start gap-3 border-t border-border pt-3 first:border-0 first:pt-0"
          >
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
              {step.to && (
                <Link
                  to={step.to}
                  className="mt-1.5 inline-flex items-center gap-1 type-link !text-accent hover:!text-foreground"
                >
                  <ClipboardList size={12} />
                  {step.cta} →
                </Link>
              )}
              {step.href && (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex type-link !text-accent hover:!text-foreground"
                  onClick={() => {
                    if (step.onCta) void step.onCta();
                  }}
                >
                  {step.cta} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </SoftCard>
  );
}
