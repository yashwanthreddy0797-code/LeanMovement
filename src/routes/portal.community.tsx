import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientShell } from "@/components/portal/ClientShell";
import { communityFeed } from "@/lib/portal/data";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export const Route = createFileRoute("/portal/community")({
  head: () => ({ meta: [{ title: "Community — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><Community /></ClientShell>,
});

function Community() {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Members only</div>
        <h1 className="text-4xl md:text-5xl">The LeanMovement circle</h1>
        <p className="mt-2 text-[#737373]">A private space for clients to share wins, ask questions, and lift each other up.</p>
      </div>

      <div className="card-soft p-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] grid place-items-center text-sm font-semibold text-[#E11D2A]">R</div>
          <div className="flex-1">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2}
              placeholder="Share a win, a question, or a moment of clarity…"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAFAF6] border border-transparent focus:bg-white focus:border-[var(--border)] text-sm outline-none resize-none" />
            <div className="flex items-center justify-between mt-3">
              <button className="text-xs text-[#737373]">📷 Add photo</button>
              <button disabled={!draft.trim()} className="px-4 py-1.5 rounded-full bg-[#000000] text-white text-xs font-medium disabled:opacity-40">Post</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {communityFeed.map((post, i) => (
          <article key={i} className="card-soft overflow-hidden">
            <header className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#000000] text-white grid place-items-center text-sm font-semibold">{post.user[0]}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{post.user}</div>
                <div className="text-[11px] text-[#737373]">{post.program} · {post.time} ago</div>
              </div>
            </header>
            {post.img && (
              <div className="aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                <img src={post.img} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <p className="text-[15px] text-[#000000] leading-relaxed">{post.text}</p>
              <div className="mt-4 flex items-center gap-6 text-xs text-[#737373]">
                <button className="inline-flex items-center gap-1.5 hover:text-[#E11D2A]"><Heart size={15} /> {post.likes}</button>
                <button className="inline-flex items-center gap-1.5 hover:text-[#E11D2A]"><MessageCircle size={15} /> {post.comments}</button>
                <button className="inline-flex items-center gap-1.5 hover:text-[#E11D2A] ml-auto"><Share2 size={15} /> Share</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
