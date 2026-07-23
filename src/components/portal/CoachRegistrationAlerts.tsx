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

    void coachGetRegistrationAlerts({ data: { coachId } }).then((result) => {
      if (result.ok) setAlerts(result.alerts);
      setLoading(false);
    });
  }, [coachId]);

  const unread = alerts.filter((a) => !a.read);
  if (!isSupabaseConfigured() || loading || alerts.length === 0) return null;

  return (
    <SoftCard className="border-accent/20 bg-accent/[0.02] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-accent">
            <Bell size={12} />
            New registrations
            {unread.length > 0 && (
              <span className="bg-accent px-1.5 py-0.5 text-[10px] text-white">
                {unread.length}
              </span>
            )}
          </div>
          <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.06em]">Members waiting</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            You are notified when someone registers. Review their session picks, then activate after payment.
          </p>
        </div>
        {unread.length > 0 && coachId && (
          <button
            type="button"
            className="portal-btn portal-btn-ghost !px-3 !py-1.5 text-xs"
            onClick={() => {
              void coachMarkRegistrationAlertsRead({ data: { coachId } }).then(() => {
                setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
              });
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="mt-6 space-y-4">
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
