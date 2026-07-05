import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ClientShell } from "@/components/portal/ClientShell";
import { PortalSessionProvider } from "@/lib/portal/session";

/** Auth pages — no session polling (prevents crash/flicker on signup/login) */
const PUBLIC_PREFIXES = ["/portal/login", "/portal/signup", "/portal/forgot"];
const COACH_PREFIXES = ["/portal/coach", "/portal/admin"];

function AuthenticatedPortalLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCoachRoute = COACH_PREFIXES.some((p) => pathname.startsWith(p));
  const useMemberShell = !isCoachRoute;

  if (useMemberShell) {
    return (
      <ClientShell>
        <Outlet />
      </ClientShell>
    );
  }

  return <Outlet />;
}

function PortalRoot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPublic) {
    return <Outlet />;
  }

  return (
    <PortalSessionProvider>
      <AuthenticatedPortalLayout />
    </PortalSessionProvider>
  );
}

export const Route = createFileRoute("/portal")({
  component: PortalRoot,
});
