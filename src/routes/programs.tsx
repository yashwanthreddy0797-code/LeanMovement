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
      { title: "Programs — LEANMOVEMENT Coaching" },
      { name: "description", content: "Consultation, 1-on-1 Primal coaching, and structured workout plans for every level — from beginner to advanced powerlifting." },
      { property: "og:title", content: "Programs — LEANMOVEMENT" },
      { property: "og:description", content: "Consultation, coaching, and workout plans built for serious training." },
    ],
  }),
  component: ProgramsPage,
});

type Coaching = {
  name: string;
  tag: string;
  price: string;
  period: string;
  highlight?: boolean;
  blurb: string;
  features: string[];
  cta: string;
  ctaTo: string;
  note?: string;
};

const COACHING: Coaching[] = [
  {
    name: "Consultation",
    tag: "30 min call",
    price: "₹4,999",
    period: "one-time",
    blurb: "An in-depth assessment of your current fitness level and a clear roadmap to your goals.",
    features: [
      "30-minute 1-on-1 consultation call",
      "Assessment of your current fitness level",
      "Personalised roadmap to your goals",
      "Answers on fat loss, muscle gain, performance & wellness",
    ],
    cta: "Book a meeting",
    ctaTo: "/contact",
    note: "Consultation fee is adjusted if you opt for the Primal plan.",
  },
  {
    name: "Primal",
    tag: "BEST PROGRAM EVER!",
    price: "₹15,999",
    period: "/ monthly",
    highlight: true,
    blurb: "PEAK HUMAN PERFORMANCE.",
    features: [
      "1 ON 1 COACHING WITH THE FOUNDERS",
      "24x7 AVAILABILITY THROUGH CALL/TEXT",
      "ALL FEATURES OF PRO PROGRAM",
      "ACCESS TO ALL WORKOUT PROGRAMS AND VIDEOS",
    ],
    cta: "Buy now",
    ctaTo: "/contact",
  },
  {
    name: "Primal — 3 Month",
    tag: "Extended commitment",
    price: "₹40,000",
    period: "/ 3 months",
    blurb: "Exceptional value for an extended commitment to your fitness journey.",
    features: [
      "1-on-1 support & consultation",
      "24×7 availability via call / text",
      "All features of the Pro program",
      "Access to all workout programs & videos",
    ],
    cta: "Buy now",
    ctaTo: "/contact",
  },
];

type WorkoutPlan = {
  name: string;
  tag: string;
  price: string;
  blurb: string;
  included: string[];
  meta: { label: string; value: string }[];
  featured?: boolean;
};

const PLANS: WorkoutPlan[] = [
  {
    name: "Primal",
    tag: "1-on-1 Coaching",
    price: "₹15,999 / month",
    featured: true,
    blurb: "Peak human performance. Direct coaching with the founders.",
    included: [
      "1-on-1 coaching with the founders",
      "24×7 availability via call / text",
      "All features of the Pro program",
      "Access to all workout programs & videos",
    ],
    meta: [
      { label: "Format", value: "Ongoing" },
      { label: "Experience", value: "All levels" },
    ],
  },
  {
    name: "Beginner",
    tag: "Essentials",
    price: "₹2,999",
    blurb: "Build your base with a structured introduction to training.",
    included: ["PDF program", "Spreadsheet for tracking", "Mobility routine"],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Time", value: "45 min" },
      { label: "Goal", value: "General physical preparedness" },
      { label: "Experience", value: "Beginner" },
      { label: "Days / week", value: "2 / 3 / 4 / 5" },
    ],
  },
  {
    name: "Push Pull Legs",
    tag: "Hybrid System",
    price: "₹2,999",
    blurb: "A proven split for hypertrophy and strength.",
    included: [
      "PDF program",
      "Spreadsheet for tracking",
      "Mobility routine video",
      "SBD technique videos",
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Time", value: "45–60 min" },
      { label: "Goal", value: "Hypertrophy & strength" },
      { label: "Experience", value: "Intermediate to advanced" },
      { label: "Days / week", value: "3 / 4 / 5 / 6" },
    ],
  },
  {
    name: "Upper Lower",
    tag: "Size & Strength",
    price: "₹2,999",
    blurb: "Balanced upper/lower split for serious size and strength.",
    included: ["PDF program", "Spreadsheet for tracking", "Mobility routine video"],
    meta: [
      { label: "Duration", value: "8 weeks" },
      { label: "Time", value: "60 min" },
      { label: "Goal", value: "Hypertrophy & strength" },
      { label: "Experience", value: "Intermediate to advanced" },
      { label: "Days / week", value: "2 / 4 / 6" },
    ],
  },
  {
    name: "Powerbuilding",
    tag: "Peak Strength & Conditioning",
    price: "₹3,999",
    blurb: "Strength, size and conditioning in one disciplined program.",
    included: [
      "PDF program",
      "Spreadsheet for tracking",
      "SBD technique videos",
      "Mobility routine videos",
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Time", value: "90 min" },
      { label: "Goal", value: "Strength & conditioning" },
      { label: "Experience", value: "Advanced" },
      { label: "Days / week", value: "4 / 5" },
    ],
  },
  {
    name: "Powerlifting 1.0",
    tag: "All About Strength",
    price: "₹4,999",
    blurb: "Max poundage on squat, bench and deadlift in 12 weeks.",
    included: [
      "PDF program",
      "Spreadsheet for tracking",
      "Monthly follow-up",
      "Customisation: Squat / Bench / Deadlift",
      "SBD technique videos (in detail)",
      "Mobility routine video",
    ],
    meta: [
      { label: "Duration", value: "12 weeks" },
      { label: "Time", value: "100–120 min" },
      { label: "Goal", value: "Max poundage in 12 weeks" },
      { label: "Experience", value: "Advanced" },
      { label: "Days / week", value: "4 / 5" },
    ],
  },
];

const FAQ = [
  { q: "How is the coaching delivered?", a: "Programming, tracking and daily communication run through a private channel. Video calls happen on Zoom based on your tier." },
  { q: "Do I need a gym membership?", a: "Most plans assume gym access, but home-based versions are available on request. We'll figure out the right setup on your consultation call." },
  { q: "What if I travel for work?", a: "Travel weeks are planned in. We adjust training and nutrition around hotel gyms, restaurants and time zones." },
  { q: "How quickly will I see results?", a: "Body composition shifts visibly in 6–8 weeks for most clients. Strength and performance markers improve from week one if the work is consistent." },
  { q: "Can I switch plans later?", a: "Yes — you can upgrade or downgrade at the start of any billing cycle. No lock-ins beyond your current month." },
];

function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Programs"
        title="Coaching & Workout Plans."
        subtitle="Start with a consultation, commit to 1-on-1 coaching, or follow a structured program built for your level."
        compact
      />

      {/* CONSULTATION + PRIMAL */}
      <section className="bg-white text-black">
        <div className="container-x py-20 md:py-28">
          <FadeUp className="mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />Coaching
            </span>
            <h2 className="font-display text-5xl mt-6">Direct Access.</h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-5">
            {COACHING.map((p, i) => {
              const dark = p.highlight;
              return (
                <FadeUp key={p.name} delay={i * 0.08}>
                  <div
                    className={`flex flex-col h-full p-8 border transition-all hover:-translate-y-1 duration-500 ${
                      dark
                        ? "bg-black text-white border-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
                        : "bg-white text-black border-black/10 hover:border-accent shadow-[0_8px_40px_-20px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <span className={`text-[11px] uppercase tracking-[0.25em] ${dark ? "text-white/70" : "text-black/55"}`}>
                      {p.tag}
                    </span>
                    <h3 className="font-display text-4xl mt-2">{p.name}</h3>
                    <div className={`my-6 h-px ${dark ? "bg-white/20" : "bg-black/10"}`} />
                    <p className={`text-sm ${dark ? "text-white/80" : "text-black/75"}`}>{p.blurb}</p>
                    <ul className="space-y-2 text-sm mt-6 flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check size={14} className="text-accent mt-1 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <div className="font-display text-4xl text-accent">{p.price}</div>
                      <div className={`text-[11px] uppercase tracking-[0.25em] mt-1 ${dark ? "text-white/70" : "text-black/55"}`}>
                        {p.period}
                      </div>
                    </div>
                    <Link
                      to={p.ctaTo}
                      className={`mt-6 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                        dark
                          ? "bg-accent text-white hover:bg-white hover:text-black"
                          : "bg-accent text-white hover:bg-black"
                      }`}
                    >
                      {p.cta}
                    </Link>
                    {p.note && (
                      <p className={`mt-4 text-[11px] uppercase tracking-[0.18em] ${dark ? "text-white/55" : "text-black/50"}`}>
                        {p.note}
                      </p>
                    )}
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKOUT PLANS */}
      <section className="bg-white text-black border-t border-black/10">
        <div className="container-x py-24">
          <FadeUp className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
                <span className="w-8 h-px bg-accent" />Workout Plans
              </span>
              <h2 className="font-display text-5xl mt-6">Train With Structure.</h2>
            </div>
            <p className="text-sm text-black/65 max-w-sm">
              Self-guided programs for every level. PDF + spreadsheet delivery, technique videos where it matters.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLANS.map((p, i) => {
              const dark = p.featured;
              return (
                <FadeUp key={p.name} delay={i * 0.06}>
                  <div
                    className={`flex flex-col h-full p-8 border transition-all hover:-translate-y-1 duration-500 ${
                      dark
                        ? "bg-black text-white border-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
                        : "bg-white text-black border-black/10 hover:border-accent shadow-[0_8px_40px_-20px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    <span className={`text-[11px] uppercase tracking-[0.25em] ${dark ? "text-white/70" : "text-black/55"}`}>
                      {p.tag}
                    </span>
                    <h3 className="font-display text-3xl mt-2">{p.name}</h3>
                    <div className={`my-5 h-px ${dark ? "bg-white/20" : "bg-black/10"}`} />
                    <p className={`text-sm ${dark ? "text-white/80" : "text-black/75"}`}>{p.blurb}</p>

                    <div className="mt-6">
                      <div className={`text-[11px] uppercase tracking-[0.25em] mb-3 ${dark ? "text-white/55" : "text-black/55"}`}>
                        What's included
                      </div>
                      <ul className="space-y-2 text-sm">
                        {p.included.map((f) => (
                          <li key={f} className="flex gap-2">
                            <Check size={14} className="text-accent mt-1 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <dl className={`mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t pt-6 ${dark ? "border-white/15" : "border-black/10"}`}>
                      {p.meta.map((m) => (
                        <div key={m.label}>
                          <dt className={`text-[10px] uppercase tracking-[0.22em] ${dark ? "text-white/55" : "text-black/50"}`}>
                            {m.label}
                          </dt>
                          <dd className={dark ? "text-white" : "text-black/85"}>{m.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-8 flex-1" />
                    <div className="font-display text-3xl text-accent">{p.price}</div>
                    <Link
                      to="/contact"
                      className={`mt-5 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                        dark
                          ? "bg-accent text-white hover:bg-white hover:text-black"
                          : "bg-accent text-white hover:bg-black"
                      }`}
                    >
                      Buy now
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white text-black border-t border-black/10">
        <div className="container-x py-24">
          <FadeUp className="max-w-2xl mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />FAQ
            </span>
            <h2 className="font-display text-5xl mt-6">Common Questions.</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Accordion type="single" collapsible className="max-w-3xl">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-black/10">
                  <AccordionTrigger className="font-display text-2xl md:text-3xl text-left text-black hover:text-accent hover:no-underline py-6">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-black/70 text-base pb-6">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      <CTABanner
        eyebrow="Not Sure Yet?"
        title="Not sure which program?"
        highlight="program"
        subtitle="Book a consultation. We'll match you to the right path."
      />
    </>
  );
}
