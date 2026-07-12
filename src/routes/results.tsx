import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";
import { TESTIMONIALS } from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — LEANMOVEMENT" },
      { name: "description", content: "Client transformations and testimonials from LEANMOVEMENT coaching." },
      { property: "og:title", content: "Results — LEANMOVEMENT" },
      { property: "og:description", content: "Real consistency. Real results." },
    ],
  }),
  component: ResultsPage,
});

const METRICS = [
  { v: "500+", l: "Members coached" },
  { v: "92%", l: "12-week completion" },
  { v: "6 yrs", l: "Coaching practice" },
];

function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Results"
        title="The work. Repeatedly."
        subtitle="Consistency compounds — these are the members who showed up."
        compact
      />

      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <div className="grid grid-cols-3 gap-10 lg:gap-14 max-w-2xl">
            {METRICS.map((m) => (
              <FadeUp key={m.l}>
                <div className="font-display text-3xl md:text-[2.5rem] leading-none tracking-[0.04em]">{m.v}</div>
                <div className="mt-3 type-meta">{m.l}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x section-y">
          <FadeUp className="section-head mb-12">
            <p className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              In their words
            </p>
            <h2 className="type-h2 stack-head">Testimonials.</h2>
          </FadeUp>

          <div className="space-y-14 max-w-3xl">
            {TESTIMONIALS.map((t) => (
              <FadeUp key={t.name}>
                <figure>
                  <blockquote className="type-quote max-w-none border-l-2 border-accent pl-6 md:pl-8">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 type-meta">
                    <span className="text-foreground">{t.name}</span>
                    <span> · {t.detail}</span>
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Train live with us."
        highlight="live"
        subtitle="12 coached sessions per month."
        ctaText="Join now"
        ctaTo="/join"
      />
    </>
  );
}
