import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/leanmovement-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/pricing", label: "Pricing" },
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
              ? "bg-background/80 backdrop-blur-2xl border border-black/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]"
              : "bg-background/40 backdrop-blur-xl border border-black/5"
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
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold border border-black/15 text-foreground/80 hover:text-foreground hover:border-black/40 transition-all"
            >
              Client Login
            </Link>
            <Link
              to="/book"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold bg-accent text-white hover:bg-foreground hover:text-background transition-all"
            >
              Book Consultation
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
        className={`pointer-events-none lg:hidden fixed inset-0 top-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/70 backdrop-blur-2xl"
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={`relative mx-4 mt-24 rounded-3xl border border-black/10 bg-background/95 backdrop-blur-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-2 py-3">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between px-5 py-4 rounded-2xl text-foreground/85 hover:bg-black/[0.04] hover:text-foreground transition-colors"
                activeProps={{ className: "!text-accent bg-black/[0.03]" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[10px] font-mono tracking-[0.22em] text-foreground/40 group-hover:text-accent transition-colors">
                    0{i + 1}
                  </span>
                  <span className="font-display text-2xl tracking-tight">{l.label}</span>
                </span>
                <span className="text-foreground/30 group-hover:text-accent group-hover:translate-x-1 transition-all text-lg">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-black/10 p-4 grid grid-cols-1 gap-2.5">
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-full text-[10px] uppercase tracking-[0.24em] font-semibold bg-accent text-white hover:bg-foreground hover:text-background transition-colors"
            >
              Book Free Consultation
            </Link>
            <Link
              to="/portal/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-full text-[10px] uppercase tracking-[0.24em] font-semibold border border-black/15 text-foreground/80 hover:text-foreground hover:border-black/40 transition-colors"
            >
              Client Login
            </Link>
          </div>
        </div>
      </div>

    </header>
  );
}
