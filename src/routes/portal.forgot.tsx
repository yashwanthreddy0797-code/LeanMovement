import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/portal/forgot")({
  head: () => ({ meta: [{ title: "Reset Password — LEANMOVEMENT" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="portal-theme min-h-screen flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10 text-sm tracking-[0.2em] uppercase font-semibold">
          <span className="w-7 h-7 rounded-full bg-[#1A1F1B] text-white grid place-items-center text-xs">L</span>
          LeanMovement
        </Link>
        <h2 className="text-3xl text-[#1A1F1B]">Reset your password</h2>
        <p className="mt-2 text-sm text-[#6B6B66]">Enter the email associated with your account. We'll send you a secure reset link.</p>

        {sent ? (
          <div className="mt-8 card-soft p-6 text-sm">
            <div className="chip mb-3">Email sent</div>
            <p className="text-[#4C534A]">If that email exists in our system, you'll receive a reset link within a minute.</p>
            <Link to="/portal/login" className="inline-block mt-5 text-sm text-[#3F5A3A] font-medium hover:underline">← Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4">
            <input type="email" required placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-white text-sm outline-none focus:border-[#B5C7AF]" />
            <button className="w-full py-3 rounded-2xl bg-[#1A1F1B] text-white text-sm font-medium hover:bg-[#2A2F2B] transition">
              Send reset link
            </button>
            <Link to="/portal/login" className="block text-center text-sm text-[#3F5A3A] font-medium hover:underline">← Back to sign in</Link>
          </form>
        )}
      </div>
    </div>
  );
}
