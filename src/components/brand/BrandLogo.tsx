import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { BrandMonogram } from "@/components/brand/BrandMonogram";

type BrandLogoProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "full" | "abbr" | "navbar";
  /** Collapsed sidebar / icon-only mark size in px */
  monogramSize?: number;
};

export function BrandLogo({
  variant = "full",
  className,
  monogramSize,
  ...props
}: BrandLogoProps) {
  if (variant === "abbr") {
    return (
      <span
        className={cn("inline-flex items-center justify-center text-[#000000]", className)}
        aria-label="LEANMOVEMENT"
        {...props}
      >
        <BrandMonogram size={monogramSize ?? 26} />
      </span>
    );
  }

  if (variant === "navbar") {
    return (
      <span className={cn("flex items-center gap-2 sm:gap-2.5", className)} {...props}>
        <BrandMonogram className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        <span className="brand-logo text-[12px] sm:text-[15px] tracking-[0.28em] sm:tracking-[0.32em] truncate">
          LEANMOVEMENT
        </span>
      </span>
    );
  }

  return (
    <span className={cn("brand-logo inline-flex items-center gap-[0.35em] tracking-tight", className)} {...props}>
      <BrandMonogram className="h-[0.82em] w-[0.82em]" />
      <span>LEANMOVEMENT</span>
    </span>
  );
}
