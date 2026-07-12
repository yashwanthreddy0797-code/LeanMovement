import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createEnrollment, linkEnrollmentAfterSignup } from "@/lib/api/enrollment.functions";
import { planAmountInr, toMembershipPlan } from "@/lib/enrollment/plans";
import { saveLocalEnrollment } from "@/lib/enrollment/storage";

export type SubmitEnrollmentInput = {
  email: string;
  fullName: string;
  planSlug: string;
  phone?: string;
  sessionIds: string[];
};

export async function submitEnrollment(input: SubmitEnrollmentInput) {
  const plan = toMembershipPlan(input.planSlug);
  const amountInr = planAmountInr(plan);
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (!isSupabaseConfigured()) {
    saveLocalEnrollment({
      email,
      fullName,
      plan,
      planSlug: input.planSlug,
      amountInr,
      sessionIds: input.sessionIds,
      submittedAt: new Date().toISOString(),
    });
    return { ok: true as const, mode: "demo" as const };
  }

  const result = await createEnrollment({
    data: {
      email,
      fullName,
      planSlug: input.planSlug,
      phone: input.phone,
      sessionIds: input.sessionIds,
    },
  });

  if (!result.ok) {
    return { ok: false as const, message: result.message ?? "Could not submit enrollment" };
  }

  saveLocalEnrollment({
    email,
    fullName,
    plan,
    planSlug: input.planSlug,
    amountInr,
    sessionIds: input.sessionIds,
    submittedAt: new Date().toISOString(),
  });

  return {
    ok: true as const,
    mode: "supabase" as const,
    enrollmentId: result.enrollmentId,
    usedFallback: "usedFallback" in result ? result.usedFallback : false,
  };
}

export async function applyEnrollmentToNewAccount(email: string) {
  if (!isSupabaseConfigured()) return { ok: true as const };
  return linkEnrollmentAfterSignup({ data: { email: email.trim().toLowerCase() } });
}
