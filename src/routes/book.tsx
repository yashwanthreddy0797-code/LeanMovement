import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Call — APEX Coaching" },
      { name: "description", content: "Book a free 15-minute consultation. No obligation. We figure out if we're the right fit before any money changes hands." },
      { property: "og:title", content: "Book a Free Call — APEX Coaching" },
      { property: "og:description", content: "Free 15-min consultation. No sales pitch." },
    ],
  }),
  component: BookPage,
});

const COACH_IMG = "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=900&q=80";

function BookPage() {
  return (
    <>
      <PageHero eyebrow="Free Consultation" title="Let's Talk." subtitle="A 15-minute call. No sales pitch. Just an honest conversation about your goal and whether we're the right fit." compact />

      <section className="container-x pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeUp>
            <h2 className="font-display text-4xl md:text-5xl">Book Your Free<br />Consultation.</h2>
            <div className="mt-10 space-y-5">
              {[
                "We'll diagnose where you actually are vs. where you want to be.",
                "I'll walk you through the program that fits your life — not the most expensive one.",
                "You leave with one concrete next step, whether you sign up or not.",
              ].map((b) => (
                <div key={b} className="flex gap-4">
                  <Check className="text-accent shrink-0 mt-0.5" size={20} />
                  <p className="text-foreground/80">{b}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 aspect-[4/5] max-w-sm overflow-hidden">
              <img src={COACH_IMG} alt="Coach" loading="lazy" className="w-full h-full object-cover grayscale" />
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="border border-border bg-card overflow-hidden">
              <iframe
                src="https://calendly.com/apex-coaching"
                title="Book a call"
                className="w-full h-[720px] bg-background"
                loading="lazy"
              />
            </div>

            <div className="mt-8 border border-border bg-surface p-8">
              <h3 className="font-display text-3xl">Prefer WhatsApp?</h3>
              <p className="mt-2 text-sm text-foreground/70">Message directly. Replies within 2 hours during India business hours.</p>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-background text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground transition-colors"
              >
                <MessageCircle size={16} /> Message on WhatsApp
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="container-x py-10 flex flex-wrap justify-center items-center gap-x-12 gap-y-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="text-accent">100% Free</span>
          <span>·</span>
          <span>No Obligation</span>
          <span>·</span>
          <span>15 Minutes</span>
          <span>·</span>
          <span>Zoom or Phone</span>
        </div>
      </section>
    </>
  );
}
