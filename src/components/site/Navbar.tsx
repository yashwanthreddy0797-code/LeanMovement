import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Membership" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-black/90 border-b border-border backdrop-blur-md">
        <div className="container-x">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" aria-label="LEANMOVEMENT home" className="text-white min-w-0">
              <BrandLogo variant="navbar" className="text-white" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="font-display text-[1.125rem] uppercase tracking-[0.08em] text-white/45 hover:text-white transition-colors"
                  activeProps={{ className: "text-white" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center min-h-11 px-3 font-display text-[1.05rem] uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/join"
                search={{ plan: "standard" }}
                className="hidden lg:inline-flex btn-primary !px-5 !py-2.5"
              >
                Join
              </Link>
              <button
                className="lg:hidden text-white min-h-11 min-w-11 grid place-items-center -mr-1"
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
        <div className="absolute inset-0 bg-black" onClick={() => setOpen(false)} />
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
                className="py-4 border-b border-border font-display text-2xl uppercase tracking-wide text-white"
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              to="/join"
              search={{ plan: "standard" }}
              onClick={() => setOpen(false)}
              className="btn-primary w-full min-h-12"
            >
              Join
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center min-h-12 w-full border border-border font-display text-lg uppercase tracking-[0.08em]"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
