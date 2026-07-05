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
      <div className="portal-theme min-h-screen">
        <div className="flex">
          <aside
            className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r border-[var(--border)] bg-white/60 backdrop-blur-xl transition-[width] duration-300 ease-in-out ${sidebarW} ${ready ? "" : "opacity-0"}`}
          >
            <SidebarBrand collapsed={collapsed} onToggle={toggle} subtitle="Coach Console" />

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
            </nav>

            <div className={collapsed ? "px-2 pb-2" : "px-3 pb-2"}>
              <Link
                to="/portal/dashboard"
                title={collapsed ? "Member portal view" : undefined}
                className={`flex items-center rounded-xl text-xs text-[#737373] hover:bg-[#F5F5F5] hover:text-[#000000] ${
                  collapsed ? "justify-center p-2.5" : "gap-2 px-3.5 py-2.5"
                }`}
              >
                <ExternalLink size={14} className="shrink-0" />
                {!collapsed && "Member portal view"}
              </Link>
            </div>

            <div className={collapsed ? "p-2" : "p-4"}>
              {!collapsed ? (
                <div className="card-soft p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold shrink-0">
                      {coachName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{coachName}</div>
                      <div className="text-[11px] text-[#737373]">Head Coach</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="w-9 h-9 mx-auto rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold"
                  title={coachName}
                >
                  {coachName[0]}
                </div>
              )}
              <button
                onClick={() => void signOut()}
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
              <div className="px-5 lg:px-10 py-4 flex items-center justify-between gap-4">
                <Link to="/" className="lg:hidden flex items-center gap-2">
                  <BrandLogo className="text-base" />
                  <span className="text-[10px] tracking-[0.28em] uppercase text-[#737373]">Coach</span>
                </Link>
                <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#737373]">
                  Lean Kettlebell™ · Coach
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="chip hidden sm:inline">
                    {isSupabaseConfigured() ? "Live" : "Demo"}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold">
                    {coachName[0]}
                  </div>
                </div>
              </div>
            </header>
            <main className="px-5 lg:px-10 py-8 lg:py-12 max-w-[1280px] pb-24 lg:pb-12">{children}</main>
          </div>
        </div>

        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur-xl">
          <div className="grid grid-cols-6">
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
                  className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${
                    active ? "text-[#000000]" : "text-[#737373]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} />
                  {n.label.split(" ")[0]}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </CoachGate>
  );
}
