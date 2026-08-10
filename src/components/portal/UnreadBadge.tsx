/** Numeric unread pill for nav + inbox lists */
export function UnreadBadge({
  count,
  className = "",
  tone = "accent",
}: {
  count: number;
  className?: string;
  tone?: "accent" | "light";
}) {
  if (!count || count < 1) return null;
  const label = count > 99 ? "99+" : String(count);
  const colors = tone === "light" ? "bg-white text-accent" : "bg-accent text-white";

  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center px-1.5 text-[10px] font-semibold tabular-nums leading-none ${colors} ${className}`}
      aria-label={`${count} unread`}
    >
      {label}
    </span>
  );
}
