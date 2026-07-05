import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Dumbbell,
  MessageCircle,
  Radio,
  Salad,
  UserCheck,
  Video,
} from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  COHORT,
  FAQ,
  HERO_IMAGE,
  HERO_IMAGE_DEFAULT,
  heroImageSrcSet,
  heroImageUrl,
  INCLUDED_SUMMARY,
  LEAN_KETTLEBELL,
  MEMBERSHIP_JOURNEY,
  PRICING_PLANS,
  SESSION_SCHEDULE,
  TESTIMONIALS,
} from "@/lib/lean-kettlebell";

const MEMBERSHIP_FEATURES = [
  { icon: UserCheck, label: INCLUDED_SUMMARY[0] },
  { icon: Radio, label: INCLUDED_SUMMARY[1] },
  { icon: Video, label: INCLUDED_SUMMARY[2] },
  { icon: Salad, label: INCLUDED_SUMMARY[3] },
  { icon: MessageCircle, label: INCLUDED_SUMMARY[4] },
  { icon: Dumbbell, label: INCLUDED_SUMMARY[5] },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lean Movement — Live Coaching Membership | LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Live kettlebell coaching for busy professionals. 12 coached sessions per month, nutrition framework, and private community.",
      },
      { property: "og:title", content: "Lean Movement — LEANMOVEMENT" },
      {
        property: "og:description",
        content: "Train live three times a week. Short, effective kettlebell sessions for visible abs, muscle, and athletic fitness.",
      },
      { property: "og:image", content: heroImageUrl(1200) },
    ],
  }),
  component: HomePage,
});

const HOME_FAQ = FAQ.slice(0, 5);

function HomePage() {
  return (
    <>
      {/* 1. Hero — outcome + CTA */}
      <section className="bg-background border-b border-border">
        <div className="container-x pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7">
              <FadeUp>
                <p className="text-[10px] uppercase tracking-[0.36em] text-muted-foreground">
                  Live kettlebell coaching · {COHORT.date}
                </p>
              </FadeUp>
              <FadeUp delay={0.08}>
                <h1 className="mt-4 font-display uppercase tracking-[0.02em] text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.92]">
                  Get lean.
                  <br />
                  Get strong.
                  <br />
                  <span className="text-accent">Stay athletic.</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.12}>
                <p className="mt-5 max-w-lg text-base md:text-lg text-foreground/75 leading-relaxed">
                  {LEAN_KETTLEBELL.positioning}
                </p>
              </FadeUp>
              <FadeUp delay={0.16}>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to="/join"
                    search={{ plan: "standard", email: "", name: "" }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
                  >
                    Join now <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/programs"
                    className="text-[11px] uppercase tracking-[0.24em] text-foreground/60 hover:text-foreground transition-colors"
                  >
                    See full membership →
                  </Link>
                </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Radio size={12} className="text-accent" /> 3× live / week
                  </span>
                  <span>45 min sessions</span>
                  <span>All recorded</span>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.1} className="lg:col-span-5">
              <div className="relative lg:pl-3 lg:pt-3">
                <div
                  className="absolute top-0 left-0 right-3 bottom-3 border border-accent/25 pointer-events-none hidden lg:block"
                  aria-hidden
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                  <img
                    src={HERO_IMAGE_DEFAULT}
                    srcSet={heroImageSrcSet()}
                    sizes="(min-width: 1280px) 38vw, (min-width: 640px) 50vw, 100vw"
                    alt={HERO_IMAGE.alt}
                    width={1920}
                    height={2400}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-[1.03] saturate-[0.9] contrast-[1.08] brightness-[0.93]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/35" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/85">
                      {LEAN_KETTLEBELL.liveNote}
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 2. Membership — premium */}
      <section className="bg-foreground text-background border-b border-border">
        <div className="container-x py-14 md:py-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <FadeUp className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="eyebrow text-background/45">
                <span className="w-6 h-px bg-accent" />
                Membership
              </div>
              <h2 className="mt-5 font-display text-4xl md:text-5xl uppercase tracking-[0.01em] leading-[0.95]">
                One plan.
                <br />
                <span className="text-accent">Everything</span>
                <br />
                included.
              </h2>
              <p className="mt-5 text-sm text-background/60 leading-relaxed max-w-xs">
                Live coaching, recordings, nutrition framework, circuits, and community — no upsells.
              </p>
              <Link
                to="/programs"
                className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-background/50 hover:text-accent transition-colors"
              >
                Full breakdown <ArrowRight size={13} />
              </Link>
            </FadeUp>

            <div className="lg:col-span-8 space-y-px bg-background/10">
              <div className="grid sm:grid-cols-2 gap-px bg-background/10">
                {MEMBERSHIP_FEATURES.map(({ icon: Icon, label }, i) => (
                  <FadeUp key={label} delay={i * 0.04}>
                    <div className="group bg-foreground p-6 md:p-8 h-full transition-colors hover:bg-[#1a1a1a]">
                      <div className="w-10 h-10 border border-background/15 grid place-items-center text-accent group-hover:border-accent/40 transition-colors">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>
                      <p className="mt-5 text-sm text-background/85 leading-relaxed">{label}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>

              <div id="pricing" className="bg-foreground border-t border-background/10 p-6 md:p-8 scroll-mt-24">
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-accent">Pricing</p>
                  <p className="mt-1 text-xs text-background/50">
                    Three ways to join. Same full access on every plan.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-px bg-background/10">
                  {PRICING_PLANS.map((plan, i) => (
                    <FadeUp key={plan.id} delay={0.12 + i * 0.04}>
                      <div className="group bg-[#1a1a1a] p-5 md:p-6 h-full flex flex-col hover:bg-[#222] transition-colors">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-background/40 group-hover:text-accent transition-colors">
                          {plan.tag}
                        </span>
                        <h3 className="mt-3 font-display text-xl uppercase tracking-[0.02em]">{plan.name}</h3>
                        <p className="mt-2 text-xs text-background/50 leading-relaxed flex-1">{plan.description}</p>
                        <div className="mt-4 font-display text-3xl text-accent">{plan.price}</div>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-background/35">{plan.period}</p>
                        <Link
                          to="/join"
                          search={{ plan: plan.id, email: "", name: "" }}
                          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.28em] border border-background/20 text-background/80 hover:border-accent hover:bg-accent hover:text-white transition-colors"
                        >
                          Enroll <ArrowRight size={12} />
                        </Link>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>

              <FadeUp delay={0.2}>
                <div className="bg-foreground border-t border-background/10 p-6 md:p-8">
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-accent">Weekly schedule</p>
                      <p className="mt-1 text-xs text-background/50">{SESSION_SCHEDULE.subtitle}</p>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-background/40">
                      {SESSION_SCHEDULE.timezone}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-px bg-background/10">
                    {SESSION_SCHEDULE.batches.map((batch) => (
                      <div
                        key={batch.day}
                        className="bg-[#1a1a1a] p-5 md:p-6 group hover:bg-[#222] transition-colors"
                      >
                        <div className="text-[10px] uppercase tracking-[0.24em] text-accent">{batch.day}</div>
                        <div className="mt-3 font-display text-2xl uppercase tracking-[0.02em]">{batch.name}</div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-background/45">
                          <Clock size={12} className="text-accent/80" />
                          {batch.time}
                        </div>
                        <p className="mt-3 text-[11px] text-background/35 leading-relaxed">{batch.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How it works — premium journey */}
      <section className="bg-background border-b border-border overflow-hidden">
        <div className="container-x py-14 md:py-24">
          <FadeUp className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center">
              <div className="eyebrow">
                <span className="w-6 h-px bg-accent" />
                How it works
              </div>
            </div>
            <h2 className="mt-5 font-display text-4xl md:text-5xl uppercase tracking-[0.01em]">
              Four steps to your first live class.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Checkout to portal access in under 2 minutes.
            </p>
          </FadeUp>

          <div className="mt-14 md:mt-16 relative">
            <div
              className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-border"
              aria-hidden
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {MEMBERSHIP_JOURNEY.map((step, i) => (
                <FadeUp key={step.step} delay={i * 0.06}>
                  <div className="relative text-center lg:text-left">
                    <div className="mx-auto lg:mx-0 w-11 h-11 rounded-full border-2 border-foreground bg-background grid place-items-center relative z-10">
                      <span className="font-mono text-[11px] text-accent font-medium">{step.step}</span>
                    </div>
                    <h3 className="mt-6 font-display text-xl md:text-2xl uppercase tracking-[0.02em]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/65 leading-relaxed max-w-[220px] mx-auto lg:mx-0">
                      {step.detail}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp delay={0.25}>
            <div className="mt-14 md:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border border-border bg-surface p-6 md:p-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {COHORT.label}
                </p>
                <p className="mt-1 font-display text-2xl md:text-3xl uppercase text-accent">{COHORT.date}</p>
                <p className="mt-2 text-xs text-muted-foreground">{COHORT.note}</p>
              </div>
              <Link
                to="/join"
                search={{ plan: "standard", email: "", name: "" }}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
              >
                Start now <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 4. Social proof */}
      <section className="bg-surface border-b border-border">
        <div className="container-x py-10 md:py-14">
          <FadeUp className="mb-8 md:mb-10">
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              Results
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase tracking-[0.01em]">
              Members who stayed consistent.
            </h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.05}>
                <figure className="bg-background p-6 md:p-8 h-full flex flex-col">
                  <blockquote className="font-serif text-base md:text-lg leading-snug text-foreground/90 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 pt-5 border-t border-border">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
                      {t.detail}
                    </div>
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="bg-surface border-b border-border scroll-mt-24">
        <div className="container-x py-12 md:py-16">
          <FadeUp className="max-w-xl mb-8">
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              FAQ
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase tracking-[0.01em]">
              Common questions.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <Accordion type="single" collapsible className="max-w-2xl">
              {HOME_FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="font-display text-base md:text-lg text-left hover:text-accent hover:no-underline py-4 uppercase tracking-[0.01em]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 text-sm pb-4 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
          <FadeUp delay={0.12}>
            <Link
              to="/programs"
              className="mt-6 inline-block text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
            >
              Full membership details →
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-foreground text-background">
        <div className="container-x py-14 md:py-20 text-center">
          <FadeUp>
            <p className="text-[10px] uppercase tracking-[0.32em] text-background/50">
              {COHORT.label} · {COHORT.date}
            </p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl uppercase tracking-[0.01em] max-w-2xl mx-auto leading-[1.02]">
              Start training live this week.
            </h2>
            <p className="mt-4 text-sm text-background/65 max-w-md mx-auto">
              {COHORT.note}
            </p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="mt-8 inline-flex items-center justify-center gap-2 px-10 py-4 text-[11px] uppercase tracking-[0.32em] bg-accent text-white hover:bg-background hover:text-foreground transition-colors"
            >
              Join now <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
