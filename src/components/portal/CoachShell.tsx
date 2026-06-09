import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, LogOut, Settings } from "lucide-react";
import { setPortalUser, usePortalUser } from "@/lib/portal/auth";
import logoAsset from "@/assets/leanmovement-logo.png.asset.json";


const nav = [
  { to: "/portal/coach", label: "Overview", icon: LayoutDashboard },
  { to: "/portal/coach/clients", label: "Clients", icon: Users },
  { to: "/portal/coach/checkins", label: "Check-ins", icon: ClipboardCheck },
  { to: "/portal/coach/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function CoachShell({ children }: { children: ReactNode }) {
  const user = usePortalUser();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = () => {
    setPortalUser(null);
    router.navigate({ to: "/portal/login" });
  };

  return (
    <div className="portal-theme min-h-screen">
      <div className="flex">
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-[var(--border)] bg-white/60 backdrop-blur-xl">
          <div className="px-6 py-7">
            <Link to="/" className="flex items-center">
              <img src={logoAsset.url} alt="LEANMOVEMENT" className="h-8 w-auto object-contain" />
            </Link>
            <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#737373]">Coach Console</div>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = n.to === "/portal/coach"
                ? pathname === "/portal/coach"
                : pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${active ? "bg-[#FEE2E2] text-[#000000] font-medium" : "text-[#404040] hover:bg-[#F5F5F5]"}`}>
                  <Icon size={17} strokeWidth={1.6} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4">
            <div className="card-soft p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#000000] text-white grid place-items-center text-xs font-semibold">
                  {user?.name?.[0] ?? "A"}
                </div>
                <div>
                  <div className="text-sm font-medium">{user?.name ?? "Arjun Kapoor"}</div>
                  <div className="text-[11px] text-[#737373]">Head Coach</div>
                </div>
              </div>
            </div>
            <button onClick={signOut} className="mt-4 flex items-center gap-2 text-xs text-[#737373] hover:text-[#000000]">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--background)]/70 border-b border-[var(--border)]">
            <div className="px-5 lg:px-10 py-4 flex items-center justify-between">
              <Link to="/" className="lg:hidden flex items-center gap-2"><img src={logoAsset.url} alt="LEANMOVEMENT" className="h-7 w-auto object-contain" /><span className="text-[10px] tracking-[0.28em] uppercase text-[#737373]">Coach</span></Link>
              <div className="ml-auto flex items-center gap-3">
                <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#404040] hover:bg-white/60">
                  <Settings size={13} /> Settings
                </button>
                <span className="chip">All systems live</span>
              </div>
            </div>
          </header>
          <main className="px-5 lg:px-10 py-8 lg:py-12 max-w-[1280px]">{children}</main>
        </div>
      </div>
    </div>
  );
}
