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
} from "lucide-react";

const nav = [
  { to: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/live", label: "Calendar", icon: Radio },
  { to: "/portal/payments", label: "Payments", icon: CreditCard },
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
    <div className="portal-theme min-h-screen">
      <div className="flex">
        <aside
          className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r border-[var(--border)] bg-white/60 backdrop-blur-xl transition-[width] duration-300 ease-in-out ${sidebarW} ${ready ? "" : "opacity-0"}`}
        >
          <SidebarBrand collapsed={collapsed} onToggle={toggle} subtitle="Lean Kettlebell™" />

          <nav className={`flex-1 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  title={collapsed ? n.label : undefined}
                  className={`flex items-center rounded-xl text-sm transition-colors ${
                    collapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                  } ${
                    active
                      ? "bg-[#FEE2E2] text-[#000000] font-medium"
                      : "text-[#404040] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.6} className="shrink-0" />
                  {!collapsed && <span className="truncate">{n.label}</span>}
                </Link>
              );
            })}
            {session.isCoach && (
              <Link
                to="/portal/coach"
                title={collapsed ? "Coach console" : undefined}
                className={`flex items-center rounded-xl text-sm transition-colors ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                } ${
                  pathname.startsWith("/portal/coach")
                    ? "bg-[#FEE2E2] text-[#000000] font-medium"
                    : "text-[#404040] hover:bg-[#F5F5F5]"
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
                  <div className="w-9 h-9 rounded-full bg-[#E11D2A] text-white grid place-items-center text-xs font-semibold shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{userName}</div>
                    <div className="text-[11px] text-[#737373] capitalize">{membershipLabel}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[#E11D2A] text-xs font-medium">
                  <Sparkles size={14} className="shrink-0" />
                  <span className="truncate">Lean Kettlebell™</span>
                </div>
                <p className="mt-1.5 text-xs text-[#737373] leading-relaxed">
                  {session.hasActiveMembership
                    ? `${sessionsCount} sessions this month`
                    : `Status: ${membershipLabel}`}
                </p>
              </div>
            ) : (
              <div
                className="w-9 h-9 mx-auto rounded-full bg-[#E11D2A] text-white grid place-items-center text-xs font-semibold"
                title={userName}
              >
                {userInitial}
              </div>
            )}
            <button
              onClick={onSignOut}
              title="Sign out"
              className={`mt-4 flex items-center text-xs text-[#737373] hover:text-[#000000] ${
                collapsed ? "justify-center w-full p-2" : "gap-2"
              }`}
            >
              <LogOut size={14} />
              {!collapsed && "Sign out"}
            </button>
          </div>
        </aside>

        <div className={`flex-1 transition-[margin] duration-300 ease-in-out ${mainMl}`}>
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--background)]/70 border-b border-[var(--border)]">
            <div className="px-5 lg:px-10 py-3 flex items-center justify-between gap-4">
              <Link to="/" className="lg:hidden flex items-center">
                <BrandLogo className="text-base" />
              </Link>
              <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#737373] bg-[#F5F5F5] px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D2A] animate-pulse" />
                {isSupabaseConfigured() ? session.mode : "Demo mode"}
                {!isSupabaseConfigured() && " · add Supabase env to go live"}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="chip hidden sm:inline capitalize">{membershipLabel}</span>
                <div className="w-9 h-9 rounded-full bg-[#F5F5F5] grid place-items-center text-xs font-semibold text-[#E11D2A]">
                  {session.user?.name?.trim()?.[0]?.toUpperCase() ?? "?"}
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 lg:px-10 py-8 lg:py-12 max-w-[1200px] pb-24 lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {nav.slice(0, 5).map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${active ? "text-[#000000]" : "text-[#737373]"}`}
              >
                <Icon size={18} strokeWidth={1.6} />
                {n.label.split(" ")[0]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
