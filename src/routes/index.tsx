import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
} from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { Ticker } from "@/components/site/Ticker";
import { PlanCard, CORE_PLANS } from "@/components/site/PlanCard";

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


function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 img-up" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 grid-overlay opacity-25" />
        <div className="container-x relative pb-16 md:pb-20 pt-28 md:pt-32 w-full">
          <FadeUp>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] mt-7 leading-[0.92] max-w-5xl">
              Build The<br />
              Strongest Version<br />
              Of <span className="text-accent">Yourself.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base md:text-lg text-foreground/75 leading-relaxed font-sans not-italic">
              Premium fitness coaching designed around your life.
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

      {/* ============ PILLARS ============ */}
      <section className="bg-white text-black">
        <div className="container-x py-20 md:py-28 space-y-16 md:space-y-24">
          {[
            {
              eyebrow: "Training",
              title: "Precision strength training",
              copy: "Training methods refined over 15+ years and delivered by the top 1% of coaches — engineered for results in 3 hours per week, or less.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=85",
              reverse: false,
            },
            {
              eyebrow: "Nutrition",
              title: "Nutrition, built around you",
              copy: "Personalised nutrition calculated for your body, tracked with data, and coached daily using proven principles you can maintain long term.",
              image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85",
              reverse: true,
            },
            {
              eyebrow: "Accountability",
              title: "Expert coaching and accountability",
              copy: "A dedicated coach takes full ownership of your training, nutrition, and progress — guiding decisions and supporting you beyond the gym, 7 days a week.",
              image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=85",
              reverse: false,
            },
            {
              eyebrow: "Progress",
              title: "Data-driven results",
              copy: "Your progress is tracked across 50+ metrics to remove guesswork and make every change visible, measurable, and repeatable.",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85",
              reverse: true,
            },
          ].map((p) => (
            <FadeUp key={p.title}>
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${p.reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-black/60">
                    <span className="w-8 h-px bg-accent" />
                    {p.eyebrow}
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl mt-6 leading-[0.95] text-black">{p.title}</h3>
                  <p className="mt-6 text-black/70 leading-relaxed max-w-lg">{p.copy}</p>
                  <a href="#method" className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-black rounded-full text-xs uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-colors">
                    Explore The Method <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>


      {/* ============ GOALS BANNER ============ */}
      <section className="bg-black text-white overflow-hidden">
        <div className="container-x py-24 md:py-36 text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
              <span className="w-8 h-px bg-accent" />
              What We Offer
              <span className="w-8 h-px bg-accent" />
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-display mt-10 leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-8xl">
              <span className="block text-white">SCULPT.</span>
              <span className="block text-white/40">STRENGTHEN.</span>
              <span className="block text-white/15">TRANSFORM.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-12 mx-auto max-w-xl text-base md:text-lg text-white/70 leading-relaxed">
              Built for fast, real results in 12 weeks.<br />
              Show up — I'll handle the rest.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.25em] text-white/50">
              <span>12 Weeks</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Real Results</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>Zero Guesswork</span>
            </div>
          </FadeUp>
        </div>
      </section>



      {/* ============ PROGRAMS ============ */}
      <section className="bg-white text-black">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-black/60">
                <span className="w-8 h-px bg-accent" />
                Levels Of Support
              </span>
              <h2 className="font-display text-4xl md:text-6xl mt-6 leading-[0.95] text-black">Choose Your Tier.</h2>
              <p className="mt-6 text-black/70">
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
                <PlanCard plan={p} light />
              </FadeUp>
            ))}
          </div>

          <FadeUp className="mt-12 flex flex-wrap items-center justify-between gap-6 p-8 border border-black/10 bg-white shadow-[0_8px_40px_-20px_rgba(0,0,0,0.15)]">
            <div>
              <h3 className="font-display text-2xl text-black">Not sure which tier fits?</h3>
              <p className="text-sm text-black/70 mt-2">
                Book a free consultation. We'll recommend the right level for your goal — even if it's the smallest one.
              </p>
            </div>
            <Link to="/book" className="btn-pill-accent">
              Book Free Consultation <ArrowRight size={16} />
            </Link>
          </FadeUp>
        </div>
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
                to="/programs"
                className="inline-flex items-center gap-3 px-6 py-3.5 border border-foreground/80 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Programs <ArrowUpRight size={16} />
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


      <HomeFooter />
    </>
  );
}

function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1a2a1f_0%,_#0a0d0a_55%,_#000_100%)] text-white">
      <div className="container-x pt-24 md:pt-32 pb-10">
        {/* Big headline */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            Find the perfect fitness journey for you and{" "}
            <span className="text-white/35">unlock your strongest healthiest self with us.</span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              to="/book"
              className="group inline-flex items-center gap-3 bg-white text-black pl-7 pr-2 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition"
            >
              Start Transforming
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-background group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8 relative z-10">
          <div>
            <ul className="space-y-3 text-sm text-white/85">
              {[
                ["/", "Home"],
                ["/about", "About Us"],
                ["/programs", "Programs"],
                ["/pricing", "Pricing"],
              ].map(([to, label]) => (
                <li key={to} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  <Link to={to} className="hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-white/85 space-y-3">
            <p>hello@leanmovement.in</p>
            <p>[+91] 99999-99999</p>
            <p className="text-white/70 leading-relaxed">
              LEANMOVEMENT Studio,<br />
              Jubilee Hills, Road No. 36,<br />
              Hyderabad, 500033
            </p>
          </div>

          <div>
            <ul className="space-y-3 text-sm text-white/85">
              {[
                ["Instagram", "https://instagram.com"],
                ["YouTube", "https://youtube.com"],
                ["WhatsApp", "https://wa.me/919999999999"],
                ["LinkedIn", "https://linkedin.com"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 decoration-white/30 hover:text-accent hover:decoration-accent">
                    {label} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-display text-xl mb-4">Join Our Newsletter</h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-white/25 bg-transparent pl-5 pr-2 py-2"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent text-background hover:rotate-45 transition-transform"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Giant wordmark */}
        <div aria-hidden className="relative mt-16 select-none pointer-events-none">
          <div className="font-display text-white/[0.06] tracking-tight leading-none text-center whitespace-nowrap text-[22vw] md:text-[18vw] lg:text-[15vw]">
            LEANMOVEMENT
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <p>© {new Date().getFullYear()} LEANMOVEMENT. All rights reserved.</p>
          <a href="#" className="hover:text-white">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
}
