import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { CoachGate } from "@/components/portal/CoachGate";
import { SidebarBrand } from "@/components/portal/SidebarBrand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { signOutPortal, usePortalSession } from "@/lib/portal/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import {
  LayoutDashboard,
  Users,
  Radio,
  Video,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

const nav = [
  { to: "/portal/coach", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/coach/members", label: "Members", icon: Users },
  { to: "/portal/coach/schedule", label: "Live Schedule", icon: Radio },
  { to: "/portal/coach/recordings", label: "Recordings", icon: Video },
  { to: "/portal/coach/onboarding", label: "Onboarding", icon: UserCheck },
  { to: "/portal/coach/settings", label: "Settings", icon: Settings },
] as const;

export function CoachShell({ children }: { children: ReactNode }) {
  const session = usePortalSession();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { collapsed, toggle, ready } = useSidebarCollapse("coach-sidebar-collapsed");

  const signOut = async () => {
    await signOutPortal();
    router.navigate({ to: "/login" });
  };

  const coachName = session.profile?.full_name ?? session.user?.name ?? "Coach";
  const sidebarW = collapsed ? "lg:w-[72px]" : "lg:w-64";
  const mainMl = collapsed ? "lg:ml-[72px]" : "lg:ml-64";

  return (
    <CoachGate>
      <div className="coach-portal min-h-screen">
        <div className="flex">
          <aside
            className={`portal-sidebar hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r transition-[width] duration-300 ease-in-out ${sidebarW} ${ready ? "" : "opacity-0"}`}
          >
            <SidebarBrand
              collapsed={collapsed}
              onToggle={toggle}
              subtitle="Coach console"
              tone="dark"
            />

            <nav className={`flex-1 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
              {nav.map((n) => {
                const Icon = n.icon;
                const active =
                  n.to === "/portal/coach"
                    ? pathname === "/portal/coach"
                    : pathname.startsWith(n.to);
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
                    {!collapsed && <span className="truncate">{n.label}</span>}
                  </Link>
                );
              })}
            </nav>

            <div className={collapsed ? "px-2 pb-2" : "px-3 pb-2"}>
              <Link
                to="/portal/dashboard"
                title={collapsed ? "Member portal view" : undefined}
                className={`portal-nav-link ${
                  collapsed ? "justify-center p-2.5" : "gap-2 px-3.5 py-2.5"
                }`}
              >
                <ExternalLink size={14} className="shrink-0" />
                {!collapsed && "Member portal view"}
              </Link>
            </div>

            <div className={collapsed ? "p-2" : "p-4"}>
              {!collapsed ? (
                <div className="portal-sidebar-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold shrink-0">
                      {coachName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate text-white">{coachName}</div>
                      <div className="text-[11px] text-muted-foreground">Head Coach · Ops</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="w-9 h-9 mx-auto bg-accent text-white grid place-items-center text-xs font-semibold"
                  title={coachName}
                >
                  {coachName[0]}
                </div>
              )}
              <button
                onClick={() => void signOut()}
                title="Sign out"
                className={`mt-4 flex items-center text-xs text-muted-foreground hover:text-white ${
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
              <div className="px-4 sm:px-5 lg:px-10 py-3 sm:py-4 flex items-center justify-between gap-3">
                <Link to="/" className="lg:hidden flex items-center gap-2 min-h-11">
                  <BrandLogo className="text-base" />
                  <span className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                    Coach
                  </span>
                </Link>
                <div className="hidden lg:flex items-center gap-3">
                  <span className="portal-identity-badge px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold">
                    Coach console
                  </span>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Lean Kettlebell™ · Operations
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                  <Link
                    to="/portal/dashboard"
                    className="lg:hidden text-[11px] uppercase tracking-[0.12em] text-muted-foreground min-h-11 px-2 grid place-items-center"
                  >
                    Member
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="lg:hidden text-[11px] uppercase tracking-[0.12em] text-muted-foreground min-h-11 px-2 grid place-items-center"
                  >
                    Sign out
                  </button>
                  <span className="chip chip-console hidden sm:inline">
                    {isSupabaseConfigured() ? "Live ops" : "Demo ops"}
                  </span>
                  <div className="w-9 h-9 bg-foreground text-white grid place-items-center text-xs font-semibold">
                    {coachName[0]}
                  </div>
                </div>
              </div>
            </header>
            <main className="px-4 sm:px-5 lg:px-10 py-6 sm:py-8 lg:py-12 max-w-[1280px] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>

        <nav className="portal-mobile-nav lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="flex overflow-x-auto no-scrollbar">
            {nav.map((n) => {
              const Icon = n.icon;
              const active =
                n.to === "/portal/coach"
                  ? pathname === "/portal/coach"
                  : pathname.startsWith(n.to);
              const short =
                n.label === "Live Schedule"
                  ? "Schedule"
                  : n.label === "Onboarding"
                    ? "Onboard"
                    : n.label;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  data-active={active}
                  className={`relative flex flex-col items-center justify-center gap-0.5 min-h-14 min-w-[4.5rem] flex-1 px-1 text-[10px] ${
                    active ? "text-white" : "text-white/50"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} className={active ? "text-accent" : undefined} />
                  <span className="truncate max-w-[4.5rem]">{short}</span>
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-accent" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </CoachGate>
  );
}
