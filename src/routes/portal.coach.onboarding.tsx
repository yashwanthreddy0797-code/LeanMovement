import { createFileRoute, Link } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
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
    return <p className="text-sm text-[#737373]">Loading onboarding…</p>;
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
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">
          New member journey
        </div>
        <h1 className="text-4xl md:text-5xl font-serif">Onboarding</h1>
        <p className="mt-2 text-[#737373] max-w-2xl">
          Every member gets a 1:1 Foundations session, then joins live classes and the WhatsApp
          community. Mark steps complete as members progress.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Foundations due", count: foundationsDue.length, color: "text-[#E65100]" },
          { label: "WhatsApp pending", count: whatsappDue.length, color: "text-[#E65100]" },
          { label: "Fully onboarded", count: complete.length, color: "text-[#2E7D32]" },
        ].map((s) => (
          <div key={s.label} className="card-soft p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#737373]">{s.label}</div>
            <div className={`mt-2 text-3xl font-serif ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
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
                className="text-[#E11D2A] hover:underline text-xs"
              >
                Open Calendly booking link →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-[#E11D2A] hover:underline text-xs">
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
                className="text-[#E11D2A] hover:underline text-xs"
              >
                Open WhatsApp invite →
              </a>
            ) : (
              <Link to="/portal/coach/settings" className="text-[#E11D2A] hover:underline text-xs">
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
          <p className="text-sm text-[#737373]">No members fully onboarded yet.</p>
        ) : (
          <ul className="space-y-2">
            {complete.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-[#2E7D32]" />
                {m.full_name ?? m.email}
                <span className="text-[#737373] text-xs">
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
        <p className="text-sm text-[#737373]">All caught up.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF6]">
              <div className="w-9 h-9 rounded-full bg-[#000000] text-white grid place-items-center shrink-0">
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{m.full_name ?? m.email}</div>
                <div className="text-[11px] text-[#737373]">{m.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {steps.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => void s.action(m)}
                      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] px-2 py-1 rounded-full transition-colors ${
                        s.done(m)
                          ? "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"
                          : "bg-[#F5F5F5] text-[#737373] hover:bg-[#E5E5E5]"
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
