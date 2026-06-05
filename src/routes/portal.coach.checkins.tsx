import { createFileRoute } from "@tanstack/react-router";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { coachCheckins } from "@/lib/portal/data";

export const Route = createFileRoute("/portal/coach/checkins")({
  head: () => ({ meta: [{ title: "Check-ins — APEX Coach" }] }),
  component: () => <CoachShell><CheckIns /></CoachShell>,
});

function CheckIns() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">Check-in management</div>
        <h1 className="text-4xl md:text-5xl">Review & respond</h1>
        <p className="mt-2 text-[#6B6B66]">{coachCheckins.filter(c => c.status === "Pending").length} pending · keep response time under 24h.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {coachCheckins.map((c, i) => (
          <SoftCard key={i}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-sm font-semibold">{c.client[0]}</div>
                <div>
                  <div className="font-medium text-[#1A1F1B]">{c.client}</div>
                  <div className="text-[11px] text-[#6B6B66]">{c.date}</div>
                </div>
              </div>
              <span className={`chip ${c.status === "Pending" ? "" : "!bg-[#F2F0EB] !text-[#6B6B66]"}`}>{c.status}</span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3 text-center">
              <Mini label="Weight" value={c.weight} />
              <Mini label="Sleep" value={`${c.sleep}h`} />
              <Mini label="Energy" value={`${c.energy}/10`} />
              <Mini label="Mood" value={c.mood} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[1,2,3].map((p) => (
                <div key={p} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#EFE9DD] to-[#F4F2EC]" />
              ))}
            </div>

            {c.status === "Pending" && (
              <div className="mt-5 flex gap-2">
                <input placeholder="Reply to client…" className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAFAF6] border border-transparent focus:bg-white focus:border-[var(--border)] text-sm outline-none" />
                <button className="px-4 py-2.5 rounded-xl bg-[#1A1F1B] text-white text-xs font-medium">Approve & reply</button>
              </div>
            )}
          </SoftCard>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#FAFAF6] rounded-xl py-3">
      <div className="text-[10px] uppercase tracking-widest text-[#6B6B66]">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-[#1A1F1B]">{value}</div>
    </div>
  );
}
