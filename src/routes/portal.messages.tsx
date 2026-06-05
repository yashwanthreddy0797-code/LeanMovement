import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientShell } from "@/components/portal/ClientShell";
import { messages as initialMessages } from "@/lib/portal/data";
import { Mic, Paperclip, Send } from "lucide-react";

export const Route = createFileRoute("/portal/messages")({
  head: () => ({ meta: [{ title: "Messages — APEX Portal" }] }),
  component: () => <ClientShell><Messages /></ClientShell>,
});

function Messages() {
  const [msgs, setMsgs] = useState(initialMessages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { from: "me", text, time: "Now" }]);
    setText("");
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-5 h-[calc(100vh-180px)]">
      {/* Conversations list */}
      <aside className="card-soft overflow-hidden hidden lg:flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="text-lg">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[
            { name: "Arjun Kapoor", role: "Head Coach", last: "Don't forget your check-in 🙌", time: "10:40 AM", active: true, unread: 1 },
            { name: "Apex Community", role: "Group", last: "Karan: Just hit 180kg deadlift!", time: "Yest", active: false },
            { name: "Nutrition Team", role: "Support", last: "Your new meal plan is ready", time: "Mon", active: false },
          ].map((c) => (
            <div key={c.name} className={`px-4 py-3.5 flex items-start gap-3 cursor-pointer border-b border-[var(--border)] ${c.active ? "bg-[#EFF3EC]" : "hover:bg-white"}`}>
              <div className="w-10 h-10 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs font-semibold flex-shrink-0">{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-[#9A9A95]">{c.time}</span>
                </div>
                <div className="text-[11px] text-[#6B6B66]">{c.role}</div>
                <div className="text-xs text-[#4C534A] truncate mt-0.5">{c.last}</div>
              </div>
              {c.unread && <span className="w-5 h-5 rounded-full bg-[#6F8F6A] text-white text-[10px] grid place-items-center">{c.unread}</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="card-soft flex flex-col overflow-hidden">
        <header className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs font-semibold">A</div>
          <div>
            <div className="text-sm font-medium">Arjun Kapoor</div>
            <div className="text-[11px] text-[#3F5A3A] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#6F8F6A]" /> Online</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAFAF6]">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-[#1A1F1B] text-white rounded-br-md" : "bg-white border border-[var(--border)] text-[#1A1F1B] rounded-bl-md"}`}>
                {m.text}
                <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/60" : "text-[#9A9A95]"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[var(--border)] bg-white flex items-center gap-2">
          <button className="p-2.5 rounded-full hover:bg-[#F2F0EB] text-[#6B6B66]"><Paperclip size={18} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message Arjun…"
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F4F2EC] border border-transparent focus:bg-white focus:border-[var(--border)] text-sm outline-none" />
          <button className="p-2.5 rounded-full hover:bg-[#F2F0EB] text-[#6B6B66]"><Mic size={18} /></button>
          <button onClick={send} className="p-2.5 rounded-full bg-[#1A1F1B] text-white hover:bg-[#2A2F2B]"><Send size={16} /></button>
        </div>
      </section>
    </div>
  );
}
