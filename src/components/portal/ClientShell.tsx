import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, LineChart, Dumbbell, Salad, ClipboardCheck,
  MessageSquare, CreditCard, Users, LogOut, Sparkles,
} from "lucide-react";
import { setPortalUser, usePortalUser } from "@/lib/portal/auth";
import logoAsset from "@/assets/leanmovement-logo.png.asset.json";


const nav = [
  { to: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/progress", label: "Progress", icon: LineChart },
  { to: "/portal/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/portal/nutrition", label: "Nutrition", icon: Salad },
  { to: "/portal/checkin", label: "Check-in", icon: ClipboardCheck },
  { to: "/portal/messages", label: "Messages", icon: MessageSquare },
  { to: "/portal/payments", label: "Payments", icon: CreditCard },
  { to: "/portal/community", label: "Community", icon: Users },
] as const;

export function ClientShell({ children }: { children: ReactNode }) {
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
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-[var(--border)] bg-white/60 backdrop-blur-xl">
          <div className="px-6 py-7">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logoAsset.url} alt="LEANMOVEMENT" className="h-8 w-auto object-contain" />
            </Link>
            <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#737373]">Client Portal</div>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-[#FEE2E2] text-[#000000] font-medium"
                      : "text-[#404040] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.6} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-[#FEE2E2] to-[#FAFAFA] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-[#E11D2A] text-xs font-medium">
              <Sparkles size={14} /> Premium 1:1
            </div>
            <p className="mt-2 text-xs text-[#737373] leading-relaxed">Direct coach access, weekly check-ins, custom plans.</p>
          </div>
          <button
            onClick={signOut}
            className="m-4 flex items-center gap-2 text-xs text-[#737373] hover:text-[#000000]"
          >
            <LogOut size={14} /> Sign out
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 lg:ml-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--background)]/70 border-b border-[var(--border)]">
            <div className="px-5 lg:px-10 py-4 flex items-center justify-between">
              <Link to="/" className="lg:hidden flex items-center"><img src={logoAsset.url} alt="LEANMOVEMENT" className="h-7 w-auto object-contain" /></Link>
              <div className="ml-auto flex items-center gap-3">
                <span className="chip">Day 23 / 90</span>
                <div className="w-9 h-9 rounded-full bg-[#F5F5F5] grid place-items-center text-xs font-semibold text-[#E11D2A]">
                  {user?.name?.[0] ?? "R"}
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 lg:px-10 py-8 lg:py-12 max-w-[1200px]">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {nav.slice(0, 5).map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-1 py-2.5 text-[10px] ${active ? "text-[#000000]" : "text-[#737373]"}`}>
                <Icon size={18} strokeWidth={1.6} />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
