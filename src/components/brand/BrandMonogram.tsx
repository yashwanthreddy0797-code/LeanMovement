import { cn } from "@/lib/utils";

type BrandMonogramProps = {
  className?: string;
  /** Pixel size when not sized via className (e.g. sidebar collapsed). */
  size?: number;
};

/** Shared L + M stroke mark — same paths everywhere (navbar, sidebar, portals). */
export function BrandMonogram({ className, size }: BrandMonogramProps) {
  return (
    <svg
      {...(size ? { width: size, height: size } : {})}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
      className={cn("shrink-0", !size && "h-[22px] w-[22px]", className)}
    >
      <path d="M2 2v18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <path d="M12 20V2l4 9 4-9v18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
