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

          <div className="flex flex-col sm:flex-row gap-10 sm:gap-14 text-sm">
            <div className="flex flex-col gap-3">
              <Link to="/programs" className="text-foreground/70 hover:text-foreground transition-colors">
                Membership
              </Link>
              <Link to="/about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground/70 hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3 text-foreground/70">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground transition-colors">
                {CONTACT.email}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LEANMOVEMENT</p>
          <p>{CONTACT.location}</p>
        </div>
      </div>
    </footer>
  );
}
