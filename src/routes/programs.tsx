import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { PlanCard, CORE_PLANS, VIP_PLAN, type Plan } from "@/components/site/PlanCard";
import { CTABanner } from "@/components/site/CTABanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "The Programs — LEANMOVEMENT Coaching" },
      { name: "description", content: "Four tiers of online coaching, from Foundation to VIP. Built for serious results — no templates, no shortcuts." },
      { property: "og:title", content: "The Programs — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Four tiers of premium online fitness coaching." },
    ],
  }),
  component: ProgramsPage,
});

const ALL_PLANS: Plan[] = [...CORE_PLANS, VIP_PLAN];

const IDEAL = {
  Foundation: "Beginners or returning lifters who need a solid base.",
  Transform: "Driven professionals chasing a 12-week body change.",
  Elite: "Experienced trainees who want hands-on accountability.",
  VIP: "Executives, founders, and athletes who need bespoke attention.",
};

const CAPACITY = {
  Foundation: "Open · Rolling intake",
  Transform: "Limited · 20 slots per quarter",
  Elite: "Limited · 10 slots per quarter",
  VIP: "Exclusive · 5 slots per quarter",
};

const BUNDLES = [
  { title: "3-Month Block", price: "₹26,999", save: "Save ₹3,000", body: "Foundation × 3 months. Locked-in pricing, momentum guaranteed." },
  { title: "6-Month Transform", price: "₹52,999", save: "Save ₹7,000", body: "Transform × 6 months. The window most real changes need." },
  { title: "Annual Elite", price: "₹1,49,999", save: "Save ₹30,000", body: "Elite × 12 months. A full year of high-touch coaching." },
];

const FAQ = [
  { q: "How is the coaching delivered?", a: "Everything runs through a private app for tracking and a dedicated WhatsApp channel for daily communication. Video calls happen on Zoom based on your tier." },
  { q: "Do I need a gym membership?", a: "Most programs assume gym access, but home-based plans are available on request. We'll figure out the right setup on your consultation call." },
  { q: "Will you tell me to take supplements?", a: "No. We use real food first. If a specific supplement makes sense for your goal, we'll discuss it — but you'll never feel sold to." },
  { q: "What if I travel a lot for work?", a: "Travel weeks are planned into your program. We adjust training and nutrition around hotel gyms, restaurant menus, and time zones." },
  { q: "How quickly will I see results?", a: "Body composition shifts visibly in 6–8 weeks for most clients. Strength and performance markers improve from week one if the work is consistent." },
  { q: "Can I switch plans later?", a: "Yes — you can upgrade or downgrade at the start of any billing cycle. No lock-ins beyond your current month." },
  { q: "Is the coaching available outside India?", a: "Yes. Currently coaching clients across India, the UAE, UK, and US." },
];

function ProgramsPage() {
  return (
    <>
      <PageHero eyebrow="The Programs" title="Four Tiers. One Standard." subtitle="From Foundation to VIP — pick the level of access that matches your ambition." compact />

      {/* PLANS — premium white */}
      <section className="bg-white text-black">
        <div className="container-x py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-6">
            {ALL_PLANS.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.08}>
                <div className="h-full flex flex-col">
                  <PlanCard plan={p} light />
                  <div className="bg-white border border-t-0 border-black/10 p-6 text-sm shadow-[0_8px_40px_-20px_rgba(0,0,0,0.15)]">
                    <div className="mb-3">
                      <div className="text-[11px] uppercase tracking-[0.25em] text-black/55">Ideal For</div>
                      <p className="mt-1 text-black/80">{IDEAL[p.name as keyof typeof IDEAL]}</p>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-accent">{CAPACITY[p.name as keyof typeof CAPACITY]}</div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLES — black */}
      <section className="bg-white text-black">
        <div className="container-x py-24">
          <FadeUp className="mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />Bundles
            </span>
            <h2 className="font-display text-5xl md:text-5xl mt-6">Commit. Save.</h2>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {BUNDLES.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.1}>
                <div className="p-8 border border-black/15 bg-black/[0.03] h-full flex flex-col hover:border-accent transition-colors">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-accent">{b.save}</span>
                  <h3 className="font-display text-3xl mt-3">{b.title}</h3>
                  <p className="mt-3 text-sm text-black/70 flex-1">{b.body}</p>
                  <div className="font-display text-4xl mt-8 text-accent">{b.price}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — premium white */}
      <section className="bg-white text-black border-t border-black/10">
        <div className="container-x py-24">
          <FadeUp className="max-w-2xl mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />FAQ
            </span>
            <h2 className="font-display text-5xl md:text-5xl mt-6">Common Questions.</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Accordion type="single" collapsible className="max-w-3xl">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-black/10">
                  <AccordionTrigger className="font-display text-2xl md:text-3xl text-left text-black hover:text-accent hover:no-underline py-6">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-black/70 text-base pb-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      <CTABanner eyebrow="Not Sure Yet?" title="Not sure which plan?" highlight="plan" subtitle="Book a free 15-minute call. We'll figure out the right tier for your goal." />
    </>
  );
}
