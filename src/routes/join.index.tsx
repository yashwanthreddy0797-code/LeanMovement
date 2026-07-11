import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PasswordInput } from "@/components/portal/PasswordInput";
import { INCLUDED_SUMMARY, PRICING_PLANS } from "@/lib/lean-kettlebell";
import { completeCheckout } from "@/lib/enrollment/checkout";
import { planSlugFromSearch } from "@/lib/enrollment/plans";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const Route = createFileRoute("/join/")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: planSlugFromSearch(search.plan as string | undefined),
    email: typeof search.email === "string" ? search.email : "",
    name: typeof search.name === "string" ? search.name : "",
  }),
  head: () => ({
    meta: [{ title: "Checkout — LEANMOVEMENT" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = Route.useNavigate();
  const { plan: initialPlan, email: emailFromSearch, name: nameFromSearch } = Route.useSearch();
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [fullName, setFullName] = useState(nameFromSearch);
  const [email, setEmail] = useState(emailFromSearch);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const activePlan = PRICING_PLANS.find((p) => p.id === selectedPlan) ?? PRICING_PLANS[0];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please accept the terms to continue");
      return;
    }

    setLoading(true);
    try {
      const result = await completeCheckout({
        email,
        fullName,
        planSlug: activePlan.id,
        phone: phone || undefined,
        password: password || (isSupabaseConfigured() ? "" : "demo123456"),
      });

      if (!result.ok) {
        toast.error(result.message ?? "Checkout failed");
        if ("redirectToLogin" in result && result.redirectToLogin) {
          await navigate({
            to: "/login",
            search: { redirect: "/portal/checkout", email: email.trim().toLowerCase() },
          });
        }
        return;
      }

      toast.success("Welcome — complete payment to unlock access");
      window.location.href = result.destination;
    } catch (err) {
      console.error("[checkout] failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container-x py-5 flex items-center justify-between">
          <Link to="/">
            <BrandLogo />
          </Link>
          <Link
            to="/login"
            search={{ redirect: "/portal/dashboard" }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="container-x py-10 md:py-14">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16">
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-10 space-y-6">
              <div>
                <p className="eyebrow">
                  <span className="w-5 h-px bg-accent" />
                  Lean Kettlebell™
                </p>
                <h1 className="type-h3 stack-head">{activePlan.name}</h1>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-[2rem] leading-none">{activePlan.price}</span>
                  <span className="text-sm text-muted-foreground">{activePlan.period}</span>
                </div>
                <p className="mt-4 type-body !max-w-none">{activePlan.description}</p>
              </div>

              <ul className="space-y-2.5">
                {INCLUDED_SUMMARY.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-foreground/70">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="border border-border bg-card p-7 md:p-8">
              <h2 className="type-h3">Checkout</h2>
              <p className="type-body stack-head !max-w-none">
                Create your account — portal unlocks after payment.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {PRICING_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`border px-3 py-3 text-left transition ${
                      selectedPlan === plan.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <div
                      className={`text-[9px] uppercase tracking-[0.16em] ${
                        selectedPlan === plan.id ? "text-background/50" : "text-muted-foreground"
                      }`}
                    >
                      {plan.tag}
                    </div>
                    <div className="mt-1 text-sm font-medium">{plan.price}</div>
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-4">
                <Field label="Full name">
                  <input
                    className="checkout-input"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Mehta"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    className="checkout-input"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="WhatsApp">
                  <input
                    type="tel"
                    className="checkout-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Password">
                  <PasswordInput
                    variant="boxed"
                    className="checkout-input"
                    required={isSupabaseConfigured()}
                    minLength={8}
                    value={password}
                    onChange={setPassword}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                </Field>

                <label className="flex items-start gap-3 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 accent-[var(--accent)]"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the terms and consent to sharing my details with LEANMOVEMENT.
                  </span>
                </label>

                <div className="flex items-start gap-3 text-xs text-muted-foreground bg-surface p-4">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-accent" />
                  <p>Account created in one step — then pay to unlock your portal.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-60"
                >
                  {loading ? "Processing…" : `Pay ${activePlan.price} & enter portal`}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1px solid var(--border);
          background: var(--background);
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
        }
        .checkout-input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
