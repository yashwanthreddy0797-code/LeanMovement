import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { toast } from "sonner";
import { CONTACT } from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LEANMOVEMENT" },
      { name: "description", content: "Get in touch with LEANMOVEMENT. Email or WhatsApp — we reply within 2 hours." },
      { property: "og:title", content: "Contact — LEANMOVEMENT" },
      { property: "og:description", content: "Get in touch with LEANMOVEMENT." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT.phone, href: CONTACT.whatsapp },
];

function ContactPage() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received. We'll reply within 2 hours.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        subtitle="Email or WhatsApp. We reply within 2 hours during business hours."
        compact
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
            <form onSubmit={onSubmit} className="space-y-6">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="WhatsApp" name="whatsapp" type="tel" />
              <div>
                <label className="block text-xs text-muted-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none resize-none"
                />
              </div>
              <button type="submit" className="btn-primary">
                Send message
              </button>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-border bg-background px-4 py-3 h-11 text-sm focus:border-accent focus:outline-none"
      />
    </div>
  );
}
