import type { MembershipPlan } from "@/lib/supabase/types";

export type StoredEnrollment = {
  email: string;
  fullName: string;
  plan: MembershipPlan;
  planSlug: string;
  amountInr: number;
  submittedAt: string;
};

const KEY = "apex_enrollment_intent";

export function saveLocalEnrollment(data: StoredEnrollment) {
  localStorage.setItem(KEY, JSON.stringify(data));
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

export function clearLocalEnrollment() {
  localStorage.removeItem(KEY);
}
