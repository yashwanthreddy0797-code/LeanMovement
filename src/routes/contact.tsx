import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mail, MessageCircle, Instagram } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { toast } from "sonner";
import { CONTACT } from "@/lib/lean-kettlebell";
import { submitContactMessage } from "@/lib/api/contact.functions";
import { sendViaFormSubmit, sendViaWeb3Forms } from "@/lib/email/contact-mail.shared";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - LEANMOVEMENT" },
      {
        name: "description",
        content: "Questions about coaching, training, or nutrition? Email or WhatsApp. Replies within 2 business hours.",
      },
      { property: "og:title", content: "Contact - LEANMOVEMENT" },
      { property: "og:description", content: "Ask about live coaching, training, or nutrition." },
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

type ContactPayload = {
  name: string;
  email: string;
  whatsapp?: string;
  message: string;
};

async function deliverContactEmailFromBrowser(data: ContactPayload) {
  const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();
  if (web3Key) {
    try {
      await sendViaWeb3Forms(data, web3Key);
      return { ok: true as const };
    } catch {
      // fall through to FormSubmit
    }
  }

  try {
    await sendViaFormSubmit(data);
    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
}

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
      const payload = { name, email, whatsapp: whatsapp || undefined, message };
      const result = await submitContactMessage({ data: payload });

      let emailed = result.ok && result.emailed;

      if (result.ok && !emailed) {
        const browserDelivery = await deliverContactEmailFromBrowser(payload);
        emailed = browserDelivery.ok;
      }

      if (!result.ok && !emailed) {
        const browserDelivery = await deliverContactEmailFromBrowser(payload);
        if (browserDelivery.ok) {
          emailed = true;
        } else {
          toast.error(
            `Could not send right now. Email ${CONTACT.email} or WhatsApp ${CONTACT.phone}.`,
          );
          return;
        }
      }

      if (emailed) {
        toast.success(`Message sent to ${CONTACT.email}. I'll reply within 2 business hours.`);
        form.reset();
        return;
      }

      if (result.ok && result.stored) {
        toast.success(
          `Message saved. If you don't hear back soon, email ${CONTACT.email} directly or WhatsApp ${CONTACT.phone}.`,
        );
        form.reset();
        return;
      }

      toast.error(`Could not send right now. Email ${CONTACT.email} or WhatsApp ${CONTACT.phone}.`);
    } catch {
      toast.error(`Could not send right now. Email ${CONTACT.email} or WhatsApp ${CONTACT.phone}.`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        subtitle={CONTACT.replyNote}
        borderless
      />

      <section className="container-x section-y">
        <div className="grid max-w-4xl gap-16 lg:grid-cols-2 lg:gap-20">
          <FadeUp>
            <div className="space-y-8">
              {CHANNELS.map((c) => (
                <a key={c.label} href={c.href} className="group flex items-center gap-4">
                  <c.icon className="shrink-0 text-accent" size={22} strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{c.label}</div>
                    <div className="mt-1.5 text-lg transition-colors group-hover:text-accent md:text-xl">
                      {c.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-10 text-base text-muted-foreground md:text-lg">{CONTACT.location}</p>
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
                  className="w-full border border-border bg-background px-4 py-3 text-base focus:border-accent focus:outline-none resize-none disabled:opacity-60"
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
                Messages go to <span className="text-foreground">{CONTACT.email}</span>.{" "}
                {CONTACT.replyNote}
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
        className="w-full border border-border bg-background px-4 py-3 h-12 text-base focus:border-accent focus:outline-none disabled:opacity-60"
      />
    </div>
  );
}
