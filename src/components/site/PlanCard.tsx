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

export function PlanCard({ plan }: { plan: Plan }) {
  const isPopular = plan.popular;
  return (
    <div
      className={`group relative flex flex-col p-8 md:p-10 border transition-all duration-300 ${
        isPopular
          ? "bg-accent text-background border-accent"
          : "bg-card border-border hover:border-accent"
      } ${plan.vip ? "shadow-[0_0_60px_-15px_var(--accent)]" : ""}`}
    >
      {isPopular && (
        <span className="absolute top-0 right-6 -translate-y-1/2 bg-background text-accent text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 font-semibold">
          Most Popular
        </span>
      )}
      <span className={`text-[11px] tracking-[0.25em] uppercase font-medium ${isPopular ? "text-background/70" : "text-muted-foreground"}`}>
        {plan.tag}
      </span>
      <h3 className="font-display text-5xl md:text-6xl mt-3">{plan.name}</h3>
      <p className={`mt-3 text-sm ${isPopular ? "text-background/80" : "text-foreground/70"}`}>{plan.description}</p>
      <div className={`my-8 h-px ${isPopular ? "bg-background/20" : "bg-border"}`} />
      <ul className="space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span className={`mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full ${isPopular ? "bg-background" : "bg-accent"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex items-end justify-between">
        <div>
          <div className="font-display text-5xl">{plan.price}</div>
          <div className={`text-xs uppercase tracking-[0.2em] mt-1 ${isPopular ? "text-background/70" : "text-muted-foreground"}`}>
            {plan.period ?? "per month"}
          </div>
        </div>
        <Link
          to="/pricing"
          aria-label={`Choose ${plan.name}`}
          className={`p-3 border transition-colors ${
            isPopular
              ? "border-background hover:bg-background hover:text-accent"
              : "border-border group-hover:border-accent group-hover:text-accent"
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
