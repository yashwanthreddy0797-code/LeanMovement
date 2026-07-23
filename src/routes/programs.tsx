import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Sun } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { ZoomMark } from "@/components/brand/ZoomMark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CONTACT,
  FAQ,
  FOUNDATIONS,
  MEMBERSHIP_CLOSING,
  MEMBERSHIP_HERO,
  MEMBERSHIP_INCLUDED,
  MEMBERSHIP_QUOTE,
  MEMBERSHIP_STATEMENT,
  NUTRITION,
  PRICING_PLANS,
  PROGRAM_HERO,
  REQUIREMENTS,
  SESSION_SCHEDULE,
  WHY_KETTLEBELLS,
} from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Lean Program — Live Kettlebell Coaching | LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Lean Program ₹6,999/mo — live kettlebell coaching 3× per week. Tue / Thu / Sat · 6–7 AM IST. Foundations, recordings, nutrition.",
      },
      { property: "og:title", content: "Lean Program — Live Kettlebell Coaching | LEANMOVEMENT" },
      {
        property: "og:description",
        content: "Train live three mornings a week. One program, one coach, clear structure.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const plan = PRICING_PLANS[0];
  const schedule = SESSION_SCHEDULE.batches[0];

  return (
    <div className="bg-background text-foreground pb-24 md:pb-0">
      {/* Hero */}
      <header
        className="relative flex flex-col justify-end overflow-hidden bg-black"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        <img
          src={PROGRAM_HERO.src}
          alt={PROGRAM_HERO.alt}
          className="absolute inset-x-0 top-0 h-[120%] w-full object-cover object-[center_top] translate-y-[8%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="container-x relative z-10 pb-14 pt-28 md:pb-20 md:pt-32">
          <FadeUp>
            <p className="font-display text-sm tracking-[0.28em] text-white/70 md:text-base">
              LEANMOVEMENT
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[2.5rem] uppercase leading-[0.92] tracking-[0.04em] text-white sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem]">
              {MEMBERSHIP_HERO.headline}
            </h1>
            <div className="mt-6 space-y-1 text-base leading-relaxed text-white/75 md:text-lg">
              {MEMBERSHIP_HERO.sublines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/join"
                search={{ plan: plan.id, email: "", name: "" }}
                className="btn-primary inline-flex"
              >
                Join now <ArrowRight size={13} />
              </Link>
              <span className="font-display text-2xl text-white md:text-3xl">{plan.price}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-white/45">{plan.period}</span>
              <ZoomMark tone="light" size="sm" label="live" />
            </div>
          </FadeUp>
        </div>
      </header>

      {/* Program story — membership-specific */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {MEMBERSHIP_STATEMENT.title}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.65]">
              {MEMBERSHIP_STATEMENT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Full included list */}
      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-3xl">
            <p className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              What&apos;s included
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              Everything in the Lean Program
            </h2>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {MEMBERSHIP_INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-border pt-5 text-base leading-relaxed text-foreground/85 md:text-lg"
                >
                  <Check size={16} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Schedule detail */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              {SESSION_SCHEDULE.title}
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {schedule.day}
            </h2>
            <div className="mt-8 inline-flex items-center justify-center gap-2 text-accent">
              <Sun size={18} />
              <p className="font-display text-2xl tracking-[0.08em] uppercase md:text-3xl">
                {schedule.time} IST
              </p>
            </div>
            <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-base text-white/60">
              <Clock size={14} />
              {schedule.type}
            </p>
            <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
              {SESSION_SCHEDULE.note}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Foundations + equipment — detail only on Membership */}
      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeUp>
              <p className="eyebrow">
                <span className="w-6 h-px bg-accent" />
                {FOUNDATIONS.title}
              </p>
              <p className="mt-4 type-lead">{FOUNDATIONS.description}</p>
              <ul className="mt-6 space-y-3">
                {FOUNDATIONS.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-foreground/80 md:text-[1.0625rem]"
                  >
                    <Check size={16} className="mt-1 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 type-meta">{FOUNDATIONS.note}</p>
            </FadeUp>
            <FadeUp delay={0.06}>
              <p className="eyebrow">
                <span className="w-6 h-px bg-accent" />
                {REQUIREMENTS.title}
              </p>
              <p className="mt-4 type-lead">{REQUIREMENTS.subtitle}</p>
              <ul className="mt-6 space-y-5">
                {REQUIREMENTS.items.map((item) => (
                  <li key={item.label}>
                    <p className="text-base font-medium md:text-lg">{item.label}</p>
                    <p className="mt-1.5 type-body">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Why kettlebells — detail only on Membership */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {WHY_KETTLEBELLS.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70 md:text-xl">{WHY_KETTLEBELLS.lead}</p>
            <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">
              {WHY_KETTLEBELLS.items.join(" · ")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
              {WHY_KETTLEBELLS.closing}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Nutrition — detail only on Membership */}
      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {NUTRITION.title}
            </h2>
            <p className="mt-4 type-lead">{NUTRITION.description}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {NUTRITION.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-foreground/80 md:text-[1.0625rem]"
                >
                  <Check size={16} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 type-body">{NUTRITION.closing}</p>
          </FadeUp>
        </div>
      </section>

      {/* Coach quote — membership only */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <blockquote className="font-display text-2xl uppercase leading-[1.15] tracking-[0.04em] md:text-3xl">
              &ldquo;{MEMBERSHIP_QUOTE.text}&rdquo;
            </blockquote>
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-white/45">
              — {MEMBERSHIP_QUOTE.author}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Price */}
      <section className="border-b border-border">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <p className="eyebrow justify-center">
              <span className="w-6 h-px bg-accent" />
              {plan.name}
            </p>
            <p className="mt-6 font-display text-5xl text-accent md:text-6xl">{plan.price}</p>
            <p className="mt-2 type-meta">{plan.period}</p>
            <p className="mt-6 type-body mx-auto max-w-md">{plan.description}</p>
            <Link
              to="/join"
              search={{ plan: plan.id, email: "", name: "" }}
              className="btn-primary mt-10 inline-flex"
            >
              Join now <ArrowRight size={14} />
            </Link>
            <p className="mt-4 type-meta">Cancel anytime</p>
          </FadeUp>
        </div>
      </section>

      {/* FAQ — membership only */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-2xl">
            <h2 className="text-center font-display text-3xl uppercase tracking-[0.06em]">FAQ</h2>
            <Accordion type="single" collapsible className="mt-10">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/15">
                  <AccordionTrigger className="py-5 text-left text-lg font-medium text-white hover:no-underline md:text-xl">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-base leading-relaxed text-white/65 md:text-[1.0625rem]">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      {/* Close + contact */}
      <section>
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <p className="font-display text-sm tracking-[0.28em] text-muted-foreground">LEANMOVEMENT</p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {MEMBERSHIP_CLOSING.headline}
            </h2>
            <div className="mt-4 space-y-1.5 text-base leading-relaxed text-foreground/70 md:text-lg">
              {MEMBERSHIP_CLOSING.sublines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link
              to="/join"
              search={{ plan: plan.id, email: "", name: "" }}
              className="btn-primary mt-8 inline-flex"
            >
              Join now · {plan.price}/mo <ArrowRight size={14} />
            </Link>
            <div className="mt-10 space-y-1 text-xs text-muted-foreground">
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-accent">
                  {CONTACT.email}
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a href={CONTACT.whatsapp} className="hover:text-accent">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                Instagram:{" "}
                <a href={CONTACT.instagram} className="hover:text-accent">
                  @{CONTACT.instagramHandle}
                </a>
              </p>
              <p>{CONTACT.location}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Mobile sticky join */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-xl md:hidden pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Link
          to="/join"
          search={{ plan: plan.id, email: "", name: "" }}
          className="btn-primary flex w-full items-center justify-center gap-2"
        >
          Join · {plan.price}/mo <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
