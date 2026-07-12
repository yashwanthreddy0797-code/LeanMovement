import type { SupabaseClient } from "@supabase/supabase-js";
import { CONTACT, COACH } from "@/lib/lean-kettlebell";
import { formatSelectedSessions } from "@/lib/sessions";

export const COACH_ALERTS_KEY = "coach_alerts";

export type CoachAlert = {
  id: string;
  type: "registration";
  email: string;
  full_name: string;
  phone: string | null;
  amount_inr: number;
  session_ids: string[];
  created_at: string;
  read: boolean;
};

export function coachWhatsAppNotifyUrl(alert: {
  full_name: string;
  email: string;
  phone?: string | null;
  session_ids: string[];
  amount_inr: number;
}) {
  const sessions = formatSelectedSessions(alert.session_ids) || "Not selected";
  const text = [
    `New LEANMOVEMENT registration`,
    ``,
    `Name: ${alert.full_name}`,
    `Email: ${alert.email}`,
    alert.phone ? `WhatsApp: ${alert.phone}` : null,
    `Program: ₹${alert.amount_inr.toLocaleString("en-IN")}/mo`,
    `Sessions: ${sessions}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function coachEmailNotifyHref(alert: {
  full_name: string;
  email: string;
  phone?: string | null;
  session_ids: string[];
  amount_inr: number;
}) {
  const sessions = formatSelectedSessions(alert.session_ids) || "Not selected";
  const subject = encodeURIComponent(`New member: ${alert.full_name}`);
  const body = encodeURIComponent(
    [
      `New registration for LEANMOVEMENT`,
      ``,
      `Name: ${alert.full_name}`,
      `Email: ${alert.email}`,
      alert.phone ? `Phone: ${alert.phone}` : "",
      `Amount: ₹${alert.amount_inr.toLocaleString("en-IN")}`,
      `Sessions: ${sessions}`,
      ``,
      `— Portal: activate from Coach → Members`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return `mailto:coach@leanmovement.in?subject=${subject}&body=${body}`;
}

export async function pushCoachRegistrationAlert(
  admin: SupabaseClient,
  alert: Omit<CoachAlert, "id" | "type" | "read" | "created_at"> & { created_at?: string },
) {
  const entry: CoachAlert = {
    id: `${Date.now()}-${alert.email}`,
    type: "registration",
    email: alert.email,
    full_name: alert.full_name,
    phone: alert.phone,
    amount_inr: alert.amount_inr,
    session_ids: alert.session_ids,
    created_at: alert.created_at ?? new Date().toISOString(),
    read: false,
  };

  const { data } = await admin.from("site_config").select("value").eq("key", COACH_ALERTS_KEY).maybeSingle();

  let list: CoachAlert[] = [];
  if (data?.value) {
    try {
      list = JSON.parse(data.value) as CoachAlert[];
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }
  }

  list = [entry, ...list].slice(0, 50);

  await admin.from("site_config").upsert({
    key: COACH_ALERTS_KEY,
    value: JSON.stringify(list),
    updated_at: new Date().toISOString(),
  });

  return entry;
}

export async function listCoachAlerts(admin: SupabaseClient) {
  const { data } = await admin.from("site_config").select("value").eq("key", COACH_ALERTS_KEY).maybeSingle();
  if (!data?.value) return [] as CoachAlert[];
  try {
    const list = JSON.parse(data.value) as CoachAlert[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function markCoachAlertsRead(admin: SupabaseClient) {
  const list = await listCoachAlerts(admin);
  const next = list.map((a) => ({ ...a, read: true }));
  await admin.from("site_config").upsert({
    key: COACH_ALERTS_KEY,
    value: JSON.stringify(next),
    updated_at: new Date().toISOString(),
  });
}

export function coachDisplayName() {
  return COACH.name;
}
