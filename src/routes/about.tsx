import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { ZoomMark } from "@/components/brand/ZoomMark";
import {
  ABOUT_HERO,
  COACH,
  CONTACT,
  PRICING_PLANS,
  TESTIMONIALS,
} from "@/lib/lean-kettlebell";

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
      { property: "og:image", content: ABOUT_HERO.src },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    n: "01",
    t: "Consistency over intensity",
    d: "Show up three mornings a week — Tue, Thu, Sat. Progress compounds.",
  },
  {
    n: "02",
    t: "Technique before load",
    d: "Foundations first. Clean movement unlocks strength, endurance, and longevity.",
  },
  {
    n: "03",
    t: "Fitness creates freedom",
    d: "Training should give energy back to work, family, and life — not take it away.",
  },
];

function AboutPage() {
  const plan = PRICING_PLANS[0];
  const quote = TESTIMONIALS[0];

  return (
    <div className="bg-background text-foreground">
      {/* Exact one-screen hero — no next-section peek */}
      <header
        className="relative flex flex-col justify-end overflow-hidden"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        <img
          src={ABOUT_HERO.src}
          alt={ABOUT_HERO.alt}
          className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/30" />
        <div className="container-x relative z-10 pb-12 pt-28 md:pb-16 md:pt-32">
          <FadeUp>
            <p className="font-display text-sm tracking-[0.28em] text-white/70 md:text-base">
              LEANMOVEMENT
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[3.25rem] uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-[4.25rem] md:text-[5.5rem] lg:text-[6.25rem]">
              Built for
              <br />
              real life.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
              Fitness should create freedom — not dependency. Live kettlebell coaching for busy
              professionals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/join"
                search={{ plan: plan.id, email: "", name: "" }}
                className="inline-flex items-center gap-2 bg-accent px-7 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white hover:opacity-90"
              >
                Join now <ArrowRight size={13} />
              </Link>
              <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                {COACH.name} · {CONTACT.location}
              </p>
            </div>
          </FadeUp>
        </div>
      </header>

      {/* Story — tight editorial */}
      <section className="border-b border-border">
        <div className="container-x py-14 md:py-16">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="w-6 h-px bg-accent" />
              The story
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl lg:text-[2.75rem]">
              No gimmicks. Just systems that fit.
            </h2>
            <p className="mt-6 type-lead mx-auto max-w-2xl !text-center">
              LEANMOVEMENT is a live coaching membership — no detoxes, no PDF plans, no unnecessary
              restrictions. Only training that works inside a real schedule.
            </p>
            <div className="mt-6 flex justify-center">
              <ZoomMark size="md" label="live coaching" />
            </div>
            <p className="mt-4 type-body mx-auto max-w-xl text-center">
              The sessions shift. The principles don&apos;t.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Coach — full-bleed dark feature */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x py-14 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <FadeUp className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111111]">
                <img
                  src={ABOUT_HERO.src}
                  alt={COACH.image.alt}
                  width={1200}
                  height={1500}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
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
              <p className="mt-3 text-sm text-white/50">
                {COACH.title} · {CONTACT.location}
              </p>

              <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-white/75">
                {COACH.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <p className="mt-8 text-sm text-white/45">{COACH.credentials.join(" · ")}</p>

              <Link
                to="/join"
                search={{ plan: plan.id, email: "", name: "" }}
                className="mt-10 inline-flex items-center gap-2 bg-accent px-7 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white hover:opacity-90"
              >
                Train with {COACH.name.split(" ")[0]} <ArrowRight size={13} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="border-b border-border bg-surface">
        <div className="container-x py-14 md:py-16">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <blockquote className="font-display text-2xl uppercase leading-[1.15] tracking-[0.04em] text-foreground md:text-3xl">
              &ldquo;{quote.quote}&rdquo;
            </blockquote>
            <p className="mt-8 type-meta text-muted-foreground">
              — {quote.name} · {quote.detail}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Principles — solid, not sparse */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x py-14 md:py-16">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              Principles
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              What we stand for
            </h2>
          </FadeUp>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10">
            {PRINCIPLES.map((p, i) => (
              <FadeUp
                key={p.t}
                delay={i * 0.05}
                className="grid grid-cols-[auto_1fr] gap-5 py-8 md:gap-8 md:py-9"
              >
                <span className="font-mono text-xs text-accent pt-1">{p.n}</span>
                <div>
                  <h3 className="font-display text-2xl uppercase tracking-[0.06em] md:text-[1.75rem]">
                    {p.t}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65">{p.d}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="border-t border-border bg-background">
        <div className="container-x py-14 md:py-16">
          <FadeUp className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              Ready to <span className="text-accent">train</span>?
            </h2>
            <p className="mt-4 mx-auto max-w-md text-center text-base leading-relaxed text-foreground/70 md:text-lg">
              Live kettlebell coaching · 3× per week · {plan.price}/mo
            </p>
            <Link
              to="/join"
              search={{ plan: plan.id, email: "", name: "" }}
              className="btn-primary mt-8 inline-flex"
            >
              Join now <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
