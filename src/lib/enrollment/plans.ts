import type { MembershipPlan } from "@/lib/supabase/types";

/** UI plan slugs from /programs and /join - single program mapped to monthly */
export type PlanSlug = "standard" | "monthly" | "quarterly" | "founding";

const SLUG_TO_PLAN: Record<PlanSlug, MembershipPlan> = {
  standard: "monthly",
  monthly: "monthly",
  quarterly: "monthly",
  founding: "monthly",
};

export const PROGRAM_AMOUNT_INR = 6969;

/**
 * TEMP live E2E test charge. Flip back to PROGRAM_AMOUNT_INR (6969) after testing.
 * Env RAZORPAY_CHARGE_AMOUNT_INR still wins when set.
 */
const TEMP_TEST_CHARGE_INR = 50;

/**
 * Amount Razorpay actually charges.
 * Website marketing copy keeps using PROGRAM_AMOUNT_INR (₹6969).
 */
export function chargeAmountInr(): number {
  const raw = process.env.RAZORPAY_CHARGE_AMOUNT_INR?.trim();
  if (raw) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return Math.round(n);
  }
  return TEMP_TEST_CHARGE_INR;
}

export function isChargeAmountOverridden(): boolean {
  return chargeAmountInr() !== PROGRAM_AMOUNT_INR;
}

export function toMembershipPlan(slug: string): MembershipPlan {
  return SLUG_TO_PLAN[slug as PlanSlug] ?? "monthly";
}

export function planAmountInr(_plan?: MembershipPlan): number {
  return chargeAmountInr();
}

export function planSlugFromSearch(_slug?: string | null): PlanSlug {
  return "standard";
}
