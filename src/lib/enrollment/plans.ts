import type { MembershipPlan } from "@/lib/supabase/types";

/** UI plan slugs from /programs and /join - single program mapped to monthly */
export type PlanSlug = "standard" | "monthly" | "quarterly" | "founding";

const SLUG_TO_PLAN: Record<PlanSlug, MembershipPlan> = {
  standard: "monthly",
  monthly: "monthly",
  quarterly: "monthly",
  founding: "monthly",
};

/** Single source of truth for what members are charged, in INR. */
export const PROGRAM_AMOUNT_INR = 6969;

/** Amounts left over from earlier pricing and from the ₹50 live-payment test. */
const LEGACY_AMOUNTS_INR = new Set([50, 5999, 9999, 14999]);

/**
 * Price to charge for a membership. A stored amount is only trusted when it is a
 * real current price, so missing or legacy amounts are re-quoted at PROGRAM_AMOUNT_INR.
 */
export function resolveChargeAmountInr(amount: number | null | undefined): number {
  if (amount == null || amount <= 0 || LEGACY_AMOUNTS_INR.has(amount)) {
    return PROGRAM_AMOUNT_INR;
  }
  return amount;
}

export function toMembershipPlan(slug: string): MembershipPlan {
  return SLUG_TO_PLAN[slug as PlanSlug] ?? "monthly";
}

export function planAmountInr(_plan?: MembershipPlan): number {
  return PROGRAM_AMOUNT_INR;
}

export function planSlugFromSearch(_slug?: string | null): PlanSlug {
  return "standard";
}
