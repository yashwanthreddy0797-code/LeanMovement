import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClientShell } from "@/components/portal/ClientShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { Upload, Check } from "lucide-react";

export const Route = createFileRoute("/portal/checkin")({
  head: () => ({ meta: [{ title: "Weekly Check-in — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><CheckIn /></ClientShell>,
});

function CheckIn() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ weight: "", sleep: 8, energy: 8, mood: "Strong", notes: "" });

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-[#FEE2E2] grid place-items-center mx-auto mb-6">
          <Check className="text-[#E11D2A]" size={28} />
        </div>
        <h1 className="text-4xl">Check-in submitted</h1>
        <p className="mt-3 text-[#737373]">Your coach will review and respond within 24 hours. Keep showing up.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 px-5 py-2.5 rounded-2xl border border-[var(--border)] text-sm hover:bg-white">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Week 10 · due today</div>
        <h1 className="text-4xl md:text-5xl">Your weekly check-in</h1>
        <p className="mt-2 text-[#737373]">Honest data &gt; perfect data. Your coach uses this to dial in next week's plan.</p>
      </div>

      <SoftCard>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
          <Field label="Current weight (kg)">
            <input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })}
              required placeholder="78.4" className="input" />
          </Field>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-2">Progress photos</span>
            <div className="grid grid-cols-3 gap-3">
              {["Front", "Side", "Back"].map((p) => (
                <button key={p} type="button" className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#D7D2C7] hover:border-[#E11D2A] hover:bg-[#FEE2E2]/40 transition grid place-items-center text-xs text-[#737373]">
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload size={18} />
                    {p}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Slider label="Sleep quality (1-10)" value={form.sleep} onChange={(v) => setForm({ ...form, sleep: v })} />
          <Slider label="Energy levels (1-10)" value={form.energy} onChange={(v) => setForm({ ...form, energy: v })} />

          <Field label="Mood">
            <div className="grid grid-cols-4 gap-2">
              {["Low", "Okay", "Good", "Strong"].map((m) => (
                <button key={m} type="button" onClick={() => setForm({ ...form, mood: m })}
                  className={`py-2.5 rounded-xl text-sm border transition ${form.mood === m ? "bg-[#000000] text-white border-[#000000]" : "bg-white border-[var(--border)] text-[#404040]"}`}>
                  {m}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notes for your coach">
            <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Wins, struggles, anything on your mind…" className="input resize-none" />
          </Field>

          <button type="submit" className="w-full py-3.5 rounded-2xl bg-[#000000] text-white text-sm font-medium hover:bg-[#111111] transition">
            Submit check-in
          </button>
        </form>
      </SoftCard>

      <style>{`
        .input { width: 100%; padding: 0.85rem 1rem; border-radius: 14px; border: 1px solid var(--border); background: #fff; font-size: 0.875rem; color: #000000; outline: none; }
        .input:focus { border-color: #FCA5A5; box-shadow: 0 0 0 3px rgba(111,143,106,0.12); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#737373]">{label}</span>
        <span className="text-sm font-medium text-[#000000]">{value}</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--accent)]" />
    </div>
  );
}
