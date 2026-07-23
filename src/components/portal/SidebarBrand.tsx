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
  const logoClass = isDark ? "text-lg text-white" : "text-lg text-foreground";
  const muted = isDark ? "text-white/40 hover:text-white hover:bg-white/5" : "text-muted-foreground hover:bg-surface hover:text-foreground";
  const subClass = isDark ? "text-white/40" : "text-muted-foreground";

  return (
    <div className={`py-5 ${collapsed ? "px-3" : "px-6"}`}>
      <div
        className={`flex ${
          collapsed ? "flex-col items-center gap-3" : "items-center justify-between gap-2"
        }`}
      >
        <Link
          to="/"
          title="LEANMOVEMENT"
          className={`relative block shrink-0 ${collapsed ? "w-full text-center" : "min-w-0 flex-1"}`}
          style={{ minHeight: "1.125rem" }}
        >
          <BrandLogo
            aria-hidden={collapsed}
            className={`${logoClass} transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              collapsed
                ? "opacity-0 scale-[0.97] absolute left-0 top-0 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          />
          <BrandLogo
            variant="abbr"
            monogramSize={28}
            aria-hidden={!collapsed}
            className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              collapsed
                ? "opacity-100 scale-100"
                : "opacity-0 scale-[0.97] absolute left-0 top-0 pointer-events-none"
            } ${isDark ? "text-white" : ""}`}
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

      <p
        className={`text-[10px] uppercase tracking-[0.28em] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${subClass} ${
          collapsed ? "max-h-0 opacity-0 mt-0" : "max-h-6 opacity-100 mt-2"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
