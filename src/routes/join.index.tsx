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
      // Full navigation so portal picks up the new auth session immediately
      window.location.href = result.destination;
    } catch (err) {
      console.error("[checkout] failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container-x py-5 flex items-center justify-between">
          <Link to="/">
            <BrandLogo />
          </Link>
          <Link
            to="/login"
            search={{ redirect: "/portal/dashboard" }}
            className="text-xs uppercase tracking-[0.2em] text-[#737373] hover:text-[#000000]"
          >
            Already a member? Sign in
          </Link>
        </div>
      </header>

      <div className="container-x py-10 md:py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Plan summary — compact, no scroll wall */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-10 space-y-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--accent)]">
                  Lean Kettlebell™
                </div>
                <h1 className="mt-2 font-serif text-3xl md:text-4xl text-[#000000]">
                  {activePlan.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-[#000000]">{activePlan.price}</span>
                  <span className="text-sm text-[#737373]">{activePlan.period}</span>
                </div>
                <p className="mt-3 text-sm text-[#737373] leading-relaxed">{activePlan.description}</p>
              </div>

              <ul className="space-y-2.5">
                {INCLUDED_SUMMARY.slice(0, 5).map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-[#404040]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Checkout form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-[#000000]">Checkout</h2>
              <p className="mt-1 text-sm text-[#737373]">
                Create your account and pay — portal access unlocks after payment.
              </p>

              {/* Plan picker — compact */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {PRICING_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      selectedPlan === plan.id
                        ? "border-[#000000] bg-[#000000] text-white"
                        : "border-[var(--border)] hover:border-[#000000]/30"
                    }`}
                  >
                    <div
                      className={`text-[9px] uppercase tracking-[0.2em] ${
                        selectedPlan === plan.id ? "text-white/60" : "text-[#737373]"
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
                    className="mt-1 accent-[#E11D2A]"
                  />
                  <span className="text-xs text-[#737373] leading-relaxed">
                    I agree to the terms and consent to sharing my details with LEANMOVEMENT for
                    membership and coaching.
                  </span>
                </label>

                <div className="pt-2 flex items-start gap-3 text-xs text-[#737373] bg-[#FAFAFA] rounded-xl p-4">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                  <p>One click — account created, then pay to unlock your portal.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-4 rounded-xl bg-[#000000] text-white text-sm font-medium hover:bg-[#111111] transition disabled:opacity-60"
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
          border-radius: 12px;
          background: #fff;
          font-size: 0.875rem;
          color: #000;
          outline: none;
        }
        .checkout-input:focus {
          border-color: #FCA5A5;
          box-shadow: 0 0 0 3px rgba(225, 29, 42, 0.08);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-[#737373] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
