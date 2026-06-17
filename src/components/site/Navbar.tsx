import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {/* LM monogram — thin geometric */}
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M2 2v18h6" stroke="currentColor" strokeWidth="1" />
        <path d="M12 20V2l4 9 4-9v18" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="font-display text-[13px] tracking-[0.32em] uppercase font-medium">
        LEAN<span className="font-normal">MOVEMENT</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-background/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container-x">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" aria-label="LEANMOVEMENT home" className="text-foreground">
            <Wordmark />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[11px] uppercase tracking-[0.28em] text-foreground/65 hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/portal/login"
              className="hidden md:inline-flex text-[11px] uppercase tracking-[0.28em] text-foreground/60 hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/book"
              className="hidden md:inline-flex items-center px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] font-medium border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all"
            >
              Apply
            </Link>
            <button
              className="lg:hidden text-foreground p-1.5"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-background" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col pt-24 pb-12 px-8">
          <nav className="flex flex-col gap-1 flex-1">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-5 py-4 border-b border-border text-foreground"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span className="text-[10px] font-mono tracking-[0.25em] text-foreground/35 w-6">
                  0{i + 1}
                </span>
                <span className="font-display text-3xl tracking-tight uppercase">{l.label}</span>
              </Link>
            ))}
          </nav>
          <div className="grid gap-3 pt-6">
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-6 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background"
            >
              Apply Now
            </Link>
            <Link
              to="/portal/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-6 py-4 text-[11px] uppercase tracking-[0.32em] border border-foreground text-foreground"
            >
              Client Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
