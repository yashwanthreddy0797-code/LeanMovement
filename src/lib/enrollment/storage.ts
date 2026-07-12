import type { MembershipPlan } from "@/lib/supabase/types";

export type StoredEnrollment = {
  email: string;
  fullName: string;
  plan: MembershipPlan;
  planSlug: string;
  amountInr: number;
  sessionIds: string[];
  submittedAt: string;
};

const KEY = "apex_enrollment_intent";
const SESSIONS_KEY = "apex_member_sessions";

export function saveLocalEnrollment(data: StoredEnrollment) {
  localStorage.setItem(KEY, JSON.stringify(data));
  if (data.sessionIds?.length) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(data.sessionIds));
  }
}

export function readLocalEnrollment(): StoredEnrollment | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredEnrollment;
  } catch {
    return null;
  }
}

export function readLocalSessionIds(): string[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw) as string[];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function clearLocalEnrollment() {
  localStorage.removeItem(KEY);
}
