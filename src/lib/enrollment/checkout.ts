import { isSupabaseConfigured } from "@/lib/supabase/client";
import { linkEnrollmentAfterSignup } from "@/lib/api/enrollment.functions";
import { signInWithEmail, signUpWithEmail } from "@/lib/portal/auth-api";
import { clearLocalEnrollment } from "@/lib/enrollment/storage";
import { submitEnrollment } from "@/lib/enrollment/submit";

export type CheckoutInput = {
  email: string;
  fullName: string;
  planSlug: string;
  phone?: string;
  password: string;
  sessionIds: string[];
};

/** One-step checkout: enroll → create account → sign in */
export async function completeCheckout(input: CheckoutInput) {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const password = input.password;

  if (!fullName || !email || password.length < 8) {
    return { ok: false as const, message: "Name, email, and password (8+ chars) required" };
  }

  if (!input.sessionIds || input.sessionIds.length !== 3) {
    return { ok: false as const, message: "Please choose exactly 3 sessions" };
  }

  const enrollment = await submitEnrollment({
    email,
    fullName,
    planSlug: input.planSlug,
    phone: input.phone,
    sessionIds: input.sessionIds,
  });

  if (!enrollment.ok) {
    return { ok: false as const, message: enrollment.message ?? "Could not submit enrollment" };
  }

  const { error: signUpError } = await signUpWithEmail(email, password, fullName);
  if (signUpError) {
    const alreadyExists = /already registered|already exists/i.test(signUpError);
    if (!alreadyExists) {
      return { ok: false as const, message: signUpError };
    }
    const { error: signInError } = await signInWithEmail(email, password);
    if (signInError) {
      return {
        ok: false as const,
        message: "Account exists — sign in with your password",
        redirectToLogin: true as const,
      };
    }
    if (isSupabaseConfigured()) {
      await linkEnrollmentAfterSignup({ data: { email } });
    }
  } else if (isSupabaseConfigured()) {
    await linkEnrollmentAfterSignup({ data: { email } });
    const { error: signInError } = await signInWithEmail(email, password);
    if (signInError) {
      return {
        ok: false as const,
        message: "Account created. Check your email to confirm, then sign in.",
        redirectToLogin: true as const,
      };
    }
  }

  clearLocalEnrollment();

  return {
    ok: true as const,
    destination: "/portal/checkout" as const,
  };
}
