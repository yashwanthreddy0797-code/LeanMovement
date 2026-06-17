import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Instagram, Youtube, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — LEANMOVEMENT Coaching" },
      { name: "description", content: "Get in touch. Email, WhatsApp, or drop in via Hyderabad. We reply within 2 hours during business hours." },
      { property: "og:title", content: "Contact — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Get in touch with LEANMOVEMENT Coaching." },
    ],
  }),
  component: ContactPage,
});

const CHANNELS = [
  { icon: Mail, label: "Email", value: "hello@natty.finesse", href: "mailto:hello@natty.finesse" },
  { icon: Phone, label: "Phone", value: "+91 99999 99999", href: "tel:+919999999999" },
  { icon: MessageCircle, label: "WhatsApp", value: "+91 99999 99999", href: "https://wa.me/919999999999" },
  { icon: Instagram, label: "Instagram", value: "@natty.finesse", href: "https://www.instagram.com/natty.finesse/" },
  { icon: Youtube, label: "YouTube", value: "/nattyfinesse", href: "https://youtube.com" },
  { icon: MapPin, label: "Studio", value: "Jubilee Hills, Hyderabad", href: "#map" },
];

function ContactPage() {
  const [goal, setGoal] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received. We'll reply within 2 hours.");
    (e.target as HTMLFormElement).reset();
    setGoal("");
  };

  return (
    <>
      <PageHero eyebrow="Get In Touch" title="Say Hello." subtitle="Email, WhatsApp, or fill the form. Replies within 2 hours during India business hours." compact />

      <section className="container-x py-16">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
          <FadeUp>
            <h2 className="font-display text-4xl">Channels.</h2>
            <div className="mt-10 space-y-5">
              {CHANNELS.map((c) => (
                <a key={c.label} href={c.href} className="flex items-center gap-5 py-4 border-b border-border group">
                  <c.icon className="text-accent shrink-0" size={22} strokeWidth={1.5} />
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{c.label}</div>
                    <div className="text-base mt-1 group-hover:text-accent transition-colors">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form onSubmit={onSubmit} className="p-8 md:p-10 border border-border bg-card space-y-6">
              <h2 className="font-display text-4xl">Send a Message.</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name" name="name" required />
                <Field label="Email" name="email" type="email" required />
              </div>
              <Field label="WhatsApp Number" name="whatsapp" type="tel" required />

              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Primary Goal</label>
                <Select value={goal} onValueChange={setGoal} required>
                  <SelectTrigger className="w-full bg-background border-border text-foreground h-12 rounded-none">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat-loss">Fat Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="recomp">Body Recomposition</SelectItem>
                    <SelectItem value="performance">Performance / Strength</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <button type="submit" className="w-full px-6 py-4 bg-accent text-background text-xs font-semibold uppercase tracking-[0.25em] hover:bg-foreground transition-colors">
                Send Message
              </button>
            </form>
          </FadeUp>
        </div>
      </section>

      <section id="map" className="container-x pb-24">
        <FadeUp>
          <div className="aspect-[21/9] border border-border bg-card overflow-hidden">
            <iframe
              title="Studio Location"
              src="https://www.google.com/maps?q=Jubilee+Hills,+Hyderabad&output=embed"
              className="w-full h-full grayscale"
              loading="lazy"
            />
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-background border border-border px-4 py-3 h-12 text-foreground focus:border-accent focus:outline-none"
      />
    </div>
  );
}
