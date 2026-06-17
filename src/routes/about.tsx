import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Repeat, UserCog } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LEANMOVEMENT Coaching" },
      { name: "description", content: "Meet the coach. Six years of evidence-based training and over 500 clients later, the philosophy hasn't changed: train on your own terms." },
      { property: "og:title", content: "About — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Meet your coach. Science-first, no-fluff online fitness coaching." },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  { t: "Train For Life", d: "Strength, capacity, longevity. Aesthetics follow." },
  { t: "Consistency Over Intensity", d: "The plan you repeat for a decade beats the one you abandon in eight weeks." },
  { t: "Health Creates Freedom", d: "Fitness gives back to every other corner of your life." },
  { t: "Build An Engine", d: "Conditioning, strength, mobility — designed to compound." },
  { t: "Educate · Empower · Execute", d: "You learn the why. You leave self-sufficient. The work decides everything." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="LEANMOVEMENT."
        subtitle="A simple belief: fitness should create freedom, not dependency."
        compact
      />

      {/* STORY */}
      <section className="bg-background border-t border-border">
        <div className="container-x py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24">
            <FadeUp className="md:col-span-5">
              <div className="eyebrow"><span className="w-6 h-px bg-accent" />The Story</div>
              <h2 className="mt-8 font-display text-4xl md:text-5xl uppercase tracking-[0.01em] leading-[1.02]">
                Built around a simple belief.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="md:col-span-6 md:col-start-7 space-y-6 text-foreground/75 leading-relaxed text-lg">
              <p>
                LEANMOVEMENT was built around a simple belief — fitness should create freedom,
                not dependency.
              </p>
              <p>No gimmicks. No detoxes. No unnecessary restrictions.</p>
              <p>
                Only systems that fit into real life. For busy professionals. Entrepreneurs.
                Athletes. People wanting structure. People wanting longevity.
              </p>
              <p>
                The training shifts. The principles don't.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-surface border-y border-border">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-2xl mb-16">
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Principles</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
              What we stand for.
            </h2>
          </FadeUp>
          <div className="divide-y divide-border border-y border-border">
            {PRINCIPLES.map((p, i) => (
              <FadeUp key={p.t} delay={i * 0.05}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-12 py-10 md:py-12 items-baseline">
                  <div className="md:col-span-1 font-mono text-xs text-muted-foreground tracking-widest">
                    0{i + 1}
                  </div>
                  <h3 className="md:col-span-5 font-display text-2xl md:text-4xl uppercase tracking-[0.01em]">
                    {p.t}
                  </h3>
                  <p className="md:col-span-6 text-foreground/70 text-base md:text-lg leading-relaxed">
                    {p.d}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        eyebrow="Apply"
        title="Ready for LEAN?"
        highlight="LEAN"
        subtitle="90 days. Application only. Limited spots."
        ctaText="Apply For Lean"
        ctaTo="/apply"
      />
    </>
  );
}

