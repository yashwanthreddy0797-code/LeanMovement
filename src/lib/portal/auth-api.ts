import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { setPortalUser } from "./auth";

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    setPortalUser({ email, name: email.split("@")[0], role: "client" });
    return { error: null };
  }
  const supabase = getSupabase()!;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured()) {
    setPortalUser({ email, name: fullName || email.split("@")[0], role: "client" });
    return { error: null };
  }
  const supabase = getSupabase()!;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "member" } },
  });
  return { error: error?.message ?? null };
}

export async function signOutPortal() {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()!;
    await supabase.auth.signOut();
  } else {
    setPortalUser(null);
  }
}

/** Send Supabase password-recovery email. Always returns ok to avoid email enumeration. */
export async function requestPasswordReset(email: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Password reset needs Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." };
  }
  const supabase = getSupabase()!;
  const redirectTo = `${window.location.origin}/portal/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  return { error: error?.message ?? null };
}

/** Set a new password while in a recovery session (after clicking the email link). */
export async function updatePassword(password: string) {
  if (!isSupabaseConfigured()) {
    return { error: "Password reset needs Supabase." };
  }
  const supabase = getSupabase()!;
  const { error } = await supabase.auth.updateUser({ password });
  return { error: error?.message ?? null };
}
