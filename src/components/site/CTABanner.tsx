import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "./FadeUp";

export function CTABanner({
  title = "Ready to start?",
  highlight = "start",
  subtitle = "Live kettlebell coaching · 3× per week.",
  ctaText = "Join now",
  ctaTo = "/join",
}: {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaTo?: string;
}) {
  const parts = title.split(highlight);
  const before = parts[0] ?? "";
  const after = parts.slice(1).join(highlight);

  return (
    <section className="border-t border-border bg-surface">
      <div className="container-x section-y-sm">
        <FadeUp className="section-head-wide">
          <h2 className="type-h2">
            {before}
            <span className="text-accent">{highlight}</span>
            {after}
          </h2>
          <p className="type-lead stack-head">{subtitle}</p>
          <Link to={ctaTo} className="btn-primary inline-flex stack-head">
            {ctaText} <ArrowRight size={14} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
