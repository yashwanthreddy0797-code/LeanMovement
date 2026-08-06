import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { ZoomMark } from "@/components/brand/ZoomMark";
import {
  ABOUT_HERO,
  COACH,
  CONTACT,
  MEMBERSHIP_HERO,
  MEMBERSHIP_STATEMENT,
  PRICING_PLANS,
  PROGRAM_HERO,
} from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About - ${COACH.name} | LEANMOVEMENT` },
      {
        name: "description",
        content: `Meet ${COACH.name}. Live coaching focused on training and nutrition - to get lean, stronger, and healthier without living in the gym.`,
      },
      { property: "og:title", content: `About - ${COACH.name} | LEANMOVEMENT` },
      {
        property: "og:description",
        content: `Live coaching with ${COACH.name}. Training and nutrition - strength, muscle, conditioning, consistency.`,
      },
      { property: "og:image", content: PROGRAM_HERO.src },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    n: "01",
    t: "Consistency over perfection",
    d: "Show up. Progress compounds.",
  },
  {
    n: "02",
    t: "Technique before load",
    d: "Foundations first. Clean movement builds strength, performance, and longevity.",
  },
  {
    n: "03",
    t: "Training that fits life",
    d: "Capable today. Still capable years from now. Training that fits real life.",
  },
];

function AboutPage() {
  const plan = PRICING_PLANS[0];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <header
        className="relative flex flex-col justify-center overflow-hidden bg-black"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        <div className="container-x relative z-10 translate-y-6 md:translate-y-8">
          <FadeUp>
            <h1 className="max-w-4xl font-display text-[2.5rem] uppercase leading-[0.92] tracking-[0.04em] text-white sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem]">
              {MEMBERSHIP_HERO.headline}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
              Live coaching and personalised nutrition.
            </p>
            <div className="mt-9">
              <ZoomMark tone="light" size="sm" label="live" />
            </div>
          </FadeUp>
        </div>
      </header>

      {/* Your coach */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <FadeUp className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                <img
                  src={ABOUT_HERO.src}
                  alt={ABOUT_HERO.alt}
                  width={768}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </FadeUp>

            <FadeUp delay={0.08} className="lg:col-span-7">
              <p className="eyebrow !text-white/45">
                <span className="w-6 h-px bg-accent" />
                Your coach
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-5xl">
                {COACH.name}
              </h2>
              <p className="mt-3 text-base text-white/55 md:text-lg">
                {COACH.title} · {CONTACT.location}
              </p>

              <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/75 md:text-xl md:leading-[1.65]">
                {COACH.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Train with me */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <p className="eyebrow !text-white/45">
              <span className="w-6 h-px bg-accent" />
              The work
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {MEMBERSHIP_STATEMENT.title}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/75 md:text-xl md:leading-[1.65]">
              {MEMBERSHIP_STATEMENT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-black text-white">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              Principles
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              What I stand for
            </h2>
          </FadeUp>
          <div className="mx-auto mt-12 max-w-3xl space-y-10 md:space-y-12">
            {PRINCIPLES.map((p, i) => (
              <FadeUp
                key={p.t}
                delay={i * 0.05}
                className="grid grid-cols-[auto_1fr] gap-5 md:gap-8"
              >
                <span className="font-mono text-xs text-accent pt-1">{p.n}</span>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-[0.06em] md:text-[1.75rem]">
                    {p.t}
                  </h3>
                  <p className="mt-2 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
                    {p.d}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Close → Join */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              Train with <span className="text-accent">{COACH.name.split(" ")[0]}</span>
            </h2>
            <p className="mt-4 mx-auto max-w-md text-center text-base leading-relaxed text-white/70 md:text-lg">
              Live coaching. Training and nutrition. Built for real schedules.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/join"
                search={{ plan: plan.id, email: "", name: "" }}
                className="btn-primary inline-flex"
              >
                Join now · {plan.price}/mo <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
