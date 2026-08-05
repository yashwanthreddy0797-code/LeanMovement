import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  linkEnrollmentAfterSignup,
  provisionMemberForCheckout,
} from "@/lib/api/enrollment.functions";
import { getSupabase } from "@/lib/supabase/client";
import { signInWithEmail, signOutPortal } from "@/lib/portal/auth-api";
import { clearLocalEnrollment } from "@/lib/enrollment/storage";
import { submitEnrollment } from "@/lib/enrollment/submit";

export type CheckoutInput = {
  email: string;
  fullName: string;
  planSlug: string;
  phone?: string;
  password: string;
  sessionIds?: string[];
};

/**
 * Register account for payment - does NOT grant portal access yet.
 * Caller must open Razorpay and verify before entering the portal.
 * On payment cancel, caller should sign the user out.
 *
 * Uses server-side provisioning (email pre-confirmed) so "Confirm email"
 * never redirects away from Razorpay on the join page.
 */
export async function completeCheckout(input: CheckoutInput) {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const password = input.password;

  if (!fullName || !email || password.length < 8) {
    return { ok: false as const, message: "Name, email, and password (8+ chars) required" };
  }

  const enrollment = await submitEnrollment({
    email,
    fullName,
    planSlug: input.planSlug,
    phone: input.phone,
    sessionIds: input.sessionIds ?? [],
  });

  if (!enrollment.ok) {
    return { ok: false as const, message: enrollment.message ?? "Could not submit enrollment" };
  }

  if (!isSupabaseConfigured()) {
    clearLocalEnrollment();
    return {
      ok: true as const,
      needsPayment: false as const,
      destination: "/portal/intake" as const,
      userId: null as string | null,
      demo: true as const,
    };
  }

  const provisioned = await provisionMemberForCheckout({
    data: { email, password, fullName },
  });

  if (!provisioned.ok) {
    if ("needsSignIn" in provisioned && provisioned.needsSignIn) {
      return {
        ok: false as const,
        message: provisioned.message,
        redirectToLogin: true as const,
      };
    }
    return { ok: false as const, message: provisioned.message };
  }

  const { error: signInError } = await signInWithEmail(email, password);
  if (signInError) {
    // Existing account with a different password - send them to pay after login.
    if (!provisioned.created) {
      return {
        ok: false as const,
        message: "Account exists - sign in with your password to complete payment",
        redirectToLogin: true as const,
      };
    }
    return {
      ok: false as const,
      message: signInError || "Could not sign in after registration",
    };
  }

  await linkEnrollmentAfterSignup({ data: { email } });

  const supabase = getSupabase();
  const { data: sessionData } = await supabase!.auth.getSession();
  const userId = sessionData.session?.user.id ?? provisioned.userId;

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
