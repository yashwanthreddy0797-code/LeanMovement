import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ZoomMark } from "@/components/brand/ZoomMark";
import { PasswordInput } from "@/components/portal/PasswordInput";
import { INCLUDED_SUMMARY, PRICING_PLANS } from "@/lib/lean-kettlebell";
import { abandonUnpaidRegistration, completeCheckout } from "@/lib/enrollment/checkout";
import { planSlugFromSearch, PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  createMemberRazorpayOrder,
  verifyMemberRazorpayPayment,
} from "@/lib/api/membership.functions";
import {
  loadRazorpayScript,
  openRazorpayCheckout,
  preloadRazorpayScript,
} from "@/lib/razorpay/checkout-client";
import { formatInr } from "@/lib/portal/member-format";

export const Route = createFileRoute("/join/")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan: planSlugFromSearch(search.plan as string | undefined),
    email: typeof search.email === "string" ? search.email : "",
    name: typeof search.name === "string" ? search.name : "",
  }),
  head: () => ({
    meta: [{ title: "Join - LEANMOVEMENT" }],
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
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payStep, setPayStep] = useState<"form" | "paying" | "verifying">("form");

  // Warm Checkout.js while the member fills the form so Proceed opens faster.
  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  const runPayment = async (userId: string, prefill: { email: string; name: string; phone?: string | null }) => {
    setPayStep("paying");

    // Create subscription/order and finish loading Checkout.js in parallel.
    const [order] = await Promise.all([
      createMemberRazorpayOrder({ data: { userId, kind: "initial" } }),
      loadRazorpayScript(),
    ]);

    if (!order.ok) {
      await abandonUnpaidRegistration();
      toast.error(order.message ?? "Could not start payment");
      setPayStep("form");
      return;
    }

    try {
      await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "LEANMOVEMENT",
        description: `Lean Movement · ${formatInr(order.amountInr)}/mo`,
        order_id: order.orderId ?? undefined,
        subscription_id: order.subscriptionId ?? undefined,
        prefill: {
          email: prefill.email,
          name: prefill.name,
          contact: prefill.phone?.replace(/\s/g, "") || undefined,
        },
        theme: { color: "#E11D2A" },
        onSuccess: async (response) => {
          setPayStep("verifying");
          const verified = await verifyMemberRazorpayPayment({
            data: {
              userId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              kind: "initial",
            },
          });

          if (!verified.ok) {
            await abandonUnpaidRegistration();
            toast.error(verified.message ?? "Payment verification failed");
            setPayStep("form");
            return;
          }

          toast.success("Payment confirmed - welcome to your portal");
          window.location.href = "/portal/intake";
        },
        onDismiss: () => {
          void abandonUnpaidRegistration().then(() => {
            toast.message("Payment required to join. Your account is saved - sign in and pay to continue.");
            setPayStep("form");
          });
        },
      });
    } catch (err) {
      await abandonUnpaidRegistration();
      if (err instanceof Error && err.message !== "Payment cancelled") {
        toast.error(err.message || "Payment failed");
      }
      setPayStep("form");
    }
  };

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
        toast.error(result.message ?? "Registration failed");
        if ("redirectToLogin" in result && result.redirectToLogin) {
          // Existing account - after login, open portal checkout (not join form again).
          await navigate({
            to: "/login",
            search: {
              redirect: "/portal/checkout",
              email: email.trim().toLowerCase(),
            },
          });
        }
        return;
      }

      if ("demo" in result && result.demo) {
        toast.success("Demo mode - entering portal");
        window.location.href = result.destination;
        return;
      }

      if (result.needsPayment && result.userId) {
        toast.message("Complete payment to open your portal");
        await runPayment(result.userId, {
          email: result.email,
          name: result.fullName,
          phone: result.phone,
        });
        return;
      }
    } catch (err) {
      console.error("[join] failed", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || payStep === "paying" || payStep === "verifying";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container-x py-5 flex items-center justify-between">
          <Link to="/">
            <BrandLogo />
          </Link>
          <Link
            to="/login"
            search={{ redirect: "/join" }}
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
                <div className="mt-4">
                  <ZoomMark size="sm" label="live sessions" />
                </div>
              </div>

              <ul className="space-y-3">
                {INCLUDED_SUMMARY.map((item) => (
                  <li key={item} className="flex gap-3 text-base leading-relaxed text-foreground/80">
                    <Check size={16} className="mt-1 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border border-border bg-surface p-5 text-sm leading-relaxed text-muted-foreground">
                <p className="font-medium text-foreground">Secure checkout</p>
                <p>Pay {formatInr(PROGRAM_AMOUNT_INR)} on this page. Portal access opens after payment is verified.</p>
                <p>Training and personalised nutrition are included. After you join, book your Foundations session with me from the portal.</p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="border border-border bg-card p-7 md:p-8">
              <h2 className="type-h3">Join & pay</h2>
              <p className="type-body stack-head !max-w-none">
                Create your account and pay securely. Portal access opens after payment is verified.
              </p>

              {payStep !== "form" && (
                <div className="mt-6 flex items-center gap-3 border border-border p-4 text-sm">
                  <Loader2 className="animate-spin text-accent shrink-0" size={18} />
                  <span>
                    {payStep === "paying" && "Opening secure Razorpay checkout…"}
                    {payStep === "verifying" && "Verifying payment with Razorpay…"}
                  </span>
                </div>
              )}

              <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5">
                <Field label="Full name">
                  <input
                    className="checkout-input"
                    required
                    disabled={busy}
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
                    disabled={busy}
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
                    disabled={busy}
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
                    disabled={busy}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 accent-[var(--accent)]"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the terms and consent to sharing my details with LEANMOVEMENT and my coach.
                    Membership renews monthly.
                  </span>
                </label>

                <div className="flex items-start gap-3 border border-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                  <p>
                    Razorpay secure checkout opens next. I&apos;m notified after payment succeeds.
                    Portal login opens only when payment is verified on our server.
                  </p>
                </div>

                <button type="submit" disabled={busy} className="w-full btn-primary disabled:opacity-60">
                  {busy ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Pay ${activePlan.price} & join`
                  )}
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
          font-size: 1rem;
          color: var(--foreground);
          outline: none;
        }
        .checkout-input:focus {
          border-color: var(--accent);
        }
        .checkout-input:disabled {
          opacity: 0.6;
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
