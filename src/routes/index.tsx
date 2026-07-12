import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
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
  PRICING_PLANS,
  TESTIMONIALS,
} from "@/lib/lean-kettlebell";

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

const HOME_FAQ = FAQ.slice(0, 3);

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
    <div className="section-head">
      <p className="eyebrow">
        <span className="w-6 h-px bg-accent" />
        {eyebrow}
      </p>
      <h2 className="type-h2 stack-head">{title}</h2>
      {description && <p className="type-lead stack-head">{description}</p>}
    </div>
  );
}

function HomePage() {
  const featuredPlan = PRICING_PLANS[0];

  return (
    <>
      <section className="bg-white border-b border-border min-h-[100svh] flex flex-col justify-center">
        <div className="container-x w-full pt-20 pb-6 md:pt-22 md:pb-8 lg:pt-[5.5rem] lg:pb-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <FadeUp>
                <p className="eyebrow">
                  <span className="w-6 h-px bg-accent" />
                  Live kettlebell coaching
                </p>
              </FadeUp>
              <FadeUp delay={0.06}>
                <h1 className="mt-5 font-display uppercase text-[3rem] sm:text-[3.75rem] md:text-[4.5rem] lg:text-[5rem] xl:text-[5.25rem] leading-[0.9] tracking-[0.04em]">
                  Get lean.
                  <br />
                  Get strong.
                  <br />
                  <span className="text-accent">Stay athletic.</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.1}>
                <p className="type-lead stack-head">
                  {LEAN_KETTLEBELL.positioning}
                </p>
              </FadeUp>
              <FadeUp delay={0.14}>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    to="/join"
                    search={{ plan: "standard", email: "", name: "" }}
                    className="btn-primary"
                  >
                    Join now <ArrowRight size={14} />
                  </Link>
                  <Link to="/programs" className="type-link">
                    View membership →
                  </Link>
                </div>
              </FadeUp>
              <FadeUp delay={0.18}>
                <p className="mt-6 type-meta">
                  3 live sessions per week · 45 minutes · All recorded
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.08} className="lg:col-span-7 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-none h-[min(62svh,540px)] md:h-[min(70svh,620px)] lg:h-[min(74svh,680px)] aspect-[4/5] lg:aspect-auto lg:w-[min(100%,calc(min(74svh,680px)*0.8))] overflow-hidden bg-white">
                <img
                  src={HERO_IMAGE_DEFAULT}
                  srcSet={heroImageSrcSet()}
                  sizes="(min-width: 1024px) 48vw, 90vw"
                  alt={HERO_IMAGE.alt}
                  width={1920}
                  height={2400}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-[center_32%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-border">
        <div className="container-x section-y">
          <FadeUp>
            <SectionHeader
              eyebrow="Membership"
              title="Everything included."
              description="One membership. Live coaching, recordings, nutrition framework, and community."
            />
          </FadeUp>
          <FadeUp delay={0.08}>
            <ul className="section-content-gap grid sm:grid-cols-2 gap-x-14 gap-y-5 max-w-2xl">
              {INCLUDED_SUMMARY.map((item) => (
                <li key={item} className="flex gap-3 type-body">
                  <Check size={15} strokeWidth={2} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      <section id="pricing" className="bg-white border-b border-border scroll-mt-24">
        <div className="container-x section-y">
          <FadeUp className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeader eyebrow="Pricing" title="Choose your plan." />
            <p className="type-meta pb-1">
              {COHORT.label}: {COHORT.date}
            </p>
          </FadeUp>

          <div className="section-content-gap grid md:grid-cols-3 gap-5 lg:gap-6">
            {PRICING_PLANS.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.05}>
                <div className="group h-full flex flex-col p-7 md:p-8 border border-border bg-white text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background">
                  <span className="type-meta transition-colors duration-300 group-hover:text-background/50">
                    {plan.tag}
                  </span>
                  <h3 className="type-h3 stack-head">{plan.name}</h3>
                  <div className="mt-6 font-display text-[2.125rem] leading-none tracking-[0.04em] transition-colors duration-300 group-hover:text-accent">
                    {plan.price}
                  </div>
                  <p className="mt-3 type-meta transition-colors duration-300 group-hover:text-background/50">
                    {plan.period}
                  </p>
                  <p className="mt-5 type-body flex-1 transition-colors duration-300 group-hover:!text-background/70">
                    {plan.description}
                  </p>
                  <Link
                    to="/join"
                    search={{ plan: plan.id, email: "", name: "" }}
                    className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] border border-border transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                  >
                    Enroll <ArrowRight size={12} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-border">
        <div className="container-x section-y">
          <FadeUp className="section-head-wide">
            <p className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              Members
            </p>
            <blockquote className="type-quote stack-head max-w-3xl border-l-2 border-accent pl-6 md:pl-8">
              {TESTIMONIALS[0].quote}
            </blockquote>
            <figcaption className="mt-7 type-meta">
              <span className="text-foreground">{TESTIMONIALS[0].name}</span>
              <span> · {TESTIMONIALS[0].detail}</span>
            </figcaption>
            <Link to="/results" className="mt-8 inline-block type-link">
              More results →
            </Link>
          </FadeUp>
        </div>
      </section>

      <section id="faq" className="bg-white border-b border-border scroll-mt-24">
        <div className="container-x section-y">
          <FadeUp>
            <SectionHeader eyebrow="FAQ" title="Common questions." />
          </FadeUp>
          <FadeUp delay={0.06}>
            <Accordion type="single" collapsible className="section-content-gap max-w-2xl">
              {HOME_FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-[0.9375rem] font-medium tracking-[-0.011em] hover:text-foreground hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="type-body pb-5">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link to="/programs" className="mt-10 inline-block type-link">
              Full membership details →
            </Link>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="section-head">
            <h2 className="type-h2">Start with {featuredPlan.price}/mo.</h2>
            <p className="type-lead stack-head">{COHORT.note}</p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="btn-primary stack-head"
            >
              Join now <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
