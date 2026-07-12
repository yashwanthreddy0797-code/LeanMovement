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
import {
  SESSION_SLOTS,
  SESSION_WINDOWS,
  SESSIONS_TO_PICK,
  slotsForWindow,
} from "@/lib/sessions";

export const Route = createFileRoute("/join/")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: planSlugFromSearch(search.plan as string | undefined),
    email: typeof search.email === "string" ? search.email : "",
    name: typeof search.name === "string" ? search.name : "",
  }),
  head: () => ({
    meta: [{ title: "Join — LEANMOVEMENT" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = Route.useNavigate();
  const { email: emailFromSearch, name: nameFromSearch } = Route.useSearch();
  const activePlan = PRICING_PLANS[0];
  const [fullName, setFullName] = useState(nameFromSearch);
  const [email, setEmail] = useState(emailFromSearch);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSession = (id: string) => {
    setSelectedSessions((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= SESSIONS_TO_PICK) {
        toast.message(`Pick exactly ${SESSIONS_TO_PICK} sessions`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSessions.length !== SESSIONS_TO_PICK) {
      toast.error(`Choose ${SESSIONS_TO_PICK} sessions to continue`);
      return;
    }

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
        sessionIds: selectedSessions,
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

      toast.success("Registered — your coach has been notified. Complete payment next.");
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
                  One program
                </p>
                <h1 className="type-h3 stack-head">{activePlan.name}</h1>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-[2rem] leading-none">{activePlan.price}</span>
                  <span className="text-sm text-muted-foreground">{activePlan.period}</span>
                </div>
                <p className="mt-4 type-body !max-w-none">{activePlan.description}</p>
              </div>

              <ul className="space-y-2.5">
                {INCLUDED_SUMMARY.map((item) => (
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
              <h2 className="type-h3">Join</h2>
              <p className="type-body stack-head !max-w-none">
                Create your account, pick 3 sessions, then pay. Your coach is notified on registration.
              </p>

              <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5">
                <div>
                  <div className="flex items-end justify-between gap-4 mb-3">
                    <span className="block text-xs text-muted-foreground">
                      Choose {SESSIONS_TO_PICK} sessions
                    </span>
                    <span className="text-xs font-medium text-accent">
                      {selectedSessions.length}/{SESSIONS_TO_PICK}
                    </span>
                  </div>

                  <div className="space-y-5">
                    {SESSION_WINDOWS.map((window) => (
                      <div key={window.id}>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
                          {window.label} · {window.days} · {window.time}
                        </p>
                        <div className="grid gap-2">
                          {slotsForWindow(window.id).map((slot) => {
                            const on = selectedSessions.includes(slot.id);
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => toggleSession(slot.id)}
                                className={`border px-4 py-3 text-left transition ${
                                  on
                                    ? "border-foreground bg-foreground text-background"
                                    : "border-border hover:border-foreground/40"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-medium">
                                      {slot.day} · {slot.focus}
                                    </div>
                                    <div
                                      className={`mt-0.5 text-xs ${
                                        on ? "text-background/60" : "text-muted-foreground"
                                      }`}
                                    >
                                      {slot.timeLabel} · {slot.brief}
                                    </div>
                                  </div>
                                  <div
                                    className={`w-4 h-4 border shrink-0 grid place-items-center ${
                                      on ? "border-accent bg-accent" : "border-current/30"
                                    }`}
                                  >
                                    {on && <Check size={10} className="text-white" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {SESSION_SLOTS.length} slots available · mix morning and evening if you want
                  </p>
                </div>

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
                    I agree to the terms and consent to sharing my details with LEANMOVEMENT and my coach.
                  </span>
                </label>

                <div className="flex items-start gap-3 text-xs text-muted-foreground bg-white border border-border p-4">
                  <ShieldCheck size={16} className="shrink-0 mt-0.5 text-accent" />
                  <p>Your coach is notified as soon as you register. Portal unlocks after payment.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-60"
                >
                  {loading ? "Processing…" : `Continue · ${activePlan.price}/mo`}
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
