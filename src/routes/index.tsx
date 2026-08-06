import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ZoomMark } from "@/components/brand/ZoomMark";
import {
  HOME_CLOSING,
  HOME_HERO,
  HOME_INCLUDED,
  HOME_JOURNEY,
  HOME_STATEMENT,
  PRICING_PLANS,
  SESSION_SCHEDULE,
} from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lean Movement - Live Coaching Membership | LEANMOVEMENT" },
      {
        name: "description",
        content:
          "Evidence-based coaching to get lean, stronger, and healthier - without living in the gym. Live sessions Tue / Thu / Sat · 6–7 AM IST. Nutrition included. ₹6,969/mo.",
      },
      { property: "og:title", content: "Lean Movement - LEANMOVEMENT" },
      {
        property: "og:description",
        content:
          "Live coaching three mornings a week. Personalised training and nutrition. Strength. Conditioning. Consistency.",
      },
      { property: "og:image", content: "/brand/lean-movement-wordmark.png" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const plan = PRICING_PLANS[0];
  const schedule = SESSION_SCHEDULE.batches[0];

  return (
    <div className="bg-background text-foreground">
      {/* Hero — wordmark upper zone, copy + CTA lower zone (no overlap) */}
      <header
        className="relative grid min-h-[100dvh] max-h-[100dvh] grid-rows-[minmax(0,1.2fr)_auto] gap-5 overflow-hidden bg-black md:grid-rows-[minmax(0,1.35fr)_auto] md:gap-8"
      >
        <div
          className="flex min-h-0 items-end justify-center px-5 pt-20 pb-0 sm:px-8 md:pt-28 md:pb-2"
          aria-hidden
        >
          <img
            src="/brand/lean-movement-wordmark.png"
            alt=""
            className="h-auto w-full max-w-[min(92vw,640px)] max-h-[min(34vh,280px)] object-contain object-bottom sm:max-w-[min(90vw,700px)] sm:max-h-[min(36vh,320px)] md:max-w-[760px] md:max-h-[min(46vh,440px)] md:translate-y-20 lg:max-w-[840px] lg:max-h-[min(48vh,480px)] lg:translate-y-24"
            fetchPriority="high"
          />
        </div>
        <div className="relative z-10 shrink-0 bg-black pb-10 pt-0 shadow-[0_-40px_80px_rgba(0,0,0,0.9)] md:pb-16">
          <div className="container-x">
            <FadeUp>
              <h1 className="max-w-4xl font-display text-[3rem] uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-[4.25rem] md:text-[5rem] lg:text-[5.5rem]">
                Train live.
                <br />
                <span className="text-accent">Stay lean.</span>
              </h1>
            <div className="mt-5 space-y-1 text-base leading-relaxed text-white/75 md:text-lg">
              <p>{HOME_HERO.sessionsLine}</p>
              <p>{HOME_HERO.sublines.join(" ")}</p>
            </div>
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
              <ZoomMark tone="light" size="sm" label="live" />
            </div>
          </FadeUp>
          </div>
        </div>
      </header>

      {/* Why this exists */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-3xl">
            <h2 className="font-display text-[2.25rem] uppercase leading-[0.95] tracking-[0.04em] sm:text-4xl md:text-5xl">
              {HOME_STATEMENT.titleLines[0]}
              <br />
              {HOME_STATEMENT.titleLines[1]}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.65]">
              {HOME_STATEMENT.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Offer + schedule - one section */}
      <section className="bg-black text-white">
        <div className="container-x section-y-sm">
          <div className="mx-auto grid max-w-5xl gap-14 lg:grid-cols-12 lg:gap-16">
            <FadeUp className="lg:col-span-7">
              <p className="eyebrow !text-white/45">
                <span className="w-6 h-px bg-accent" />
                What you get
              </p>
              <ul className="mt-8 space-y-5 md:space-y-6">
                {HOME_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-white/85 md:text-lg"
                  >
                    <Check size={16} className="mt-1 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
            <FadeUp delay={0.06} className="lg:col-span-5">
              <p className="eyebrow !text-white/45">
                <span className="w-6 h-px bg-accent" />
                Schedule
              </p>
              <h2 className="mt-4 font-display text-2xl uppercase tracking-[0.06em] md:text-3xl">
                {schedule.day}
              </h2>
              <p className="mt-3 font-display text-xl text-accent md:text-2xl">
                {schedule.time} IST
              </p>
              <p className="mt-5 text-base leading-relaxed text-white/65">
                One hour. Before work. Strength and conditioning.
              </p>
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent hover:text-white"
              >
                Meet the coach <ArrowRight size={13} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-black text-white">
        <div className="container-x section-y-sm">
          <FadeUp className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              Clear process. Real coaching.
            </h2>
          </FadeUp>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3 md:gap-10">
            {HOME_JOURNEY.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.05}>
                <p className="font-mono text-xs text-accent">{step.n}</p>
                <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.06em]">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/65">{step.detail}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Price → Join */}
      <section id="pricing" className="scroll-mt-24 bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <p className="eyebrow justify-center !text-white/45">
              <span className="w-6 h-px bg-accent" />
              {plan.name}
            </p>
            <p className="mt-6 font-display text-5xl text-accent md:text-6xl">{plan.price}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/45">{plan.period}</p>
            <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
              {plan.description}
            </p>
            <Link
              to="/join"
              search={{ plan: plan.id, email: "", name: "" }}
              className="btn-primary mt-10 inline-flex"
            >
              Join now <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Close */}
      <section className="bg-black text-white">
        <div className="container-x section-y">
          <FadeUp className="mx-auto max-w-xl text-center">
            <BrandLogo className="mx-auto items-center text-[1.5rem] text-white/80" />
            <h2 className="mt-5 font-display text-3xl uppercase tracking-[0.06em] md:text-4xl">
              {HOME_CLOSING.headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
              {HOME_CLOSING.subline}
            </p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="btn-primary mt-8 inline-flex"
            >
              Join now <ArrowRight size={13} />
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
