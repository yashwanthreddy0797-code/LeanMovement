import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { SectionTitle, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { formatInr, updateSiteConfig } from "@/lib/portal/coach-queries";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/settings")({
  head: () => ({ meta: [{ title: "Settings — Lean Kettlebell Coach" }] }),
  component: () => (
    <CoachShell>
      <SettingsPage />
    </CoachShell>
  ),
});

function SettingsPage() {
  const session = usePortalSession();
  const { data, loading, refresh } = useCoachData();
  const [saving, setSaving] = useState(false);

  const coachId = session.user?.id;

  useEffect(() => {
    if (!data) return;
    setWhatsapp(data.siteConfig.whatsapp_invite_url ?? "");
    setCalendly(data.siteConfig.foundations_calendly_url ?? "");
    setCohort(data.siteConfig.cohort_start_date ?? "");
  }, [data]);

  if (loading || !data) {
    return <p className="text-sm text-[#737373]">Loading settings…</p>;
  }

  const save = async () => {
    setSaving(true);
    const results = await Promise.all([
      updateSiteConfig(coachId, "whatsapp_invite_url", whatsapp.trim()),
      updateSiteConfig(coachId, "foundations_calendly_url", calendly.trim()),
      updateSiteConfig(coachId, "cohort_start_date", cohort.trim()),
    ]);
    setSaving(false);

    const err = results.find((r) => r.error)?.error;
    if (err) toast.error(err);
    else {
      toast.success("Portal settings saved");
      void refresh();
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0 max-w-2xl">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373] mb-1.5">Portal</div>
        <h1 className="text-4xl md:text-5xl font-serif">Settings</h1>
        <p className="mt-2 text-[#737373]">
          Links and dates shown to members on their dashboard and community pages.
        </p>
      </div>

      <SoftCard>
        <SectionTitle eyebrow="Member-facing" title="Portal links" />
        <div className="space-y-5">
          <Field label="WhatsApp group invite URL">
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="coach-input"
            />
          </Field>
          <Field label="Foundations session — Calendly URL">
            <input
              value={calendly}
              onChange={(e) => setCalendly(e.target.value)}
              placeholder="https://calendly.com/your-link"
              className="coach-input"
            />
          </Field>
          <Field label="Cohort start date (display text)">
            <input
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              placeholder="April 2026"
              className="coach-input"
            />
          </Field>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#000000] text-white text-sm font-medium hover:bg-[#111111] disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </SoftCard>

      <SoftCard>
        <SectionTitle eyebrow="Revenue" title="Membership overview" />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-[#737373] text-xs uppercase tracking-wider">Active members</dt>
            <dd className="text-2xl font-serif mt-1">{data.stats.activeMembers}</dd>
          </div>
          <div>
            <dt className="text-[#737373] text-xs uppercase tracking-wider">Est. MRR</dt>
            <dd className="text-2xl font-serif mt-1">{formatInr(data.stats.mrrInr)}</dd>
          </div>
          <div>
            <dt className="text-[#737373] text-xs uppercase tracking-wider">Pending</dt>
            <dd className="text-2xl font-serif mt-1">{data.stats.pendingMembers}</dd>
          </div>
          <div>
            <dt className="text-[#737373] text-xs uppercase tracking-wider">Renewals (14d)</dt>
            <dd className="text-2xl font-serif mt-1">{data.stats.expiringSoon}</dd>
          </div>
        </dl>
        <Link
          to="/portal/coach/members"
          className="mt-6 inline-block text-sm text-[#E11D2A] hover:underline"
        >
          Manage members →
        </Link>
      </SoftCard>

      <style>{`.coach-input { width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--border); font-size: 0.875rem; outline: none; } .coach-input:focus { border-color: #FCA5A5; }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-[#737373] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
