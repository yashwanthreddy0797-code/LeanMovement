import type { MembershipPlan } from "@/lib/supabase/types";

/** UI plan slugs from /programs and /join — single program mapped to monthly */
export type PlanSlug = "standard" | "monthly" | "quarterly" | "founding";

const SLUG_TO_PLAN: Record<PlanSlug, MembershipPlan> = {
  standard: "monthly",
  monthly: "monthly",
  quarterly: "monthly",
  founding: "monthly",
};

export const PROGRAM_AMOUNT_INR = 6999;

export function toMembershipPlan(slug: string): MembershipPlan {
  return SLUG_TO_PLAN[slug as PlanSlug] ?? "monthly";
}

export function planAmountInr(_plan?: MembershipPlan): number {
  return PROGRAM_AMOUNT_INR;
}

export function planSlugFromSearch(_slug?: string | null): PlanSlug {
  return "standard";
}
