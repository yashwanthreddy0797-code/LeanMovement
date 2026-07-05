import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase/client";
import { COACH } from "@/lib/lean-kettlebell";
import { signInWithEmail } from "@/lib/portal/auth-api";
import { setPortalUser } from "@/lib/portal/auth";
import { PasswordInput } from "@/components/portal/PasswordInput";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

function safeRedirect(value: unknown) {
  if (typeof value === "string" && value.startsWith("/portal")) return value;
  return "/portal/dashboard";
}

/** Standalone login — outside /portal layout to avoid session/auth race crashes */
export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: safeRedirect(search.redirect),
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({ meta: [{ title: "Client Login — LEANMOVEMENT" }] }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const { redirect, email: emailFromSearch } = Route.useSearch();
  const [email, setEmail] = useState(emailFromSearch);
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "coach">("client");
  const [loading, setLoading] = useState(false);
  const supabaseLive = isSupabaseConfigured();

  useEffect(() => {
    if (emailFromSearch) setEmail(emailFromSearch);
  }, [emailFromSearch]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabaseLive) {
        const name = role === "coach" ? COACH.name : email.split("@")[0] || "Member";
        setPortalUser({
          email: email || (role === "coach" ? "coach@leanmovement.in" : "member@example.com"),
          name,
          role,
        });
        await router.navigate({
          to: role === "coach" ? "/portal/coach" : redirect,
        });
        return;
      }

      const { error } = await signInWithEmail(email, pwd || "demo-password-not-used");

      if (error) {
        toast.error(error);
        return;
      }

      const supabase = getSupabase();
      let destination: "/portal/dashboard" | "/portal/coach" = redirect as "/portal/dashboard";
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .maybeSingle();
          if (profile?.role === "coach" || profile?.role === "admin") {
            destination = "/portal/coach";
          }
        }
      }

      await router.navigate({ to: destination });
    } catch (err) {
      console.error("[login] failed", err);
      toast.error("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-black font-sans">
      <div className="relative hidden lg:block overflow-hidden bg-[#0a0a0a]">
        <div className="absolute top-0 left-0 h-full w-[6px] bg-[#E11D2A]" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <Link to="/" className="flex items-center">
            <BrandLogo className="text-xl text-white" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#E11D2A] mb-5">
              <span className="w-8 h-px bg-[#E11D2A]" /> Lean Kettlebell™
            </div>
            <h1 className="font-display text-5xl xl:text-7xl leading-[0.95] uppercase tracking-tight">
              Train live.
              <br />
              <span className="text-[#E11D2A]">Three times</span>
              <br />a week.
            </h1>
            <p className="mt-6 max-w-md text-sm text-white/70 leading-relaxed">
              Live sessions, recordings, circuits, nutrition framework, and WhatsApp community.
            </p>
          </div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-white/50">© LEANMOVEMENT</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center mb-10">
            <BrandLogo className="text-lg" />
          </Link>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-[#E11D2A] mb-3">
            <span className="w-6 h-px bg-[#E11D2A]" /> Welcome back
          </div>
          <h2 className="font-display text-4xl uppercase tracking-tight leading-none">
            Sign in to
            <br />
            your portal
          </h2>

          {!supabaseLive && (
            <div className="mt-4 inline-flex p-1 border border-black/10 bg-black/[0.03]">
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
          )}

          <form onSubmit={(e) => void signIn(e)} className="mt-8 space-y-5">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="login-input"
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <PasswordInput
                value={pwd}
                onChange={setPwd}
                placeholder={supabaseLive ? "Your password" : "Optional in demo"}
                required={supabaseLive}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-2 inline-flex items-center justify-center gap-3 py-4 bg-[#E11D2A] text-white text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-black transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Enter Portal"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-[11px] text-black/60 text-center">
            New member?{" "}
            <Link to="/join" className="text-black font-semibold border-b border-[#E11D2A]">
              Join now
            </Link>
          </p>
          {!supabaseLive && (
            <p className="mt-4 text-[10px] text-center text-black/40 tracking-[0.18em] uppercase">
              Demo mode · add .env Supabase keys for production auth
            </p>
          )}
        </div>
      </div>

      <style>{`
        .login-input { width: 100%; padding: 0.95rem 0; border: 0; border-bottom: 1.5px solid rgba(0,0,0,0.15); background: transparent; font-size: 0.95rem; color: #000; outline: none; }
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
