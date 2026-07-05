import { useEffect, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { usePortalSession } from "@/lib/portal/session";
import { MembershipPaywall } from "./MembershipPaywall";

const PUBLIC_PATHS = ["/portal/login", "/portal/signup", "/portal/forgot"];

/** Logged-in members without active membership can still open these routes */
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

  useEffect(() => {
    if (session.loading || isPublic) return;
    if (!session.user) {
      router.navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [session.loading, session.user, isPublic, pathname, router]);

  if (isPublic) return <>{children}</>;

  if (session.loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-[#737373]">Loading portal…</div>
      </div>
    );
  }

  if (!session.user) return null;

  if (isAdmin && !session.isCoach) {
    return (
      <div className="min-h-[50vh] grid place-items-center p-6">
        <p className="text-sm text-[#737373]">Coach access only.</p>
      </div>
    );
  }

  const pendingAllowed = PENDING_MEMBER_PATHS.some((p) => pathname.startsWith(p));

  if (requireActive && !session.hasActiveMembership && !isAdmin && !pendingAllowed) {
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
