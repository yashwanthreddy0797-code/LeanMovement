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
    <footer className="border-t border-border bg-black text-white">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block text-white">
              <BrandLogo className="text-3xl text-white md:text-[2.25rem]" />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white/55">
              Live kettlebell coaching for busy professionals. Three morning sessions every week —
              Tue / Thu / Sat · 6–7 AM IST.
            </p>
            <Link
              to="/join"
              search={{ plan: "standard", email: "", name: "" }}
              className="btn-primary mt-8 inline-flex"
            >
              Join · {plan.price}/mo <ArrowRight size={13} />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] text-white/40">Explore</p>
            <ul className="mt-5 space-y-3">
              {NAV.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-display text-lg uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display text-sm tracking-[0.2em] text-white/40">Account</p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/login"
                  className="font-display text-lg uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-accent"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  search={{ plan: "standard", email: "", name: "" }}
                  className="font-display text-lg uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-accent"
                >
                  Join
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="font-display text-sm tracking-[0.2em] text-white/40">Connect</p>
            <ul className="mt-5 space-y-3 text-base text-white/70">
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="break-all transition-colors hover:text-accent"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  WhatsApp · {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  @{CONTACT.instagramHandle}
                </a>
              </li>
              <li className="pt-1 text-white/40">{CONTACT.location}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.14em] text-white/35">
            © {year} {BRAND.name}
          </p>
          <p className="font-display text-sm tracking-[0.16em] text-white/35">
            Get lean. Get strong. Stay athletic.
          </p>
        </div>
      </div>
    </footer>
  );
}
