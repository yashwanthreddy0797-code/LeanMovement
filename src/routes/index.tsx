import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeUp } from "@/components/site/FadeUp";
import heroImg from "@/assets/lm-hero-minimal.jpg.asset.json";
import aboutImg from "@/assets/lm-about-minimal.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEANMOVEMENT — Become The Strongest Version Of Yourself" },
      {
        name: "description",
        content:
          "Evidence-informed coaching for busy professionals, entrepreneurs and individuals seeking sustainable fat loss, strength and performance without sacrificing their lifestyle.",
      },
      { property: "og:title", content: "LEANMOVEMENT — Pure Work In Solitude" },
      { property: "og:description", content: "Evidence-informed coaching for the disciplined professional." },
      { property: "og:image", content: heroImg.url },
    ],
  }),
  component: HomePage,
});

const PRINCIPLES = [
  { n: "01", t: "Train For Performance", d: "Strength, capacity, longevity. Aesthetics follow." },
  { n: "02", t: "Sustainability Wins", d: "A protocol you can't repeat for a decade isn't a protocol." },
  { n: "03", t: "Education Over Dependence", d: "You learn the why. You leave self-sufficient." },
  { n: "04", t: "Consistency Beats Perfection", d: "Showing up imperfectly, repeated, beats the perfect plan abandoned." },
  { n: "05", t: "Health Is A Lifestyle", d: "Sleep, food, training, recovery — designed around your life, not against it." },
] as const;

const PACKAGES = [
  {
    name: "Foundation",
    price: "₹5,999",
    note: "One-time setup",
    features: [
      "Calorie targets",
      "Macro setup",
      "Workout template",
      "Supplement recommendations",
      "Habit checklist",
      "PDF resources",
    ],
  },
  {
    name: "Transformation Blueprint",
    price: "₹11,999",
    note: "One-time setup",
    features: [
      "Everything in Foundation",
      "Travel nutrition guide",
      "Restaurant eating guide",
      "Progress tracker",
      "Exercise video library",
      "One adjustment after four weeks",
    ],
    featured: true,
  },
  {
    name: "Elite Mentorship",
    price: "₹24,999",
    note: "One-time setup",
    features: [
      "Everything above",
      "Two private online consultations",
      "Technique review submissions",
      "Priority messaging",
      "Biweekly check-ins for 90 days",
    ],
  },
] as const;

function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden bg-background">
        <img
          src={heroImg.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/10" />

        <div className="relative container-x pb-16 md:pb-24 pt-32 w-full">
          <FadeUp>
            <div className="text-[10px] uppercase tracking-[0.4em] text-foreground/55">
              Evidence-Informed Coaching · Est. Hyderabad
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="mt-8 font-display uppercase tracking-[0.02em] text-foreground text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.92] max-w-6xl">
              LEAN<span className="font-normal">MOVEMENT</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-2xl font-serif italic text-2xl md:text-3xl text-foreground/80 leading-snug">
              Become the strongest version of yourself.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Evidence-informed coaching for busy professionals, entrepreneurs and individuals
              seeking sustainable fat loss, strength and performance — without sacrificing their lifestyle.
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/book"
                className="inline-flex items-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
              >
                Apply Now
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Explore Coaching
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="bg-background">
        <div className="container-x py-32 md:py-48">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24 items-start">
            <FadeUp className="md:col-span-5 md:sticky md:top-32">
              <div className="eyebrow"><span className="w-6 h-px bg-accent" />The Philosophy</div>
              <h2 className="mt-8 font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
                Fitness should create freedom — not dependency.
              </h2>
            </FadeUp>
            <FadeUp delay={0.15} className="md:col-span-6 md:col-start-7 space-y-8 text-foreground/75 text-lg leading-relaxed">
              <p>
                LEANMOVEMENT was built on the belief that the work you do for your body should
                give back to every other corner of your life — your focus, your discipline,
                your standards.
              </p>
              <p>No detoxes. No unnecessary restrictions. No gimmicks.</p>
              <p>
                Only systems that fit into real life, refined over years of practice, and built
                to produce long-term results long after the programme ends.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============ EDITORIAL IMAGE ============ */}
      <section className="bg-background">
        <div className="container-x pb-32 md:pb-48">
          <FadeUp>
            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8 aspect-[4/5] md:aspect-[16/11] overflow-hidden">
                <img src={aboutImg.url} alt="Quiet training" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="md:col-span-3 md:col-start-10">
                <div className="eyebrow"><span className="w-6 h-px bg-accent" />Mantra</div>
                <p className="mt-6 font-serif italic text-2xl md:text-3xl leading-snug text-foreground">
                  Pure work in solitude.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============ PRINCIPLES ============ */}
      <section className="bg-surface border-y border-border">
        <div className="container-x py-32 md:py-48">
          <FadeUp>
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Principles</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] max-w-4xl leading-[1.02]">
              Five non-negotiables that shape every programme.
            </h2>
          </FadeUp>

          <div className="mt-20 md:mt-28 divide-y divide-border border-t border-border">
            {PRINCIPLES.map((p, i) => (
              <FadeUp key={p.n} delay={i * 0.05}>
                <div className="grid md:grid-cols-12 gap-6 md:gap-12 py-10 md:py-12 items-baseline">
                  <div className="md:col-span-1 font-mono text-xs text-muted-foreground tracking-widest">{p.n}</div>
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

      {/* ============ COACHING / PACKAGES ============ */}
      <section className="bg-background">
        <div className="container-x py-32 md:py-48">
          <FadeUp>
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Coaching</div>
            <div className="mt-8 grid md:grid-cols-12 gap-10 items-end">
              <h2 className="md:col-span-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
                Three ways to begin.
              </h2>
              <p className="md:col-span-4 text-foreground/70 text-base leading-relaxed">
                Choose the level of guidance that matches where you are. Each pathway is built on
                the same evidence-informed foundations.
              </p>
            </div>
          </FadeUp>

          <div className="mt-20 grid md:grid-cols-3 gap-px bg-border border border-border">
            {PACKAGES.map((pkg, i) => (
              <FadeUp key={pkg.name} delay={i * 0.08}>
                <div
                  className={`h-full flex flex-col p-10 md:p-12 transition-colors ${
                    pkg.featured
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground hover:bg-surface"
                  }`}
                >
                  <div
                    className={`text-[10px] uppercase tracking-[0.32em] ${
                      pkg.featured ? "text-background/60" : "text-muted-foreground"
                    }`}
                  >
                    {pkg.note}
                  </div>
                  <h3 className="mt-5 font-display text-3xl md:text-4xl uppercase tracking-[0.01em] leading-[1.05]">
                    {pkg.name}
                  </h3>
                  <div
                    className={`mt-8 font-display text-5xl md:text-6xl tracking-tight ${
                      pkg.featured ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {pkg.price}
                  </div>

                  <ul className={`mt-10 space-y-3 flex-1 text-[15px] ${pkg.featured ? "text-background/80" : "text-foreground/75"}`}>
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className={`mt-2 w-1 h-1 shrink-0 ${pkg.featured ? "bg-accent" : "bg-foreground"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className={`mt-12 inline-flex items-center justify-between px-6 py-4 text-[11px] uppercase tracking-[0.32em] border transition-colors ${
                      pkg.featured
                        ? "border-background/40 text-background hover:bg-accent hover:border-accent"
                        : "border-foreground text-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    <span>Apply</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="bg-surface border-t border-border">
        <div className="container-x py-32 md:py-44 text-center">
          <FadeUp>
            <div className="eyebrow justify-center"><span className="w-6 h-px bg-accent" />Apply</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.01em] max-w-4xl mx-auto leading-[1.02]">
              The work is quiet. The results are not.
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-foreground/70 text-base md:text-lg">
              Coaching slots are intentionally limited. If LEANMOVEMENT sounds like your standard,
              submit an application.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/book"
                className="inline-flex items-center px-10 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
