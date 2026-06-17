import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7">
            <div className="font-display text-5xl md:text-7xl tracking-[0.04em] uppercase leading-[0.95]">
              LEAN<span className="font-normal">MOVEMENT</span>
            </div>
            <p className="mt-6 font-serif text-2xl md:text-3xl text-foreground/70">
              Pure work in solitude.
            </p>
          </div>

          <div className="md:col-span-5 md:text-right flex flex-col md:items-end gap-6">
            <Link
              to="/apply"
              className="inline-flex w-fit items-center px-7 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background hover:bg-accent transition-colors"
            >
              Apply For Lean
            </Link>
            <div className="flex flex-col md:items-end gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <p>© {new Date().getFullYear()} LEANMOVEMENT</p>
          <p>Hyderabad · India</p>
        </div>
      </div>
    </footer>
  );
}
