import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { usePortalSession } from "@/lib/portal/session";
import { MembershipPaywall } from "./MembershipPaywall";

const PUBLIC_PATHS = ["/portal/login", "/portal/signup", "/portal/forgot"];

/** Unpaid / expired members may only reach renewal checkout */
const PENDING_MEMBER_PATHS = ["/portal/checkout", "/portal/payments"];

export function PortalGate({
  children,
  requireActive = true,
}: {
  children: ReactNode;
  requireActive?: boolean;
}) {
  const router = useRouter();
  const session = usePortalSession();
  const pathname = router.state.location.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith("/portal/admin");
  const isCoachArea = pathname.startsWith("/portal/coach");

  useEffect(() => {
    if (session.loading || isPublic) return;
    if (!session.user) {
      router.navigate({ to: "/login", search: { redirect: pathname } });
      return;
    }
    // Brand-new unpaid members: send back to public join to pay
    if (
      requireActive &&
      !session.hasActiveMembership &&
      !session.isCoach &&
      session.membership?.status === "pending" &&
      !PENDING_MEMBER_PATHS.some((p) => pathname.startsWith(p))
    ) {
      router.navigate({ to: "/join", search: { plan: "standard", email: session.user.email, name: "" } });
    }
  }, [
    session.loading,
    session.user,
    session.hasActiveMembership,
    session.isCoach,
    session.membership?.status,
    isPublic,
    pathname,
    requireActive,
    router,
  ]);

  if (isPublic) return <>{children}</>;

  if (session.loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-[#737373]">Loading portal…</div>
      </div>
    );
  }

  if (!session.user) return null;

  if ((isAdmin || isCoachArea) && !session.isCoach) {
    return (
      <div className="min-h-[50vh] grid place-items-center p-6">
        <p className="text-sm text-[#737373]">Coach access only.</p>
      </div>
    );
  }

  if (session.isCoach && isCoachArea) {
    return <>{children}</>;
  }

  const pendingAllowed = PENDING_MEMBER_PATHS.some((p) => pathname.startsWith(p));

  if (requireActive && !session.hasActiveMembership && !pendingAllowed) {
    return (
      <MembershipPaywall
        membership={session.membership}
        mode={session.mode}
        userEmail={session.user?.email}
      />
    );
  }

  return <>{children}</>;
}
