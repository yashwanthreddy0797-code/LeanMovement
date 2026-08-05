import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatDate,
  updateOnboarding,
  type CoachMember,
} from "@/lib/portal/coach-queries";
import { Calendar, CheckCircle2, MessageCircle, Circle, ClipboardList } from "lucide-react";
import { MemberIntakeSummary } from "@/components/portal/MemberIntakeSummary";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding - Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <OnboardingPage />
    </CoachShell>
  ),
});

function OnboardingPage() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();
  const coachId = session.user?.id;

  if (loading || !data) {
    return <PortalPageSkeleton />;
  }

  const activeMembers = data.members.filter(
    (m) => m.role === "member" && m.membership?.status === "active",
  );

  const intakeDue = activeMembers.filter((m) => !m.intake?.completed_at);
  const foundationsDue = activeMembers.filter(
    (m) => m.intake?.completed_at && !m.onboarding?.foundations_completed_at,
  );
  const whatsappDue = activeMembers.filter(
    (m) => m.onboarding?.foundations_completed_at && !m.onboarding?.whatsapp_joined,
  );

  const calendly = data.siteConfig.foundations_calendly_url;
  const whatsapp = data.siteConfig.whatsapp_invite_url;

  const toggle = async (
    memberId: string,
    patch: Parameters<typeof updateOnboarding>[2],
    label: string,
  ) => {
    const { error } = await updateOnboarding(coachId, memberId, patch);
    if (error) toast.error(error);
    else {
      toast.success(label);
      void refresh();
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        title="Onboarding"
        description="Intake, Foundations, and WhatsApp — one list per step."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <OnboardingList
          title="Member profile"
          eyebrow="Step 1"
          members={intakeDue}
          icon={ClipboardList}
          hint={<p className="text-xs text-muted-foreground">New members fill this after payment.</p>}
          steps={[]}
          emptyLabel="All profiles received."
        />

        <OnboardingList
          title="Foundations session"
          eyebrow="Step 2"
          members={foundationsDue}
          icon={Calendar}
          hint={
            calendly ? (
              <a
                href={calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                Open Calendly booking link →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-xs text-accent hover:underline">
                Add Calendly URL in Settings →
              </Link>
            )
          }
          steps={[
            {
              key: "booked",
              label: "Booked",
              done: (m) => !!m.onboarding?.foundations_booked_at,
              action: (m) =>
                toggle(
                  m.id,
                  { foundationsBooked: !m.onboarding?.foundations_booked_at },
                  "Foundations booking updated",
                ),
            },
            {
              key: "done",
              label: "Completed",
              done: (m) => !!m.onboarding?.foundations_completed_at,
              action: (m) =>
                toggle(
                  m.id,
                  { foundationsCompleted: !m.onboarding?.foundations_completed_at },
                  "Foundations marked complete",
                ),
            },
          ]}
        />

        <OnboardingList
          title="WhatsApp community"
          eyebrow="Step 3"
          members={whatsappDue}
          icon={MessageCircle}
          hint={
            whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent hover:underline"
              >
                Open WhatsApp invite →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-xs text-accent hover:underline">
                Add WhatsApp URL in Settings →
              </Link>
            )
          }
          steps={[
            {
              key: "wa",
              label: "Joined group",
              done: (m) => !!m.onboarding?.whatsapp_joined,
              action: (m) =>
                toggle(
                  m.id,
                  { whatsappJoined: !m.onboarding?.whatsapp_joined },
                  "WhatsApp status updated",
                ),
            },
          ]}
        />
      </div>

      {activeMembers.some((m) => m.intake?.completed_at) && (
        <SoftCard className="!p-5 md:!p-6">
          <h2 className="mb-4 font-display text-xl uppercase tracking-[0.06em]">Member profiles</h2>
          <div className="space-y-4">
            {activeMembers
              .filter((m) => m.intake?.completed_at)
              .map((m) => (
                <div key={m.id} className="border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{m.full_name ?? m.email}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {formatDate(m.intake?.completed_at)}
                    </p>
                  </div>
                  {m.intake && (
                    <div className="mt-4 border-t border-border pt-4">
                      <MemberIntakeSummary intake={m.intake} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </SoftCard>
      )}
    </div>
  );
}

function OnboardingList({
  title,
  eyebrow,
  members,
  icon: Icon,
  hint,
  steps,
  emptyLabel = "All caught up.",
}: {
  title: string;
  eyebrow: string;
  members: CoachMember[];
  icon: typeof Calendar;
  hint: React.ReactNode;
  steps: {
    key: string;
    label: string;
    done: (m: CoachMember) => boolean;
    action: (m: CoachMember) => void;
  }[];
  emptyLabel?: string;
}) {
  return (
    <SoftCard className="!p-5 md:!p-6">
      <div className="mb-1 flex items-center gap-2">
        <Icon size={15} className="text-accent" />
        <h2 className="font-display text-xl uppercase tracking-[0.06em]">{title}</h2>
      </div>
      <p className="mb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <div className="mb-4">{hint}</div>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-start gap-3 border border-border bg-surface p-3">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{m.full_name ?? m.email}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {steps.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => void s.action(m)}
                      className={`inline-flex min-h-9 items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                        s.done(m)
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border border-border bg-white text-muted-foreground hover:bg-surface"
                      }`}
                    >
                      {s.done(m) ? <CheckCircle2 size={10} /> : <Circle size={10} />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SoftCard>
  );
}
