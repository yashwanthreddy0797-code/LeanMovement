import { useEffect, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { usePortalSession } from "@/lib/portal/session";

export function CoachGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const session = usePortalSession();
  const pathname = router.state.location.pathname;

  useEffect(() => {
    if (session.loading) return;
    if (!session.user) {
      router.navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [session.loading, session.user, pathname, router]);

  if (session.loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading coach console…</div>
      </div>
    );
  }

  if (!session.user) return null;

  if (!session.isCoach) {
    return (
      <div className="portal-theme min-h-[50vh] grid place-items-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl uppercase tracking-[0.04em]">Coach access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set your <code className="bg-surface px-1 py-0.5 text-xs">role</code> to{" "}
            <strong>coach</strong> in Supabase → profiles, then refresh.
          </p>
          <Link
            to="/portal/dashboard"
            className="mt-6 inline-flex text-sm text-accent hover:text-foreground"
          >
            ← Back to member portal
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
