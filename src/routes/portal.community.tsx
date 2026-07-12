import { createFileRoute } from "@tanstack/react-router";
import { SoftCard } from "@/components/portal/ui";
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
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Your coach</div>
        <h1 className="text-4xl md:text-5xl font-serif">{COACH.name}</h1>
        <p className="mt-2 text-[#737373]">{COACH.title} · Direct support for your Lean Program.</p>
      </div>

      <SoftCard className="text-center p-10 md:p-14">
        <div className="w-20 h-20 rounded-full bg-[#111] grid place-items-center text-white mx-auto">
          <User size={36} />
        </div>
        <h2 className="mt-6 font-serif text-3xl">Message your coach</h2>
        <p className="mt-3 text-[#737373] max-w-md mx-auto">
          Members only connect with {COACH.name.split(" ")[0]} — session questions, schedule, and progress.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-medium hover:opacity-90 w-full sm:w-auto"
          >
            <MessageCircle size={18} /> WhatsApp coach
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-[var(--border)] font-medium hover:bg-[#FAFAFA] w-full sm:w-auto"
          >
            <Mail size={18} /> Email
          </a>
        </div>
      </SoftCard>
    </div>
  );
}
