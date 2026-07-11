import type { ReactNode } from "react";
import { FadeUp } from "./FadeUp";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden border-b border-border ${
        compact ? "hero-y" : "min-h-[68vh] flex items-end hero-y"
      }`}
    >
      {image && (
        <>
          <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/55" />
        </>
      )}
      <div className="container-x relative w-full">
        <FadeUp className="section-head-wide">
          <span className="eyebrow">
            <span className="w-6 h-px bg-accent" />
            {eyebrow}
          </span>
          <h1 className="type-h1 stack-head">{title}</h1>
          {subtitle && <p className="type-lead stack-head">{subtitle}</p>}
          {children}
        </FadeUp>
      </div>
    </section>
  );
}
