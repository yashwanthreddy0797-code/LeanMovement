import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

/** Refetch member portal content when coach updates live_sessions in Supabase */
export function useLiveSessionsRealtime(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isSupabaseConfigured()) return;

    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("live_sessions_sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_sessions" },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["portal-content", "v3"] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);
}
