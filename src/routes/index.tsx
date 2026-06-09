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
  { n: "", l: "" },
  { n: "", l: "" },
  { n: "", l: "" },
] as const;

const CLIENT_STORIES = [
  {
    name: "Software Engineer, 32",
    headline: "Arjun lost 11kg in 14 weeks",
    note: "Sustained fat loss while protecting strength and an 80-hour work week. No crash protocols.",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80",
    before: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
    after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  },
  {
    name: "Founder, 29",
    headline: "Priya returned to elite condition at 45",
    note: "Full recomposition with travel-proof nutrition across 4 timezones. Strength up across all lifts.",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=80",
    before: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80",
    after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80",
  },
  {
    name: "Consultant, 36",
    headline: "Rohan added 6kg of lean mass",
    note: "Structured hypertrophy block. Visible muscle gain with bloodwork improvements across the board.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80",
    before: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
  },
  {
    name: "Doctor, 34",
    headline: "Neha dropped 7kg between hospital shifts",
    note: "Sustainable fat loss without sacrificing performance on 24-hour on-call rotations.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80",
    before: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80",
    after: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
  },
  {
    name: "Lawyer, 41",
    headline: "Vikram rebuilt his body at 41",
    note: "Eight kilos of lean mass added over six months. Stronger, leaner, sharper — and sustainable.",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&q=80",
    before: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
    after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  },
  {
    name: "Founder, 38",
    headline: "Anjali made the change permanent",
    note: "Six months in, the habits feel automatic. Performance, body composition and energy all up.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80",
    before: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80",
    after: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80",
  },
  {
    name: "Analyst, 30",
    headline: "Kabir cut 9kg in 16 weeks",
    note: "Lean and athletic without sacrificing the deadlift. Energy and focus reported at all-time highs.",
    image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&q=80",
    before: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80",
    after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80",
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
              
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] mt-7 leading-[0.92] max-w-5xl">
              Build The<br />
              Strongest Version<br />
              Of <span className="text-accent">Yourself.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg text-foreground/75 leading-relaxed">
              Personalised training, nutrition, and accountability for ambitious professionals who want lasting body transformation,
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

      {/* ============ CLIENT STORIES — hover expand strip ============ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <FadeUp>
              <span className="inline-block px-4 py-1.5 border border-accent text-accent text-[10px] uppercase tracking-[0.25em] rounded-full">
                Clients Stories
              </span>
              <h2 className="font-display text-4xl md:text-6xl mt-7 leading-[0.95]">
                REAL CLIENTS.<br />LIFE-CHANGING RESULTS
              </h2>
              <p className="mt-6 text-foreground/70 max-w-xl">
                Ambitious professionals of all starting points have achieved meaningful, lasting change with LEANMOVEMENT.
                These results don't happen by chance — they're the outcome of a proven method, delivered with uncompromising consistency.
              </p>
            </FadeUp>
            <FadeUp>
              <Link
                to="/results"
                className="inline-flex items-center gap-3 px-6 py-3.5 border border-foreground/80 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
              >
                See More Client Results <ArrowUpRight size={16} />
              </Link>
            </FadeUp>
          </div>
        </div>

        <FadeUp>
          <div className="flex w-full h-[460px] md:h-[560px] overflow-hidden px-4 md:px-8 gap-1.5 md:gap-2">
            {CLIENT_STORIES.map((c, i) => (
              <div
                key={i}
                className="group relative flex-1 hover:flex-[4] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden cursor-pointer"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                {/* Before/After inset — appears on hover */}
                <div className="absolute bottom-28 right-6 w-32 h-24 md:w-44 md:h-32 border-2 border-accent shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200 grid grid-cols-2 overflow-hidden">
                  <img src={c.before} alt="Before" className="w-full h-full object-cover grayscale" />
                  <img src={c.after} alt="After" className="w-full h-full object-cover" />
                </div>
                {/* Info card — appears on hover */}
                <div className="absolute left-0 right-0 bottom-0 bg-background/95 backdrop-blur p-5 md:p-6 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                  <h3 className="font-display text-lg md:text-2xl leading-tight">
                    {c.headline}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-foreground/70 line-clamp-2">
                    {c.note}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-foreground rounded-full text-[10px] uppercase tracking-[0.25em]">
                    Read Now <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
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
