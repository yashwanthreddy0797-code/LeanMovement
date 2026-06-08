import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Star } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { Ticker } from "@/components/site/Ticker";
import { PlanCard, CORE_PLANS } from "@/components/site/PlanCard";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEANMOVEMENT — Train On Your Own Terms" },
      { name: "description", content: "Science-backed online fitness coaching for the modern Indian professional. No fluff, no fads — just results that last." },
      { property: "og:title", content: "LEANMOVEMENT — Train On Your Own Terms" },
      { property: "og:description", content: "Premium online fitness coaching from Hyderabad." },
    ],
  }),
  component: HomePage,
});

const HERO_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80";
const MOSAIC = [
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
];

const STATS = [
  { n: "500+", l: "Clients Coached" },
  { n: "6", l: "Years Experience" },
  { n: "92%", l: "Completion Rate" },
  { n: "0", l: "Supplement Upsells" },
];

const TESTIMONIALS = [
  { name: "Arjun M.", quote: "Lost 11kg in 14 weeks while keeping my strength. No crash diets, no nonsense. The coaching was uncompromising.", result: "−11kg in 14 weeks" },
  { name: "Priya S.", quote: "Finally a coach who treats nutrition seriously without pushing supplements. My energy is at an all-time high.", result: "Recomp · 18 weeks" },
  { name: "Rohan K.", quote: "I've worked with three coaches before. None came close. The check-ins were sharp, the program adapted weekly.", result: "+6kg lean mass" },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 img-up" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container-x relative pb-20 pt-32 w-full">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <FadeUp>
              <span className="eyebrow">
                <span className="w-10 h-px bg-accent" />
                Online Coaching · Hyderabad
              </span>
              <h1 className="font-display text-6xl sm:text-8xl lg:text-[9rem] mt-6 leading-[0.88]">
                Train<br />On Your Own<br />Terms.
              </h1>
              <p className="mt-8 max-w-xl text-lg text-foreground/75">
                Science-backed fitness coaching built for the modern Indian professional.
                No fluff, no fads — just results that last.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/pricing" className="btn-pill-accent">
                  View Plans <ArrowUpRight size={16} />
                </Link>
                <Link to="/about" className="btn-pill-ghost">
                  Our Method
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.2} className="hidden lg:block">
              <div className="border-l border-border pl-8 space-y-8">
                {[["500+", "Clients"], ["4.9", "Rating"], ["6 yrs", "Experience"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-5xl text-accent">{n}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ABOUT TEASER */}
      <section className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <div className="grid grid-cols-2 gap-3">
              {MOSAIC.map((src, i) => (
                <div key={i} className={`overflow-hidden ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square mt-12"}`}>
                  <img src={src} alt="" loading="lazy" className="img-up w-full h-full object-cover hover:scale-[1.04]" />
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <span className="eyebrow">
              <span className="w-8 h-px bg-accent" />
              The Method
            </span>
            <h2 className="font-display text-5xl md:text-7xl mt-6">Built on Science.<br />Driven by Results.</h2>
            <p className="mt-6 text-foreground/70">
              Every program is engineered around evidence-based training and nutrition principles —
              then personalized to your body, your schedule, and your goals. No templates. No shortcuts.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10">
              {STATS.map((s) => (
                <div key={s.l} className="border-l border-border pl-5">
                  <div className="font-display text-5xl text-accent">{s.n}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-2">{s.l}</div>
                </div>
              ))}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-accent text-sm uppercase tracking-[0.2em] hover:gap-4 transition-all">
              Learn More About Us <ArrowUpRight size={16} />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="container-x py-24 md:py-32 border-t border-border">
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="eyebrow">
              <span className="w-8 h-px bg-accent" />
              Programs
            </span>
            <h2 className="font-display text-5xl md:text-7xl mt-6">Choose Your Plan.</h2>
          </div>
          <Link to="/programs" className="text-accent text-sm uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:gap-4 transition-all">
            See All Programs <ArrowUpRight size={16} />
          </Link>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {CORE_PLANS.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1}>
              <PlanCard plan={p} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24 md:py-32 border-t border-border">
        <FadeUp className="mb-16">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />Receipts</span>
          <h2 className="font-display text-5xl md:text-7xl mt-6">What Clients Say.</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <div className="p-8 border border-border bg-card h-full flex flex-col">
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                </div>
                <p className="mt-6 text-foreground/85 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="mt-8 pt-6 border-t border-border flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-accent text-background flex items-center justify-center font-display text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-accent uppercase tracking-[0.2em] mt-0.5">{t.result}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
