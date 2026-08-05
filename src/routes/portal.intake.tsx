import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { isIntakeComplete, useMemberIntake, useSubmitMemberIntake } from "@/hooks/useMemberIntake";
import { usePortalSession } from "@/lib/portal/session";
import {
  TRAINING_DAYS_OPTIONS,
  TRAINING_EXPERIENCE_OPTIONS,
  type TrainingDaysPerWeek,
  type TrainingExperience,
} from "@/lib/intake";
import { COACH } from "@/lib/lean-kettlebell";

export const Route = createFileRoute("/portal/intake")({
  head: () => ({ meta: [{ title: "Your profile - LEANMOVEMENT Portal" }] }),
  component: MemberIntakePage,
});

type FormState = {
  full_name: string;
  age: string;
  height: string;
  weight: string;
  occupation: string;
  goal: string;
  biggest_struggle: string;
  training_experience: TrainingExperience | "";
  training_days_per_week: TrainingDaysPerWeek | "";
  why_now: string;
  instagram_handle: string;
  phone: string;
};

function MemberIntakePage() {
  const session = usePortalSession();
  const navigate = useNavigate();
  const userId = session.user?.id;
  const { data: intakeResult, isLoading } = useMemberIntake(userId);
  const submitIntake = useSubmitMemberIntake(userId);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    full_name: "",
    age: "",
    height: "",
    weight: "",
    occupation: "",
    goal: "",
    biggest_struggle: "",
    training_experience: "",
    training_days_per_week: "",
    why_now: "",
    instagram_handle: "",
    phone: "",
  });

  useEffect(() => {
    if (!session.loading && !session.user) {
      void navigate({ to: "/login", search: { redirect: "/portal/intake" } });
    }
  }, [session.loading, session.user, navigate]);

  useEffect(() => {
    if (isLoading || !intakeResult?.ok) return;
    if (isIntakeComplete(intakeResult.intake) && !submitted) {
      void navigate({ to: "/portal/book-onboarding" });
      return;
    }
    const intake = intakeResult.intake;
    if (intake) {
      setForm({
        full_name: intake.full_name,
        age: intake.age ? String(intake.age) : "",
        height: intake.height ?? "",
        weight: intake.weight ?? "",
        occupation: intake.occupation ?? "",
        goal: intake.goal,
        biggest_struggle: intake.biggest_struggle ?? "",
        training_experience: intake.training_experience as TrainingExperience,
        training_days_per_week: intake.training_days_per_week as TrainingDaysPerWeek,
        why_now: intake.why_now ?? "",
        instagram_handle: intake.instagram_handle ?? "",
        phone: intake.phone ?? "",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      full_name: session.profile?.full_name ?? session.user?.name ?? prev.full_name,
    }));
  }, [intakeResult, isLoading, session.profile, session.user, navigate, submitted]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.training_experience || !form.training_days_per_week) {
      toast.error("Please select training experience and days per week");
      return;
    }

    try {
      const result = await submitIntake.mutateAsync({
        full_name: form.full_name,
        age: form.age ? Number(form.age) : null,
        height: form.height || null,
        weight: form.weight || null,
        occupation: form.occupation || null,
        goal: form.goal,
        biggest_struggle: form.biggest_struggle || null,
        training_experience: form.training_experience,
        training_days_per_week: form.training_days_per_week,
        why_now: form.why_now || null,
        instagram_handle: form.instagram_handle || null,
        phone: form.phone || null,
      });

      if (!result.ok) {
        toast.error("message" in result ? result.message : "Could not save your profile");
        return;
      }

      setSubmitted(true);
      toast.success("Profile saved — book your onboarding call next");
      void navigate({ to: "/portal/book-onboarding" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (session.loading || isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={24} />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-accent/10 text-accent">
          <Check size={24} />
        </div>
        <h1 className="font-display text-2xl uppercase tracking-[0.06em]">Profile saved</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Next: book your 30-minute onboarding call with {COACH.name.split(" ")[0]}.
        </p>
        <Link to="/portal/book-onboarding" className="portal-btn portal-btn-accent mt-8 inline-flex">
          Book onboarding call
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-16 lg:pb-0">
      <PortalPageHeader
        eyebrow="Welcome"
        title="Tell me about you"
        description="You're in. Help me coach you properly — then book your onboarding call."
      />

      <SoftCard className="!p-5 sm:!p-8">
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-10">
          <section className="space-y-5">
            <SectionHeading title="About you" />
            <Field label="Name" required>
              <input
                className="intake-input"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                autoComplete="name"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Age" required>
                <input
                  type="number"
                  min={13}
                  max={99}
                  className="intake-input"
                  required
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="32"
                />
              </Field>
              <Field label="Occupation">
                <input
                  className="intake-input"
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  placeholder="Software engineer, founder…"
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone" required>
                <input
                  type="tel"
                  className="intake-input"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Instagram handle">
                <input
                  className="intake-input"
                  value={form.instagram_handle}
                  onChange={(e) => setForm({ ...form, instagram_handle: e.target.value })}
                  placeholder="@yourhandle"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeading title="Height & weight" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Height" required>
                <input
                  className="intake-input"
                  required
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  placeholder="175 cm or 5'10&quot;"
                />
              </Field>
              <Field label="Weight" required>
                <input
                  className="intake-input"
                  required
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="72 kg or 160 lbs"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeading title="Your training" />
            <Field label="Goal" required>
              <textarea
                rows={3}
                className="intake-input resize-none"
                required
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="Get lean, build strength, feel athletic again…"
              />
            </Field>
            <Field label="Biggest struggle" required>
              <textarea
                rows={3}
                className="intake-input resize-none"
                required
                value={form.biggest_struggle}
                onChange={(e) => setForm({ ...form, biggest_struggle: e.target.value })}
                placeholder="Consistency, nutrition, knowing what to do in the gym…"
              />
            </Field>
            <Field label="Training experience" required>
              <select
                className="intake-input"
                required
                value={form.training_experience}
                onChange={(e) =>
                  setForm({ ...form, training_experience: e.target.value as TrainingExperience })
                }
              >
                <option value="" disabled>
                  Select one
                </option>
                {TRAINING_EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="How many days can you train?" required>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TRAINING_DAYS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, training_days_per_week: opt })}
                    className={`min-h-11 border px-3 py-2.5 text-sm transition ${
                      form.training_days_per_week === opt
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-border bg-white text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
          </section>

          <section className="space-y-5">
            <SectionHeading title="Why now?" />
            <Field label="What's driving you to start now?" required>
              <textarea
                rows={4}
                className="intake-input resize-none"
                required
                value={form.why_now}
                onChange={(e) => setForm({ ...form, why_now: e.target.value })}
                placeholder="A health wake-up call, wedding, tired of starting over…"
              />
            </Field>
          </section>

          <button
            type="submit"
            disabled={submitIntake.isPending}
            className="portal-btn portal-btn-accent w-full disabled:opacity-60"
          >
            {submitIntake.isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Saving…
              </span>
            ) : (
              "Save & continue"
            )}
          </button>
        </form>
      </SoftCard>

      <style>{`
        .intake-input {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.75rem 1rem;
          font-size: 1rem;
          color: var(--foreground);
          outline: none;
        }
        .intake-input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div>
      <h2 className="font-display text-lg uppercase tracking-[0.06em]">{title}</h2>
      <div className="mt-2 h-px w-10 bg-accent" />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
