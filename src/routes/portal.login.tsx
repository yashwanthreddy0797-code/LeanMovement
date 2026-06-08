import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { setPortalUser } from "@/lib/portal/auth";

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
    <div className="portal-theme min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#EFF3EC] via-[#F8F5EF] to-[#F2EFE7] relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-semibold">
          <span className="w-7 h-7 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs">L</span>
          LeanMovement
        </Link>
        <div>
          <h1 className="text-5xl xl:text-6xl text-[#1A1F1B] leading-[1.05] max-w-md">
            Train with intention.<br />
            <span className="italic text-[#3F5A3A]">Live with strength.</span>
          </h1>
          <p className="mt-6 text-[#4C534A] text-sm max-w-md leading-relaxed">
            Sign in to your personalised coaching dashboard — workouts, nutrition, check-ins and direct access to your coach, all in one calm space.
          </p>
        </div>
        <div className="text-xs text-[#6B6B66]">© LEANMOVEMENT Performance · Private members area</div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10 text-sm tracking-[0.2em] uppercase font-semibold">
            <span className="w-7 h-7 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs">L</span>
            LeanMovement
          </Link>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-2">Welcome back</div>
          <h2 className="text-3xl text-[#1A1F1B]">Sign in to your portal</h2>

          <div className="mt-8 inline-flex p-1 rounded-full bg-white/70 border border-[var(--border)]">
            {(["client", "coach"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${role === r ? "bg-[#1A1F1B] text-white" : "text-[#4C534A]"}`}>
                {r === "coach" ? "Coach" : "Client"}
              </button>
            ))}
          </div>

          <form onSubmit={signIn} className="mt-6 space-y-4">
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "coach" ? "arjun@apex.fit" : "you@example.com"}
                className="input" />
            </Field>
            <Field label="Password">
              <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••" className="input" />
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#6B6B66]">
                <input type="checkbox" className="accent-[var(--accent)]" defaultChecked /> Remember me
              </label>
              <Link to="/portal/forgot" className="text-[#3F5A3A] hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B] transition">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-xs text-[#6B6B66] text-center">
            New to LeanMovement? <Link to="/portal/signup" className="text-[#3F5A3A] font-medium hover:underline">Request access</Link>
          </p>
          <p className="mt-8 text-[10px] text-center text-[#9A9A95] leading-relaxed">
            Demo mode — credentials aren't validated. Pick a role and continue.
          </p>
        </div>
      </div>

      <style>{`
        .input { width: 100%; padding: 0.85rem 1rem; border-radius: 14px; border: 1px solid var(--border); background: #fff; font-size: 0.875rem; color: #1A1F1B; outline: none; transition: border-color .15s, box-shadow .15s; }
        .input:focus { border-color: #B5C7AF; box-shadow: 0 0 0 3px rgba(111,143,106,0.12); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-[#6B6B66] mb-1.5">{label}</span>
      {children}
    </label>
  );
}
