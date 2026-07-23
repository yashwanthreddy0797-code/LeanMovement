import { Check, Circle } from "lucide-react";
import { SoftCard } from "@/components/portal/ui";
import { formatPortalDate } from "@/lib/portal/member-format";
import { formatSelectedSessions } from "@/lib/sessions";

type OnboardingRow = {
  foundations_completed_at: string | null;
  whatsapp_joined?: boolean | null;
  session_ids?: string[] | null;
  sessions_selected_at?: string | null;
} | null | undefined;

export function OnboardingChecklist({
  onboarding,
  calendlyUrl,
  whatsappUrl,
  loading,
}: {
  onboarding: OnboardingRow;
  calendlyUrl?: string | null;
  whatsappUrl?: string | null;
  loading?: boolean;
}) {
  if (loading) return null;

  const foundationsDone = Boolean(onboarding?.foundations_completed_at);
  const whatsappDone = Boolean(onboarding?.whatsapp_joined);
  const sessionsDone = Boolean(onboarding?.sessions_selected_at && (onboarding?.session_ids?.length ?? 0) >= 3);

  if (foundationsDone && whatsappDone && sessionsDone) return null;

  const steps = [
    {
      id: "sessions",
      label: "Weekly schedule",
      detail: sessionsDone
        ? formatSelectedSessions(onboarding?.session_ids ?? [])
        : "Tue / Thu / Sat · 6:00–7:00 AM IST — assigned automatically",
      done: sessionsDone,
    },
    {
      id: "foundations",
      label: "Book Foundations session",
      detail: foundationsDone
        ? `Completed ${formatPortalDate(onboarding?.foundations_completed_at)}`
        : "60-min technique session before your first live class",
      done: foundationsDone,
      href: !foundationsDone && calendlyUrl ? calendlyUrl : undefined,
      cta: "Book on Calendly",
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
    <SoftCard>
      <p className="eyebrow mb-2">
        <span className="h-px w-5 bg-accent" />
        Get started
      </p>
      <h2 className="font-display text-2xl uppercase tracking-[0.06em]">Your setup checklist</h2>
      <ul className="mt-6 space-y-4">
        {steps.map((step) => (
          <li key={step.id} className="flex items-start gap-3 border-t border-border pt-4 first:border-0 first:pt-0">
            {step.done ? (
              <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            ) : (
              <Circle size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{step.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
              {step.href && (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex type-link !text-accent hover:!text-foreground"
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
