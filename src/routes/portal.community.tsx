import { createFileRoute } from "@tanstack/react-router";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useMarkWhatsAppJoined, useMemberOnboarding } from "@/hooks/useMemberOnboarding";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { whatsAppCommunity } from "@/lib/portal/member-data";
import { usePortalSession } from "@/lib/portal/session";
import { COACH } from "@/lib/lean-kettlebell";
import { Check, CheckCircle2, MessageCircle, Users } from "lucide-react";

export const Route = createFileRoute("/portal/community")({
  head: () => ({ meta: [{ title: "Community — Lean Kettlebell Portal" }] }),
  component: Community,
});

function Community() {
  const session = usePortalSession();
  const { siteConfig } = usePortalPageContent();
  const { data: onboarding } = useMemberOnboarding(session.user?.id);
  const markJoined = useMarkWhatsAppJoined(session.user?.id);

  const whatsappUrl = siteConfig.whatsappInviteUrl || whatsAppCommunity.inviteUrl;
  const calendlyUrl = siteConfig.foundationsCalendlyUrl;
  const hasJoined = onboarding?.whatsapp_joined;

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Members only</div>
        <h1 className="text-4xl md:text-5xl font-serif">Community</h1>
        <p className="mt-2 text-[#737373]">Private WhatsApp group — accountability, questions, progress sharing.</p>
      </div>

      <SoftCard className="text-center p-10 md:p-14 bg-gradient-to-br from-[#E8F5E9] to-white">
        <div className="w-20 h-20 rounded-full bg-[#25D366] grid place-items-center text-white mx-auto">
          <MessageCircle size={36} />
        </div>
        <h2 className="mt-6 font-serif text-3xl">{whatsAppCommunity.groupName}</h2>
        <p className="mt-3 text-[#737373]">{whatsAppCommunity.description}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#404040]">
          <Users size={16} /> Members-only group
        </div>

        {hasJoined && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-[#2E7D32] font-medium">
            <CheckCircle2 size={16} /> You&apos;ve joined the community
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (!hasJoined) void markJoined.mutate();
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-medium hover:opacity-90 w-full sm:w-auto"
          >
            <MessageCircle size={18} /> {hasJoined ? "Open WhatsApp group" : "Join WhatsApp group"}
          </a>
        </div>
      </SoftCard>

      <OnboardingChecklist onboarding={onboarding} calendlyUrl={calendlyUrl} whatsappUrl={whatsappUrl} />

      <SoftCard>
        <SectionTitle eyebrow="In the group" title="What happens here" />
        <ul className="space-y-4 mt-2">
          {[
            `Questions answered by ${COACH.name.split(" ")[0]} and the community`,
            "Progress photos and wins shared",
            "Session reminders and schedule updates",
            "Accountability between live classes",
            "Travel and restaurant tips from other members",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-sm text-[#404040]">
              <Check size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </SoftCard>
    </div>
  );
}
