import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Onboarding } from "@/lib/supabase/types";

const DEMO_ONBOARDING: Onboarding = {
  user_id: "demo",
  foundations_booked_at: new Date().toISOString(),
  foundations_completed_at: new Date().toISOString(),
  whatsapp_joined: true,
  session_ids: ["tue-am", "thu-am", "sat-am"],
  sessions_selected_at: new Date().toISOString(),
};

export function useMemberOnboarding(userId?: string | null) {
  return useQuery({
    queryKey: ["member-onboarding", userId],
    queryFn: async (): Promise<Onboarding | null> => {
      if (!userId) return null;
      if (!isSupabaseConfigured()) return DEMO_ONBOARDING;

      const supabase = getSupabase()!;
      const { data, error } = await supabase
        .from("onboarding")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.warn("[member-onboarding] fetch failed", error.message);
        return null;
      }
      return data as Onboarding | null;
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}

export function useMarkWhatsAppJoined(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId || !isSupabaseConfigured()) return;
      const supabase = getSupabase()!;
      const { error } = await supabase
        .from("onboarding")
        .update({ whatsapp_joined: true })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["member-onboarding", userId] });
    },
  });
}

/** Mark Foundations as booked when member opens Calendly (coach still marks completed). */
export function useMarkFoundationsBooked(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId || !isSupabaseConfigured()) return;
      const supabase = getSupabase()!;
      const bookedAt = new Date().toISOString();
      const { data: existing } = await supabase
        .from("onboarding")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      const { error } = existing
        ? await supabase
            .from("onboarding")
            .update({ foundations_booked_at: bookedAt })
            .eq("user_id", userId)
        : await supabase.from("onboarding").insert({
            user_id: userId,
            foundations_booked_at: bookedAt,
          });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["member-onboarding", userId] });
    },
  });
}
