import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import {
  formatDate,
  updateOnboarding,
  type CoachMember,
} from "@/lib/portal/coach-queries";
import { Calendar, CheckCircle2, MessageCircle, Circle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Lean Kettlebell Coach" }] }),
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

  const foundationsDue = activeMembers.filter((m) => !m.onboarding?.foundations_completed_at);
  const whatsappDue = activeMembers.filter(
    (m) => m.onboarding?.foundations_completed_at && !m.onboarding?.whatsapp_joined,
  );
  const complete = activeMembers.filter(
    (m) => m.onboarding?.foundations_completed_at && m.onboarding?.whatsapp_joined,
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
        eyebrow="New member journey"
        title="Onboarding"
        description="Every member gets a 1:1 Foundations session, then joins live classes and the WhatsApp community. Mark steps complete as members progress."
      />

      <div className="grid gap-px bg-border md:grid-cols-3">
        {[
          { label: "Foundations due", count: foundationsDue.length, color: "text-amber-700" },
          { label: "WhatsApp pending", count: whatsappDue.length, color: "text-amber-700" },
          { label: "Fully onboarded", count: complete.length, color: "text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-5">
            <div className="eyebrow !gap-0">{s.label}</div>
            <div className={`mt-2 font-display text-3xl tracking-[0.04em] ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <OnboardingList
          title="Foundations session"
          eyebrow="Step 1"
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
          eyebrow="Step 2"
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

      <SoftCard>
        <SectionTitle eyebrow="Complete" title="Fully onboarded members" />
        {complete.length === 0 ? (
          <p className="text-sm text-muted-foreground">No members fully onboarded yet.</p>
        ) : (
          <ul className="space-y-2">
            {complete.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-emerald-700" />
                {m.full_name ?? m.email}
                <span className="text-xs text-muted-foreground">
                  · foundations {formatDate(m.onboarding?.foundations_completed_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SoftCard>
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
}) {
  return (
    <SoftCard>
      <SectionTitle eyebrow={eyebrow} title={title} />
      <div className="mb-4">{hint}</div>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">All caught up.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-start gap-3 border border-border bg-surface p-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center bg-foreground text-background">
                <Icon size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{m.full_name ?? m.email}</div>
                <div className="text-[11px] text-muted-foreground">{m.email}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {steps.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => void s.action(m)}
                      className={`inline-flex min-h-10 items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                        s.done(m)
                          ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "bg-surface text-muted-foreground hover:bg-border"
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
