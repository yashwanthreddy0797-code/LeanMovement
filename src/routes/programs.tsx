import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  COHORT,
  FAQ,
  INCLUDED_SUMMARY,
  MEMBERSHIP_JOURNEY,
  MEMBERSHIP_OVERVIEW,
  MEMBERSHIP_PILLARS,
  PRICING_PLANS,
  SESSION_SCHEDULE,
} from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Live Coaching Membership — LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Live kettlebell coaching membership — 12 sessions per month, foundations onboarding, nutrition framework, and private community.",
      },
      { property: "og:title", content: "Live Coaching Membership — LEANMOVEMENT" },
      {
        property: "og:description",
        content: "Small-group live coached training. Not online coaching — coached presence, energy, and consistency.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Lean Kettlebell™"
        subtitle={MEMBERSHIP_OVERVIEW.subtitle}
        compact
      />

      {/* Overview — short */}
      <section className="bg-background border-b border-border">
        <div className="container-x py-10 md:py-14">
          <FadeUp>
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-[0.01em]">
                  {MEMBERSHIP_OVERVIEW.title}
                </h2>
                <p className="mt-4 text-foreground/75 text-sm md:text-base leading-relaxed max-w-xl">
                  {MEMBERSHIP_OVERVIEW.description}
                </p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-4 gap-px bg-border border border-border">
                <Stat label="Sessions" value="12" unit="/mo" />
                <Stat label="Length" value="45" unit="min" />
                <Stat label="Live" value="3×" unit="/wk" />
                <Stat label="Format" value="Live" unit="+ rec" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-surface border-b border-border">
        <div className="container-x py-14 md:py-24">
          <FadeUp>
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              Pricing
            </div>
            <h2 className="mt-6 font-display text-3xl md:text-5xl uppercase tracking-[0.01em]">
              Three ways to join.
            </h2>
            <p className="mt-4 text-foreground/70 max-w-xl">
              Same full membership on every plan — only billing differs. All include live sessions,
              recordings, nutrition, circuits, and community.
            </p>
          </FadeUp>

          <div className="mt-12 grid md:grid-cols-3 gap-px bg-border border border-border">
            {PRICING_PLANS.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.05}>
                <div className="group p-8 md:p-10 h-full flex flex-col bg-background text-foreground transition-colors duration-300 ease-out hover:bg-foreground hover:text-background">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground transition-colors duration-300 group-hover:text-accent">
                    {plan.tag}
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70 transition-colors duration-300 group-hover:text-background/75">
                    {plan.description}
                  </p>
                  <div className="mt-6 font-display text-4xl text-foreground transition-colors duration-300 group-hover:text-accent">
                    {plan.price}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-hover:text-background/60">
                    {plan.period}
                  </div>

                  <ul className="mt-8 space-y-2.5 flex-1">
                    {INCLUDED_SUMMARY.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-xs leading-relaxed text-foreground/75 transition-colors duration-300 group-hover:text-background/80"
                      >
                        <Check size={12} className="mt-0.5 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/join"
                    search={{ plan: plan.id, email: "", name: "" }}
                    className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] uppercase tracking-[0.28em] bg-foreground text-background transition-colors duration-300 group-hover:bg-accent group-hover:text-white hover:bg-accent"
                  >
                    Enroll <ArrowRight size={13} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* What's included — compact grid */}
      <section id="whats-included" className="bg-background border-b border-border">
        <div className="container-x py-10 md:py-16">
          <FadeUp className="max-w-xl">
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              What's included
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl uppercase tracking-[0.01em]">
              Everything in your membership.
            </h2>
          </FadeUp>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {MEMBERSHIP_PILLARS.map((pillar, i) => (
              <FadeUp key={pillar.id} delay={i * 0.03}>
                <article className="bg-background p-5 md:p-6 h-full">
                  <span className="text-[9px] uppercase tracking-[0.22em] text-accent">
                    {pillar.eyebrow}
                  </span>
                  <h3 className="mt-2 font-display text-lg uppercase tracking-[0.02em] leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">{pillar.duration}</p>
                  <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{pillar.summary}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it works + good to know — one compact band */}
      <section className="bg-surface border-b border-border">
        <div className="container-x py-10 md:py-14">
          <FadeUp>
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              How it works
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl uppercase tracking-[0.01em]">
              Checkout to first live class.
            </h2>
          </FadeUp>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEMBERSHIP_JOURNEY.map((step, i) => (
              <FadeUp key={step.step} delay={i * 0.04}>
                <div className="border border-border bg-background p-5 h-full">
                  <span className="font-mono text-[10px] text-accent">{step.step}</span>
                  <h3 className="mt-2 text-sm font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-xs text-foreground/65 leading-relaxed">{step.detail}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.15}>
            <div className="mt-8 grid md:grid-cols-2 gap-6 md:gap-10 pt-8 border-t border-border">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent mb-3">Ideal for</p>
                <ul className="space-y-2">
                  {MEMBERSHIP_OVERVIEW.idealFor.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-foreground/75">
                      <Check size={12} className="mt-0.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
                  You'll need
                </p>
                <ul className="space-y-2 text-xs text-foreground/65">
                  <li>· One kettlebell minimum (two–three weights ideal)</li>
                  <li>· 45 min free, three days per week</li>
                  <li>· Phone or laptop with stable internet</li>
                  <li>· {COHORT.note}</li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              {COHORT.label}: <span className="text-foreground">{COHORT.date}</span>
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-background border-b border-border">
        <div className="container-x py-10 md:py-16">
          <FadeUp>
            <div className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              Schedule
            </div>
            <h2 className="mt-4 font-display text-2xl md:text-3xl uppercase tracking-[0.01em]">
              {SESSION_SCHEDULE.title}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{SESSION_SCHEDULE.subtitle}</p>
          </FadeUp>

          <FadeUp delay={0.06}>
            <div className="mt-8 border border-border overflow-hidden max-w-3xl">
              {SESSION_SCHEDULE.batches.map((batch, i) => (
                <div
                  key={batch.day}
                  className={`flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 bg-background ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <span className="text-sm font-medium w-24">{batch.day}</span>
                  <span className="text-xs text-foreground/70 flex items-center gap-1.5 w-20">
                    <Clock size={12} className="text-accent" />
                    {batch.time}
                  </span>
                  <span className="font-display text-base uppercase tracking-[0.02em]">
                    {batch.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
                    {batch.type}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground max-w-3xl">
              {SESSION_SCHEDULE.timezone} · {SESSION_SCHEDULE.note}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background">
        <div className="container-x py-14 md:py-20">
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
              {FAQ.map((f, i) => (
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
        </div>
      </section>

      <CTABanner
        eyebrow="Enroll"
        title="Ready to train live?"
        highlight="live"
        subtitle="12 coached sessions per month — checkout in under 2 minutes."
        ctaText="Join Now"
        ctaTo="/join"
      />
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-background p-4 md:p-5 text-center">
      <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 flex items-baseline justify-center gap-0.5">
        <span className="font-display text-2xl md:text-3xl text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
