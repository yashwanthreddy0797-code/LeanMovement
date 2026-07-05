import type { MembershipPlan } from "@/lib/supabase/types";

/** UI plan slugs from /programs and /join */
export type PlanSlug = "standard" | "monthly" | "quarterly" | "founding";

const SLUG_TO_PLAN: Record<PlanSlug, MembershipPlan> = {
  standard: "monthly",
  monthly: "monthly",
  quarterly: "quarterly",
  founding: "founding",
};

export function toMembershipPlan(slug: string): MembershipPlan {
  return SLUG_TO_PLAN[slug as PlanSlug] ?? "monthly";
}

export function planAmountInr(plan: MembershipPlan): number {
  if (plan === "founding") return 5999;
  if (plan === "quarterly") return 21999;
  return 7999;
}

export function planSlugFromSearch(slug?: string | null): PlanSlug {
  if (slug === "quarterly" || slug === "founding" || slug === "monthly") return slug;
  return "standard";
}
