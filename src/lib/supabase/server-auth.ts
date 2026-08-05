import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "./server";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuthUser(accessToken: string): Promise<User> {
  const admin = getSupabaseAdmin();
  if (!admin) throw new AuthError("Server not configured");

  const { data, error } = await admin.auth.getUser(accessToken);
  if (error || !data.user) throw new AuthError("Unauthorized");
  return data.user;
}

export async function requireMemberCaller(accessToken: string, userId: string) {
  const user = await requireAuthUser(accessToken);
  if (user.id !== userId) throw new AuthError("Forbidden");
  return { admin: getSupabaseAdmin()!, user };
}

export async function requireCoachCaller(accessToken: string, coachId: string) {
  const user = await requireAuthUser(accessToken);
  if (user.id !== coachId) throw new AuthError("Forbidden");

  const admin = getSupabaseAdmin()!;
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "coach" && profile.role !== "admin")) {
    throw new AuthError("Coach access required");
  }

  return { admin, user, coachId: user.id };
}

export function authErrorMessage(err: unknown) {
  return err instanceof AuthError ? err.message : "Unauthorized";
}
