import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { ZoomMark } from "@/components/brand/ZoomMark";
import {
  BRAND,
  COHORT,
  HOME_CLOSING,
  HOME_HERO,
  HOME_INCLUDED,
  HOME_JOURNEY,
  HOME_QUOTE,
  HOME_STATEMENT,
  PRICING_PLANS,
  PROGRAM_GALLERY,
  SESSION_SCHEDULE,
  WHO_ITS_FOR,
} from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lean Movement — Live Coaching Membership | LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Train live. Stay lean. Three live kettlebell coaching sessions every week — Tue / Thu / Sat · 6–7 AM IST. ₹6,999/mo.",
      },
      { property: "og:title", content: "Lean Movement — LEANMOVEMENT" },
      {
        property: "og:description",
        content:
          "Live coaching three mornings a week. Build strength, improve endurance, stay lean.",
      },
      { property: "og:image", content: "/images/programs/kb-hero.webp" },
    ],
  }),
  component: HomePage,
});

const HOME_GALLERY = [
  PROGRAM_GALLERY[0],
  PROGRAM_GALLERY[1],
  { src: "/images/programs/kb-02.webp", alt: "Athlete mid kettlebell swing" },
  PROGRAM_GALLERY[2],
] as const;

function HomePage() {
  const plan = PRICING_PLANS[0];
  const schedule = SESSION_SCHEDULE.batches[0];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <header
        className="relative flex flex-col justify-end overflow-hidden bg-black"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        <img
          src="/images/programs/kb-hero.webp"
          alt="Athlete gripping a kettlebell handle"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="container-x relative z-10 pb-12 pt-28 md:pb-16 md:pt-32">
          <FadeUp>
            <p className="font-display text-sm tracking-[0.28em] text-white/70 md:text-base">
              {BRAND.name}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[3.25rem] uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]">
              Train live.
              <br />
              <span className="text-accent">Stay lean.</span>
            </h1>
            <div className="mt-5 max-w-lg space-y-1 text-base leading-relaxed text-white/75 md:text-lg">
              {HOME_HERO.sublines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <p className="mt-4 text-sm uppercase tracking-[0.14em] text-white/55">
              {HOME_HERO.sessionsLine}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/join"
                search={{ plan: "standard", email: "", name: "" }}
                className="btn-primary inline-flex"
              >
                Join now <ArrowRight size={13} />
              </Link>
              <span className="font-display text-2xl text-white md:text-3xl">{plan.price}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-white/45">{plan.period}</span>
              <ZoomMark tone="light" size="sm" label="live sessions" />
            </div>
          </FadeUp>
        </div>
      </header>

      {/* Statement — brand pitch only */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-[2.25rem] uppercase leading-[0.95] tracking-[0.04em] sm:text-4xl md:text-5xl">
              {HOME_STATEMENT.title}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.65]">
              {HOME_STATEMENT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Included teaser — short; full list on Membership */}
      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="w-6 h-px bg-accent" />
              At a glance
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              What you get
            </h2>
            <ul className="mt-10 grid gap-3 text-left sm:grid-cols-2">
              {HOME_INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-border pt-5 text-base leading-relaxed text-foreground/85 md:text-lg"
                >
                  <Check size={16} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/programs"
              className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent hover:text-foreground"
            >
              Full membership details <ArrowRight size={13} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Schedule teaser */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              Schedule
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {schedule.day}
            </h2>
            <p className="mt-4 font-display text-2xl text-accent md:text-3xl">{schedule.time} IST</p>
            <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
              Train before work. Start your day with intent.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Journey teaser — unique to home; detail on Membership */}
      <section className="border-b border-border">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="w-6 h-px bg-accent" />
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              Simple path. Real coaching.
            </h2>
          </FadeUp>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3 md:gap-10">
            {HOME_JOURNEY.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.05}>
                <p className="font-mono text-xs text-accent">{step.n}</p>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.06em]">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/70">{step.detail}</p>
              </FadeUp>
            ))}
          </div>
          <FadeUp className="mt-10 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent hover:text-foreground"
            >
              See foundations, nutrition &amp; gear <ArrowRight size={13} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Who it's for — audience lives on home only */}
      <section className="border-b border-border bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {WHO_ITS_FOR.title}
            </h2>
            <ul className="mt-8 grid gap-3.5 sm:grid-cols-2">
              {WHO_ITS_FOR.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-white/75 md:text-[1.0625rem]"
                >
                  <Check size={16} className="mt-1 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* Quote */}
      <section className="border-b border-border">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <blockquote className="font-display text-2xl uppercase leading-[1.15] tracking-[0.04em] md:text-3xl">
              &ldquo;{HOME_QUOTE.text}&rdquo;
            </blockquote>
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              — {HOME_QUOTE.author}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="border-b border-border scroll-mt-24 bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              {plan.name}
            </p>
            <p className="mt-6 font-display text-5xl text-accent md:text-6xl">{plan.price}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/45">{plan.period}</p>
            <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">{plan.description}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/40">Cancel anytime</p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/join"
                search={{ plan: plan.id, email: "", name: "" }}
                className="btn-primary inline-flex"
              >
                Join now <ArrowRight size={13} />
              </Link>
              <Link
                to="/programs"
                className="text-xs uppercase tracking-[0.12em] text-white/50 hover:text-white"
              >
                View program details →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {HOME_GALLERY.map((img) => (
          <div key={img.src} className="relative aspect-[3/4] overflow-hidden bg-black">
            <img
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 hover:scale-105 hover:opacity-100"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Close */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <p className="font-display text-sm tracking-[0.28em] text-white/50">{BRAND.name}</p>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {HOME_CLOSING.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">{HOME_CLOSING.subline}</p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="btn-primary mt-8 inline-flex"
            >
              Join now · {plan.price}/mo <ArrowRight size={13} />
            </Link>
            <p className="mt-6 text-xs text-white/40">{COHORT.note}</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
