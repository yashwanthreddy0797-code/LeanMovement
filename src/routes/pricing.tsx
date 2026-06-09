import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { CORE_PLANS, VIP_PLAN, type Plan } from "@/components/site/PlanCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LEANMOVEMENT Coaching" },
      { name: "description", content: "Transparent pricing. No hidden fees. Four tiers of online fitness coaching, monthly or bundled." },
      { property: "og:title", content: "Pricing — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Transparent pricing for premium online coaching." },
    ],
  }),
  component: PricingPage,
});

const ALL_PLANS: Plan[] = [...CORE_PLANS, VIP_PLAN];

const FEATURES = [
  ["Custom Training Plan", true, true, true, true],
  ["Macro & Nutrition Plan", true, true, true, true],
  ["Weekly Check-ins", "Text", "Text+Video", "Video", "Video"],
  ["WhatsApp Access", false, "Priority", "Daily", "Unlimited"],
  ["Video Calls / month", false, "2", "4", "Weekly"],
  ["Adaptive Programming", false, true, true, true],
  ["Recovery & Sleep Audit", false, false, true, true],
  ["In-person sessions", false, false, false, true],
  ["Blood work review", false, false, false, true],
] as const;

const PRICING_FAQ = [
  { q: "Are there any hidden fees?", a: "No. The monthly price is the total price. No setup fees, no app charges, no surprises." },
  { q: "Can I cancel anytime?", a: "Yes. Month-to-month subscriptions can be cancelled before the next billing date. Bundle purchases run their full term." },
  { q: "Do you offer refunds?", a: "If you've done the work for 30 days and haven't progressed, we refund the month. We've never had to issue one. We're confident you won't be the first." },
  { q: "What payment methods do you accept?", a: "All major Indian cards, UPI, net banking via Razorpay. International payments via Stripe on request." },
  { q: "Do you offer a free trial?", a: "We offer a free 15-minute consultation. No commitment, no card needed." },
];

function PricingPage() {
  const [mode, setMode] = useState<"monthly" | "bundle">("monthly");

  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple. Honest." subtitle="One price. Everything included. No supplement upsells, no add-ons." compact />

      <section className="container-x pb-8">
        <FadeUp className="flex justify-center">
          <div className="inline-flex p-1 border border-border bg-surface">
            {(["monthly", "bundle"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                  mode === m ? "bg-accent text-background" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {m === "monthly" ? "Monthly" : "Bundle · Save 10%"}
              </button>
            ))}
          </div>
        </FadeUp>
      </section>

      <section className="container-x py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {ALL_PLANS.map((p, i) => {
            const base = parseInt(p.price.replace(/[^0-9]/g, ""));
            const display = mode === "bundle" ? `₹${Math.round(base * 3 * 0.9).toLocaleString("en-IN")}` : p.price;
            const period = mode === "bundle" ? "3-month bundle" : "per month";
            return (
              <FadeUp key={p.name} delay={i * 0.07}>
                <div className={`flex flex-col h-full p-8 border bg-card transition-all hover:border-accent ${p.vip ? "border-accent/40 shadow-[0_0_40px_-15px_var(--accent)]" : "border-border"}`}>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{p.tag}</span>
                  <h3 className="font-display text-4xl mt-2">{p.name}</h3>
                  <div className="my-6 h-px bg-border" />
                  <ul className="space-y-2 text-sm flex-1">
                    {p.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex gap-2"><Check size={14} className="text-accent mt-1 shrink-0" /><span>{f}</span></li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <div className="font-display text-4xl text-accent">{display}</div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mt-1">{period}</div>
                  </div>
                  <a href="#" aria-label={`Pay with Razorpay for ${p.name}`} className="mt-6 inline-flex items-center justify-center px-5 py-3 bg-accent text-background text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground transition-colors">
                    Pay with Razorpay
                  </a>
                  <a href="/book" className="mt-3 text-center text-xs text-muted-foreground hover:text-accent uppercase tracking-[0.2em]">
                    or book a call first
                  </a>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="container-x py-24 border-t border-border">
        <FadeUp className="mb-12">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />Compare</span>
          <h2 className="font-display text-5xl md:text-5xl mt-6">What's Included.</h2>
        </FadeUp>
        <FadeUp delay={0.1} className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr>
                <th className="text-left py-5 px-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium border-b border-border">Feature</th>
                {ALL_PLANS.map((p) => (
                  <th key={p.name} className="text-left py-5 px-4 border-b border-border">
                    <div className="font-display text-2xl">{p.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(([label, ...vals]) => (
                <tr key={label as string} className="border-b border-border">
                  <td className="py-5 px-4 text-sm text-foreground/80">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="py-5 px-4 text-sm">
                      {v === true ? <Check size={18} className="text-accent" /> :
                       v === false ? <X size={18} className="text-muted-foreground/40" /> :
                       <span className="text-foreground/80">{v}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </FadeUp>
      </section>

      {/* TRUST */}
      <section className="container-x py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Secure payments", body: "All transactions via Razorpay. Bank-grade encryption." },
            { icon: RefreshCw, title: "Cancel anytime", body: "No lock-ins on monthly plans. Pause or stop whenever." },
            { icon: Clock, title: "Free 15-min consultation", body: "Talk first, decide later. Always." },
          ].map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.1}>
              <div className="flex gap-4">
                <t.icon className="text-accent shrink-0" size={28} strokeWidth={1.5} />
                <div>
                  <div className="font-medium">{t.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{t.body}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x py-24 border-t border-border">
        <FadeUp className="max-w-2xl mb-12">
          <span className="eyebrow"><span className="w-8 h-px bg-accent" />FAQ</span>
          <h2 className="font-display text-5xl md:text-5xl mt-6">Pricing Questions.</h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <Accordion type="single" collapsible className="max-w-3xl">
            {PRICING_FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="font-display text-2xl text-left hover:text-accent hover:no-underline py-6">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </section>
    </>
  );
}
