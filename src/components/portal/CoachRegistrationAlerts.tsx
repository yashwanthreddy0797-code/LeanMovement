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
    <SoftCard className="p-6 md:p-8 border-[#FEE2E2] bg-[#FFFBFB]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#E11D2A]">
            <Bell size={12} />
            New registrations
            {unread.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#E11D2A] text-white text-[10px]">
                {unread.length}
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-serif">Members waiting</h2>
          <p className="mt-2 text-sm text-[#737373] max-w-xl">
            You are notified when someone registers. Review their session picks, then activate after payment.
          </p>
        </div>
        {unread.length > 0 && coachId && (
          <button
            type="button"
            className="text-xs px-3 py-1.5 border border-[var(--border)] hover:bg-white"
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
            className={`p-4 border ${alert.read ? "border-[var(--border)] bg-white" : "border-[#FECACA] bg-white"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium text-[#000000]">{alert.full_name}</div>
                <div className="mt-1 text-sm text-[#737373]">{alert.email}</div>
                {alert.phone && <div className="text-sm text-[#737373]">{alert.phone}</div>}
                <div className="mt-2 text-sm text-[#000000]">
                  {formatInr(alert.amount_inr)} · {formatSelectedSessions(alert.session_ids) || "Sessions pending"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={coachWhatsAppNotifyUrl(alert)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#25D366] text-white"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
                <a
                  href={coachEmailNotifyHref(alert)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[var(--border)]"
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
