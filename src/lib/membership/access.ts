import type { Membership } from "@/lib/supabase/types";

/** Days after renews_at where portal access continues while renewal is pending */
export const MEMBERSHIP_GRACE_DAYS = 4;

/** Send renewal reminder this many days before renews_at */
export const RENEWAL_REMINDER_DAYS_BEFORE = 3;

export function addDays(isoOrDate: string | Date, days: number) {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : new Date(isoOrDate);
  d.setDate(d.getDate() + days);
  return d;
}

export function graceEndsAt(renewsAt: string | null | undefined) {
  if (!renewsAt) return null;
  return addDays(renewsAt, MEMBERSHIP_GRACE_DAYS);
}

export type MembershipAccess = {
  access: boolean;
  inGrace: boolean;
  needsRenewal: boolean;
  graceEndsAt: Date | null;
  renewsAt: Date | null;
};

/**
 * Portal access: active membership, or past_due / overdue within 4-day grace.
 */
export function getMembershipAccess(membership: Membership | null | undefined): MembershipAccess {
  const empty: MembershipAccess = {
    access: false,
    inGrace: false,
    needsRenewal: false,
    graceEndsAt: null,
    renewsAt: null,
  };

  if (!membership) return empty;

  const now = new Date();
  const renews = membership.renews_at ? new Date(membership.renews_at) : null;
  const graceEnd = renews ? addDays(renews, MEMBERSHIP_GRACE_DAYS) : null;

  if (membership.status === "cancelled" || membership.status === "expired") {
    return { ...empty, renewsAt: renews, graceEndsAt: graceEnd };
  }

  if (membership.status === "pending") {
    return { ...empty, renewsAt: renews, graceEndsAt: graceEnd };
  }

  if (membership.status === "active") {
    if (renews && now > renews) {
      if (graceEnd && now <= graceEnd) {
        return {
          access: true,
          inGrace: true,
          needsRenewal: true,
          graceEndsAt: graceEnd,
          renewsAt: renews,
        };
      }
      return {
        access: false,
        inGrace: false,
        needsRenewal: true,
        graceEndsAt: graceEnd,
        renewsAt: renews,
      };
    }
    const soon =
      renews != null &&
      renews.getTime() - now.getTime() <= RENEWAL_REMINDER_DAYS_BEFORE * 24 * 60 * 60 * 1000;
    return {
      access: true,
      inGrace: false,
      needsRenewal: Boolean(soon),
      graceEndsAt: graceEnd,
      renewsAt: renews,
    };
  }

  if (membership.status === "past_due") {
    if (graceEnd && now <= graceEnd) {
      return {
        access: true,
        inGrace: true,
        needsRenewal: true,
        graceEndsAt: graceEnd,
        renewsAt: renews,
      };
    }
    return {
      access: false,
      inGrace: false,
      needsRenewal: true,
      graceEndsAt: graceEnd,
      renewsAt: renews,
    };
  }

  return empty;
}

export function hasPortalMembershipAccess(membership: Membership | null | undefined) {
  return getMembershipAccess(membership).access;
}
