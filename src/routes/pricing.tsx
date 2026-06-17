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

      {/* TOGGLE + CARDS — premium white */}
      <section className="bg-white text-black">
        <div className="container-x pt-16 pb-8">
          <FadeUp className="flex justify-center">
            <div className="inline-flex p-1 border border-black/15 bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)]">
              {(["monthly", "bundle"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                    mode === m ? "bg-black text-white" : "text-black/60 hover:text-black"
                  }`}
                >
                  {m === "monthly" ? "Monthly" : "Bundle · Save 10%"}
                </button>
              ))}
            </div>
          </FadeUp>
        </div>

        <div className="container-x pb-20 md:pb-28 pt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {ALL_PLANS.map((p, i) => {
              const base = parseInt(p.price.replace(/[^0-9]/g, ""));
              const display = mode === "bundle" ? `₹${Math.round(base * 3 * 0.9).toLocaleString("en-IN")}` : p.price;
              const period = mode === "bundle" ? "3-month bundle" : "per month";
              const isPopular = p.popular;
              return (
                <FadeUp key={p.name} delay={i * 0.07}>
                  <div
                    className={`flex flex-col h-full p-8 border transition-all hover:-translate-y-1 duration-500 ${
                      isPopular
                        ? "bg-black text-white border-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
                        : "bg-white text-black border-black/10 hover:border-accent shadow-[0_8px_40px_-20px_rgba(0,0,0,0.08)]"
                    } ${p.vip && !isPopular ? "shadow-[0_0_40px_-15px_var(--accent)]" : ""}`}
                  >
                    <span className={`text-[11px] uppercase tracking-[0.25em] ${isPopular ? "text-white/70" : "text-black/55"}`}>{p.tag}</span>
                    <h3 className="font-display text-4xl mt-2">{p.name}</h3>
                    <div className={`my-6 h-px ${isPopular ? "bg-white/20" : "bg-black/10"}`} />
                    <ul className="space-y-2 text-sm flex-1">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check size={14} className="text-accent mt-1 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <div className={`font-display text-4xl ${isPopular ? "text-accent" : "text-accent"}`}>{display}</div>
                      <div className={`text-[11px] uppercase tracking-[0.25em] mt-1 ${isPopular ? "text-white/70" : "text-black/55"}`}>{period}</div>
                    </div>
                    <a
                      href="#"
                      aria-label={`Pay with Razorpay for ${p.name}`}
                      className={`mt-6 inline-flex items-center justify-center px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                        isPopular
                          ? "bg-accent text-white hover:bg-white hover:text-black"
                          : "bg-accent text-white hover:bg-black"
                      }`}
                    >
                      Pay with Razorpay
                    </a>
                    <a href="/book" className={`mt-3 text-center text-xs uppercase tracking-[0.2em] ${isPopular ? "text-black/60 hover:text-black" : "text-black/55 hover:text-accent"}`}>
                      or book a call first
                    </a>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON — black */}
      <section className="bg-white text-black">
        <div className="container-x py-24">
          <FadeUp className="mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />Compare
            </span>
            <h2 className="font-display text-5xl md:text-5xl mt-6">What's Included.</h2>
          </FadeUp>
          <FadeUp delay={0.1} className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-5 px-4 text-[11px] uppercase tracking-[0.25em] text-black/55 font-medium border-b border-black/15">Feature</th>
                  {ALL_PLANS.map((p) => (
                    <th key={p.name} className="text-left py-5 px-4 border-b border-black/15">
                      <div className="font-display text-2xl">{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(([label, ...vals]) => (
                  <tr key={label as string} className="border-b border-black/10">
                    <td className="py-5 px-4 text-sm text-black/80">{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="py-5 px-4 text-sm">
                        {v === true ? <Check size={18} className="text-accent" /> :
                         v === false ? <X size={18} className="text-black/25" /> :
                         <span className="text-black/85">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeUp>
        </div>
      </section>

      {/* TRUST — premium white */}
      <section className="bg-white text-black border-t border-black/10">
        <div className="container-x py-16">
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
                    <div className="font-medium text-black">{t.title}</div>
                    <p className="text-sm text-black/65 mt-1">{t.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — black */}
      <section className="bg-white text-black">
        <div className="container-x py-24">
          <FadeUp className="max-w-2xl mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-black/60">
              <span className="w-8 h-px bg-accent" />FAQ
            </span>
            <h2 className="font-display text-5xl md:text-5xl mt-6">Pricing Questions.</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Accordion type="single" collapsible className="max-w-3xl">
              {PRICING_FAQ.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-black/15">
                  <AccordionTrigger className="font-display text-2xl text-left text-black hover:text-accent hover:no-underline py-6">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-black/70 pb-6">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
