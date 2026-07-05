import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";
import { COACH, COACH_IMAGE_DEFAULT, coachImageUrl } from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${COACH.name} | LEANMOVEMENT` },
      {
        name: "description",
        content: `Meet ${COACH.name}, ${COACH.title.toLowerCase()} at LEANMOVEMENT. Live kettlebell coaching for busy professionals who want structure, technique, and real results.`,
      },
      { property: "og:title", content: `About — ${COACH.name} | LEANMOVEMENT` },
      {
        property: "og:description",
        content: `Train live with ${COACH.name}. Strength-first kettlebell coaching built for real schedules.`,
      },
      { property: "og:image", content: coachImageUrl(1200) },
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

      {/* COACH */}
      <section className="bg-foreground text-background border-t border-border">
        <div className="container-x py-16 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <FadeUp className="lg:col-span-5">
              <div className="relative lg:pr-3 lg:pb-3">
                <div
                  className="absolute bottom-0 right-0 left-3 top-3 border border-accent/30 pointer-events-none hidden lg:block"
                  aria-hidden
                />
                <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={COACH_IMAGE_DEFAULT}
                    srcSet={`${coachImageUrl(640)} 640w, ${coachImageUrl(960)} 960w, ${coachImageUrl(1280)} 1280w, ${coachImageUrl(1600)} 1600w`}
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    alt={COACH.image.alt}
                    width={1200}
                    height={1500}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center scale-[1.02] saturate-[0.92] contrast-[1.06] brightness-[0.94]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">{COACH.location}</p>
                    <p className="mt-1 font-display text-2xl uppercase tracking-[0.02em]">{COACH.name}</p>
                  </div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.08} className="lg:col-span-7">
              <div className="eyebrow text-background/45">
                <span className="w-6 h-px bg-accent" />
                Your Coach
              </div>
              <h2 className="mt-6 font-display text-4xl md:text-5xl uppercase tracking-[0.01em] leading-[0.95]">
                {COACH.name.split(" ")[0]}
                <br />
                <span className="text-accent">{COACH.name.split(" ").slice(1).join(" ")}</span>
              </h2>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-background/50">{COACH.title}</p>

              <div className="mt-8 space-y-5 text-background/75 leading-relaxed text-base md:text-lg">
                {COACH.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                {COACH.credentials.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-background/60 border border-background/10 px-4 py-3 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/join"
                search={{ plan: "standard", email: "", name: "" }}
                className="mt-10 inline-flex items-center gap-2 px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-accent text-white hover:bg-background hover:text-foreground transition-colors"
              >
                Train with {COACH.name.split(" ")[0]} <ArrowRight size={14} />
              </Link>
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
        subtitle="Live kettlebell coaching · 3× per week · Limited spots."
        ctaText="Join Now"
        ctaTo="/join"
      />
    </>
  );
}
