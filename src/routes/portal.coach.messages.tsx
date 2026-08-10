import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { ChatThreadView } from "@/components/portal/ChatThreadView";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { useChatThread, useCoachChatInbox } from "@/hooks/useChatThread";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { UnreadBadge } from "@/components/portal/UnreadBadge";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";

export const Route = createFileRoute("/portal/coach/messages")({
  head: () => ({ meta: [{ title: "Messages - Lean Movement Coach" }] }),
  component: CoachMessagesRoute,
  errorComponent: CoachMessagesError,
});

function CoachMessagesError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="coach-portal flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl uppercase tracking-[0.04em]">Messages error</h1>
        <p className="mt-3 text-sm text-muted-foreground break-words">
          {error?.message || "Something went wrong loading chat."}
        </p>
        <button type="button" onClick={() => reset()} className="portal-btn portal-btn-accent mt-6">
          Try again
        </button>
      </div>
    </div>
  );
}

function CoachMessagesRoute() {
  return (
    <CoachShell>
      <CoachMessagesPage />
    </CoachShell>
  );
}

function formatPreviewTime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function memberLabel(name: string | null | undefined, email: string | null | undefined) {
  return (name && name.trim()) || (email && email.trim()) || "Member";
}

function CoachMessagesPage() {
  const session = usePortalSession();
  const coachId = session.user?.id;
  const { data: coachData, loading: coachLoading } = useCoachData();
  const inbox = useCoachChatInbox(coachId, Boolean(coachId) && isSupabaseConfigured());
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // Avoid stale selection after inbox refresh
  useEffect(() => {
    if (!selectedMemberId) return;
    const exists =
      inbox.threads.some((t) => t.member_id === selectedMemberId) ||
      (coachData?.members ?? []).some((m) => m.id === selectedMemberId);
    if (!exists && inbox.threads.length === 0 && !coachLoading) {
      // keep selection — coach can still start a thread for known member ids
    }
  }, [selectedMemberId, inbox.threads, coachData?.members, coachLoading]);

  const activeMembers = useMemo(
    () =>
      (coachData?.members ?? []).filter(
        (m) => m.role === "member" && m.membership?.status === "active",
      ),
    [coachData?.members],
  );

  const rows = useMemo(() => {
    const fromInbox = (inbox.threads ?? []).map((t) => {
      const name = memberLabel(t.member?.full_name, t.member?.email);
      return {
        memberId: t.member_id,
        name,
        email: t.member?.email ?? "",
        preview: t.last_message_preview,
        lastAt: t.last_message_at,
        unread: Boolean(t.unread),
        unreadCount: t.unreadCount || 0,
        hasThread: true,
      };
    });

    const seen = new Set(fromInbox.map((r) => r.memberId));
    const extras = activeMembers
      .filter((m) => !seen.has(m.id))
      .map((m) => ({
        memberId: m.id,
        name: memberLabel(m.full_name, m.email),
        email: m.email ?? "",
        preview: null as string | null,
        lastAt: null as string | null,
        unread: false,
        unreadCount: 0,
        hasThread: false,
      }));

    const all = [...fromInbox, ...extras];
    const query = q.trim().toLowerCase();
    if (!query) return all;
    return all.filter(
      (r) => r.name.toLowerCase().includes(query) || (r.email || "").toLowerCase().includes(query),
    );
  }, [inbox.threads, activeMembers, q]);

  const chat = useChatThread({
    userId: coachId,
    role: "coach",
    memberId: selectedMemberId ?? undefined,
    enabled: Boolean(coachId && selectedMemberId && isSupabaseConfigured()),
  });

  const selected = rows.find((r) => r.memberId === selectedMemberId);
  const showThreadMobile = Boolean(selectedMemberId);

  if (session.loading || coachLoading) {
    return <PortalPageSkeleton />;
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="border border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
        Chat needs Supabase configured.
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="font-display text-[1.75rem] uppercase tracking-[0.04em] sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {inbox.unreadCount > 0
            ? `${inbox.unreadCount} unread message${inbox.unreadCount === 1 ? "" : "s"} · private 1:1`
            : "Private 1:1 chats with active members"}
        </p>
      </div>

      {inbox.error && <p className="text-sm text-red-600">{inbox.error}</p>}

      <div className="grid overflow-hidden border border-border bg-white lg:grid-cols-[minmax(0,19rem)_1fr] xl:grid-cols-[minmax(0,22rem)_1fr]">
        <div
          className={`border-border lg:border-r ${showThreadMobile ? "hidden lg:block" : "block"}`}
        >
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search members…"
                className="w-full border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent focus:bg-white"
              />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto lg:max-h-[72vh]">
            {inbox.loading && rows.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">Loading…</p>
            ) : rows.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MessageCircle size={22} className="mx-auto mb-3 text-accent" />
                <p className="text-sm text-muted-foreground">
                  No active members yet. When someone joins, you can chat with them here.
                </p>
              </div>
            ) : (
              rows.map((r) => {
                const active = r.memberId === selectedMemberId;
                const initial = (r.name?.[0] || "M").toUpperCase();
                return (
                  <button
                    key={r.memberId}
                    type="button"
                    onClick={() => setSelectedMemberId(r.memberId)}
                    className={`flex w-full items-start gap-3 border-b border-border px-3 py-3.5 text-left transition-colors ${
                      active ? "bg-surface" : "hover:bg-surface/70"
                    }`}
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center bg-accent/10 text-xs font-semibold text-accent">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{r.name}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {formatPreviewTime(r.lastAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p
                          className={`min-w-0 flex-1 truncate text-xs ${
                            r.unread ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {r.preview || (r.hasThread ? "No messages yet" : "Start a chat")}
                        </p>
                        <UnreadBadge count={r.unreadCount} className="shrink-0" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className={`min-w-0 ${showThreadMobile ? "block" : "hidden lg:block"}`}>
          {!selectedMemberId || !coachId ? (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground lg:min-h-[72vh]">
              <MessageCircle size={28} className="mb-3 text-accent" />
              <p className="font-medium text-foreground">Your inbox</p>
              <p className="mt-1 max-w-xs">Select a member on the left to open their chat.</p>
            </div>
          ) : (
            <ChatThreadView
              messages={chat.messages}
              currentUserId={coachId}
              loading={chat.loading}
              sending={chat.sending}
              error={chat.error}
              emptyLabel="No messages yet. Send the first note to start the thread."
              onSend={async (body) => {
                const result = await chat.send(body);
                void inbox.refresh();
                return result;
              }}
              className="min-h-[70vh] border-0 lg:min-h-[72vh]"
              header={
                <div className="flex items-center gap-3 border-b border-border px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center text-muted-foreground lg:hidden"
                    onClick={() => setSelectedMemberId(null)}
                    aria-label="Back to inbox"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="grid h-10 w-10 shrink-0 place-items-center bg-accent text-sm font-semibold text-white">
                    {(selected?.name?.[0] || "M").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{selected?.name ?? "Member"}</p>
                    {selected?.email ? (
                      <p className="truncate text-xs text-muted-foreground">{selected.email}</p>
                    ) : null}
                  </div>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
