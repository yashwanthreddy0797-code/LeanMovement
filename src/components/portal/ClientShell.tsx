import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { PortalGate } from "@/components/portal/PortalGate";
import { SidebarBrand } from "@/components/portal/SidebarBrand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PortalContentProvider, useSharedPortalContent } from "@/lib/portal/portal-content";
import { signOutPortal, usePortalSession } from "@/lib/portal/session";
import { formatPlanLabel, membershipSummary } from "@/lib/portal/member-format";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import {
  LayoutDashboard,
  Radio,
  CreditCard,
  LogOut,
  Sparkles,
  Shield,
  Video,
  Dumbbell,
  MessageCircle,
} from "lucide-react";

const nav = [
  { to: "/portal/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/portal/live", label: "Live", icon: Radio },
  { to: "/portal/recordings", label: "Videos", icon: Video },
  { to: "/portal/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/portal/payments", label: "Pay", icon: CreditCard },
] as const;

const moreLinks = [
  { to: "/portal/community", label: "Community", icon: MessageCircle },
] as const;

export function ClientShell({ children }: { children: ReactNode }) {
  const session = usePortalSession();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { collapsed, toggle, ready } = useSidebarCollapse("member-sidebar-collapsed");

  const signOut = async () => {
    await signOutPortal();
    router.navigate({ to: "/login" });
  };

  const billing = membershipSummary(session.membership);
  const membershipLabel = billing.isActive
    ? formatPlanLabel(session.membership?.plan)
    : billing.statusLabel;

  const userName = session.user?.name?.trim() || "Member";
  const userInitial = userName[0]?.toUpperCase() ?? "M";
  const sidebarW = collapsed ? "lg:w-[72px]" : "lg:w-64";
  const mainMl = collapsed ? "lg:ml-[72px]" : "lg:ml-64";

  return (
    <PortalGate>
      <PortalContentProvider enabled={session.hasActiveMembership}>
        <ClientShellInner
          session={session}
          pathname={pathname}
          collapsed={collapsed}
          toggle={toggle}
          ready={ready}
          membershipLabel={membershipLabel}
          userName={userName}
          userInitial={userInitial}
          sidebarW={sidebarW}
          mainMl={mainMl}
          onSignOut={() => void signOut()}
        >
          {children}
        </ClientShellInner>
      </PortalContentProvider>
    </PortalGate>
  );
}

function ClientShellInner({
  children,
  session,
  pathname,
  collapsed,
  toggle,
  ready,
  membershipLabel,
  userName,
  userInitial,
  sidebarW,
  mainMl,
  onSignOut,
}: {
  children: ReactNode;
  session: ReturnType<typeof usePortalSession>;
  pathname: string;
  collapsed: boolean;
  toggle: () => void;
  ready: boolean;
  membershipLabel: string;
  userName: string;
  userInitial: string;
  sidebarW: string;
  mainMl: string;
  onSignOut: () => void;
}) {
  const { data: portalContent } = useSharedPortalContent();

  const sessionsCount = session.hasActiveMembership && portalContent
    ? `${portalContent.sessionsThisMonth ?? 0}/${portalContent.totalSessionsPerMonth ?? 12}`
    : "—";

  return (
    <div className="member-portal portal-theme min-h-screen">
      <div className="flex">
        <aside
          className={`portal-sidebar hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r transition-[width] duration-300 ease-in-out ${sidebarW} ${ready ? "" : "opacity-0"}`}
        >
          <SidebarBrand
            collapsed={collapsed}
            onToggle={toggle}
            subtitle="Member · Lean Kettlebell™"
            tone="light"
          />

          <nav className={`flex-1 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
            {[...nav, ...moreLinks].map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to || pathname.startsWith(`${n.to}/`);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  title={collapsed ? n.label : undefined}
                  data-active={active}
                  className={`portal-nav-link ${
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.6} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate">
                      {n.to === "/portal/dashboard"
                        ? "Dashboard"
                        : n.to === "/portal/live"
                          ? "Live sessions"
                          : n.to === "/portal/recordings"
                            ? "Recordings"
                            : n.to === "/portal/payments"
                              ? "Payments"
                              : n.label}
                    </span>
                  )}
                </Link>
              );
            })}
            {session.isCoach && (
              <Link
                to="/portal/coach"
                title={collapsed ? "Coach console" : undefined}
                data-active={pathname.startsWith("/portal/coach")}
                className={`portal-nav-link ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                }`}
              >
                <Shield size={17} strokeWidth={1.6} className="shrink-0" />
                {!collapsed && "Coach console"}
              </Link>
            )}
          </nav>

          <div className={collapsed ? "p-2" : "p-4"}>
            {!collapsed ? (
              <div className="card-soft p-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{userName}</div>
                    <div className="text-[11px] text-muted-foreground capitalize">{membershipLabel}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-accent text-xs font-medium">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="truncate">Your training home</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {session.hasActiveMembership
                    ? `${sessionsCount} sessions this month`
                    : `Status: ${membershipLabel}`}
                </p>
              </div>
            ) : (
              <div
                className="w-9 h-9 mx-auto bg-accent text-white grid place-items-center text-xs font-semibold"
                title={userName}
              >
                {userInitial}
              </div>
            )}
            <button
              onClick={onSignOut}
              title="Sign out"
              className={`mt-4 flex items-center text-xs text-muted-foreground hover:text-foreground ${
                collapsed ? "justify-center w-full p-2" : "gap-2"
              }`}
            >
              <LogOut size={14} />
              {!collapsed && "Sign out"}
            </button>
          </div>
        </aside>

        <div className={`flex-1 transition-[margin] duration-300 ease-in-out ${mainMl}`}>
          <header className="portal-topbar sticky top-0 z-30 backdrop-blur-xl border-b">
            <div className="px-4 sm:px-5 lg:px-10 py-3 flex items-center justify-between gap-3">
              <Link to="/" className="lg:hidden flex items-center min-h-11">
                <BrandLogo className="text-base" />
              </Link>
              <div className="hidden lg:flex items-center gap-3">
                <span className="portal-identity-badge px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold">
                  Member portal
                </span>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                  {isSupabaseConfigured() ? session.mode : "Demo mode"}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Link
                  to="/portal/community"
                  className="lg:hidden text-[11px] uppercase tracking-[0.12em] text-muted-foreground min-h-11 px-2 grid place-items-center"
                >
                  Community
                </Link>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="lg:hidden text-[11px] uppercase tracking-[0.12em] text-muted-foreground min-h-11 px-2 grid place-items-center"
                >
                  Sign out
                </button>
                <span className="chip hidden sm:inline capitalize">{membershipLabel}</span>
                <div className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold">
                  {session.user?.name?.trim()?.[0]?.toUpperCase() ?? "?"}
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-5 lg:px-10 py-6 sm:py-8 lg:py-12 max-w-[1200px] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to || pathname.startsWith(`${n.to}/`);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-h-14 text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={1.6} className={active ? "text-accent" : undefined} />
                {n.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
