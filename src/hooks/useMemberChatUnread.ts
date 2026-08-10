import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { threadUnreadForRole } from "@/lib/portal/chat";
import type { ChatThread } from "@/lib/supabase/types";

/** Lightweight unread flag for member nav badge. */
export function useMemberChatUnread(memberId: string | undefined, enabled = true) {
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    if (!enabled || !memberId || !isSupabaseConfigured()) {
      setUnread(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;

    const refresh = async () => {
      const { data } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("member_id", memberId)
        .maybeSingle();
      if (cancelled) return;
      setUnread(data ? threadUnreadForRole(data as ChatThread, "member") : false);
    };

    void refresh();

    const channel = supabase
      .channel(`member_chat_unread_${memberId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_threads", filter: `member_id=eq.${memberId}` },
        () => {
          void refresh();
        },
      )
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        void refresh();
      })
      .subscribe();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [enabled, memberId]);

  return unread;
}
