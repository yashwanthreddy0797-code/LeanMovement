import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { CoachGate } from "@/components/portal/CoachGate";
import { SidebarBrand } from "@/components/portal/SidebarBrand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { signOutPortal, usePortalSession } from "@/lib/portal/session";
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
  MoreHorizontal,
  MessageCircle,
  X,
} from "lucide-react";

const nav = [
  { to: "/portal/coach", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/portal/coach/members", label: "Members", icon: Users },
  { to: "/portal/coach/messages", label: "Messages", icon: MessageCircle },
  { to: "/portal/coach/schedule", label: "Schedule", icon: Radio },
] as const;

const moreNav = [
  { to: "/portal/coach/recordings", label: "Recordings", icon: Video },
  { to: "/portal/coach/onboarding", label: "Onboarding", icon: UserCheck },
  { to: "/portal/coach/settings", label: "Settings", icon: Settings },
] as const;

const desktopNav = [
  { to: "/portal/coach", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/portal/coach/members", label: "Members", icon: Users },
  { to: "/portal/coach/messages", label: "Messages", icon: MessageCircle },
  { to: "/portal/coach/schedule", label: "Live Schedule", icon: Radio },
  { to: "/portal/coach/recordings", label: "Recordings", icon: Video },
  { to: "/portal/coach/onboarding", label: "Onboarding", icon: UserCheck },
  { to: "/portal/coach/settings", label: "Settings", icon: Settings },
] as const;

function pathActive(pathname: string, to: string, exact?: boolean) {
  if (exact || to === "/portal/coach") return pathname === "/portal/coach";
  return pathname.startsWith(to);
}

export function CoachShell({ children }: { children: ReactNode }) {
  const session = usePortalSession();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { collapsed, toggle, ready } = useSidebarCollapse("coach-sidebar-collapsed");
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const signOut = async () => {
    await signOutPortal();
    router.navigate({ to: "/login" });
  };

  const coachName = session.profile?.full_name ?? session.user?.name ?? "Coach";
  const sidebarW = collapsed ? "lg:w-[72px]" : "lg:w-64";
  const mainMl = collapsed ? "lg:ml-[72px]" : "lg:ml-64";
  const moreActive = moreNav.some((n) => pathActive(pathname, n.to));

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
              {desktopNav.map((n) => {
                const Icon = n.icon;
                const active = pathActive(pathname, n.to, "exact" in n ? n.exact : false);
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
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold shrink-0">
                    {coachName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate text-white">{coachName}</div>
                    <div className="text-[11px] text-muted-foreground">Coach</div>
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
                  collapsed ? "justify-center w-full p-2" : "gap-2 px-1"
                }`}
              >
                <LogOut size={14} />
                {!collapsed && "Sign out"}
              </button>
            </div>
          </aside>

          <div className={`flex-1 transition-[margin] duration-300 ease-in-out ${mainMl}`}>
            <header className="portal-topbar sticky top-0 z-30 backdrop-blur-xl border-b">
              <div className="px-3 sm:px-5 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-3">
                <Link to="/" className="lg:hidden flex items-center min-h-10">
                  <BrandLogo className="text-base" />
                </Link>
                <p className="hidden lg:block text-sm text-muted-foreground">Coach console</p>
                <div className="ml-auto flex items-center gap-2">
                  <div
                    className="w-9 h-9 bg-foreground text-white grid place-items-center text-xs font-semibold"
                    title={coachName}
                  >
                    {coachName[0]}
                  </div>
                </div>
              </div>
            </header>
            <main className="px-3 sm:px-5 lg:px-10 py-4 sm:py-8 lg:py-12 max-w-[1280px] pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>

        <nav className="portal-mobile-nav lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="grid grid-cols-5">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathActive(pathname, n.to, "exact" in n ? n.exact : false);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  data-active={active}
                  className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[3.5rem] px-1 text-[10px] ${
                    active ? "text-white" : "text-white/50"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                    className={active ? "text-accent" : undefined}
                  />
                  <span className="truncate">{n.label}</span>
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-accent" />
                  )}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              data-active={moreOpen || moreActive}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[3.5rem] px-1 text-[10px] ${
                moreOpen || moreActive ? "text-white" : "text-white/50"
              }`}
            >
              <MoreHorizontal
                size={18}
                strokeWidth={1.6}
                className={moreOpen || moreActive ? "text-accent" : undefined}
              />
              More
            </button>
          </div>
        </nav>

        {moreOpen && (
          <div
            className="portal-mobile-sheet lg:hidden"
            onClick={() => setMoreOpen(false)}
            role="presentation"
          >
            <div
              className="portal-mobile-sheet-panel"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="More menu"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{coachName}</p>
                  <p className="text-xs text-white/50">Coach console</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="grid h-10 w-10 place-items-center text-white/60"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1">
                {moreNav.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="flex min-h-12 items-center gap-3 border border-white/10 px-3 text-sm text-white"
                    >
                      <Icon size={16} className="text-accent" /> {n.label}
                    </Link>
                  );
                })}
                <Link
                  to="/portal/dashboard"
                  className="flex min-h-12 items-center gap-3 border border-white/10 px-3 text-sm text-white"
                >
                  <ExternalLink size={16} className="text-accent" /> Member portal
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="flex w-full min-h-12 items-center gap-3 border border-white/10 px-3 text-sm text-white/60"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CoachGate>
  );
}
