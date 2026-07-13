import { isSupabaseConfigured } from "@/lib/supabase/client";
import { linkEnrollmentAfterSignup } from "@/lib/api/enrollment.functions";
import { getSupabase } from "@/lib/supabase/client";
import { signInWithEmail, signOutPortal, signUpWithEmail } from "@/lib/portal/auth-api";
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

/**
 * Register account for payment — does NOT grant portal access yet.
 * Caller must open Razorpay and verify before entering the portal.
 * On payment cancel, caller should sign the user out.
 */
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

  if (!isSupabaseConfigured()) {
    clearLocalEnrollment();
    return {
      ok: true as const,
      needsPayment: false as const,
      destination: "/portal/dashboard" as const,
      userId: null as string | null,
      demo: true as const,
    };
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
        message: "Account exists — sign in with your password to complete payment",
        redirectToLogin: true as const,
      };
    }
    await linkEnrollmentAfterSignup({ data: { email } });
  } else {
    await linkEnrollmentAfterSignup({ data: { email } });
    const { error: signInError } = await signInWithEmail(email, password);
    if (signInError) {
      return {
        ok: false as const,
        message: "Account created. Confirm your email if required, then sign in to pay.",
        redirectToLogin: true as const,
      };
    }
  }

  const supabase = getSupabase();
  const { data: sessionData } = await supabase!.auth.getSession();
  const userId = sessionData.session?.user.id ?? null;

  if (!userId) {
    return { ok: false as const, message: "Could not establish session for payment" };
  }

  clearLocalEnrollment();

  return {
    ok: true as const,
    needsPayment: true as const,
    userId,
    email,
    fullName,
    phone: input.phone ?? null,
  };
}

/** If payment is abandoned on /join, sign out so portal stays locked. */
export async function abandonUnpaidRegistration() {
  await signOutPortal();
}
