import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BrandLogoProps = HTMLAttributes<HTMLSpanElement> & {
  /** full = default wordmark; navbar = nav scale; compact = collapsed sidebar */
  variant?: "full" | "navbar" | "compact";
};

/**
 * Stacked LEAN / MOVEMENT wordmark — matches the brand lockup.
 * Uses currentColor so it works on black nav and light portal chrome.
 */
export function BrandLogo({
  variant = "full",
  className,
  ...props
}: BrandLogoProps) {
  const sizeClass =
    variant === "navbar"
      ? "text-[1.35rem] sm:text-[1.55rem]"
      : variant === "compact"
        ? "text-[1.05rem]"
        : undefined;

  return (
    <span
      className={cn(
        "brand-logo inline-flex flex-col items-start justify-center text-current select-none",
        sizeClass,
        className,
      )}
      aria-label="Lean Movement"
      {...props}
    >
      <span className="brand-logo-lean">LEAN</span>
      <span className="brand-logo-movement">MOVEMENT</span>
    </span>
  );
}
