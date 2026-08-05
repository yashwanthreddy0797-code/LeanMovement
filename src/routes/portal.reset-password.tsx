import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PasswordInput } from "@/components/portal/PasswordInput";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { updatePassword } from "@/lib/portal/auth-api";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/reset-password")({
  head: () => ({ meta: [{ title: "Set New Password - LEANMOVEMENT" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLinkError("Supabase is not configured.");
      return;
    }
    const supabase = getSupabase()!;
    let settled = false;

    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    const markBad = (message: string) => {
      if (settled) return;
      settled = true;
      setLinkError(message);
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) markReady();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        markReady();
      }
    });

    const timer = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data }) => {
        if (data.session) markReady();
        else {
          markBad(
            "This reset link is invalid or has expired. Request a new one from the forgot-password page.",
          );
        }
      });
    }, 2500);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Password updated. Sign in with your new password.");
      const supabase = getSupabase();
      await supabase?.auth.signOut();
      await router.navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6 font-sans text-black sm:p-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center">
          <BrandLogo className="text-lg" />
        </Link>
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#E11D2A]">
          <span className="h-px w-6 bg-[#E11D2A]" /> Account
        </div>
        <h2 className="font-display text-4xl uppercase leading-none tracking-tight">
          Choose a new password
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-black/60">
          Pick a strong password you haven’t used elsewhere. You’ll sign in again after saving.
        </p>

        {linkError ? (
          <div className="mt-8 border border-black/10 bg-black/[0.02] p-6 text-sm text-black/70">
            <p>{linkError}</p>
            <Link
              to="/portal/forgot"
              className="mt-5 inline-block text-sm font-medium text-[#E11D2A] hover:underline"
            >
              Request a new reset link →
            </Link>
          </div>
        ) : !ready ? (
          <p className="mt-8 text-sm text-black/50">Verifying reset link…</p>
        ) : (
          <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-black/50">
                New password
              </span>
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="At least 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                variant="boxed"
                className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E11D2A]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-black/50">
                Confirm password
              </span>
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter password"
                required
                minLength={8}
                autoComplete="new-password"
                variant="boxed"
                className="w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E11D2A]"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E11D2A] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
