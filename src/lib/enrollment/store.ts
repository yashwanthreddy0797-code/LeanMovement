import type { SupabaseClient } from "@supabase/supabase-js";
import type { MembershipPlan } from "@/lib/supabase/types";

export const ENROLLMENT_KEY_PREFIX = "enrollment:";

export type EnrollmentRecord = {
  email: string;
  full_name: string;
  phone: string | null;
  plan: MembershipPlan;
  amount_inr: number;
  session_ids: string[];
  status: "pending_payment" | "account_created";
  payment_method: "manual";
  created_at: string;
  updated_at: string;
};

export function enrollmentConfigKey(email: string) {
  return `${ENROLLMENT_KEY_PREFIX}${email.trim().toLowerCase()}`;
}

export function isMissingEnrollmentTable(error: { message?: string; code?: string } | null) {
  if (!error) return false;
  return (
    error.code === "PGRST205" ||
    error.message?.includes("enrollment_intents") ||
    error.message?.includes("schema cache")
  );
}

export async function saveEnrollmentToSiteConfig(
  admin: SupabaseClient,
  record: EnrollmentRecord,
) {
  const key = enrollmentConfigKey(record.email);
  const { error } = await admin.from("site_config").upsert({
    key,
    value: JSON.stringify(record),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return key;
}

export async function getEnrollmentFromSiteConfig(admin: SupabaseClient, email: string) {
  const { data, error } = await admin
    .from("site_config")
    .select("value")
    .eq("key", enrollmentConfigKey(email))
    .maybeSingle();

  if (error || !data?.value) return null;
  try {
    return JSON.parse(data.value) as EnrollmentRecord;
  } catch {
    return null;
  }
}

export async function listPendingEnrollmentsFromSiteConfig(admin: SupabaseClient) {
  const { data, error } = await admin
    .from("site_config")
    .select("key, value")
    .like("key", `${ENROLLMENT_KEY_PREFIX}%`);

  if (error || !data) return [];

  return data
    .map((row) => {
      try {
        return JSON.parse(row.value) as EnrollmentRecord;
      } catch {
        return null;
      }
    })
    .filter((r): r is EnrollmentRecord => r !== null && r.status === "pending_payment");
}

export async function markEnrollmentAccountCreated(admin: SupabaseClient, email: string) {
  const record = await getEnrollmentFromSiteConfig(admin, email);
  if (!record) return;
  await saveEnrollmentToSiteConfig(admin, {
    ...record,
    status: "account_created",
    updated_at: new Date().toISOString(),
  });
}
