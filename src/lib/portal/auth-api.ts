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
