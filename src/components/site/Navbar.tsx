import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/results", label: "Results" },
  { to: "/apply", label: "Apply" },
] as const;

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0 sm:w-[22px] sm:h-[22px]">
        <path d="M2 2v18h6" stroke="currentColor" strokeWidth="1" />
        <path d="M12 20V2l4 9 4-9v18" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="font-display text-[12px] sm:text-[15px] tracking-[0.28em] sm:tracking-[0.32em] uppercase font-medium truncate">
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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container-x">
          <div className="flex items-center justify-between h-16 md:h-24">
            <Link to="/" aria-label="LEANMOVEMENT home" className="text-foreground min-w-0">
              <Wordmark />
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-[13px] uppercase tracking-[0.28em] text-foreground/65 hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/apply"
                className="hidden lg:inline-flex items-center px-6 py-3 text-[11px] uppercase tracking-[0.28em] bg-foreground text-background hover:bg-accent transition-colors"
              >
                Apply For Lean
              </Link>
              <button
                className="lg:hidden text-foreground p-2 -mr-2"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu — rendered outside header so backdrop-blur doesn't trap fixed positioning */}
      <div
        className={`lg:hidden fixed inset-0 z-[55] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-background" onClick={() => setOpen(false)} />
        <div className="relative h-full w-full flex flex-col pt-20 pb-8 px-6 overflow-y-auto">
          <nav className="flex flex-col flex-1">
            {links.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-4 border-b border-border text-foreground"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                <span className="text-[10px] font-mono tracking-[0.25em] text-foreground/35 w-6 shrink-0">
                  0{i + 1}
                </span>
                <span className="font-display text-3xl tracking-tight uppercase">{l.label}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-6 mt-6 border-t border-border">
            <Link
              to="/apply"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full px-6 py-4 text-[11px] uppercase tracking-[0.32em] bg-foreground text-background"
            >
              Apply For Lean
            </Link>
            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Pure work in solitude.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
