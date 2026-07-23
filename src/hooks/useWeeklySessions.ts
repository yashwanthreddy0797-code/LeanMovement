import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMemberWeeklySessions,
  recordSessionJoin,
  saveMemberWeeklySessions,
} from "@/lib/api/weekly-sessions.functions";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SESSIONS_TO_PICK } from "@/lib/sessions";

const DEMO_WEEKLY = {
  ok: true as const,
  weekStart: "2026-07-14",
  weekLabel: "14 Jul – 20 Jul 2026",
  pickedIds: [] as string[],
  attendedSlotIds: [] as string[],
  attended: [] as { slotId: string; attendedAt: string }[],
  slots: [] as Array<{
    slotId: string;
    day: string;
    focus: string;
    timeLabel: string;
    brief: string;
    joinUrl: string | null;
    liveState: "live" | "soon" | "later";
    attended: boolean;
    attendedAt: string | null;
  }>,
  picksComplete: false,
  attendedCount: 0,
  updatedAt: null as string | null,
};

export function useWeeklySessions(userId?: string | null) {
  return useQuery({
    queryKey: ["weekly-sessions", userId],
    queryFn: async () => {
      if (!userId) return null;
      if (!isSupabaseConfigured()) return DEMO_WEEKLY;
      return getMemberWeeklySessions({ data: { userId } });
    },
    enabled: Boolean(userId),
    staleTime: 20_000,
    refetchInterval: 60_000,
  });
}

export function useWeeklySessionActions(userId?: string | null) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["weekly-sessions", userId] });

  const savePicks = async (sessionIds: string[]) => {
    if (!userId) return { ok: false as const, message: "Not signed in" };
    if (!isSupabaseConfigured()) {
      return { ok: true as const, sessionIds };
    }
    const result = await saveMemberWeeklySessions({ data: { userId, sessionIds } });
    if (result.ok) invalidate();
    return result;
  };

  const joinSession = async (sessionSlotId: string) => {
    if (!userId) return { ok: false as const, message: "Not signed in" };
    if (!isSupabaseConfigured()) {
      return { ok: true as const, attendedAt: new Date().toISOString() };
    }
    const result = await recordSessionJoin({ data: { userId, sessionSlotId } });
    if (result.ok) invalidate();
    return result;
  };

  return { savePicks, joinSession, invalidate };
}

export function needsWeeklyPicks(
  data: Awaited<ReturnType<typeof getMemberWeeklySessions>> | null | undefined,
) {
  if (!data || !("ok" in data) || !data.ok) return true;
  return data.pickedIds.length < SESSIONS_TO_PICK;
}
