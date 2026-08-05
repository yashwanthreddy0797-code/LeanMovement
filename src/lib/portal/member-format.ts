import { PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";
import type { Membership, MembershipPlan, MembershipStatus } from "@/lib/supabase/types";

const PLAN_LABELS: Record<MembershipPlan, string> = {
  monthly: "Lean Movement",
  quarterly: "Lean Movement",
  founding: "Lean Movement",
};

const STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: "Pending activation",
  active: "Active",
  past_due: "Past due",
  cancelled: "Cancelled",
  expired: "Expired",
};

export function formatPlanLabel(plan?: MembershipPlan | string | null) {
  if (!plan) return "Monthly";
  return PLAN_LABELS[plan as MembershipPlan] ?? plan;
}

export function formatMembershipStatus(status?: MembershipStatus | string | null) {
  if (!status) return "Unknown";
  return STATUS_LABELS[status as MembershipStatus] ?? status;
}

export function formatPortalDate(iso?: string | null, fallback = "-") {
  if (!iso) return fallback;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatInr(amount?: number | null) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function planPriceInr(_plan?: MembershipPlan | string | null) {
  return PROGRAM_AMOUNT_INR;
}

export function membershipSummary(membership: Membership | null) {
  const plan = membership?.plan ?? "monthly";
  return {
    planLabel: formatPlanLabel(plan),
    statusLabel: formatMembershipStatus(membership?.status),
    price: formatInr(membership?.amount_inr ?? planPriceInr(plan)),
    renewsOn: formatPortalDate(membership?.renews_at),
    memberSince: formatPortalDate(membership?.started_at, "Not started"),
    isActive: membership?.status === "active",
    isPending: membership?.status === "pending" || !membership,
  };
}
