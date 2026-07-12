import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Membership" },
  { to: "/results", label: "Results" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || open ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container-x">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" aria-label="LEANMOVEMENT home" className="text-foreground min-w-0">
              <BrandLogo variant="navbar" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="font-display text-[1.125rem] uppercase tracking-[0.08em] text-foreground/45 hover:text-foreground transition-colors"
                  activeProps={{ className: "text-foreground" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/join"
                search={{ plan: "standard" }}
                className="hidden lg:inline-flex btn-primary !py-2.5 !px-5 !text-[10px]"
              >
                Join
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

      <div
        className={`lg:hidden fixed inset-0 z-[55] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-background" onClick={() => setOpen(false)} />
        <div className="relative h-full flex flex-col pt-6 pb-8 px-6">
          <div className="flex justify-end mb-8">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col flex-1 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-4 border-b border-border font-display text-2xl uppercase tracking-wide"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/join"
            search={{ plan: "standard" }}
            onClick={() => setOpen(false)}
            className="mt-8 btn-primary w-full"
          >
            Join
          </Link>
        </div>
      </div>
    </>
  );
}
