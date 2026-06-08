import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-x py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-4xl tracking-widest">
              LEANMOVEMENT<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Science-backed online coaching for the modern Indian professional. Hyderabad.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["/about", "About"],
                ["/programs", "Programs"],
                ["/pricing", "Pricing"],
                ["/results", "Results"],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-accent">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 border border-border hover:border-accent hover:text-accent">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-2 border border-border hover:border-accent hover:text-accent">
                <Youtube size={18} />
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2 border border-border hover:border-accent hover:text-accent">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} LEANMOVEMENT. All rights reserved.</p>
          <p>Built with <span className="text-accent">Brilliantzero</span></p>
        </div>
      </div>
    </footer>
  );
}
