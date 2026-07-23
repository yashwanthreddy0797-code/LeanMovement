import { createFileRoute } from "@tanstack/react-router";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { CONTACT, COACH } from "@/lib/lean-kettlebell";
import { MessageCircle, Mail, User } from "lucide-react";

export const Route = createFileRoute("/portal/community")({
  head: () => ({ meta: [{ title: "Your Coach — Lean Movement Portal" }] }),
  component: CoachContact,
});

function CoachContact() {
  const { siteConfig } = usePortalPageContent();
  const whatsappUrl = siteConfig.whatsappInviteUrl || CONTACT.whatsapp;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <PortalPageHeader
        eyebrow="Your coach"
        title={COACH.name}
        description={`${COACH.title} · Direct support for your Lean Program.`}
      />

      <SoftCard className="p-10 text-center md:p-14">
        <div className="mx-auto grid h-20 w-20 place-items-center bg-foreground text-background">
          <User size={36} />
        </div>
        <h2 className="mt-6 font-display text-3xl uppercase tracking-[0.04em]">Message your coach</h2>
        <p className="mx-auto mt-3 max-w-md type-body">
          Members only connect with {COACH.name.split(" ")[0]} — session questions, schedule, and progress.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-btn portal-btn-accent w-full sm:w-auto"
          >
            <MessageCircle size={18} /> WhatsApp coach
          </a>
          <a href={`mailto:${CONTACT.email}`} className="portal-btn portal-btn-ghost w-full sm:w-auto">
            <Mail size={18} /> Email
          </a>
        </div>
      </SoftCard>
    </div>
  );
}
