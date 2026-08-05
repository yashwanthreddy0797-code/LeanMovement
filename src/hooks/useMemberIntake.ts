import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMemberIntake, submitMemberIntake, type MemberIntakeInput } from "@/lib/api/intake.functions";
import { getDemoMemberIntake, saveDemoMemberIntake } from "@/lib/intake-demo";
import { requireAccessToken } from "@/lib/supabase/access-token";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { MemberIntake } from "@/lib/supabase/types";

export function useMemberIntake(userId?: string | null) {
  return useQuery({
    queryKey: ["member-intake", userId],
    queryFn: async () => {
      if (!userId) return { ok: true as const, intake: null as MemberIntake | null };
      if (!isSupabaseConfigured()) {
        return { ok: true as const, intake: getDemoMemberIntake() };
      }

      const accessToken = await requireAccessToken();
      return getMemberIntake({ data: { accessToken, userId } });
    },
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}

export function useSubmitMemberIntake(userId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<MemberIntakeInput, "userId">) => {
      if (!userId) throw new Error("Not signed in");
      if (!isSupabaseConfigured()) {
        const now = new Date().toISOString();
        saveDemoMemberIntake({
          user_id: userId,
          full_name: input.full_name,
          age: input.age ?? null,
          height: input.height ?? null,
          weight: input.weight ?? null,
          occupation: input.occupation ?? null,
          goal: input.goal,
          biggest_struggle: input.biggest_struggle ?? null,
          training_experience: input.training_experience,
          training_days_per_week: input.training_days_per_week,
          why_now: input.why_now ?? null,
          instagram_handle: input.instagram_handle ?? null,
          phone: input.phone ?? null,
          completed_at: now,
          updated_at: now,
        });
        return { ok: true as const };
      }

      const accessToken = await requireAccessToken();
      return submitMemberIntake({ data: { ...input, userId, accessToken } });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["member-intake", userId] });
    },
  });
}

export function isIntakeComplete(intake: MemberIntake | null | undefined) {
  return Boolean(intake?.completed_at);
}
