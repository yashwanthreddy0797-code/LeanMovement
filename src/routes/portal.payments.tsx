import { createFileRoute } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { invoices, clientProfile } from "@/lib/portal/data";
import { Download, CreditCard, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/portal/payments")({
  head: () => ({ meta: [{ title: "Payments — LEANMOVEMENT Portal" }] }),
  component: () => <ClientShell><Payments /></ClientShell>,
});

function Payments() {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-1.5">Billing</div>
        <h1 className="text-4xl md:text-5xl">Membership & payments</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <SoftCard className="lg:col-span-2 bg-gradient-to-br from-[#1A1F1B] to-[#2D3A2A] text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">Current plan</div>
              <div className="mt-2 text-3xl font-serif">{clientProfile.membership}</div>
              <div className="mt-1 text-white/70 text-sm">{clientProfile.program}</div>
            </div>
            <span className="chip" style={{ background: "rgba(111,143,106,0.25)", color: "#D7E5D2" }}>Active</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Renews on</div>
              <div className="mt-1 font-medium">{clientProfile.membershipRenewsOn}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Amount</div>
              <div className="mt-1 font-medium">₹14,999 / month</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-widest">Next charge</div>
              <div className="mt-1 font-medium">In 12 days</div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-2xl bg-white text-[#1A1F1B] text-sm font-medium hover:bg-white/90">Upgrade plan</button>
            <button className="px-5 py-2.5 rounded-2xl border border-white/20 text-sm hover:bg-white/10">Manage subscription</button>
          </div>
        </SoftCard>

        <SoftCard>
          <SectionTitle eyebrow="Payment method" title="Card on file" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-[#6F8F6A] to-[#3F5A3A] grid place-items-center text-white text-xs font-semibold">VISA</div>
            <div className="text-sm">
              <div className="font-medium">•••• 4242</div>
              <div className="text-[11px] text-[#6B6B66]">Expires 09/27</div>
            </div>
          </div>
          <button className="mt-5 w-full py-2.5 rounded-2xl border border-[var(--border)] text-sm hover:bg-white inline-flex items-center justify-center gap-2">
            <CreditCard size={15} /> Update card
          </button>
        </SoftCard>
      </div>

      <div>
        <SectionTitle eyebrow="History" title="Invoices" />
        <SoftCard className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-[#6B6B66] bg-[#FAFAF6]">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-[var(--border)]">
                  <td className="px-6 py-4 font-mono text-xs text-[#1A1F1B]">{inv.id}</td>
                  <td className="px-6 py-4 text-[#4C534A]">{inv.date}</td>
                  <td className="px-6 py-4 text-[#1A1F1B] font-medium">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs text-[#3F5A3A]"><CheckCircle2 size={13} /> {inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-1 text-xs text-[#3F5A3A] hover:underline"><Download size={13} /> Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SoftCard>
      </div>
    </div>
  );
}
