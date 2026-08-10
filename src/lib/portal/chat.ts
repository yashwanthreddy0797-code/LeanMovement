import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ChatMessage, ChatThread, Profile } from "@/lib/supabase/types";

export const CHAT_BODY_MAX = 2000;

export type CoachInboxThread = ChatThread & {
  member: Pick<Profile, "id" | "email" | "full_name"> | null;
  unread: boolean;
  unreadCount: number;
};

export function threadUnreadForRole(thread: ChatThread, role: "member" | "coach"): boolean {
  if (!thread.last_message_at) return false;
  const lastRead = role === "member" ? thread.member_last_read_at : thread.coach_last_read_at;
  if (!lastRead) return true;
  return new Date(thread.last_message_at).getTime() > new Date(lastRead).getTime();
}

function lastReadMs(thread: ChatThread, role: "member" | "coach") {
  const lastRead = role === "member" ? thread.member_last_read_at : thread.coach_last_read_at;
  return lastRead ? new Date(lastRead).getTime() : 0;
}

/** Count messages from the other person after this role's last-read timestamp. */
export async function countUnreadMessages(
  thread: ChatThread,
  role: "member" | "coach",
): Promise<number> {
  if (!threadUnreadForRole(thread, role)) return 0;
  const supabase = getSupabase();
  if (!supabase) return threadUnreadForRole(thread, role) ? 1 : 0;

  const selfId = role === "member" ? thread.member_id : thread.coach_id;
  const since = lastReadMs(thread, role);

  let query = supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("thread_id", thread.id)
    .neq("sender_id", selfId);

  if (since > 0) {
    query = query.gt("created_at", new Date(since).toISOString());
  }

  const { count, error } = await query;
  if (error) return threadUnreadForRole(thread, role) ? 1 : 0;
  return count ?? 0;
}

export async function resolveCoachProfileId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("get_primary_coach_id");
  if (!error && data) return data as string;

  // Fallback when RPC not applied yet: coach clients can still list profiles.
  const { data: row } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["coach", "admin"])
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return row?.id ?? null;
}

export async function ensureMemberThread(memberId: string): Promise<{
  thread: ChatThread | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { thread: null, error: "Chat is unavailable offline." };
  }
  const supabase = getSupabase()!;

  const { data: existing, error: existingError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("member_id", memberId)
    .maybeSingle();

  if (existingError) {
    if (/chat_threads|relation|schema/i.test(existingError.message)) {
      return {
        thread: null,
        error: "Run supabase/chat.sql in Supabase SQL Editor, then try again.",
      };
    }
    return { thread: null, error: existingError.message };
  }
  if (existing) return { thread: existing as ChatThread, error: null };

  const coachId = await resolveCoachProfileId();
  if (!coachId) {
    return {
      thread: null,
      error: "Coach profile not found yet. Try again shortly.",
    };
  }

  const { data: created, error: createError } = await supabase
    .from("chat_threads")
    .insert({ member_id: memberId, coach_id: coachId })
    .select("*")
    .single();

  if (createError) {
    if (createError.code === "23505") {
      const { data: again } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("member_id", memberId)
        .maybeSingle();
      return { thread: again ? (again as ChatThread) : null, error: null };
    }
    return { thread: null, error: createError.message };
  }

  return { thread: created as ChatThread, error: null };
}

export async function ensureCoachThread(
  coachId: string,
  memberId: string,
): Promise<{ thread: ChatThread | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { thread: null, error: "Chat is unavailable offline." };
  }
  const supabase = getSupabase()!;

  const { data: existing, error: existingError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("member_id", memberId)
    .maybeSingle();

  if (existingError) {
    if (/chat_threads|relation|schema/i.test(existingError.message)) {
      return {
        thread: null,
        error: "Run supabase/chat.sql in Supabase SQL Editor, then try again.",
      };
    }
    return { thread: null, error: existingError.message };
  }
  if (existing) return { thread: existing as ChatThread, error: null };

  const { data: created, error: createError } = await supabase
    .from("chat_threads")
    .insert({ member_id: memberId, coach_id: coachId })
    .select("*")
    .single();

  if (createError) {
    if (createError.code === "23505") {
      const { data: again } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("member_id", memberId)
        .maybeSingle();
      return { thread: again ? (again as ChatThread) : null, error: null };
    }
    return { thread: null, error: createError.message };
  }

  return { thread: created as ChatThread, error: null };
}

export async function listThreadMessages(
  threadId: string,
  limit = 100,
): Promise<{ messages: ChatMessage[]; error: string | null }> {
  const supabase = getSupabase();
  if (!supabase) return { messages: [], error: "Chat is unavailable offline." };

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) return { messages: [], error: error.message };
  return { messages: (data ?? []) as ChatMessage[], error: null };
}

export async function sendChatMessage(
  threadId: string,
  senderId: string,
  body: string,
): Promise<{ message: ChatMessage | null; error: string | null }> {
  const trimmed = body.trim();
  if (!trimmed) return { message: null, error: "Message cannot be empty." };
  if (trimmed.length > CHAT_BODY_MAX) {
    return { message: null, error: `Keep messages under ${CHAT_BODY_MAX} characters.` };
  }

  const supabase = getSupabase();
  if (!supabase) return { message: null, error: "Chat is unavailable offline." };

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ thread_id: threadId, sender_id: senderId, body: trimmed })
    .select("*")
    .single();

  if (error) return { message: null, error: error.message };
  return { message: data as ChatMessage, error: null };
}

export async function markThreadRead(
  threadId: string,
  role: "member" | "coach",
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  if (!supabase) return { error: "Chat is unavailable offline." };

  const patch =
    role === "member"
      ? { member_last_read_at: new Date().toISOString() }
      : { coach_last_read_at: new Date().toISOString() };

  const { error } = await supabase.from("chat_threads").update(patch).eq("id", threadId);
  return { error: error?.message ?? null };
}

export async function listCoachInbox(): Promise<{
  threads: CoachInboxThread[];
  error: string | null;
}> {
  const supabase = getSupabase();
  if (!supabase) return { threads: [], error: "Chat is unavailable offline." };

  const { data: threads, error } = await supabase
    .from("chat_threads")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) {
    if (/chat_threads|relation|schema/i.test(error.message)) {
      return {
        threads: [],
        error: "Run supabase/chat.sql in Supabase SQL Editor, then try again.",
      };
    }
    return { threads: [], error: error.message };
  }

  const rows = (threads ?? []) as ChatThread[];
  if (rows.length === 0) return { threads: [], error: null };

  const memberIds = [...new Set(rows.map((t) => t.member_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", memberIds);

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

  const unreadCounts = await Promise.all(rows.map((t) => countUnreadMessages(t, "coach")));

  return {
    threads: rows.map((t, i) => {
      const unreadCount = unreadCounts[i] ?? 0;
      return {
        ...t,
        member: byId.get(t.member_id) ?? null,
        unread: unreadCount > 0,
        unreadCount,
      };
    }),
    error: null,
  };
}
