import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SectionTitle, SoftCard } from "@/components/portal/ui";
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
  const [whatsapp, setWhatsapp] = useState("");
  const [calendly, setCalendly] = useState("");
  const [cohort, setCohort] = useState("");

  useEffect(() => {
    if (!data) return;
    setWhatsapp(data.siteConfig.whatsapp_invite_url ?? "");
    setCalendly(data.siteConfig.foundations_calendly_url ?? "");
    setCohort(data.siteConfig.cohort_start_date ?? "");
  }, [data]);

  if (loading || !data) {
    return <PortalPageSkeleton />;
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
    <div className="max-w-2xl space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        eyebrow="Portal"
        title="Settings"
        description="Links and dates shown to members on their dashboard and community pages."
      />

      <SoftCard>
        <SectionTitle eyebrow="Member-facing" title="Portal links" />
        <div className="space-y-5">
          <Field label="WhatsApp group invite URL">
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Foundations session — Calendly URL">
            <input
              value={calendly}
              onChange={(e) => setCalendly(e.target.value)}
              placeholder="https://calendly.com/your-link"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Cohort start date (display text)">
            <input
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
              placeholder="April 2026"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </Field>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="portal-btn disabled:opacity-50"
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
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Active members</dt>
            <dd className="mt-1 font-display text-2xl tracking-[0.04em]">{data.stats.activeMembers}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Est. MRR</dt>
            <dd className="mt-1 font-display text-2xl tracking-[0.04em]">{formatInr(data.stats.mrrInr)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Pending</dt>
            <dd className="mt-1 font-display text-2xl tracking-[0.04em]">{data.stats.pendingMembers}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">Renewals (14d)</dt>
            <dd className="mt-1 font-display text-2xl tracking-[0.04em]">{data.stats.expiringSoon}</dd>
          </div>
        </dl>
        <Link to="/portal/coach/members" className="mt-6 inline-block text-sm text-accent hover:underline">
          Manage members →
        </Link>
      </SoftCard>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
