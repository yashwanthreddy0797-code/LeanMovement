import { useCallback, useEffect, useId, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  ensureCoachThread,
  ensureMemberThread,
  listCoachInbox,
  listThreadMessages,
  markThreadRead,
  sendChatMessage,
  type CoachInboxThread,
} from "@/lib/portal/chat";
import type { ChatMessage, ChatThread } from "@/lib/supabase/types";

export function useChatThread(opts: {
  userId: string | undefined;
  role: "member" | "coach";
  /** Required for coach opening a specific member thread */
  memberId?: string;
  enabled?: boolean;
}) {
  const { userId, role, memberId, enabled = true } = opts;
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !userId || !isSupabaseConfigured()) {
      setLoading(false);
      setThread(null);
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    const ensured =
      role === "member"
        ? await ensureMemberThread(userId)
        : memberId
          ? await ensureCoachThread(userId, memberId)
          : { thread: null, error: "Select a member to chat." };

    if (ensured.error || !ensured.thread) {
      setThread(null);
      setMessages([]);
      setError(ensured.error);
      setLoading(false);
      return;
    }

    setThread(ensured.thread);
    const listed = await listThreadMessages(ensured.thread.id);
    if (listed.error) setError(listed.error);
    setMessages(listed.messages);
    await markThreadRead(ensured.thread.id, role);
    setThread((t) =>
      t
        ? {
            ...t,
            ...(role === "member"
              ? { member_last_read_at: new Date().toISOString() }
              : { coach_last_read_at: new Date().toISOString() }),
          }
        : t,
    );
    setLoading(false);
  }, [enabled, userId, role, memberId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!enabled || !thread?.id || !isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`chat_messages_${thread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `thread_id=eq.${thread.id}`,
        },
        (payload) => {
          const row = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [...prev, row];
          });
          void markThreadRead(thread.id, role);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, thread?.id, role]);

  const send = useCallback(
    async (body: string) => {
      if (!userId || !thread) return { error: "Chat not ready." };
      setSending(true);
      const result = await sendChatMessage(thread.id, userId, body);
      if (result.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === result.message!.id)) return prev;
          return [...prev, result.message!];
        });
        setThread((t) =>
          t
            ? {
                ...t,
                last_message_at: result.message!.created_at,
                last_message_preview: result.message!.body.slice(0, 120),
              }
            : t,
        );
      }
      setSending(false);
      return { error: result.error };
    },
    [userId, thread],
  );

  return { thread, messages, loading, sending, error, send, refresh: load };
}

export function useCoachChatInbox(coachId: string | undefined, enabled = true) {
  const instanceId = useId();
  const [threads, setThreads] = useState<CoachInboxThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !coachId || !isSupabaseConfigured()) {
      setThreads([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await listCoachInbox();
      setThreads(Array.isArray(result.threads) ? result.threads : []);
      setError(result.error);
    } catch (err) {
      setThreads([]);
      setError(err instanceof Error ? err.message : "Could not load inbox");
    } finally {
      setLoading(false);
    }
  }, [enabled, coachId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!enabled || !coachId || !isSupabaseConfigured()) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`chat_inbox_sync_${coachId}_${instanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_threads" }, () => {
        void load();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [enabled, coachId, instanceId, load]);

  const unreadCount = threads.filter((t) => t.unread).length;

  return { threads, loading, error, refresh: load, unreadCount };
}
