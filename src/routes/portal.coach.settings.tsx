import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CoachShell } from "@/components/portal/CoachShell";
import { PortalPageSkeleton } from "@/components/portal/PortalPageSkeleton";
import { PortalPageHeader, SoftCard } from "@/components/portal/ui";
import { useCoachData } from "@/hooks/useCoachData";
import { usePortalSession } from "@/lib/portal/session";
import { normalizeCalendlyUrl } from "@/lib/calendly";
import { updateSiteConfig } from "@/lib/portal/coach-queries";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/coach/settings")({
  head: () => ({ meta: [{ title: "Settings - Lean Kettlebell Coach" }] }),
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
    const calendlyNormalized = calendly.trim() ? normalizeCalendlyUrl(calendly) : "";
    if (calendly.trim() && !calendlyNormalized) {
      toast.error("Use a full Calendly event link (https://calendly.com/your-name/event)");
      return;
    }

    setSaving(true);
    const results = await Promise.all([
      updateSiteConfig(coachId, "whatsapp_invite_url", whatsapp.trim()),
      updateSiteConfig(coachId, "foundations_calendly_url", calendlyNormalized),
      updateSiteConfig(coachId, "cohort_start_date", cohort.trim()),
    ]);
    setSaving(false);

    const err = results.find((r) => r.error)?.error;
    if (err) toast.error(err);
    else {
      toast.success(
        calendlyNormalized
          ? "Saved — new members will book onboarding after their profile"
          : "Portal settings saved",
      );
      setCalendly(calendlyNormalized);
      void refresh();
    }
  };

  return (
    <div className="max-w-2xl space-y-8 pb-20 lg:pb-0">
      <PortalPageHeader
        title="Settings"
        description="WhatsApp, onboarding call (Calendly), and cohort date shown to members."
      />

      <SoftCard className="!p-5 md:!p-6">
        <h2 className="mb-5 font-display text-xl uppercase tracking-[0.06em]">Portal links</h2>
        <div className="space-y-5">
          <Field label="WhatsApp group invite URL">
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Onboarding call — Calendly event link">
            <input
              value={calendly}
              onChange={(e) => setCalendly(e.target.value)}
              placeholder="https://calendly.com/your-name/leanmovement-onboarding"
              className="w-full border border-border px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              In Calendly: open your event (e.g. “LeanMovement - Onboarding Call with Coach”) →
              Copy link → paste here. Members see this embedded right after they submit their profile.
            </p>
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
