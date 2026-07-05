import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { COACH } from "@/lib/lean-kettlebell";
import { messages as initialMessages } from "@/lib/portal/data";
import { Mic, Paperclip, Send } from "lucide-react";

export const Route = createFileRoute("/portal/messages")({
  head: () => ({ meta: [{ title: "Messages — LEANMOVEMENT Portal" }] }),
  component: Messages,
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
            { name: COACH.name, role: "Head Coach", last: "Don't forget your check-in 🙌", time: "10:40 AM", active: true, unread: 1 },
            { name: "LeanMovement Community", role: "Group", last: "Karan: Just hit 180kg deadlift!", time: "Yest", active: false },
            { name: "Nutrition Team", role: "Support", last: "Your new meal plan is ready", time: "Mon", active: false },
          ].map((c) => (
            <div key={c.name} className={`px-4 py-3.5 flex items-start gap-3 cursor-pointer border-b border-[var(--border)] ${c.active ? "bg-[#FEE2E2]" : "hover:bg-white"}`}>
              <div className="w-10 h-10 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold flex-shrink-0">{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-[#A3A3A3]">{c.time}</span>
                </div>
                <div className="text-[11px] text-[#737373]">{c.role}</div>
                <div className="text-xs text-[#404040] truncate mt-0.5">{c.last}</div>
              </div>
              {c.unread && <span className="w-5 h-5 rounded-full bg-[#E11D2A] text-white text-[10px] grid place-items-center">{c.unread}</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="card-soft flex flex-col overflow-hidden">
        <header className="p-4 border-b border-[var(--border)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold">{COACH.name[0]}</div>
          <div>
            <div className="text-sm font-medium">{COACH.name}</div>
            <div className="text-[11px] text-[#E11D2A] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A]" /> Online</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAFAF6]">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "me" ? "bg-[#000000] text-white rounded-br-md" : "bg-white border border-[var(--border)] text-[#000000] rounded-bl-md"}`}>
                {m.text}
                <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/60" : "text-[#A3A3A3]"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[var(--border)] bg-white flex items-center gap-2">
          <button className="p-2.5 rounded-full hover:bg-[#F5F5F5] text-[#737373]"><Paperclip size={18} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Message ${COACH.name.split(" ")[0]}…`}
            className="flex-1 px-4 py-2.5 rounded-full bg-[#F4F2EC] border border-transparent focus:bg-white focus:border-[var(--border)] text-sm outline-none" />
          <button className="p-2.5 rounded-full hover:bg-[#F5F5F5] text-[#737373]"><Mic size={18} /></button>
          <button onClick={send} className="p-2.5 rounded-full bg-[#000000] text-white hover:bg-[#111111]"><Send size={16} /></button>
        </div>
      </section>
    </div>
  );
}
