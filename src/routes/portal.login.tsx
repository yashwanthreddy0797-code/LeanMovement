import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { setPortalUser } from "@/lib/portal/auth";
import { ArrowRight } from "lucide-react";
import loginHero from "@/assets/login-hero.jpg.asset.json";

export const Route = createFileRoute("/portal/login")({
  head: () => ({ meta: [{ title: "Client Login — LEANMOVEMENT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "coach">("client");

  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    const name = role === "coach" ? "Arjun Kapoor" : "Rahul";
    setPortalUser({ email: email || (role === "coach" ? "arjun@apex.fit" : "rahul@example.com"), name, role });
    router.navigate({ to: role === "coach" ? "/portal/coach" : "/portal/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-black font-sans">
      {/* Left visual panel */}
      <div className="relative hidden lg:block overflow-hidden bg-black">
        <img
          src={loginHero.url}
          alt="LEANMOVEMENT training"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/80" />
        {/* red accent bar */}
        <div className="absolute top-0 left-0 h-full w-[6px] bg-[#E11D2A]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <Link to="/" className="flex items-center gap-2 text-xs tracking-[0.28em] uppercase font-semibold">
            <span className="w-7 h-7 rounded-full bg-[#E11D2A] grid place-items-center text-[10px]">L</span>
            LEANMOVEMENT
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#E11D2A] mb-5">
              <span className="w-8 h-px bg-[#E11D2A]" /> Members Area
            </div>
            <h1 className="font-display text-5xl xl:text-7xl leading-[0.95] uppercase tracking-tight">
              Train with<br />
              <span className="text-[#E11D2A]">intent.</span><br />
              Live strong.
            </h1>
            <p className="mt-6 max-w-md text-sm text-white/70 leading-relaxed">
              Your workouts, nutrition, check-ins and direct coach access — engineered for results, designed for clarity.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-white/50">
            <span>© LEANMOVEMENT</span>
            <span>Private · Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-white">
        {/* corner accents */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#E11D2A]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-black" />

        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10 text-xs tracking-[0.28em] uppercase font-semibold">
            <span className="w-7 h-7 rounded-full bg-[#E11D2A] text-white grid place-items-center text-[10px]">L</span>
            LEANMOVEMENT
          </Link>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#E11D2A] mb-3">
            <span className="w-6 h-px bg-[#E11D2A]" /> Welcome back
          </div>
          <h2 className="font-display text-4xl uppercase tracking-tight text-black leading-none">
            Sign in to<br />your portal
          </h2>

          {/* Role toggle */}
          <div className="mt-8 inline-flex p-1 border border-black/10 bg-black/[0.03]">
            {(["client", "coach"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-5 py-2 text-[10px] tracking-[0.22em] uppercase font-semibold transition ${
                  role === r ? "bg-black text-white" : "text-black/60 hover:text-black"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={signIn} className="mt-8 space-y-5">
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "coach" ? "arjun@apex.fit" : "you@example.com"}
                className="login-input"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                className="login-input"
              />
            </Field>
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 text-black/60">
                <input type="checkbox" className="accent-[#E11D2A]" defaultChecked /> Remember me
              </label>
              <Link to="/portal/forgot" className="text-[#E11D2A] font-semibold hover:underline">
                Forgot?
              </Link>
            </div>

            <button
              type="submit"
              className="group w-full mt-2 inline-flex items-center justify-center gap-3 py-4 bg-[#E11D2A] text-white text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-black transition-colors"
            >
              Enter Portal
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-[11px] text-black/60 text-center tracking-wide">
            New to LeanMovement?{" "}
            <Link to="/portal/signup" className="text-black font-semibold border-b border-[#E11D2A] hover:text-[#E11D2A]">
              Request access
            </Link>
          </p>
          <p className="mt-6 text-[10px] text-center text-black/40 tracking-[0.18em] uppercase">
            Demo mode · pick a role to continue
          </p>
        </div>
      </div>

      <style>{`
        .login-input {
          width: 100%;
          padding: 0.95rem 0;
          border: 0;
          border-bottom: 1.5px solid rgba(0,0,0,0.15);
          background: transparent;
          font-size: 0.95rem;
          color: #000;
          outline: none;
          transition: border-color .2s;
          border-radius: 0;
        }
        .login-input::placeholder { color: rgba(0,0,0,0.35); }
        .login-input:focus { border-bottom-color: #E11D2A; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.25em] text-black/50 mb-1">{label}</span>
      {children}
    </label>
  );
}
