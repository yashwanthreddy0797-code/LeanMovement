import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ClipboardList,
  Target,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  FlaskConical,
  Briefcase,
  Headphones,
  UserCog,
  Infinity as InfinityIcon,
} from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { Ticker } from "@/components/site/Ticker";
import { PlanCard, CORE_PLANS } from "@/components/site/PlanCard";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEANMOVEMENT — Premium Online Body Transformation Coaching" },
      {
        name: "description",
        content:
          "High-accountability online coaching for ambitious professionals. Custom training, personalised nutrition, weekly check-ins, lasting transformation.",
      },
      { property: "og:title", content: "LEANMOVEMENT — Premium Online Body Transformation Coaching" },
      {
        property: "og:description",
        content: "Premium online transformation coaching for ambitious professionals.",
      },
    ],
  }),
  component: HomePage,
});

const HERO_IMG =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=85";

const HERO_POINTS = [
  "Custom Training",
  "Personalised Nutrition",
  "Weekly Accountability",
  "Data-Driven Progress",
] as const;

const TRUST_BAR = [
  { n: "500+", l: "Transformations" },
  { n: "6 Yrs", l: "Coaching Experience" },
  { n: "92%", l: "Completion Rate" },
] as const;

const PROOF_CARDS = [
  {
    metric: "−11 kg",
    period: "14 weeks",
    role: "Software Engineer, 32",
    tier: "Transform",
    note: "Lost fat while maintaining strength. No crash diet, no extreme cardio.",
  },
  {
    metric: "+6 kg lean",
    period: "22 weeks",
    role: "Founder, 29",
    tier: "Elite",
    note: "Structured hypertrophy block with travel-proof nutrition system.",
  },
  {
    metric: "−14% BF",
    period: "20 weeks",
    role: "Consultant, 36",
    tier: "Transform",
    note: "Recomposition while flying weekly. Adapted weekly to schedule.",
  },
  {
    metric: "−8 kg",
    period: "12 weeks",
    role: "Doctor, 34",
    tier: "Foundation",
    note: "Sustainable fat loss between hospital shifts. Bloodwork improved.",
  },
] as const;

const PROBLEMS = [
  { t: "No Structure", d: "Random workouts and ever-changing diets create noise, not progress." },
  { t: "No Accountability", d: "Without weekly checkpoints, slip-ups quietly compound into stalls." },
  { t: "Bad Information", d: "Influencer advice optimised for views, not for your body or your life." },
  { t: "No Consistency", d: "Programs that don't bend to real life — travel, work, family — get abandoned." },
] as const;

const METHOD = [
  {
    n: "01",
    icon: ClipboardList,
    t: "Assessment",
    d: "Deep dive into your goals, lifestyle, training history, schedule, and limitations. We measure where you actually are.",
  },
  {
    n: "02",
    icon: Target,
    t: "Precision Planning",
    d: "A training and nutrition strategy engineered for your body and your calendar — not a template recycled from a spreadsheet.",
  },
  {
    n: "03",
    icon: MessageSquare,
    t: "Accountability",
    d: "Weekly check-ins, direct coach access, and continuous program adjustment. You are never coaching yourself.",
  },
  {
    n: "04",
    icon: TrendingUp,
    t: "Transformation",
    d: "Measurable, repeatable, sustainable results. A body and a system you keep long after coaching ends.",
  },
] as const;

const DIFFERENTIATORS = [
  { icon: ShieldCheck, t: "Zero Supplement Sales", d: "No upsells, no affiliate stacks. Our only product is your result." },
  { icon: FlaskConical, t: "Evidence-Based", d: "Programs built on peer-reviewed science, not gym folklore or influencer trends." },
  { icon: Briefcase, t: "Built For Professionals", d: "Travel, meetings, late nights, family. Your program flexes around the life you have." },
  { icon: Headphones, t: "High Accountability", d: "Weekly check-ins, direct coach access, real conversations — not bot replies." },
  { icon: UserCog, t: "Truly Personalised", d: "Every plan is written from scratch for one person. No app-generated templates." },
  { icon: InfinityIcon, t: "Long-Term Results", d: "We teach you the system. You leave coaching with skills, not dependence." },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "I've worked with three coaches before LEANMOVEMENT. None came close. The check-ins were sharp and the program adapted weekly to my travel.",
    role: "Consultant",
    age: "36",
    result: "+6 kg lean · 22 weeks",
  },
  {
    quote:
      "Finally a coach who takes nutrition seriously without pushing supplements. My energy is steadier than it has been in a decade.",
    role: "Product Manager",
    age: "33",
    result: "Recomp · 18 weeks",
  },
  {
    quote:
      "I expected a workout plan. I got a system — for training, eating, recovering, and travelling — that I still run on my own a year later.",
    role: "Founder",
    age: "29",
    result: "−9 kg · 16 weeks",
  },
] as const;

function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 img-up" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 grid-overlay opacity-25" />
        <div className="container-x relative pb-20 md:pb-28 pt-36 w-full">
          <FadeUp>
            <span className="eyebrow">
              <span className="w-10 h-px bg-accent" />
              Online Coaching · Hyderabad · Worldwide
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] mt-7 leading-[0.92] max-w-5xl">
              Build The<br />
              Strongest Version<br />
              Of <span className="text-accent">Yourself.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg text-foreground/75 leading-relaxed">
              Personalised coaching for ambitious professionals who want lasting body transformation,
              better performance, and complete confidence in their health.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3 max-w-3xl">
              {HERO_POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                  <Check size={16} className="text-accent shrink-0" />
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/book" className="btn-pill-accent">
                Book Free Consultation <ArrowUpRight size={16} />
              </Link>
              <a href="#method" className="btn-pill-ghost">
                See How It Works
              </a>
            </div>

            <div className="mt-14 pt-8 border-t border-white/10 max-w-2xl flex flex-wrap gap-x-10 gap-y-4">
              {TRUST_BAR.map((t) => (
                <div key={t.l} className="flex items-baseline gap-2.5">
                  <span className="font-display text-2xl text-foreground">{t.n}</span>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t.l}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <Ticker />

      {/* ============ SOCIAL PROOF — RESULTS ============ */}
      <section className="container-x py-24 md:py-32">
        <FadeUp className="max-w-3xl mb-16">
          <span className="eyebrow">
            <span className="w-8 h-px bg-accent" />
            Client Results
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">
            Results That Speak<br />For Themselves.
          </h2>
          <p className="mt-6 text-foreground/70 max-w-xl">
            A sample of outcomes from clients who completed our programs. Anonymised by request —
            real metrics, real timeframes.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {PROOF_CARDS.map((c, i) => (
            <FadeUp key={i} delay={i * 0.08} className="bg-background">
              <div className="p-8 md:p-9 h-full flex flex-col justify-between min-h-[280px] hover:bg-card transition-colors">
                <div>
                  <div className="font-display text-5xl md:text-6xl text-accent leading-none">{c.metric}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    in {c.period}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{c.note}</p>
                  <div className="mt-5 pt-5 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-foreground/80">{c.role}</span>
                    <span className="text-accent uppercase tracking-[0.2em] text-[10px]">{c.tier}</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-12">
          <Link to="/results" className="inline-flex items-center gap-2 text-accent text-sm uppercase tracking-[0.2em] hover:gap-4 transition-all">
            View All Transformations <ArrowUpRight size={16} />
          </Link>
        </FadeUp>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="border-y border-border bg-surface relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container-x py-24 md:py-32 relative">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24">
            <FadeUp>
              <span className="eyebrow">
                <span className="w-8 h-px bg-accent" />
                The Reality
              </span>
              <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">
                Why Most<br />Transformations<br />
                <span className="text-accent">Fail.</span>
              </h2>
              <p className="mt-8 text-foreground/70 leading-relaxed max-w-md">
                People don't fail because they lack motivation. They fail because they're handed
                generic plans, asked to coach themselves, and abandoned when life gets in the way.
              </p>
              <p className="mt-6 text-foreground/85 leading-relaxed max-w-md">
                LEANMOVEMENT exists to remove every one of those reasons.
              </p>
            </FadeUp>

            <div className="grid sm:grid-cols-2 gap-px bg-border self-start">
              {PROBLEMS.map((p, i) => (
                <FadeUp key={p.t} delay={i * 0.08} className="bg-surface">
                  <div className="p-8 h-full hover:bg-card transition-colors">
                    <div className="text-accent font-display text-3xl">0{i + 1}</div>
                    <h3 className="font-display text-2xl mt-4">{p.t}</h3>
                    <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{p.d}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ METHOD ============ */}
      <section id="method" className="container-x py-24 md:py-32">
        <FadeUp className="max-w-3xl mb-20">
          <span className="eyebrow">
            <span className="w-8 h-px bg-accent" />
            The Method
          </span>
          <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">
            The LEANMOVEMENT<br />Method.
          </h2>
          <p className="mt-6 text-foreground/70 max-w-xl">
            A four-stage system engineered to produce measurable, sustainable transformation —
            without burnout, guesswork, or supplement upsells.
          </p>
        </FadeUp>

        <div className="relative">
          <div className="hidden lg:block absolute top-[88px] left-0 right-0 h-px bg-border" />
          <div className="grid lg:grid-cols-4 gap-px lg:gap-0 lg:gap-x-px bg-border lg:bg-transparent">
            {METHOD.map((m, i) => {
              const Icon = m.icon;
              return (
                <FadeUp key={m.n} delay={i * 0.1} className="bg-background lg:bg-transparent">
                  <div className="p-8 lg:p-0 lg:pr-10 h-full relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 border border-border bg-background grid place-items-center text-accent relative z-10">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>
                      <span className="font-display text-xs tracking-[0.3em] text-muted-foreground">
                        STEP {m.n}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl">{m.t}</h3>
                    <p className="mt-4 text-sm text-foreground/70 leading-relaxed max-w-xs">{m.d}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DIFFERENTIATION ============ */}
      <section className="border-t border-border bg-surface">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-3xl mb-16">
            <span className="eyebrow">
              <span className="w-8 h-px bg-accent" />
              The Difference
            </span>
            <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">
              Why LEANMOVEMENT<br />Is Different.
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {DIFFERENTIATORS.map((d, i) => {
              const Icon = d.icon;
              return (
                <FadeUp key={d.t} delay={i * 0.06} className="bg-surface">
                  <div className="p-9 h-full hover:bg-card transition-colors group">
                    <Icon size={28} strokeWidth={1.4} className="text-accent" />
                    <h3 className="font-display text-2xl mt-7">{d.t}</h3>
                    <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{d.d}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ PROGRAMS ============ */}
      <section className="container-x py-24 md:py-32">
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="eyebrow">
              <span className="w-8 h-px bg-accent" />
              Levels Of Support
            </span>
            <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">Choose Your Tier.</h2>
            <p className="mt-6 text-foreground/70">
              Three levels of coaching depth. The same standards, methodology, and direct coach access — different cadences of contact.
            </p>
          </div>
          <Link
            to="/programs"
            className="text-accent text-sm uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:gap-4 transition-all"
          >
            Compare All Tiers <ArrowUpRight size={16} />
          </Link>
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {CORE_PLANS.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1}>
              <PlanCard plan={p} />
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-12 flex flex-wrap items-center justify-between gap-6 p-8 border border-border bg-card">
          <div>
            <h3 className="font-display text-2xl">Not sure which tier fits?</h3>
            <p className="text-sm text-foreground/70 mt-2">
              Book a free consultation. We'll recommend the right level for your goal — even if it's the smallest one.
            </p>
          </div>
          <Link to="/book" className="btn-pill-accent">
            Book Free Consultation <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="border-t border-border bg-surface">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="mb-16 max-w-3xl">
            <span className="eyebrow">
              <span className="w-8 h-px bg-accent" />
              In Their Words
            </span>
            <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95]">
              What Clients Say.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-px bg-border">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={i} delay={i * 0.08} className="bg-surface">
                <div className="p-9 h-full flex flex-col hover:bg-card transition-colors">
                  <span className="font-display text-6xl text-accent leading-none">"</span>
                  <p className="mt-2 text-foreground/85 leading-relaxed flex-1 text-[15px]">
                    {t.quote}
                  </p>
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="text-sm text-foreground">
                      {t.role} <span className="text-muted-foreground">· {t.age}</span>
                    </div>
                    <div className="text-xs text-accent uppercase tracking-[0.2em] mt-1.5">
                      {t.result}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        eyebrow="The first step"
        title="A Conversation Comes First."
        highlight="Conversation"
        subtitle="A 15-minute call. No sales pitch. We diagnose where you are, where you want to be, and the fastest honest path to get there."
        ctaText="Book Free Consultation"
        ctaTo="/book"
      />
    </>
  );
}
