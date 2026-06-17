import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { FadeUp } from "./FadeUp";

export function CTABanner({
  eyebrow = "Take the first step",
  title = "Ready to Start?",
  highlight = "Start",
  subtitle = "A coach. No sales pitch. We figure out if we're the right fit — then build the plan.",
  ctaText = "Book a Free Call",
  ctaTo = "/contact",
}: {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaTo?: string;
}) {
  const [before, after] = title.split(highlight);
  return (
    <section className="border-y border-border bg-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50" />
      <div className="container-x py-24 md:py-32 relative">
        <FadeUp className="max-w-4xl">
          <span className="eyebrow">
            <span className="w-8 h-px bg-accent" />
            {eyebrow}
          </span>
          <h2 className="font-display text-6xl md:text-6xl mt-6 leading-[0.9]">
            {before}
            <span className="text-accent">{highlight}</span>
            {after}
          </h2>
          <p className="mt-6 max-w-xl text-foreground/70">{subtitle}</p>
          <Link
            to={ctaTo}
            className="mt-10 btn-pill-accent"
          >
            {ctaText} <ArrowUpRight size={18} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
