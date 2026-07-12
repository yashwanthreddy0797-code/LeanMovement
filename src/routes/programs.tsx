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
  FAQ,
  INCLUDED_SUMMARY,
  MEMBERSHIP_JOURNEY,
  MEMBERSHIP_OVERVIEW,
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

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-head-wide">
      <p className="eyebrow">
        <span className="w-6 h-px bg-accent" />
        {eyebrow}
      </p>
      <h2 className="type-h2 stack-head">{title}</h2>
      {description && <p className="type-lead stack-head">{description}</p>}
    </div>
  );
}

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Membership"
        title="Lean Kettlebell™"
        subtitle={MEMBERSHIP_OVERVIEW.subtitle}
        compact
      />

      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="section-head-wide">
            <h2 className="type-h2">{MEMBERSHIP_OVERVIEW.title}</h2>
            <p className="type-lead stack-head">{MEMBERSHIP_OVERVIEW.description}</p>
            <p className="type-meta stack-head">
              12 sessions · 45 min · 3× per week · Live + recordings
            </p>
          </FadeUp>
        </div>
      </section>

      <section id="pricing" className="bg-white border-b border-border">
        <div className="container-x section-y">
          <FadeUp>
            <SectionHeader
              eyebrow="Program"
              title="One program. ₹6,999/mo."
              description="Strength and endurance — live with your coach. Choose 3 sessions at signup."
            />
          </FadeUp>

          <div className="section-content-gap max-w-xl">
            {PRICING_PLANS.map((plan) => (
              <FadeUp key={plan.id}>
                <div className="group flex flex-col p-7 md:p-8 border border-border bg-white text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                  <span className="type-meta transition-colors duration-300 group-hover:text-background/50">
                    {plan.tag}
                  </span>
                  <h3 className="type-h3 stack-head">{plan.name}</h3>
                  <div className="mt-6 font-display text-[2.5rem] leading-none tracking-[0.04em] transition-colors duration-300 group-hover:text-accent">
                    {plan.price}
                  </div>
                  <p className="mt-3 type-meta transition-colors duration-300 group-hover:text-background/50">
                    {plan.period}
                  </p>
                  <p className="mt-5 type-body transition-colors duration-300 group-hover:!text-background/70">
                    {plan.description}
                  </p>
                  <Link
                    to="/join"
                    search={{ plan: plan.id, email: "", name: "" }}
                    className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] border border-border transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                  >
                    Join now <ArrowRight size={12} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.1}>
            <ul className="section-content-gap grid sm:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl">
              {INCLUDED_SUMMARY.map((item) => (
                <li key={item} className="flex gap-3 type-body">
                  <Check size={15} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp>
            <SectionHeader eyebrow="How it works" title="Register to first live class." />
          </FadeUp>
          <div className="section-content-gap grid sm:grid-cols-3 gap-8 max-w-3xl">
            {MEMBERSHIP_JOURNEY.map((step) => (
              <div key={step.step}>
                <span className="font-mono text-xs text-accent">{step.step}</span>
                <h3 className="mt-3 text-sm font-medium">{step.title}</h3>
                <p className="mt-2 type-body">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp>
            <SectionHeader
              eyebrow="Schedule"
              title={SESSION_SCHEDULE.title}
              description={SESSION_SCHEDULE.subtitle}
            />
          </FadeUp>
          <FadeUp delay={0.06}>
            <div className="section-content-gap max-w-xl divide-y divide-border border border-border">
              {SESSION_SCHEDULE.batches.map((batch) => (
                <div key={batch.day} className="flex items-center justify-between gap-6 px-5 py-4 bg-white">
                  <div>
                    <span className="text-sm font-medium">{batch.day}</span>
                    <span className="ml-3 text-sm text-muted-foreground">{batch.name}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{batch.type}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
                    <Clock size={12} className="text-accent" />
                    {batch.time}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {SESSION_SCHEDULE.timezone} · {SESSION_SCHEDULE.note}
            </p>
          </FadeUp>
        </div>
      </section>

      <section>
        <div className="container-x section-y">
          <FadeUp>
            <SectionHeader eyebrow="FAQ" title="Common questions." />
          </FadeUp>
          <FadeUp delay={0.06}>
            <Accordion type="single" collapsible className="section-content-gap max-w-2xl">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium tracking-[-0.014em] hover:text-foreground hover:no-underline py-6">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="type-lead max-w-none pb-6">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      <CTABanner
        title="Ready to train live?"
        highlight="live"
        subtitle="Checkout in under 2 minutes."
        ctaText="Join now"
        ctaTo="/join"
      />
    </>
  );
}
