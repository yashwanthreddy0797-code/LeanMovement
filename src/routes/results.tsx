import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — LEANMOVEMENT" },
      { name: "description", content: "Client transformations, performance metrics and testimonials from LEANMOVEMENT coaching." },
      { property: "og:title", content: "Results — LEANMOVEMENT" },
      { property: "og:description", content: "Real metrics. Real clients. Real consistency." },
    ],
  }),
  component: ResultsPage,
});

const METRICS = [
  { v: "12,400+", l: "Kgs of fat lost" },
  { v: "500+", l: "Clients coached" },
  { v: "92%", l: "12-week completion rate" },
  { v: "6 yrs", l: "Of coaching practice" },
];

const TRANSFORMATIONS = [
  { name: "Arjun · 34", duration: "16 weeks", result: "Lost 11 kg · Bench +20 kg", note: "Hybrid → LEAN" },
  { name: "Priya · 29", duration: "12 weeks", result: "Lost 7 kg · First-ever pull-up", note: "Fat Loss" },
  { name: "Karthik · 41", duration: "24 weeks", result: "Squat 60 → 130 kg", note: "Muscle Gain → LEAN" },
  { name: "Neha · 32", duration: "12 weeks", result: "Lost 5 kg · Half marathon PR", note: "Hybrid" },
  { name: "Rohan · 27", duration: "20 weeks", result: "Deadlift +50 kg · Body recomp", note: "LEAN" },
  { name: "Sana · 36", duration: "12 weeks", result: "Lost 8 kg · Sleeping through night", note: "Fat Loss" },
];

const TESTIMONIALS = [
  {
    quote:
      "I've worked with three coaches before. None of them treated me like an adult. LEANMOVEMENT does. The work is hard. The instruction is clear. The results are obvious.",
    name: "Vikram",
    detail: "Founder · LEAN client",
  },
  {
    quote:
      "Hybrid changed the way I think about training. I'm stronger, leaner, and I actually have energy for my kids at the end of the day.",
    name: "Anika",
    detail: "Hybrid · 12 weeks",
  },
  {
    quote:
      "No fluff. No fads. Just a system that fits into a 60-hour work week. That's all I needed.",
    name: "Saurabh",
    detail: "Muscle Gain · Lifetime client",
  },
];

function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="The Results"
        title="The work. Quietly. Repeatedly."
        subtitle="Real metrics from real clients. Discipline compounds — these numbers are what that looks like."
        compact
      />

      {/* METRICS */}
      <section className="bg-background border-t border-border">
        <div className="container-x py-24 md:py-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {METRICS.map((m, i) => (
              <FadeUp key={m.l} delay={i * 0.06}>
                <div className="bg-background p-10 md:p-12 h-full">
                  <div className="font-display text-5xl md:text-6xl text-foreground tracking-tight">
                    {m.v}
                  </div>
                  <div className="mt-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    {m.l}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="bg-surface border-y border-border">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-3xl mb-16">
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Transformations</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
              A sample of the work.
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {TRANSFORMATIONS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.05}>
                <div className="bg-background p-8 md:p-10 h-full flex flex-col">
                  <div className="aspect-[4/5] bg-surface border border-border grid place-items-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    Before / After
                  </div>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.32em] text-accent">
                    {t.note}
                  </div>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.01em]">
                    {t.name}
                  </h3>
                  <p className="mt-3 text-foreground/80 text-[15px] leading-relaxed flex-1">
                    {t.result}
                  </p>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {t.duration}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-background">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-3xl mb-16">
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />In Their Words</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
              Testimonials.
            </h2>
          </FadeUp>

          <div className="space-y-px bg-border border border-border">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.06}>
                <figure className="bg-background grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">
                  <div className="md:col-span-3">
                    <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                      {t.detail}
                    </div>
                    <div className="mt-3 font-display text-2xl uppercase tracking-[0.01em]">
                      {t.name}
                    </div>
                  </div>
                  <blockquote className="md:col-span-9 font-serif text-2xl md:text-3xl leading-snug text-foreground/90">
                    “{t.quote}”
                  </blockquote>
                </figure>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        eyebrow="Your Turn"
        title="Add your name to this list."
        highlight="name"
        subtitle="Apply for LEAN. 90 days of structured mentorship. Application only. Limited spots."
        ctaText="Apply For Lean"
        ctaTo="/apply"
      />
    </>
  );
}
