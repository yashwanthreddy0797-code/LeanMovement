import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply For LEAN — LEANMOVEMENT" },
      { name: "description", content: "Apply for LEAN — the 90-day 1-on-1 mentorship by LEANMOVEMENT. Application only. Limited spots." },
      { property: "og:title", content: "Apply For LEAN — LEANMOVEMENT" },
      { property: "og:description", content: "90-day mentorship. Application only. Limited spots." },
    ],
  }),
  component: ApplyPage,
});

const INCLUDED = [
  "Everything in Fat Loss, Muscle Gain & Hybrid",
  "Lifetime access to every program",
  "Weekly 1-on-1 coaching call",
  "Technique reviews",
  "Priority messaging",
  "Travel & restaurant guides",
  "Progress dashboard",
  "Supplement guidance",
  "Personalized adjustments",
  "90 days of mentorship",
];

function ApplyPage() {
  const [goal, setGoal] = useState("");
  const [budget, setBudget] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application received. We'll reply within 48 hours.");
    (e.target as HTMLFormElement).reset();
    setGoal("");
    setBudget("");
  };

  return (
    <>
      <PageHero
        eyebrow="LEAN · 90 Day Mentorship"
        title="Apply for LEAN."
        subtitle="Application only. Limited spots. ₹29,999 for 90 days of structured, 1-on-1 mentorship."
        compact
      />

      <section className="bg-background border-t border-border">
        <div className="container-x py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Sidebar — what's included */}
            <aside className="lg:col-span-5">
              <FadeUp>
                <div className="eyebrow"><span className="w-6 h-px bg-accent" />What you get</div>
                <h2 className="mt-8 font-display text-3xl md:text-4xl uppercase tracking-[0.01em] leading-[1.05]">
                  Peak human performance.
                </h2>
                <p className="mt-6 text-foreground/75 leading-relaxed">
                  LEAN is the most direct path. Weekly calls, technique reviews, full program access
                  and a coach in your corner for 90 days.
                </p>
                <ul className="mt-10 space-y-3 text-[15px]">
                  {INCLUDED.map((i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 w-1 h-1 shrink-0 bg-accent" />
                      <span className="text-foreground/80">{i}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    Investment
                  </div>
                  <div className="mt-3 font-display text-5xl md:text-6xl text-foreground">
                    ₹29,999
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    90 days · limited spots
                  </div>
                </div>
              </FadeUp>
            </aside>

            {/* Form */}
            <FadeUp delay={0.15} className="lg:col-span-7">
              <form
                onSubmit={onSubmit}
                className="p-8 md:p-12 border border-border bg-card space-y-7"
              >
                <div>
                  <div className="eyebrow"><span className="w-6 h-px bg-accent" />Application</div>
                  <h2 className="mt-6 font-display text-3xl md:text-4xl uppercase tracking-[0.01em]">
                    Tell us about yourself.
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" name="name" required />
                  <Field label="Age" name="age" type="number" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" name="email" type="email" required />
                  <Field label="WhatsApp Number" name="whatsapp" type="tel" required />
                </div>
                <Field label="Location (City)" name="city" required />

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    Primary Goal
                  </label>
                  <Select value={goal} onValueChange={setGoal} required>
                    <SelectTrigger className="w-full bg-background border-border text-foreground h-12 rounded-none">
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fat-loss">Fat Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="hybrid">Hybrid / Engine</SelectItem>
                      <SelectItem value="performance">Performance / Strength</SelectItem>
                      <SelectItem value="longevity">Longevity / Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    Training Experience
                  </label>
                  <Select value={budget} onValueChange={setBudget} required>
                    <SelectTrigger className="w-full bg-background border-border text-foreground h-12 rounded-none">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner · 0–1 yr</SelectItem>
                      <SelectItem value="intermediate">Intermediate · 1–3 yrs</SelectItem>
                      <SelectItem value="advanced">Advanced · 3+ yrs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
                    Why LEAN? What are you trying to change?
                  </label>
                  <textarea
                    name="why"
                    rows={5}
                    required
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:border-accent focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.32em] hover:bg-accent transition-colors"
                >
                  Submit Application
                </button>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground text-center">
                  We reply within 48 hours.
                </p>
              </form>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full bg-background border border-border px-4 py-3 h-12 text-foreground focus:border-accent focus:outline-none"
      />
    </div>
  );
}
