import { useQuery } from "@tanstack/react-query";
import { getMemberBillingDetails } from "@/lib/api/membership.functions";
import { PROGRAM_AMOUNT_INR } from "@/lib/enrollment/plans";
import { requireAccessToken } from "@/lib/supabase/access-token";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Membership } from "@/lib/supabase/types";

export function useMemberBilling(userId?: string | null, membership?: Membership | null) {
  return useQuery({
    queryKey: [
      "member-billing",
      userId,
      membership?.razorpay_payment_id,
      membership?.razorpay_subscription_id,
      membership?.amount_inr,
      membership?.renews_at,
      membership?.status,
    ],
    queryFn: async () => {
      if (!userId) {
        return {
          ok: true as const,
          billing: {
            planLabel: "Lean Movement",
            planPeriod: "monthly",
            priceInr: PROGRAM_AMOUNT_INR,
            status: "pending",
            renewsAt: null,
            memberSince: null,
            lastPaymentAmountInr: null,
            lastPaymentAt: null,
            subscriptionId: null,
            paymentId: null,
            source: "local" as const,
            razorpaySynced: false,
          },
          razorpayEnabled: false,
        };
      }

      if (!isSupabaseConfigured()) {
        return {
          ok: true as const,
          billing: {
            planLabel: "Lean Movement",
            planPeriod: "monthly",
            priceInr: membership?.amount_inr ?? PROGRAM_AMOUNT_INR,
            status: membership?.status ?? "active",
            renewsAt: membership?.renews_at ?? null,
            memberSince: membership?.started_at ?? null,
            lastPaymentAmountInr: membership?.amount_inr ?? PROGRAM_AMOUNT_INR,
            lastPaymentAt: membership?.started_at ?? null,
            subscriptionId: membership?.razorpay_subscription_id ?? null,
            paymentId: membership?.razorpay_payment_id ?? null,
            source: "local" as const,
            razorpaySynced: false,
          },
          razorpayEnabled: false,
        };
      }

      const accessToken = await requireAccessToken();
      return getMemberBillingDetails({ data: { accessToken, userId } });
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
