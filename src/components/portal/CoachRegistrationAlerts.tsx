import { useEffect, useState } from "react";
import {
  coachGetRegistrationAlerts,
  coachMarkRegistrationAlertsRead,
} from "@/lib/api/enrollment.functions";
import {
  coachEmailNotifyHref,
  coachWhatsAppNotifyUrl,
  type CoachAlert,
} from "@/lib/coach-notify";
import { formatSelectedSessions } from "@/lib/sessions";
import { formatInr } from "@/lib/portal/member-format";
import { withCoachAuth } from "@/lib/api/coach-call";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SoftCard } from "@/components/portal/ui";
import { Bell, Mail, MessageCircle } from "lucide-react";

export function CoachRegistrationAlerts({ coachId }: { coachId?: string }) {
  const [alerts, setAlerts] = useState<CoachAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    void withCoachAuth(coachId)
      .then((auth) => coachGetRegistrationAlerts({ data: auth }))
      .then((result) => {
      if (result.ok) setAlerts(result.alerts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [coachId]);

  const unread = alerts.filter((a) => !a.read);
  if (!isSupabaseConfigured() || loading || alerts.length === 0) return null;

  return (
    <SoftCard className="!p-5 md:!p-6 border-accent/20 bg-accent/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-2 font-display text-xl uppercase tracking-[0.06em]">
            <Bell size={15} className="text-accent" />
            New registrations
            {unread.length > 0 && (
              <span className="bg-accent px-1.5 py-0.5 text-[10px] font-sans normal-case tracking-normal text-white">
                {unread.length}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review picks, then activate after payment.
          </p>
        </div>
        {unread.length > 0 && coachId && (
          <button
            type="button"
            className="portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => {
              void withCoachAuth(coachId)
                .then((auth) => coachMarkRegistrationAlertsRead({ data: auth }))
                .then(() => {
                setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
              });
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {alerts.slice(0, 8).map((alert) => (
          <div
            key={alert.id}
            className={`border p-4 ${alert.read ? "border-border bg-white" : "border-accent/30 bg-white"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium text-foreground">{alert.full_name}</div>
                <div className="mt-1 text-sm text-muted-foreground">{alert.email}</div>
                {alert.phone && <div className="text-sm text-muted-foreground">{alert.phone}</div>}
                <div className="mt-2 text-sm text-foreground">
                  {formatInr(alert.amount_inr)} · {formatSelectedSessions(alert.session_ids) || "Sessions pending"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={coachWhatsAppNotifyUrl(alert)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] px-3 py-1.5 text-xs text-white"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
                <a
                  href={coachEmailNotifyHref(alert)}
                  className="portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
                >
                  <Mail size={12} /> Email
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SoftCard>
  );
}
