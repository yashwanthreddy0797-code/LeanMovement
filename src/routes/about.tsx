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
        content: `Meet ${COACH.name}, ${COACH.title.toLowerCase()} at LEANMOVEMENT. Live kettlebell coaching for busy professionals.`,
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
  { t: "Consistency over intensity", d: "The plan you repeat beats the one you abandon." },
  { t: "Technique before load", d: "Foundations first. Progression follows." },
  { t: "Fitness creates freedom", d: "Training should give back to every part of your life." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="LEANMOVEMENT."
        subtitle="Fitness should create freedom — not dependency."
        compact
      />

      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-start max-w-5xl">
            <FadeUp className="md:col-span-5">
              <p className="eyebrow">
                <span className="w-6 h-px bg-accent" />
                The story
              </p>
              <h2 className="type-h2 stack-head">Built for real schedules.</h2>
            </FadeUp>
            <FadeUp delay={0.08} className="md:col-span-7 space-y-5 type-lead !max-w-none">
              <p>
                LEANMOVEMENT is a live coaching membership for busy professionals — no gimmicks,
                no detoxes, no unnecessary restrictions.
              </p>
              <p>Only systems that fit into real life. The training shifts. The principles don&apos;t.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background border-b border-border">
        <div className="container-x section-y">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <FadeUp className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                <img
                  src={COACH_IMAGE_DEFAULT}
                  srcSet={`${coachImageUrl(640)} 640w, ${coachImageUrl(960)} 960w, ${coachImageUrl(1280)} 1280w`}
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  alt={COACH.image.alt}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
            </FadeUp>

            <FadeUp delay={0.08} className="lg:col-span-7">
              <p className="eyebrow text-background/45">
                <span className="w-6 h-px bg-accent" />
                Your coach
              </p>
              <h2 className="type-h2 text-background stack-head">{COACH.name}</h2>
              <p className="mt-3 text-sm text-background/50">{COACH.title}</p>

              <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-background/75">
                {COACH.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-8 text-sm text-background/50">{COACH.credentials.join(" · ")}</p>

              <Link
                to="/join"
                search={{ plan: "standard", email: "", name: "" }}
                className="btn-primary bg-accent hover:bg-background hover:text-foreground stack-head"
              >
                Train with {COACH.name.split(" ")[0]} <ArrowRight size={14} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-surface border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="section-head mb-10">
            <p className="eyebrow">
              <span className="w-6 h-px bg-accent" />
              Principles
            </p>
            <h2 className="type-h2 stack-head">What we stand for.</h2>
          </FadeUp>
          <div className="divide-y divide-border max-w-2xl">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="py-7 first:pt-0 last:pb-0">
                <h3 className="type-h3 !text-[1.25rem]">{p.t}</h3>
                <p className="mt-3 type-body">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready to train?"
        highlight="train"
        subtitle="Live kettlebell coaching · 3× per week."
        ctaText="Join now"
        ctaTo="/join"
      />
    </>
  );
}
