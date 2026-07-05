import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  LiveSessionRow,
  Membership,
  MembershipPlan,
  Onboarding,
  Profile,
  RecordingRow,
} from "@/lib/supabase/types";

export type CoachMember = Profile & {
  membership: Membership | null;
  onboarding: Onboarding | null;
};

export type CoachStats = {
  activeMembers: number;
  pendingMembers: number;
  expiringSoon: number;
  mrrInr: number;
  foundationsPending: number;
  whatsappPending: number;
  totalMembers: number;
};

export type CoachDashboardData = {
  source: "supabase" | "mock";
  members: CoachMember[];
  liveSessions: LiveSessionRow[];
  recordings: RecordingRow[];
  siteConfig: Record<string, string>;
  stats: CoachStats;
};

const PLAN_MONTHLY_INR: Record<MembershipPlan, number> = {
  monthly: 7999,
  quarterly: 7333,
  founding: 5999,
};

export const PLAN_LABELS: Record<MembershipPlan, string> = {
  monthly: "Monthly · ₹7,999",
  quarterly: "Quarterly · ₹21,999",
  founding: "Founding · ₹5,999",
};

export function formatSessionTime(t: string | null | undefined) {
  if (!t || typeof t !== "string") return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (!Number.isFinite(hour)) return t;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m ?? "00"} ${ampm} IST`;
}

export function todayWeekday() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export function getNextLiveSession(sessions: LiveSessionRow[]) {
  const today = todayWeekday();
  const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sorted = [...sessions].sort(
    (a, b) => order.indexOf(a.day_of_week) - order.indexOf(b.day_of_week),
  );
  const todayIdx = order.indexOf(today);
  const upcoming =
    sorted.find((s) => order.indexOf(s.day_of_week) >= todayIdx) ?? sorted[0];
  return upcoming ?? null;
}

function monthlyEquivalent(m: Membership): number {
  if (m.amount_inr) {
    if (m.plan === "quarterly") return Math.round(m.amount_inr / 3);
    return m.amount_inr;
  }
  return PLAN_MONTHLY_INR[m.plan];
}

function computeStats(members: CoachMember[]): CoachStats {
  const memberRows = members.filter((m) => m.role === "member");
  const active = memberRows.filter((m) => m.membership?.status === "active");
  const pending = memberRows.filter((m) => m.membership?.status === "pending");
  const in14Days = Date.now() + 14 * 24 * 60 * 60 * 1000;

  const expiringSoon = active.filter((m) => {
    const r = m.membership?.renews_at;
    if (!r) return false;
    const t = new Date(r).getTime();
    return t <= in14Days && t >= Date.now();
  }).length;

  const mrrInr = active.reduce((sum, m) => {
    if (!m.membership) return sum;
    return sum + monthlyEquivalent(m.membership);
  }, 0);

  const foundationsPending = active.filter(
    (m) => !m.onboarding?.foundations_completed_at,
  ).length;

  const whatsappPending = active.filter((m) => !m.onboarding?.whatsapp_joined).length;

  return {
    activeMembers: active.length,
    pendingMembers: pending.length,
    expiringSoon,
    mrrInr,
    foundationsPending,
    whatsappPending,
    totalMembers: memberRows.length,
  };
}

const MOCK_MEMBERS: CoachMember[] = [
  {
    id: "1",
    email: "rahul@example.com",
    full_name: "Rahul Mehta",
    role: "member",
    created_at: "2026-02-01T00:00:00Z",
    membership: {
      id: "m1",
      user_id: "1",
      product: "lean_kettlebell",
      plan: "monthly",
      status: "active",
      amount_inr: 7999,
      razorpay_subscription_id: null,
      razorpay_payment_id: null,
      started_at: "2026-02-01T00:00:00Z",
      renews_at: "2026-03-01T00:00:00Z",
      cancelled_at: null,
      created_at: "2026-02-01T00:00:00Z",
    },
    onboarding: {
      user_id: "1",
      foundations_booked_at: "2026-02-02T00:00:00Z",
      foundations_completed_at: "2026-02-05T00:00:00Z",
      whatsapp_joined: true,
    },
  },
  {
    id: "2",
    email: "priya@example.com",
    full_name: "Priya Sharma",
    role: "member",
    created_at: "2026-02-18T00:00:00Z",
    membership: {
      id: "m2",
      user_id: "2",
      product: "lean_kettlebell",
      plan: "founding",
      status: "pending",
      amount_inr: null,
      razorpay_subscription_id: null,
      razorpay_payment_id: null,
      started_at: null,
      renews_at: null,
      cancelled_at: null,
      created_at: "2026-02-18T00:00:00Z",
    },
    onboarding: {
      user_id: "2",
      foundations_booked_at: null,
      foundations_completed_at: null,
      whatsapp_joined: false,
    },
  },
];

const MOCK_SESSIONS: LiveSessionRow[] = [
  {
    id: "s1",
    day_of_week: "Monday",
    title: "Strength",
    session_type: "Strength",
    focus: "Heavy KB · Carries · Presses · Squats",
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 45,
    join_url: "https://meet.google.com/demo-monday",
    sort_order: 1,
  },
  {
    id: "s2",
    day_of_week: "Wednesday",
    title: "Conditioning",
    session_type: "Conditioning",
    focus: "EMOMs · Intervals · Complexes",
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 45,
    join_url: "https://meet.google.com/demo-wednesday",
    sort_order: 2,
  },
  {
    id: "s3",
    day_of_week: "Saturday",
    title: "Hybrid Athlete",
    session_type: "Hybrid",
    focus: "Power · Core · Mobility · KB flow",
    start_time: "08:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 45,
    join_url: "https://meet.google.com/demo-saturday",
    sort_order: 3,
  },
];

function mockDashboard(): CoachDashboardData {
  const members = MOCK_MEMBERS;
  return {
    source: "mock",
    members,
    liveSessions: MOCK_SESSIONS,
    recordings: [],
    siteConfig: {
      whatsapp_invite_url: "https://chat.whatsapp.com/demo",
      foundations_calendly_url: "https://calendly.com/demo",
      cohort_start_date: "April 2026",
    },
    stats: computeStats(members),
  };
}

export async function fetchCoachDashboard(): Promise<CoachDashboardData> {
  if (!isSupabaseConfigured()) return mockDashboard();

  const supabase = getSupabase()!;

  const [profilesRes, membershipsRes, onboardingRes, liveRes, recRes, cfgRes] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("memberships").select("*").eq("product", "lean_kettlebell"),
      supabase.from("onboarding").select("*"),
      supabase.from("live_sessions").select("*").order("sort_order"),
      supabase.from("recordings").select("*").order("recorded_at", { ascending: false }),
      supabase.from("site_config").select("*"),
    ]);

  if (profilesRes.error) return mockDashboard();

  const memberships = (membershipsRes.data ?? []) as Membership[];
  const onboarding = (onboardingRes.data ?? []) as Onboarding[];

  const members: CoachMember[] = ((profilesRes.data ?? []) as Profile[]).map((p) => ({
    ...p,
    membership: memberships.find((m) => m.user_id === p.id) ?? null,
    onboarding: onboarding.find((o) => o.user_id === p.id) ?? null,
  }));

  const configMap = Object.fromEntries(
    ((cfgRes.data ?? []) as { key: string; value: string }[]).map((c) => [c.key, c.value]),
  );

  return {
    source: "supabase",
    members,
    liveSessions: (liveRes.data as LiveSessionRow[]) ?? MOCK_SESSIONS,
    recordings: (recRes.data as RecordingRow[]) ?? [],
    siteConfig: configMap,
    stats: computeStats(members),
  };
}

export {
  updateMemberStatus,
  updateOnboarding,
  updateSiteConfig,
  updateLiveSessionUrl,
  addRecording,
  deleteRecording,
} from "./coach-mutations";

export function formatInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function membershipStatusLabel(status: Membership["status"] | undefined) {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "past_due":
      return "Past due";
    case "expired":
      return "Expired";
    case "cancelled":
      return "Cancelled";
    default:
      return "None";
  }
}

export function statusChipClass(status: Membership["status"] | undefined) {
  switch (status) {
    case "active":
      return "bg-[#E8F5E9] text-[#2E7D32]";
    case "pending":
      return "bg-[#FFF3E0] text-[#E65100]";
    case "past_due":
      return "bg-[#FEE2E2] text-[#E11D2A]";
    case "expired":
    case "cancelled":
      return "bg-[#F5F5F5] text-[#737373]";
    default:
      return "bg-[#F5F5F5] text-[#737373]";
  }
}
