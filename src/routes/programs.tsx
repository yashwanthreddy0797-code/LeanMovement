import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — LEANMOVEMENT" },
      { name: "description", content: "Consultation, self-guided programs and the LEAN 90-day mentorship — Fat Loss, Muscle Gain, Hybrid and more." },
      { property: "og:title", content: "Programs — LEANMOVEMENT" },
      { property: "og:description", content: "Consultation, self-guided programs and the LEAN 90-day mentorship." },
    ],
  }),
  component: ProgramsPage,
});

type Program = {
  name: string;
  tag: string;
  price: string;
  period?: string;
  tagline: string;
  intro?: string;
  sections: { title: string; items: string[] }[];
  meta?: { label: string; value: string }[];
  cta: string;
  ctaTo: string;
  note?: string;
  featured?: boolean;
  highlight?: boolean;
};

const PROGRAMS: Program[] = [
  {
    name: "Consultation",
    tag: "30 Minute Call",
    price: "₹4,999",
    period: "one-time",
    tagline: "In-depth assessment & roadmap creation.",
    intro: "Fee deducted upon enrolling into LEAN.",
    sections: [
      {
        title: "What you get",
        items: [
          "In-depth fitness assessment",
          "Lifestyle review",
          "Nutrition review",
          "Roadmap creation",
          "Supplement guidance",
          "Q&A",
        ],
      },
      {
        title: "Topics include",
        items: [
          "Fat Loss",
          "Muscle Gain",
          "Hybrid Training",
          "Sports Performance",
          "Longevity",
          "Recovery",
          "Health",
        ],
      },
    ],
    cta: "Book Consultation",
    ctaTo: "/contact",
  },
  {
    name: "Fat Loss",
    tag: "Self-Guided",
    price: "₹5,999",
    period: "one-time payment",
    tagline: "Lose fat. Build momentum.",
    sections: [
      {
        title: "What's included",
        items: [
          "12 week program",
          "Lifetime access",
          "Progress spreadsheet",
          "Mobility video",
          "Exercise library",
          "Habit scorecard",
          "Restaurant guide",
          "Travel guide",
          "Fat loss nutrition guide",
        ],
      },
      {
        title: "Training style",
        items: [
          "Full body training",
          "Kettlebell circuits",
          "Zone 2",
          "Intervals",
          "Incline walks",
          "Conditioning",
          "Loaded carries",
        ],
      },
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Access", value: "Lifetime" },
      { label: "Training Days", value: "3–5" },
      { label: "Session", value: "45–60 min" },
    ],
    cta: "Buy Now",
    ctaTo: "/contact",
  },
  {
    name: "Muscle Gain",
    tag: "Self-Guided",
    price: "₹5,999",
    period: "one-time payment",
    tagline: "Build size & strength.",
    sections: [
      {
        title: "What's included",
        items: [
          "12 week program",
          "Lifetime access",
          "Spreadsheet",
          "Mobility",
          "Exercise videos",
          "Nutrition guide",
          "Progressive overload framework",
          "Warm-up protocols",
        ],
      },
      {
        title: "Training style",
        items: [
          "Upper Lower",
          "Compound movements",
          "Hypertrophy",
          "Accessory work",
          "Optional cardio",
        ],
      },
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Access", value: "Lifetime" },
      { label: "Training Days", value: "3–5" },
      { label: "Session", value: "60–75 min" },
    ],
    cta: "Buy Now",
    ctaTo: "/contact",
  },
  {
    name: "Hybrid",
    tag: "Best Seller",
    price: "₹6,999",
    period: "one-time payment",
    tagline: "Strength. Engine. Longevity.",
    sections: [
      {
        title: "What's included",
        items: [
          "12 week program",
          "Lifetime access",
          "Spreadsheet",
          "Mobility library",
          "Running guide",
          "Kettlebell sessions",
          "Recovery guide",
          "Nutrition framework",
          "Warm-ups",
          "Exercise library",
        ],
      },
      {
        title: "Training styles",
        items: [
          "3 Days: Full Body / Full Body / Conditioning",
          "4 Days: Upper / Lower / Conditioning / Full Body",
          "5 Days: Upper Strength / Lower Strength / Zone 2 / Upper Hypertrophy / Lower Hypertrophy",
        ],
      },
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Access", value: "Lifetime" },
      { label: "Training Days", value: "3–5" },
      { label: "Session", value: "45–75 min" },
    ],
    cta: "Buy Now",
    ctaTo: "/contact",
  },
  {
    name: "LEAN",
    tag: "90 Day Mentorship · Application Only",
    price: "",
    period: "",
    tagline: "Peak human performance.",
    featured: true,
    sections: [
      {
        title: "What you get",
        items: [
          "Everything in Fat Loss",
          "Everything in Muscle Gain",
          "Everything in Hybrid",
          "Lifetime access to all programs",
          "Weekly 1-on-1 coaching call",
          "Technique reviews",
          "Priority support",
          "Travel nutrition guide",
          "Restaurant guide",
          "Progress dashboard",
          "Supplement guidance",
          "Personalized adjustments",
          "90 days mentorship",
        ],
      },
    ],
    cta: "Apply For Lean",
    ctaTo: "/apply",
  },
];

const FAQ = [
  { q: "Are the programs beginner friendly?", a: "Yes. Each plan scales — Fat Loss and Hybrid both have entry tiers for 3 days a week with full progression as you grow." },
  { q: "Do I need supplements?", a: "No. Supplement guidance is included for clients who want it, but every plan is designed to work without them." },
  { q: "Can vegetarians join?", a: "Absolutely. Nutrition guides include vegetarian and Indian-specific frameworks." },
  { q: "Can I train at home?", a: "Yes — home-based versions of Fat Loss and Hybrid are available on request." },
  { q: "Can I travel?", a: "Travel weeks are planned in. Restaurant and travel guides are included with every program." },
  { q: "How long do I have access?", a: "Lifetime access. LEAN clients get every current and future program forever." },
];

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Programs"
        title="Five paths. One standard."
        subtitle="Start with a consultation, follow a self-guided system, or apply for LEAN — the 90-day 1-on-1 mentorship."
        compact
      />

      <section className="bg-background">
        <div className="container-x py-20 md:py-32 space-y-px bg-border border border-border">
          {PROGRAMS.map((p, i) => (
            <FadeUp key={p.name} delay={Math.min(i * 0.04, 0.12)}>
              <article
                className="grid lg:grid-cols-12 gap-8 lg:gap-16 p-6 sm:p-8 md:p-12 lg:p-16 transition-colors group bg-background text-foreground hover:bg-foreground hover:text-background"
              >
                <header className="lg:col-span-4 flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground group-hover:text-accent">
                    {p.tag}
                  </span>
                  <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.01em] leading-[0.95] break-words">
                    {p.name}
                  </h2>
                  <p className="mt-5 font-serif text-lg sm:text-xl md:text-2xl text-foreground/85 group-hover:text-background/85">
                    {p.tagline}
                  </p>
                  <div className="mt-8">
                    <div className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground group-hover:text-accent">
                      {p.price}
                    </div>
                    {p.period && (
                      <div className="mt-2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground group-hover:text-background/60">
                        {p.period}
                      </div>
                    )}
                  </div>
                  {p.cta === "Buy Now" ? (
                    <Link
                      to="/checkout"
                      search={{ plan: p.name }}
                      className="mt-10 inline-flex w-fit items-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] transition-colors bg-foreground text-background hover:bg-accent group-hover:bg-accent"
                    >
                      {p.cta}
                    </Link>
                  ) : (
                    <Link
                      to={p.ctaTo}
                      className="mt-10 inline-flex w-fit items-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] transition-colors bg-foreground text-background hover:bg-accent group-hover:bg-accent"
                    >
                      {p.cta}
                    </Link>
                  )}
                  {p.intro && (
                    <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground group-hover:text-background/55">
                      {p.intro}
                    </p>
                  )}
                </header>

                <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8 lg:gap-12 min-w-0">
                  {p.sections.map((s) => (
                    <div key={s.title}>
                      <h3 className="text-[10px] uppercase tracking-[0.32em] mb-5 text-muted-foreground group-hover:text-accent">
                        {s.title}
                      </h3>
                      <ul className="space-y-3 text-[15px] leading-relaxed">
                        {s.items.map((it) => (
                          <li key={it} className="flex gap-3">
                            <Check
                              size={14}
                              className="mt-1.5 shrink-0 text-accent"
                            />
                            <span className="text-foreground/80 group-hover:text-background/85">
                              {it}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {p.meta && (
                    <div className="sm:col-span-2">
                      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border group-hover:border-background/15">
                        {p.meta.map((m) => (
                          <div key={m.label}>
                            <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground group-hover:text-background/55">
                              {m.label}
                            </dt>
                            <dd className="mt-2 font-display text-xl text-foreground group-hover:text-background">
                              {m.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="bg-surface border-t border-border">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-2xl mb-16">
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />FAQ</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
              Common questions.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Accordion type="single" collapsible className="max-w-3xl">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="font-display text-2xl md:text-3xl text-left hover:text-accent hover:no-underline py-6 uppercase tracking-[0.01em]">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 text-base pb-6 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      <CTABanner
        eyebrow="Apply"
        title="Ready for LEAN?"
        highlight="LEAN"
        subtitle="LEAN is 90 days of structured, application-only mentorship. Limited spots."
        ctaText="Apply For Lean"
        ctaTo="/apply"
      />
    </>
  );
}
