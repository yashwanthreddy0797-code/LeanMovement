import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/programs", label: "Programs" },
  { to: "/pricing", label: "Pricing" },
  { to: "/results", label: "Results" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link to="/" className="font-display text-3xl tracking-widest text-foreground">
          APEX<span className="text-accent">.</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-xs uppercase tracking-[0.2em] font-medium text-foreground/70 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/portal/login"
            className="hidden md:inline-flex items-center px-4 py-2.5 border border-foreground/20 text-foreground text-xs font-semibold uppercase tracking-[0.2em] hover:border-accent hover:text-accent transition-colors"
          >
            Client Login
          </Link>
          <Link
            to="/book"
            className="hidden md:inline-flex items-center px-5 py-2.5 bg-accent text-background text-xs font-semibold uppercase tracking-[0.2em] hover:bg-accent/90 transition-colors"
          >
            Start Now
          </Link>
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-20 bg-background z-40 animate-fade-in">
          <nav className="flex flex-col container-x py-10 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-display text-5xl py-3 border-b border-border text-foreground hover:text-accent"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center px-6 py-4 bg-accent text-background text-sm font-semibold uppercase tracking-[0.2em]"
            >
              Start Now
            </Link>
            <Link
              to="/portal/login"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center px-6 py-4 border border-foreground/20 text-foreground text-sm font-semibold uppercase tracking-[0.2em]"
            >
              Client Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
