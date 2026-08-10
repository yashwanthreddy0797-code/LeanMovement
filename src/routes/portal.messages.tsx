import { createFileRoute, Link } from "@tanstack/react-router";
import { ChatThreadView } from "@/components/portal/ChatThreadView";
import { useChatThread } from "@/hooks/useChatThread";
import { usePortalSession } from "@/lib/portal/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { COACH, CONTACT } from "@/lib/lean-kettlebell";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/portal/messages")({
  head: () => ({ meta: [{ title: "Messages - LEANMOVEMENT Portal" }] }),
  component: MemberMessagesPage,
});

function MemberMessagesPage() {
  const session = usePortalSession();
  const userId = session.user?.id;
  const chat = useChatThread({
    userId,
    role: "member",
    enabled: Boolean(userId) && isSupabaseConfigured() && session.hasActiveMembership,
  });

  const coachFirst = COACH.name.split(" ")[0] || "Coach";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="font-display text-[1.75rem] uppercase tracking-[0.04em] sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Private chat with {COACH.name}. Replies show up here in real time.
        </p>
      </div>

      {!isSupabaseConfigured() ? (
        <div className="border border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
          Chat needs Supabase configured.
        </div>
      ) : !session.hasActiveMembership ? (
        <div className="border border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
          Activate your membership to message your coach.
        </div>
      ) : !userId ? (
        <div className="border border-border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
          Sign in to use messages.
        </div>
      ) : (
        <ChatThreadView
          messages={chat.messages}
          currentUserId={userId}
          loading={chat.loading}
          sending={chat.sending}
          error={chat.error}
          emptyLabel={`Message ${coachFirst} about sessions, form, or progress.`}
          onSend={chat.send}
          className="min-h-[min(70vh,36rem)] sm:min-h-[32rem]"
          header={
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center bg-accent text-sm font-semibold text-white">
                {coachFirst[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{COACH.name}</p>
                <p className="text-xs text-muted-foreground">
                  Your coach · usually replies same day
                </p>
              </div>
            </div>
          }
        />
      )}

      <p className="text-center text-xs text-muted-foreground sm:text-sm">
        Need WhatsApp or email instead?{" "}
        <Link to="/portal/community" className="text-foreground underline-offset-2 hover:underline">
          Other contact options
        </Link>
        {" · "}
        <a
          href={`mailto:${CONTACT.email}`}
          className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
        >
          <Mail size={12} /> {CONTACT.email}
        </a>
        {" · "}
        <a
          href={CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
        >
          <MessageCircle size={12} /> WhatsApp
        </a>
      </p>
    </div>
  );
}
