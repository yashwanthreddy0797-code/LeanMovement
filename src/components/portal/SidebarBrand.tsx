import { Link } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

type SidebarBrandProps = {
  collapsed: boolean;
  onToggle: () => void;
  subtitle: string;
  /** light = member (white sidebar), dark = coach console */
  tone?: "light" | "dark";
};

export function SidebarBrand({
  collapsed,
  onToggle,
  subtitle,
  tone = "light",
}: SidebarBrandProps) {
  const isDark = tone === "dark";
  const logoClass = isDark ? "text-white" : "text-foreground";
  const muted = isDark
    ? "text-white/40 hover:text-white hover:bg-white/5"
    : "text-muted-foreground hover:bg-surface hover:text-foreground";
  const subClass = isDark ? "text-white/55" : "text-foreground/62";

  return (
    <div className={`shrink-0 py-5 ${collapsed ? "px-3" : "px-6"}`}>
      <div
        className={`flex ${
          collapsed ? "flex-col items-center gap-3" : "items-center justify-between gap-2"
        }`}
      >
        <Link
          to="/"
          title="Lean Movement"
          className={`relative block shrink-0 ${collapsed ? "w-full flex justify-center" : "min-w-0 flex-1"}`}
        >
          <BrandLogo
            aria-hidden={collapsed}
            className={`${logoClass} text-[1.35rem] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              collapsed
                ? "opacity-0 scale-[0.97] absolute left-0 top-0 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          />
          <BrandLogo
            variant="compact"
            aria-hidden={!collapsed}
            className={`${logoClass} transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              collapsed
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[0.97] absolute left-0 top-0 pointer-events-none"
            }`}
          />
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className={`shrink-0 p-1.5 transition-colors ${muted}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} strokeWidth={1.75} />
          ) : (
            <PanelLeftClose size={16} strokeWidth={1.75} />
          )}
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`pt-2.5 text-[10px] font-medium uppercase tracking-[0.12em] leading-[1.5] transition-opacity duration-300 ${subClass} ${
              collapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
