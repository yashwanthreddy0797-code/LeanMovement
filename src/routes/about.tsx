import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Repeat, UserCog } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — LEANMOVEMENT Coaching" },
      { name: "description", content: "Meet the coach. Six years of evidence-based training and over 500 clients later, the philosophy hasn't changed: train on your own terms." },
      { property: "og:title", content: "About — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Meet your coach. Science-first, no-fluff online fitness coaching." },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  { icon: FlaskConical, title: "Science", body: "Every recommendation is rooted in peer-reviewed research. No trends, no guesswork." },
  { icon: Repeat, title: "Consistency", body: "Sustainable habits over heroic effort. The plan you can run for a decade beats the one you abandon in 8 weeks." },
  { icon: UserCog, title: "Personalisation", body: "Your body, your schedule, your psychology. Templates are tools, not solutions." },
];
const CREDENTIALS = ["NSCA-CPT", "Precision Nutrition L2", "FRC Mobility Specialist", "BSc Sports Science", "6 yrs coaching"];

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Meet Your Coach" title="LEANMOVEMENT." subtitle="" compact />

      {/* STORY — premium white */}
      <section className="bg-white text-black">
        <div className="container-x py-24 md:py-32">
          <div className="max-w-3xl">
            <FadeUp>
              <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60"><span className="w-8 h-px bg-accent" />The Story</span>
              <h2 className="font-display text-5xl md:text-6xl text-black mt-6">A coach,</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="mt-8 space-y-6 text-black/75 leading-relaxed">
              <p>I started coaching out of a small gym in Hyderabad in 2019 with one rule: never sell anything I wouldn't use myself. That meant no fad diets, no supplement pyramids, no fear-mongering.</p>
              <p>Six years later, the rule still stands. Over 500 clients have transformed under this method — corporate professionals, parents, students, athletes. The training shifts. The principles don't.</p>
              <p>I believe fitness should give you energy for the rest of your life, not consume it. That means programs that fit into real schedules, nutrition that respects Indian food, and a coach who picks up the phone.</p>
              <p>If that sounds like the kind of coaching you've been looking for — let's talk.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — black */}
      <section className="bg-white text-black">
        <div className="container-x py-24 md:py-32">
          <FadeUp className="max-w-2xl mb-16">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60"><span className="w-8 h-px bg-accent" />Philosophy</span>
            <h2 className="font-display text-5xl md:text-5xl mt-6">Three Pillars.</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <div className="p-10 border border-black/15 bg-black/[0.03] h-full hover:border-accent transition-colors">
                  <p.icon className="text-accent" size={32} strokeWidth={1.5} />
                  <h3 className="font-display text-4xl mt-8">{p.title}</h3>
                  <p className="mt-4 text-black/70">{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CREDENTIALS — white strip */}
      <section className="bg-white text-black border-y border-black/10 py-10">
        <div className="container-x flex flex-wrap items-center gap-x-12 gap-y-4 text-xs uppercase tracking-[0.25em] text-black/60">
          <span className="text-accent">Credentials</span>
          {CREDENTIALS.map((c) => <span key={c}>· {c}</span>)}
        </div>
      </section>

      <CTABanner eyebrow="Let's Work" title="Ready to work with me?" highlight="me" />
    </>
  );
}
