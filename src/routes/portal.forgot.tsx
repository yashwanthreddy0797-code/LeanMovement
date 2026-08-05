import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { requestPasswordReset } from "@/lib/portal/auth-api";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/forgot")({
  head: () => ({ meta: [{ title: "Reset Password - LEANMOVEMENT" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await requestPasswordReset(email);
      if (error) {
        toast.error(error);
        return;
      }
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 sm:p-12 text-black font-sans">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center">
          <BrandLogo className="text-lg" />
        </Link>
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#E11D2A]">
          <span className="h-px w-6 bg-[#E11D2A]" /> Account
        </div>
        <h2 className="font-display text-4xl uppercase tracking-tight leading-none">Reset your password</h2>
        <p className="mt-3 text-sm text-black/60 leading-relaxed">
          Enter the email on your Lean Kettlebell account. We’ll send a secure link to choose a new
          password.
        </p>

        {sent ? (
          <div className="mt-8 border border-black/10 bg-black/[0.02] p-6 text-sm">
            <div className="mb-3 inline-flex bg-[#E11D2A]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E11D2A]">
              Check your inbox
            </div>
            <p className="text-black/70">
              If <strong className="text-black">{email.trim()}</strong> has an account, you’ll get a
              reset link shortly. Open it on this device to set a new password.
            </p>
            <p className="mt-3 text-xs text-black/45">
              Don’t see it? Check spam, or wait a minute and try again.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-block text-sm font-medium text-[#E11D2A] hover:underline"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-black/50">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border-0 border-b border-black/15 bg-transparent py-3 text-sm outline-none focus:border-[#E11D2A]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E11D2A] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <Link
              to="/login"
              className="block text-center text-sm font-medium text-[#E11D2A] hover:underline"
            >
              ← Back to sign in
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
