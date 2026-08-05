import { useEffect, useState } from "react";
import {
  coachListContactMessages,
  coachMarkContactMessagesRead,
  type ContactMessageRow,
} from "@/lib/api/contact.functions";
import { SoftCard } from "@/components/portal/ui";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Mail, MessageCircle } from "lucide-react";

export function CoachContactInbox({ coachId }: { coachId?: string }) {
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }
    void coachListContactMessages({ data: { coachId } }).then((result) => {
      if (result.ok) setMessages(result.messages);
      setLoading(false);
    });
  }, [coachId]);

  const unread = messages.filter((m) => !m.read);
  if (!isSupabaseConfigured() || loading || messages.length === 0) return null;

  return (
    <SoftCard className="!p-5 md:!p-6 border-accent/20 bg-accent/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 font-display text-xl uppercase tracking-[0.06em]">
            <Mail size={15} className="text-accent" />
            Website messages
            {unread.length > 0 && (
              <span className="bg-accent px-1.5 py-0.5 text-[10px] font-sans normal-case tracking-normal text-white">
                {unread.length}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">From the public contact form.</p>
        </div>
        {unread.length > 0 && coachId && (
          <button
            type="button"
            className="portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => {
              void coachMarkContactMessagesRead({ data: { coachId } }).then(() => {
                setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
              });
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {messages.slice(0, 8).map((m) => (
          <div
            key={m.id}
            className={`border p-4 ${m.read ? "border-border bg-white" : "border-accent/30 bg-white"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{m.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.email}</p>
                {m.whatsapp && (
                  <p className="text-sm text-muted-foreground">WhatsApp: {m.whatsapp}</p>
                )}
              </div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                {new Date(m.created_at).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">{m.message}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: your LEANMOVEMENT message`)}`}
                className="portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
              >
                <Mail size={12} /> Reply email
              </a>
              {m.whatsapp && (
                <a
                  href={`https://wa.me/${m.whatsapp.replace(/\D/g, "").replace(/^0/, "91")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] px-3 py-1.5 text-xs text-white"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </SoftCard>
  );
}
