import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Send } from "lucide-react";
import { CHAT_BODY_MAX } from "@/lib/portal/chat";
import type { ChatMessage } from "@/lib/supabase/types";

function formatChatTime(iso: string) {
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
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isMine(senderId: string, currentUserId: string) {
  return String(senderId).trim() === String(currentUserId).trim();
}

export function ChatThreadView({
  messages,
  currentUserId,
  loading,
  sending,
  error,
  emptyLabel = "No messages yet. Say hello.",
  header,
  onSend,
  className = "",
}: {
  messages: ChatMessage[];
  currentUserId: string;
  loading?: boolean;
  sending?: boolean;
  error?: string | null;
  emptyLabel?: string;
  header?: ReactNode;
  onSend: (body: string) => Promise<{ error: string | null } | void>;
  className?: string;
}) {
  const [draft, setDraft] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setLocalError(null);
    const result = await onSend(body);
    if (result?.error) {
      setLocalError(result.error);
      return;
    }
    setDraft("");
  };

  const displayError = localError || error;

  return (
    <div
      className={`flex h-full min-h-[28rem] flex-col overflow-hidden border border-border bg-white ${className}`}
    >
      {header}

      <div className="relative flex-1 overflow-y-auto bg-[#efeae2]/[background-image:radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:18px_18px] px-3 py-4 sm:px-5">
        {loading ? (
          <div className="flex h-full min-h-[16rem] items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Loading conversation…
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center bg-white text-accent shadow-sm">
              <Send size={18} />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">{emptyLabel}</p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-1.5">
            {messages.map((m, idx) => {
              const mine = isMine(m.sender_id, currentUserId);
              const prev = messages[idx - 1];
              const prevMine = prev ? isMine(prev.sender_id, currentUserId) : null;
              const stacked = prevMine === mine;

              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"} ${stacked ? "mt-0.5" : "mt-2"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed shadow-sm sm:max-w-[70%] ${
                      mine
                        ? "rounded-2xl rounded-br-md bg-accent text-white"
                        : "rounded-2xl rounded-bl-md border border-black/5 bg-white text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p
                      className={`mt-1 text-right text-[10px] tabular-nums ${
                        mine ? "text-white/75" : "text-muted-foreground"
                      }`}
                    >
                      {formatChatTime(m.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {displayError && (
        <p className="border-t border-border bg-red-50 px-4 py-2 text-xs text-red-600">
          {displayError}
        </p>
      )}

      <form
        onSubmit={(e) => void submit(e)}
        className="flex items-end gap-2 border-t border-border bg-white p-3 sm:gap-3 sm:p-4"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, CHAT_BODY_MAX))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit(e);
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="max-h-32 min-h-[2.75rem] flex-1 resize-none border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:bg-white"
          disabled={sending || loading}
        />
        <button
          type="submit"
          disabled={sending || loading || !draft.trim()}
          className="portal-btn portal-btn-accent !h-11 shrink-0 !px-4 disabled:opacity-40"
          aria-label="Send message"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
