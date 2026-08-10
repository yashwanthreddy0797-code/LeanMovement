import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { PortalGate } from "@/components/portal/PortalGate";
import { SidebarBrand } from "@/components/portal/SidebarBrand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PortalContentProvider, useSharedPortalContent } from "@/lib/portal/portal-content";
import { signOutPortal, usePortalSession } from "@/lib/portal/session";
import { formatPlanLabel, membershipSummary } from "@/lib/portal/member-format";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { useMemberChatUnread } from "@/hooks/useMemberChatUnread";
import {
  LayoutDashboard,
  Radio,
  CreditCard,
  LogOut,
  Shield,
  Video,
  MessageCircle,
} from "lucide-react";

const nav = [
  { to: "/portal/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/portal/live", label: "Live", icon: Radio },
  { to: "/portal/recordings", label: "Recordings", icon: Video },
  { to: "/portal/messages", label: "Messages", icon: MessageCircle },
  { to: "/portal/payments", label: "Billing", icon: CreditCard },
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
  useSharedPortalContent();
  const messagesUnread = useMemberChatUnread(
    session.user?.id,
    session.hasActiveMembership && !session.isCoach,
  );

  return (
    <div className="member-portal portal-theme min-h-screen">
      <div className="flex">
        <aside
          className={`portal-sidebar hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r transition-[width] duration-300 ease-in-out ${sidebarW} ${ready ? "" : "opacity-0"}`}
        >
          <SidebarBrand
            collapsed={collapsed}
            onToggle={toggle}
            subtitle="Member portal"
            tone="light"
          />

          <nav className={`flex-1 space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to || pathname.startsWith(`${n.to}/`);
              const showUnread = n.to === "/portal/messages" && messagesUnread && !active;
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
                  <span className="relative shrink-0">
                    <Icon size={17} strokeWidth={1.6} />
                    {showUnread && (
                      <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-accent" />
                    )}
                  </span>
                  {!collapsed && <span className="truncate">{n.label}</span>}
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
              <div className="flex items-center gap-3 px-1">
                <div className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{userName}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {membershipLabel}
                  </div>
                </div>
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
                collapsed ? "justify-center w-full p-2" : "gap-2 px-1"
              }`}
            >
              <LogOut size={14} />
              {!collapsed && "Sign out"}
            </button>
          </div>
        </aside>

        <div className={`flex-1 transition-[margin] duration-300 ease-in-out ${mainMl}`}>
          <header className="portal-topbar sticky top-0 z-30 backdrop-blur-xl border-b lg:hidden">
            <div className="px-3 py-2.5 flex items-center justify-between gap-3">
              <Link to="/portal/dashboard" className="flex items-center min-h-10">
                <BrandLogo className="text-base" />
              </Link>
              <div
                className="w-9 h-9 bg-accent text-white grid place-items-center text-xs font-semibold"
                title={userName}
              >
                {userInitial}
              </div>
            </div>
          </header>

          <main className="px-3 sm:px-5 lg:px-10 py-4 sm:py-8 lg:py-10 max-w-[1100px] pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-10 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to || pathname.startsWith(`${n.to}/`);
            const showUnread = n.to === "/portal/messages" && messagesUnread && !active;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[3.5rem] text-[10px] ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon
                    size={18}
                    strokeWidth={1.6}
                    className={active ? "text-accent" : undefined}
                  />
                  {showUnread && (
                    <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 bg-accent" />
                  )}
                </span>
                {n.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-accent" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
