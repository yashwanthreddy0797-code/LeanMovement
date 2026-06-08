import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { setPortalUser } from "@/lib/portal/auth";

export const Route = createFileRoute("/portal/signup")({
  head: () => ({ meta: [{ title: "Request Access — LEANMOVEMENT" }] }),
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", pwd: "", goal: "Fat loss" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalUser({ email: form.email || "you@example.com", name: form.name || "New Member", role: "client" });
    router.navigate({ to: "/portal/dashboard" });
  };

  return (
    <div className="portal-theme min-h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10 text-sm tracking-[0.2em] uppercase font-semibold">
          <span className="w-7 h-7 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs">A</span>
          LeanMovement
        </Link>
        <div className="text-[11px] uppercase tracking-[0.2em] text-[#6B6B66] mb-2">Begin your journey</div>
        <h2 className="text-3xl text-[#1A1F1B]">Create your account</h2>
        <p className="mt-2 text-sm text-[#6B6B66]">Coaches review every application personally. Expect a reply within 24 hours.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Full name">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Mehta" />
          </Field>
          <Field label="Email">
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </Field>
          <Field label="Password">
            <input type="password" className="input" value={form.pwd} onChange={(e) => setForm({ ...form, pwd: e.target.value })} placeholder="At least 8 characters" />
          </Field>
          <Field label="Primary goal">
            <select className="input" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
              <option>Fat loss</option><option>Muscle gain</option><option>Body recomposition</option><option>Strength / Athletic</option>
            </select>
          </Field>
          <button type="submit" className="w-full py-3 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B] transition">
            Create account
          </button>
        </form>

        <p className="mt-6 text-xs text-[#6B6B66] text-center">
          Already a member? <Link to="/portal/login" className="text-[#3F5A3A] font-medium hover:underline">Sign in</Link>
        </p>

        <style>{`
          .input { width: 100%; padding: 0.85rem 1rem; border-radius: 14px; border: 1px solid var(--border); background: #fff; font-size: 0.875rem; color: #1A1F1B; outline: none; }
          .input:focus { border-color: #B5C7AF; box-shadow: 0 0 0 3px rgba(111,143,106,0.12); }
        `}</style>
      </div>
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
