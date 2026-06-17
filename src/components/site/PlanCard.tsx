import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface Plan {
  tag: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  period?: string;
  popular?: boolean;
  vip?: boolean;
}

export function PlanCard({ plan, light = false }: { plan: Plan; light?: boolean }) {
  const isPopular = plan.popular;
  return (
    <div
      className={`group relative flex flex-col p-8 md:p-10 border transition-all duration-500 hover:-translate-y-1 ${
        isPopular
          ? "bg-black text-white border-black"
          : light
            ? "bg-white text-black border-black/10 hover:border-accent shadow-[0_8px_40px_-20px_rgba(0,0,0,0.15)]"
            : "bg-white text-black border-black/10 hover:border-accent"
      } ${plan.vip ? "shadow-[0_0_60px_-15px_var(--accent)]" : ""}`}
    >
      {isPopular && (
        <span className="absolute top-0 right-6 -translate-y-1/2 bg-accent text-background text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 font-semibold">
          Most Popular
        </span>
      )}
      <span className={`text-[11px] tracking-[0.25em] uppercase font-medium ${isPopular ? "text-white/70" : light ? "text-black/55" : "text-black/55"}`}>
        {plan.tag}
      </span>
      <h3 className="font-display text-5xl md:text-6xl mt-3">{plan.name}</h3>
      <p className={`mt-3 text-sm ${isPopular ? "text-white/80" : "text-black/65"}`}>{plan.description}</p>
      <div className={`my-8 h-px ${isPopular ? "bg-white/20" : "bg-black/10"}`} />
      <ul className="space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span className={`mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full ${isPopular ? "bg-white" : "bg-accent"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex items-end justify-between">
        <div>
          <div className="font-display text-5xl">{plan.price}</div>
          <div className={`text-xs uppercase tracking-[0.2em] mt-1 ${isPopular ? "text-white/70" : "text-black/55"}`}>
            {plan.period ?? "per month"}
          </div>
        </div>
        <Link
          to="/pricing"
          aria-label={`Choose ${plan.name}`}
          className={`w-12 h-12 rounded-full border grid place-items-center transition-all ${
            isPopular
              ? "border-white/40 hover:bg-accent hover:border-accent text-white"
              : "border-black/30 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
          }`}
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export const CORE_PLANS: Plan[] = [
  {
    tag: "Starter",
    name: "Foundation",
    description: "Build the base. Training and nutrition fundamentals dialed in.",
    features: [
      "Customized training plan",
      "Macro & calorie targets",
      "Weekly check-in (text)",
      "App-based tracking",
      "Email support",
    ],
    price: "₹5,999",
  },
  {
    tag: "Most Chosen",
    name: "Transform",
    description: "Serious change in 12 weeks with full accountability.",
    features: [
      "Everything in Foundation",
      "Bi-weekly video calls",
      "Adaptive program updates",
      "Nutrition deep-dive",
      "Priority WhatsApp access",
    ],
    price: "₹9,999",
    popular: true,
  },
  {
    tag: "Premium",
    name: "Elite",
    description: "1:1 coaching for those who refuse average. Hands-on.",
    features: [
      "Everything in Transform",
      "Weekly 45-min video calls",
      "Daily WhatsApp coaching",
      "Lifestyle & sleep audit",
      "Recovery protocols",
    ],
    price: "₹14,999",
  },
];

export const VIP_PLAN: Plan = {
  tag: "Concierge",
  name: "VIP",
  description: "White-glove coaching. Limited to 5 clients per quarter.",
  features: [
    "Everything in Elite",
    "Unlimited WhatsApp access",
    "In-person sessions (Hyderabad)",
    "Blood work review",
    "Travel & event nutrition",
    "Direct line to coach",
  ],
  price: "₹19,999",
  vip: true,
};
