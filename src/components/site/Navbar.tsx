import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/leanmovement-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/pricing", label: "Pricing" },
  { to: "/results", label: "Results" },
  { to: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      if (y > lastScrollY.current && y > 80 && !open) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);


  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container-x pt-4 md:pt-5">

        <div
          className={`pointer-events-auto mx-auto flex items-center justify-between gap-6 h-14 md:h-16 px-4 md:px-6 rounded-full transition-all duration-500 ${
            scrolled || open
              ? "bg-background/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
              : "bg-background/40 backdrop-blur-xl border border-white/5"
          }`}
        >
          <Link to="/" className="flex items-center gap-1.5 shrink-0" aria-label="LEANMOVEMENT home">
            <img src={logoAsset.url} alt="LEANMOVEMENT" className="h-9 md:h-11 w-auto" />
            <span className="font-display text-sm md:text-base tracking-[0.22em] text-foreground">LEANMOVEMENT</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[10px] uppercase tracking-[0.22em] font-medium text-foreground/70 hover:text-accent transition-colors"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/portal/login"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold border border-white/15 text-foreground/80 hover:text-foreground hover:border-white/40 transition-all"
            >
              Client Login
            </Link>
            <Link
              to="/book"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold bg-accent text-white hover:bg-foreground hover:text-background transition-all"
            >
              Enquire
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

      {open && (
        <div className="pointer-events-auto lg:hidden fixed inset-0 top-24 bg-background z-40 animate-fade-in overflow-y-auto">
          <nav className="flex flex-col container-x py-8 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-4xl py-3 border-b border-border text-foreground hover:text-accent"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold bg-accent text-white"
            >
              Enquire Now
            </Link>
            <Link
              to="/portal/login"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-5 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold border border-white/15 text-foreground"
            >
              Client Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
