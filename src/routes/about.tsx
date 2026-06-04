import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Repeat, UserCog } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — APEX Coaching" },
      { name: "description", content: "Meet the coach. Six years of evidence-based training and over 500 clients later, the philosophy hasn't changed: train on your own terms." },
      { property: "og:title", content: "About — APEX Coaching" },
      { property: "og:description", content: "Meet your coach. Science-first, no-fluff online fitness coaching." },
    ],
  }),
  component: AboutPage,
});

const COACH_IMG = "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=1200&q=80";
const PILLARS = [
  { icon: FlaskConical, title: "Science", body: "Every recommendation is rooted in peer-reviewed research. No trends, no guesswork." },
  { icon: Repeat, title: "Consistency", body: "Sustainable habits over heroic effort. The plan you can run for a decade beats the one you abandon in 8 weeks." },
  { icon: UserCog, title: "Personalisation", body: "Your body, your schedule, your psychology. Templates are tools, not solutions." },
];
const CREDENTIALS = ["NSCA-CPT", "Precision Nutrition L2", "FRC Mobility Specialist", "BSc Sports Science", "6 yrs coaching"];
const GALLERY = [
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Meet Your Coach" title="APEX." subtitle="Six years. 500+ transformations. Zero shortcuts." image={COACH_IMG} compact />

      <section className="container-x py-24 md:py-32">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-12 lg:gap-20">
          <FadeUp>
            <div className="aspect-[3/4] overflow-hidden sticky top-32">
              <img src={COACH_IMG} alt="Coach portrait" loading="lazy" className="w-full h-full object-cover grayscale" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="space-y-6 text-foreground/80 leading-relaxed">
            <span className="eyebrow"><span className="w-8 h-px bg-accent" />The Story</span>
            <h2 className="font-display text-5xl md:text-6xl text-foreground">A coach, not a salesman.</h2>
            <p>I started coaching out of a small gym in Hyderabad in 2019 with one rule: never sell anything I wouldn't use myself. That meant no fad diets, no supplement pyramids, no fear-mongering.</p>
            <p>Six years later, the rule still stands. Over 500 clients have transformed under this method — corporate professionals, parents, students, athletes. The training shifts. The principles don't.</p>
            <p>I believe fitness should give you energy for the rest of your life, not consume it. That means programs that fit into real schedules, nutrition that respects Indian food, and a coach who picks up the phone.</p>
            <p>If that sounds like the kind of coaching you've been looking for — let's talk.</p>
          </FadeUp>
        </div>
      </section>

      <section className="container-x py-24 md:py-32 border-t border-border">
        <FadeUp className="max-w-2xl mb-16">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />Philosophy</span>
          <h2 className="font-display text-5xl md:text-7xl mt-6">Three Pillars.</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <FadeUp key={p.title} delay={i * 0.1}>
              <div className="p-10 border border-border bg-card h-full">
                <p.icon className="text-accent" size={32} strokeWidth={1.5} />
                <h3 className="font-display text-4xl mt-8">{p.title}</h3>
                <p className="mt-4 text-foreground/70">{p.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10">
        <div className="container-x flex flex-wrap items-center gap-x-12 gap-y-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="text-accent">Credentials</span>
          {CREDENTIALS.map((c) => <span key={c}>· {c}</span>)}
        </div>
      </section>

      <section className="container-x py-24 md:py-32">
        <FadeUp className="mb-12">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />Inside The Work</span>
          <h2 className="font-display text-5xl md:text-7xl mt-6">From the Gym.</h2>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {GALLERY.map((src, i) => (
            <FadeUp key={src} delay={i * 0.05}>
              <div className={`overflow-hidden ${i === 1 || i === 4 ? "md:row-span-2 aspect-[3/5]" : "aspect-square"}`}>
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <CTABanner eyebrow="Let's Work" title="Ready to work with me?" highlight="me" />
    </>
  );
}
