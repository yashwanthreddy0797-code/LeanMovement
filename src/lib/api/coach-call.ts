import { requireAccessToken } from "@/lib/supabase/access-token";

export async function withCoachAuth(coachId: string | undefined) {
  const accessToken = await requireAccessToken();
  if (!coachId) throw new Error("Not signed in as coach");
  return { accessToken, coachId };
}
