import { createFileRoute, Link } from "@tanstack/react-router";
import { FadeUp } from "@/components/site/FadeUp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEANMOVEMENT — Become The Strongest Version Of Yourself" },
      {
        name: "description",
        content:
          "Evidence-informed coaching systems for ambitious individuals seeking sustainable fat loss, muscle gain and peak human performance.",
      },
      { property: "og:title", content: "LEANMOVEMENT — Pure Work In Solitude" },
      { property: "og:description", content: "Evidence-informed coaching for the disciplined professional." },
    ],
  }),
  component: HomePage,
});

const PRINCIPLES = [
  { n: "01", t: "Train For Life", d: "Strength, capacity, longevity. Aesthetics follow the engine you build." },
  { n: "02", t: "Consistency Over Intensity", d: "The plan you can repeat for a decade beats the perfect plan abandoned in eight weeks." },
  { n: "03", t: "Health Creates Freedom", d: "Fitness should give back to the rest of your life — not consume it." },
  { n: "04", t: "Build An Engine", d: "Conditioning, strength, mobility — designed to compound, not collapse." },
  { n: "05", t: "Educate", d: "You learn the why behind every decision, every meal, every set." },
  { n: "06", t: "Empower", d: "Self-sufficiency over dependence. You leave with the playbook." },
  { n: "07", t: "Execute", d: "Discipline is the difference. The work decides everything." },
] as const;

const PROGRAMS_PREVIEW = [
  { tag: "Consultation", name: "Consultation", price: "₹4,999", desc: "30-min call. Assessment, roadmap and Q&A.", to: "/programs" },
  { tag: "Self-Guided", name: "Fat Loss", price: "₹5,999", desc: "12-week program. Lifetime access.", to: "/programs" },
  { tag: "Self-Guided", name: "Muscle Gain", price: "₹5,999", desc: "Hypertrophy split for size and strength.", to: "/programs" },
  { tag: "Best Seller", name: "Hybrid", price: "₹6,999", desc: "Strength. Engine. Longevity.", to: "/programs", featured: true },
  { tag: "Mentorship", name: "LEAN", price: "₹29,999", desc: "90-day 1-on-1 mentorship. Application only.", to: "/apply" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-background overflow-hidden">
        <div className="container-x pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="md:col-span-7">
              <FadeUp>
                <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Evidence-Informed Coaching · Hyderabad
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h1 className="mt-6 sm:mt-8 font-display uppercase tracking-[0.02em] text-foreground text-[2.5rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.92] break-words">
                  LEAN<span className="font-normal">MOVEMENT</span>
                </h1>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="mt-6 sm:mt-8 max-w-2xl font-serif text-xl sm:text-2xl md:text-3xl text-foreground/85 leading-snug">
                  Become the strongest version of yourself.
                </p>
              </FadeUp>
              <FadeUp delay={0.3}>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  Evidence-informed coaching systems designed for ambitious individuals seeking sustainable fat loss,
                  muscle gain and peak human performance.
                </p>
              </FadeUp>
              <FadeUp delay={0.4}>
                <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Link
                    to="/apply"
                    className="inline-flex items-center justify-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
                  >
                    Apply For Lean
                  </Link>
                  <Link
                    to="/programs"
                    className="inline-flex items-center justify-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    Explore Programs
                  </Link>
                </div>
              </FadeUp>
            </div>
            <FadeUp delay={0.2} className="md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1400&q=80"
                  alt="Athlete training in focused solitude"
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-background border-t border-border">
        <div className="container-x py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
            <FadeUp className="md:col-span-5">
              <div className="eyebrow"><span className="w-6 h-px bg-accent" />The Philosophy</div>
              <h2 className="mt-5 font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.01em] leading-[1.02]">
                Fitness should create freedom — not dependency.
              </h2>
              <div className="mt-8 relative aspect-[4/5] w-full overflow-hidden bg-surface">
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80"
                  alt="Disciplined lift under controlled tension"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05]"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.15} className="md:col-span-7 space-y-6 text-foreground/75 text-base md:text-lg leading-relaxed pt-2 md:pt-16">
              <p>
                LEANMOVEMENT was built around a simple belief. The work you do for your body
                should give back to every other corner of your life — your focus, your discipline,
                your standards.
              </p>
              <p>No gimmicks. No detoxes. No unnecessary restrictions.</p>
              <p>
                Only systems that fit into real life. Built for busy professionals, entrepreneurs,
                athletes — people who want structure, and people who want longevity.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* MANTRA */}
      <section className="bg-background border-t border-border">
        <div className="container-x py-32 md:py-48">
          <FadeUp>
            <div className="grid md:grid-cols-12 gap-16 items-end">
              <div className="md:col-span-8">
                <div className="eyebrow"><span className="w-6 h-px bg-accent" />Mantra</div>
                <p className="mt-10 font-serif text-4xl md:text-5xl lg:text-6xl leading-snug text-foreground">
                  Pure work in solitude.
                </p>
              </div>
              <div className="md:col-span-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Discipline doesn't need an audience. The work speaks — louder, and for longer.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-surface border-y border-border">
        <div className="container-x py-32 md:py-48">
          <FadeUp>
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Principles</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] max-w-4xl leading-[1.02]">
              Seven non-negotiables that shape every programme.
            </h2>
          </FadeUp>

          <div className="mt-20 md:mt-28 divide-y divide-border border-t border-border">
            {PRINCIPLES.map((p, i) => (
              <FadeUp key={p.n} delay={i * 0.04}>
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

      {/* PROGRAMS PREVIEW */}
      <section className="bg-background">
        <div className="container-x py-32 md:py-48">
          <FadeUp>
            <div className="eyebrow"><span className="w-6 h-px bg-accent" />Programs</div>
            <div className="mt-8 grid md:grid-cols-12 gap-10 items-end">
              <h2 className="md:col-span-8 font-display text-4xl md:text-6xl uppercase tracking-[0.01em] leading-[1.02]">
                Five ways to begin.
              </h2>
              <p className="md:col-span-4 text-foreground/70 text-base leading-relaxed">
                From self-guided programs to a 90-day 1-on-1 mentorship. Each path built on
                the same evidence-informed foundations.
              </p>
            </div>
          </FadeUp>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border border border-border">
            {PROGRAMS_PREVIEW.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.06}>
                <Link
                  to={p.to}
                  className={`group h-full flex flex-col p-8 transition-colors ${
                    p.featured
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground hover:bg-surface"
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-[0.32em] ${p.featured ? "text-accent" : "text-muted-foreground"}`}>
                    {p.tag}
                  </div>
                  <h3 className="mt-5 font-display text-3xl uppercase tracking-[0.01em]">{p.name}</h3>
                  <p className={`mt-4 text-sm flex-1 ${p.featured ? "text-background/75" : "text-foreground/70"}`}>{p.desc}</p>
                  <div className={`mt-8 font-display text-2xl ${p.featured ? "text-accent" : "text-foreground"}`}>{p.price}</div>
                  <span className="mt-4 text-[10px] uppercase tracking-[0.32em] inline-flex items-center gap-2 opacity-70 group-hover:opacity-100">
                    View <span aria-hidden>→</span>
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC BAND */}
      <section className="bg-background">
        <div className="relative w-full h-[55vh] md:h-[75vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=80"
            alt="The work is quiet — pure effort, no audience"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-x pb-12 md:pb-20">
              <FadeUp>
                <p className="font-serif text-2xl md:text-4xl text-foreground/90 max-w-2xl leading-snug">
                  The body you build is the discipline you keep.
                </p>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-surface border-t border-border">
        <div className="container-x py-32 md:py-44 text-center">
          <FadeUp>
            <div className="eyebrow justify-center"><span className="w-6 h-px bg-accent" />Apply</div>
            <h2 className="mt-8 font-display text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.01em] max-w-4xl mx-auto leading-[1.02]">
              The work is quiet. The results are not.
            </h2>
            <p className="mt-8 max-w-xl mx-auto text-foreground/70 text-base md:text-lg">
              LEAN spots are intentionally limited. If LEANMOVEMENT sounds like your standard,
              submit an application.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/apply"
                className="inline-flex items-center px-10 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
              >
                Apply For Lean
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
