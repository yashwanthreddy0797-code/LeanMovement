import { getSupabase, isSupabaseConfigured } from "./client";

/** Supabase JWT for authenticated server function calls. */
export async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabase()!.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error("Not signed in");
  return token;
}
