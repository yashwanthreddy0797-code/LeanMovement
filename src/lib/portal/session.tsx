import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Membership, Profile } from "@/lib/supabase/types";
import { getPortalUser, setPortalUser, type PortalUser } from "./auth";
import { signInWithEmail, signOutPortal, signUpWithEmail } from "./auth-api";

export { signInWithEmail, signOutPortal, signUpWithEmail };

export type PortalSession = {
  mode: "supabase" | "demo";
  loading: boolean;
  user: PortalUser | null;
  profile: Profile | null;
  membership: Membership | null;
  isCoach: boolean;
  hasActiveMembership: boolean;
  refresh: () => Promise<void>;
};

const DEMO_MEMBERSHIP: Membership = {
  id: "demo",
  user_id: "demo",
  product: "lean_kettlebell",
  plan: "monthly",
  status: "active",
  amount_inr: 7999,
  razorpay_subscription_id: null,
  razorpay_payment_id: null,
  started_at: new Date().toISOString(),
  renews_at: null,
  cancelled_at: null,
  created_at: new Date().toISOString(),
};

const PortalSessionContext = createContext<PortalSession | null>(null);

function usePortalSessionState(): PortalSession {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PortalUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);

  const loadDemo = useCallback(() => {
    const demo = getPortalUser();
    setUser(demo);
    setProfile(null);
    setMembership(demo ? DEMO_MEMBERSHIP : null);
    setLoading(false);
  }, []);

  const loadSupabase = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      loadDemo();
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn("[portal-session] getSession failed", sessionError.message);
        setUser(null);
        setProfile(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      const session = sessionData.session;

      if (!session) {
        setUser(null);
        setProfile(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      const email = session.user.email ?? "";
      const name =
        (session.user.user_metadata?.full_name as string) ||
        email.split("@")[0] ||
        "Member";
      const roleMeta = session.user.user_metadata?.role as string | undefined;

      setUser({
        email,
        name,
        role: roleMeta === "coach" ? "coach" : "client",
        id: session.user.id,
      });

      const [{ data: profileRow }, { data: membershipRow }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle(),
        supabase
          .from("memberships")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("product", "lean_kettlebell")
          .maybeSingle(),
      ]);

      if (profileRow) {
        setProfile(profileRow as Profile);
        setUser({
          email: profileRow.email,
          name: profileRow.full_name ?? name,
          role: profileRow.role === "coach" || profileRow.role === "admin" ? "coach" : "client",
          id: profileRow.id,
        });
      }

      setMembership((membershipRow as Membership | null) ?? null);
    } catch (err) {
      console.error("[portal-session] load failed", err);
      setUser(null);
      setProfile(null);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  }, [loadDemo]);

  const refresh = useCallback(async () => {
    setLoading(true);
    if (isSupabaseConfigured()) await loadSupabase();
    else loadDemo();
  }, [loadDemo, loadSupabase]);

  useEffect(() => {
    void refresh();

    if (!isSupabaseConfigured()) {
      const onAuth = () => loadDemo();
      window.addEventListener("portal-auth", onAuth);
      window.addEventListener("storage", onAuth);
      return () => {
        window.removeEventListener("portal-auth", onAuth);
        window.removeEventListener("storage", onAuth);
      };
    }

    const supabase = getSupabase();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void loadSupabase();
    });

    return () => sub.subscription.unsubscribe();
  }, [loadDemo, loadSupabase, refresh]);

  const isCoach = profile?.role === "coach" || profile?.role === "admin" || user?.role === "coach";
  const hasActiveMembership = isCoach || membership?.status === "active";

  return {
    mode: isSupabaseConfigured() ? "supabase" : "demo",
    loading,
    user,
    profile,
    membership,
    isCoach,
    hasActiveMembership,
    refresh,
  };
}

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const session = usePortalSessionState();
  return (
    <PortalSessionContext.Provider value={session}>{children}</PortalSessionContext.Provider>
  );
}

export function usePortalSession(): PortalSession {
  const context = useContext(PortalSessionContext);
  if (!context) {
    throw new Error("usePortalSession must be used within PortalSessionProvider");
  }
  return context;
}
