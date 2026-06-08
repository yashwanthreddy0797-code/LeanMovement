import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { coachClients } from "@/lib/portal/data";
import { Search, Plus, Upload, X } from "lucide-react";

export const Route = createFileRoute("/portal/coach/clients")({
  head: () => ({ meta: [{ title: "Clients — LEANMOVEMENT Coach" }] }),
  component: () => <CoachShell><Clients /></CoachShell>,
});

function Clients() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = coachClients.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.program.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">Client management</div>
          <h1 className="text-4xl md:text-5xl">All clients <span className="text-[#9A9A95] text-2xl">· {coachClients.length}</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9A95]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
              className="pl-9 pr-4 py-2.5 rounded-2xl border border-[var(--border)] bg-white text-sm outline-none w-56 focus:border-[#B5C7AF]" />
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B]">
            <Plus size={15} /> Add client
          </button>
        </div>
      </div>

      <SoftCard className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#6B6B66] bg-[#FAFAF6]">
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Program</th>
              <th className="px-6 py-3 font-medium">Goal</th>
              <th className="px-6 py-3 font-medium">Join date</th>
              <th className="px-6 py-3 font-medium">Renewal</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.name} className="border-t border-[var(--border)] hover:bg-[#FAFAF6]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EFE9DD] text-[#3F5A3A] grid place-items-center text-xs font-semibold">{c.name[0]}</div>
                    <span className="font-medium text-[#1A1F1B]">{c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#4C534A]">{c.program}</td>
                <td className="px-6 py-4 text-[#4C534A]">{c.goal}</td>
                <td className="px-6 py-4 text-[#4C534A]">{c.join}</td>
                <td className="px-6 py-4 text-[#4C534A]">{c.renew}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    c.status === "Active" ? "bg-[#EFF3EC] text-[#3F5A3A]" :
                    c.status === "Onboarding" ? "bg-[#FBF2DC] text-[#A77B2C]" :
                    "bg-[#F6E6DC] text-[#A55A2C]"
                  }`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-right text-xs">
                  <button className="text-[#3F5A3A] hover:underline mr-3">Open</button>
                  <button className="text-[#6B6B66] hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SoftCard>

      {open && <AddClientModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function AddClientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm p-4">
      <div className="card-soft w-full max-w-lg p-7 relative">
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-[#F2F0EB] grid place-items-center text-[#6B6B66]">
          <X size={16} />
        </button>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66]">New client</div>
        <h2 className="text-2xl mt-1">Invite a new member</h2>
        <p className="text-sm text-[#6B6B66] mt-1">They'll receive an email with a link to set their password and start onboarding.</p>

        <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="mt-6 space-y-4">
          <Field label="Full name"><input className="input" placeholder="Rahul Mehta" required /></Field>
          <Field label="Email"><input type="email" className="input" placeholder="rahul@example.com" required /></Field>
          <Field label="Program">
            <select className="input">
              <option>Lean Transformation 12W</option>
              <option>Fat Loss 16W</option>
              <option>Muscle Gain 24W</option>
              <option>Hybrid Athlete 16W</option>
            </select>
          </Field>
          <Field label="Goal"><input className="input" placeholder="Lose 8kg, build lean muscle" /></Field>

          <div className="flex items-center gap-3 pt-2">
            <button type="button" className="px-4 py-2.5 rounded-2xl border border-[var(--border)] text-sm inline-flex items-center gap-2 hover:bg-white">
              <Upload size={14} /> Attach plan
            </button>
            <button type="submit" className="ml-auto px-5 py-2.5 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B]">
              Send invite
            </button>
          </div>
        </form>
        <style>{`
          .input { width: 100%; padding: 0.75rem 0.95rem; border-radius: 12px; border: 1px solid var(--border); background: #fff; font-size: 0.875rem; outline: none; }
          .input:focus { border-color: #B5C7AF; }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-[#6B6B66] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
