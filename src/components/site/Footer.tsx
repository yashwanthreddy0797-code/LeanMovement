import { Link } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CONTACT } from "@/lib/lean-kettlebell";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x section-y-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div className="section-head">
            <BrandLogo className="text-3xl md:text-[2.125rem]" />
            <p className="type-body stack-head">
              Live kettlebell coaching for busy professionals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-14">
            <div className="flex flex-col gap-3.5">
              <Link to="/programs" className="type-link">
                Membership
              </Link>
              <Link to="/about" className="type-link">
                About
              </Link>
              <Link to="/contact" className="type-link">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3.5">
              <a href={`mailto:${CONTACT.email}`} className="type-link normal-case tracking-[0.04em]">
                {CONTACT.email}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="type-link">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 type-meta">
          <p>© {new Date().getFullYear()} LEANMOVEMENT</p>
          <p>{CONTACT.location}</p>
        </div>
      </div>
    </footer>
  );
}
