import { motion } from "motion/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { Ticker } from "@/components/site/Ticker";
import { PlanCard, CORE_PLANS } from "@/components/site/PlanCard";
import heroMaleTrainer from "@/assets/hero-male-trainer.jpg.asset.json";

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

const HERO_IMG = heroMaleTrainer.url;


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
      <section className="bg-white text-black pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
        <div className="container-x">
          <FadeUp>
            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.88] tracking-tight max-w-5xl">
              FIND YOUR<br />
              STRENGTH
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-black/65 leading-relaxed font-sans normal-case">
              Science-backed coaching from certified professionals, tailored to your level and designed around your life.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/book" className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-colors">
                Start Training <ArrowUpRight size={16} />
              </Link>
              <a href="#programs" className="inline-flex items-center gap-2 px-7 py-3.5 border border-black/20 text-black text-xs font-semibold uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-colors">
                Take the FitQuiz
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-12 md:mt-16 relative">
              <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,0.35)]">
                <img
                  src={HERO_IMG}
                  alt="Male personal trainer performing deadlift in gym"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
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
              image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1400&q=90",
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
              image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85",
              reverse: true,
            },
          ].map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.08}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
                }}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${p.reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <motion.div
                  className="relative aspect-[4/3] overflow-hidden rounded-3xl"
                  variants={{
                    hidden: { opacity: 0, scale: 1.08, y: 30 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                </motion.div>
                <motion.div>
                  <motion.span
                    className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-black/60"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <span className="w-8 h-px bg-accent" />
                    {p.eyebrow}
                  </motion.span>
                  <motion.h3
                    className="font-display text-4xl md:text-5xl lg:text-6xl mt-6 leading-[0.95] text-black"
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    {p.title}
                  </motion.h3>
                  <motion.p
                    className="mt-6 text-black/70 leading-relaxed max-w-lg"
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    {p.copy}
                  </motion.p>
                  <motion.a
                    href="#method"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-black rounded-full text-xs uppercase tracking-[0.25em] text-black hover:bg-white hover:text-black transition-colors"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    Explore The Method <ArrowUpRight size={14} />
                  </motion.a>
                </motion.div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>


      {/* ============ GOALS BANNER ============ */}
      <section className="bg-white text-black overflow-hidden">
        <div className="container-x py-24 md:py-36 text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-black/70">
              <span className="w-8 h-px bg-accent" />
              What We Offer
              <span className="w-8 h-px bg-accent" />
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="font-display mt-10 leading-[0.95] tracking-tight text-5xl md:text-7xl lg:text-8xl">
              <span className="block text-black">SCULPT.</span>
              <span className="block text-black/40">STRENGTHEN.</span>
              <span className="block text-black/15">TRANSFORM.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-12 mx-auto max-w-xl text-base md:text-lg text-black/70 leading-relaxed">
              Built for fast, real results in 12 weeks.<br />
              Show up — I'll handle the rest.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.25em] text-black/50">
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
    <footer className="relative overflow-hidden bg-white text-black border-t border-black/5">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

      <div className="container-x pt-24 md:pt-32 pb-10">
        {/* Big headline */}
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            Find the perfect fitness journey for you and{" "}
            <span className="text-black/25">unlock your strongest healthiest self with us.</span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              to="/book"
              className="group inline-flex items-center gap-3 bg-white text-black pl-7 pr-2 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition"
            >
              Start Transforming
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={18} />
              </span>
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8 relative z-10">
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-black/40 mb-5">Navigate</h4>
            <ul className="space-y-3 text-sm text-black/80">
              {[
                ["/", "Home"],
                ["/about", "About Us"],
                ["/programs", "Programs"],
                ["/pricing", "Pricing"],
              ].map(([to, label]) => (
                <li key={to} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <Link to={to} className="hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-black/40 mb-5">Contact</h4>
            <div className="text-sm text-black/80 space-y-3">
              <p className="hover:text-accent transition-colors cursor-pointer">hello@leanmovement.in</p>
              <p>[+91] 99999-99999</p>
              <p className="text-black/60 leading-relaxed">
                LEANMOVEMENT Studio,<br />
                Jubilee Hills, Road No. 36,<br />
                Hyderabad, 500033
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.25em] text-black/40 mb-5">Social</h4>
            <ul className="space-y-3 text-sm text-black/80">
              {[
                ["Instagram", "https://instagram.com"],
                ["YouTube", "https://youtube.com"],
                ["WhatsApp", "https://wa.me/919999999999"],
                ["LinkedIn", "https://linkedin.com"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 decoration-black/20 hover:text-accent hover:decoration-accent transition-colors">
                    {label} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-2">
            <h4 className="font-display text-xl mb-4">Join Our Newsletter</h4>
            <p className="text-sm text-black/60 mb-4">Weekly insights on training, nutrition, and transformation. No noise.</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 rounded-full border border-black/15 bg-black/[0.02] pl-5 pr-2 py-2"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-black/40 text-black"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white hover:rotate-45 transition-transform"
                aria-label="Subscribe"
              >
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Giant wordmark */}
        <div aria-hidden className="relative mt-16 select-none pointer-events-none">
          <div className="font-display text-black/[0.04] tracking-tight leading-none text-center whitespace-nowrap text-[22vw] md:text-[18vw] lg:text-[15vw]">
            LEANMOVEMENT
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-6 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-black/50">
          <p>© {new Date().getFullYear()} LEANMOVEMENT. All rights reserved.</p>
          <a href="#" className="hover:text-black transition-colors">Privacy policy</a>
        </div>
      </div>
    </footer>
  );
}
