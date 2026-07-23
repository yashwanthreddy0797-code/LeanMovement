import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND, CONTACT, PRICING_PLANS } from "@/lib/lean-kettlebell";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Membership" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const plan = PRICING_PLANS[0];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main band */}
      <div className="container-x py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand + CTA */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block text-background">
              <BrandLogo className="text-3xl md:text-[2.25rem] text-background" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/55">
              Live kettlebell coaching for busy professionals. Three morning sessions every week —
              Tue / Thu / Sat · 6–7 AM IST.
            </p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="mt-8 inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white hover:opacity-90"
            >
              Join · {plan.price}/mo <ArrowRight size={12} />
            </Link>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] text-background/40">Explore</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-display text-lg uppercase tracking-[0.08em] text-background/70 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="lg:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] text-background/40">Account</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/login"
                  className="font-display text-lg uppercase tracking-[0.08em] text-background/70 hover:text-accent transition-colors"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  search={{ plan: "standard", email: "", name: "" }}
                  className="font-display text-lg uppercase tracking-[0.08em] text-background/70 hover:text-accent transition-colors"
                >
                  Join
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <p className="font-display text-sm tracking-[0.2em] text-background/40">Connect</p>
            <ul className="mt-5 space-y-3 text-sm text-background/70">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-accent transition-colors break-all"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  WhatsApp · {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  @{CONTACT.instagramHandle}
                </a>
              </li>
              <li className="pt-1 text-background/40">{CONTACT.location}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="container-x flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-background/35">
            © {year} {BRAND.name}
          </p>
          <p className="font-display text-sm tracking-[0.16em] text-background/35">
            Get lean. Get strong. Stay athletic.
          </p>
        </div>
      </div>
    </footer>
  );
}
