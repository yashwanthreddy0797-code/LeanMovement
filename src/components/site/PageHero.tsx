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
    <section className={`relative ${compact ? "pt-40 pb-20" : "min-h-[80vh] flex items-end pb-20 pt-40"} overflow-hidden`}>
      {image && (
        <>
          <img src={image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </>
      )}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="container-x relative">
        <FadeUp>
          <span className="eyebrow">
            <span className="w-8 h-px bg-accent" />
            {eyebrow}
          </span>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mt-6 max-w-5xl leading-[0.9]">{title}</h1>
          {subtitle && <p className="mt-6 max-w-2xl text-lg text-foreground/70">{subtitle}</p>}
          {children}
        </FadeUp>
      </div>
    </section>
  );
}
