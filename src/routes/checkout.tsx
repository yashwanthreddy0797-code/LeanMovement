import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";

type PlanInfo = {
  name: string;
  tag: string;
  tagline: string;
  price: string;
  priceNumber: number;
  period: string;
  highlights: string[];
};

const PLANS: Record<string, PlanInfo> = {
  "Fat Loss": {
    name: "Fat Loss",
    tag: "Self-Guided · 12 Weeks",
    tagline: "Lose fat. Build momentum.",
    price: "₹5,999",
    priceNumber: 5999,
    period: "one-time payment · lifetime access",
    highlights: [
      "12 week structured program",
      "Lifetime access & updates",
      "Nutrition guide + macros",
      "Mobility & exercise library",
      "Travel & restaurant guides",
    ],
  },
  "Strength Gain": {
    name: "Strength Gain",
    tag: "Self-Guided · 12 Weeks",
    tagline: "Build size & strength.",
    price: "₹5,999",
    priceNumber: 5999,
    period: "one-time payment · lifetime access",
    highlights: [
      "12 week strength plan",
      "Upper / Lower split",
      "Progressive overload framework",
      "Warm-up & mobility protocols",
      "Nutrition guide for gaining",
    ],
  },
  Hybrid: {
    name: "Hybrid",
    tag: "Best Seller · 12 Weeks",
    tagline: "Strength. Engine. Longevity.",
    price: "₹6,999",
    priceNumber: 6999,
    period: "one-time payment · lifetime access",
    highlights: [
      "12 week hybrid program",
      "Strength + conditioning + Zone 2",
      "3 / 4 / 5 day options",
      "Running & kettlebell guides",
      "Recovery & nutrition framework",
    ],
  },
};

const searchSchema = z.object({
  plan: z.enum(["Fat Loss", "Strength Gain", "Hybrid"]).catch("Hybrid"),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Checkout — LEANMOVEMENT" },
      { name: "description", content: "Secure checkout for LEANMOVEMENT programs. Lifetime access, no recurring charges." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { plan } = Route.useSearch();
  const info = PLANS[plan];
  const [submitted, setSubmitted] = useState(false);

  const gst = Math.round(info.priceNumber * 0.18);
  const total = info.priceNumber + gst;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <>
      <PageHero eyebrow="Checkout" title="Almost in." subtitle="Review your program and complete your details. Payment is processed securely on the next step." compact />

      <section className="bg-background">
        <div className="container-x py-16 md:py-24">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} /> Back to programs
          </Link>

          <div className="mt-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
            {/* LEFT — Order summary */}
            <FadeUp className="lg:col-span-5 order-2 lg:order-1">
              <div className="border border-border bg-surface p-8 md:p-10 sticky top-24">
                <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Order summary
                </span>

                <h2 className="mt-4 font-display text-4xl md:text-5xl uppercase tracking-[0.01em] leading-[0.95]">
                  {info.name}
                </h2>
                <p className="mt-3 font-serif text-lg text-foreground/80">{info.tagline}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {info.tag}
                </p>

                <ul className="mt-8 space-y-3 text-sm">
                  {info.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <Check size={14} className="mt-1.5 shrink-0 text-accent" />
                      <span className="text-foreground/80">{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-8 border-t border-border space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Program</span>
                    <span>{fmt(info.priceNumber)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>{fmt(gst)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border">
                    <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground self-center">
                      Total
                    </span>
                    <span className="font-display text-3xl">{fmt(total)}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground pt-2">
                    {info.period}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={14} className="text-accent" />
                  30-day satisfaction guarantee
                </div>
              </div>
            </FadeUp>

            {/* RIGHT — Form */}
            <FadeUp delay={0.1} className="lg:col-span-7 order-1 lg:order-2">
              {submitted ? (
                <div className="border border-border bg-surface p-10 md:p-14">
                  <Check size={32} className="text-accent" />
                  <h2 className="mt-6 font-display text-4xl md:text-5xl uppercase tracking-[0.01em] leading-[0.95]">
                    Order received.
                  </h2>
                  <p className="mt-5 font-serif text-lg text-foreground/80">
                    Thanks for choosing {info.name}. We've sent payment instructions and program access details to your email.
                  </p>
                  <Link
                    to="/programs"
                    className="mt-10 inline-flex w-fit items-center px-8 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
                  >
                    Back to programs
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-12"
                >
                  <FormSection step="01" title="Your details">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="First name" name="firstName" required />
                      <Field label="Last name" name="lastName" required />
                      <Field label="Email" name="email" type="email" required />
                      <Field label="Phone" name="phone" type="tel" required placeholder="+91 …" />
                    </div>
                  </FormSection>

                  <FormSection step="02" title="Billing address">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <Field label="Address" name="address" required />
                      </div>
                      <Field label="City" name="city" required />
                      <Field label="State" name="state" required />
                      <Field label="Postal code" name="postal" required />
                      <Field label="Country" name="country" defaultValue="India" required />
                    </div>
                  </FormSection>

                  <FormSection step="03" title="Payment">
                    <div className="space-y-5">
                      <Field label="Cardholder name" name="cardName" required />
                      <Field label="Card number" name="cardNumber" placeholder="1234 5678 9012 3456" required />
                      <div className="grid grid-cols-2 gap-5">
                        <Field label="Expiry (MM/YY)" name="exp" placeholder="08/28" required />
                        <Field label="CVC" name="cvc" placeholder="123" required />
                      </div>
                    </div>
                  </FormSection>

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      className="inline-flex w-full sm:w-fit items-center justify-center gap-2 px-10 py-5 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
                    >
                      <Lock size={14} /> Pay {fmt(total)}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      By completing your purchase you agree to the terms of service. This is a demo checkout — no real payment is processed.
                    </p>
                  </div>
                </form>
              )}
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

function FormSection({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-6 pb-4 border-b border-border">
        <span className="font-display text-2xl text-accent">{step}</span>
        <h3 className="font-display text-2xl md:text-3xl uppercase tracking-[0.01em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}{required && " *"}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full bg-transparent border-b border-border px-0 py-3 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
      />
    </label>
  );
}
