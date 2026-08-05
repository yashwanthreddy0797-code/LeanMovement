import { createFileRoute } from "@tanstack/react-router";
import { PortalPageHeader } from "@/components/portal/ui";
import { usePortalPageContent } from "@/lib/portal/portal-content";
import { CONTACT, COACH } from "@/lib/lean-kettlebell";
import { MessageCircle, Mail } from "lucide-react";

export const Route = createFileRoute("/portal/community")({
  head: () => ({ meta: [{ title: "Your Coach - LEANMOVEMENT Portal" }] }),
  component: CoachContact,
});

function CoachContact() {
  const { siteConfig } = usePortalPageContent();
  const whatsappUrl = siteConfig.whatsappInviteUrl || CONTACT.whatsapp;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <PortalPageHeader
        title="Your coach"
        description={`${COACH.name} · ${CONTACT.replyNote}`}
      />

      <div className="border border-border bg-white p-6 text-center sm:p-8">
        <p className="text-sm text-muted-foreground">
          Session questions, schedule, or progress — reach out directly.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="portal-btn portal-btn-accent"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <a href={`mailto:${CONTACT.email}`} className="portal-btn portal-btn-ghost">
            <Mail size={16} /> Email
          </a>
        </div>
      </div>
    </div>
  );
}
