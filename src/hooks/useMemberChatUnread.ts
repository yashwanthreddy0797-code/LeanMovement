import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { countUnreadMessages } from "@/lib/portal/chat";
import type { ChatThread } from "@/lib/supabase/types";

/** Unread message count for member nav badge. */
export function useMemberChatUnread(memberId: string | undefined, enabled = true) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled || !memberId || !isSupabaseConfigured()) {
      setUnreadCount(0);
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
      if (!data) {
        setUnreadCount(0);
        return;
      }
      const count = await countUnreadMessages(data as ChatThread, "member");
      if (!cancelled) setUnreadCount(count);
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

  return unreadCount;
}
