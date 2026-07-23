import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, MessageCircle, Instagram } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { toast } from "sonner";
import { CONTACT } from "@/lib/lean-kettlebell";
import { submitContactMessage } from "@/lib/api/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LEANMOVEMENT" },
      { name: "description", content: "Get in touch with LEANMOVEMENT. Email, WhatsApp, or Instagram." },
      { property: "og:title", content: "Contact — LEANMOVEMENT" },
      { property: "og:description", content: "Get in touch with LEANMOVEMENT." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT.phone, href: CONTACT.whatsapp },
  {
    icon: Instagram,
    label: "Instagram",
    value: `@${CONTACT.instagramHandle}`,
    href: CONTACT.instagram,
  },
];

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const whatsapp = String(fd.get("whatsapp") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setSending(true);
    try {
      const result = await submitContactMessage({
        data: { name, email, whatsapp: whatsapp || undefined, message },
      });

      if (result.ok) {
        toast.success(
          result.emailed
            ? `Message sent to ${CONTACT.email}. We'll reply within 2 hours.`
            : `Message received — we'll reply to you at ${email} within 2 hours.`,
        );
        form.reset();
        return;
      }

      // Browser-side FormSubmit fallback (works when server IP is blocked)
      const fallback = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT.email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name,
            email,
            whatsapp: whatsapp || "—",
            message,
            _subject: `LEANMOVEMENT contact — ${name}`,
            _replyto: email,
            _template: "table",
            _captcha: "false",
          }),
        },
      );

      if (fallback.ok) {
        toast.success(`Message sent to ${CONTACT.email}. We'll reply within 2 hours.`);
        form.reset();
        return;
      }

      toast.error(result.message);
    } catch {
      toast.error(`Could not send your message. Email ${CONTACT.email} directly.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        subtitle="Email or WhatsApp. We reply within 2 hours during business hours."
        compact
        borderless
      />

      <section className="container-x pb-24 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 max-w-4xl">
          <FadeUp>
            <div className="space-y-8">
              {CHANNELS.map((c) => (
                <a key={c.label} href={c.href} className="flex items-center gap-4 group">
                  <c.icon className="text-accent shrink-0" size={20} strokeWidth={1.5} />
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="mt-1 text-sm group-hover:text-accent transition-colors">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-10 text-sm text-muted-foreground">{CONTACT.location}</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
              <Field label="Name" name="name" required disabled={sending} />
              <Field label="Email" name="email" type="email" required disabled={sending} />
              <Field label="WhatsApp" name="whatsapp" type="tel" disabled={sending} />
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  disabled={sending}
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none resize-none disabled:opacity-60"
                />
              </div>
              <button type="submit" className="btn-primary inline-flex items-center gap-2" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                Messages go to <span className="text-foreground">{CONTACT.email}</span>
              </p>
            </form>
          </FadeUp>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className="w-full border border-border bg-background px-4 py-3 h-11 text-sm focus:border-accent focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
