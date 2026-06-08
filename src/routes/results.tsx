import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Play } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — LEANMOVEMENT Coaching" },
      { name: "description", content: "Real people. Real transformations. See what 12 weeks of focused coaching produces." },
      { property: "og:title", content: "Results — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "500+ clients. Real transformations. Real numbers." },
    ],
  }),
  component: ResultsPage,
});

type Category = "All" | "Fat Loss" | "Muscle Gain" | "Recomp";

const TRANSFORMATIONS = [
  { name: "Arjun M.", time: "14 weeks", plan: "Transform", result: "−11kg", category: "Fat Loss",
    before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
    after: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" },
  { name: "Priya S.", time: "18 weeks", plan: "Elite", result: "Recomp",  category: "Recomp",
    before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
    after: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80" },
  { name: "Rohan K.", time: "20 weeks", plan: "Elite", result: "+6kg lean", category: "Muscle Gain",
    before: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80" },
  { name: "Neha R.", time: "12 weeks", plan: "Foundation", result: "−7kg", category: "Fat Loss",
    before: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
    after: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" },
  { name: "Vikram P.", time: "24 weeks", plan: "VIP", result: "+8kg lean", category: "Muscle Gain",
    before: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    after: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80" },
  { name: "Anjali D.", time: "16 weeks", plan: "Transform", result: "Recomp", category: "Recomp",
    before: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    after: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Arjun M.", role: "Software Engineer", quote: "Lost 11kg in 14 weeks while keeping my strength. The coaching was uncompromising — exactly what I needed.", result: "−11kg in 14 weeks" },
  { name: "Priya S.", role: "Architect", quote: "Finally a coach who treats nutrition seriously without pushing supplements. My energy is at an all-time high.", result: "Full recomp" },
  { name: "Rohan K.", role: "Founder", quote: "I've worked with three coaches before. None came close. The check-ins were sharp, the program adapted weekly.", result: "+6kg lean mass" },
  { name: "Neha R.", role: "Doctor", quote: "Programs that respect a 70-hour work week. I finally have a plan I can actually run.", result: "−7kg sustained" },
  { name: "Vikram P.", role: "Lawyer", quote: "The VIP tier was worth every rupee. Direct access, real attention, results that hold.", result: "+8kg lean" },
  { name: "Anjali D.", role: "Founder", quote: "Six months in and the habits feel permanent. That's the part no one promises but LEANMOVEMENT delivered.", result: "Sustainable change" },
];

const STATS = [
  { n: "500+", l: "Clients" },
  { n: "92%", l: "Goal Achievement" },
  { n: "4.9", l: "Average Rating" },
  { n: "6", l: "Years Coaching" },
];

function ResultsPage() {
  const [filter, setFilter] = useState<Category>("All");
  const filtered = filter === "All" ? TRANSFORMATIONS : TRANSFORMATIONS.filter(t => t.category === filter);

  return (
    <>
      <PageHero eyebrow="Receipts" title="Real People. Real Results." subtitle="No transformation theatre. Just before-and-afters, names, and the numbers that matter." compact />

      <section className="container-x py-12">
        <FadeUp className="flex flex-wrap gap-2 mb-10">
          {(["All", "Fat Loss", "Muscle Gain", "Recomp"] as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.2em] border transition-colors ${
                filter === c ? "bg-accent text-background border-accent" : "border-border hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <FadeUp key={t.name + i} delay={i * 0.07}>
              <div className="group border border-border bg-card overflow-hidden hover:border-accent transition-colors">
                <div className="grid grid-cols-2">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img src={t.before} alt="Before" loading="lazy" className="w-full h-full object-cover grayscale" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] bg-background/80 px-2 py-1">Before</span>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img src={t.after} alt="After" loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] bg-accent text-background px-2 py-1">After</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl">{t.name}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.time}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/60">{t.plan}</span>
                    <span className="font-display text-2xl text-accent">{t.result}</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-24 border-t border-border">
        <FadeUp className="mb-12">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />In Their Words</span>
          <h2 className="font-display text-5xl md:text-7xl mt-6">What They Say.</h2>
        </FadeUp>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.05}>
              <div className="p-7 border border-border bg-card h-full flex flex-col">
                <div className="flex gap-1 text-accent">
                  {[...Array(5)].map((_, k) => <Star key={k} size={13} fill="currentColor" />)}
                </div>
                <p className="mt-5 text-foreground/85 flex-1">"{t.quote}"</p>
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
                  <div className="text-xs text-accent uppercase tracking-[0.2em] mt-2">{t.result}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface">
        <div className="container-x py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <FadeUp key={s.l} delay={i * 0.1}>
              <div>
                <div className="font-display text-6xl md:text-7xl text-accent">{s.n}</div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-3">{s.l}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* VIDEO */}
      <section className="container-x py-24">
        <FadeUp>
          <div className="aspect-video bg-card border border-border flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid-overlay opacity-30" />
            <div className="w-20 h-20 rounded-full bg-accent text-background flex items-center justify-center relative">
              <Play size={28} fill="currentColor" />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground relative">Video Testimonials · Coming Soon</p>
          </div>
        </FadeUp>
      </section>

      <CTABanner title="Your story next?" highlight="next" />
    </>
  );
}
