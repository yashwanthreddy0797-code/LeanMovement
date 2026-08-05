import type { MemberIntake } from "@/lib/supabase/types";

const DEMO_INTAKE_KEY = "lm-demo-member-intake";

export function getDemoMemberIntake(): MemberIntake | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DEMO_INTAKE_KEY);
    return raw ? (JSON.parse(raw) as MemberIntake) : null;
  } catch {
    return null;
  }
}

export function saveDemoMemberIntake(intake: MemberIntake) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_INTAKE_KEY, JSON.stringify(intake));
}

export function clearDemoMemberIntake() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_INTAKE_KEY);
}
