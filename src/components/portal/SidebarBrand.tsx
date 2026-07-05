import { Link } from "@tanstack/react-router";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

type SidebarBrandProps = {
  collapsed: boolean;
  onToggle: () => void;
  subtitle: string;
};

const logoClass = "text-lg text-[#000000]";

export function SidebarBrand({ collapsed, onToggle, subtitle }: SidebarBrandProps) {
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
            }`}
          />
        </Link>

        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 p-1.5 rounded-lg text-[#A3A3A3] hover:bg-[#F5F5F5] hover:text-[#000000] transition-colors"
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
        className={`text-[10px] uppercase tracking-[0.28em] text-[#737373] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          collapsed ? "max-h-0 opacity-0 mt-0" : "max-h-6 opacity-100 mt-2"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}
