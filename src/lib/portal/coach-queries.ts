import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { pickNextLiveSession } from "@/lib/portal/live-session";
import type {
  LiveSessionRow,
  Membership,
  MembershipPlan,
  Onboarding,
  MemberIntake,
  Profile,
  RecordingRow,
} from "@/lib/supabase/types";

export type CoachMember = Profile & {
  membership: Membership | null;
  onboarding: Onboarding | null;
  intake: MemberIntake | null;
};

export type CoachStats = {
  activeMembers: number;
  pendingMembers: number;
  onboardingPending: number;
  whatsappPending: number;
};

export type CoachDashboardData = {
  source: "supabase" | "mock";
  members: CoachMember[];
  liveSessions: LiveSessionRow[];
  recordings: RecordingRow[];
  siteConfig: Record<string, string>;
  stats: CoachStats;
};

export const PLAN_LABELS: Record<MembershipPlan, string> = {
  monthly: "Lean Movement · ₹6,969",
  quarterly: "Lean Movement · ₹6,969",
  founding: "Lean Movement · ₹6,969",
};

export function formatSessionTime(t: string | null | undefined) {
  if (!t || typeof t !== "string") return "-";
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
  return pickNextLiveSession(sessions)?.row ?? null;
}

function computeStats(members: CoachMember[]): CoachStats {
  const memberRows = members.filter((m) => m.role === "member");
  const active = memberRows.filter((m) => m.membership?.status === "active");
  const pending = memberRows.filter((m) => m.membership?.status === "pending");

  const onboardingPending = active.filter(
    (m) => !m.onboarding?.foundations_completed_at,
  ).length;

  const whatsappPending = active.filter((m) => !m.onboarding?.whatsapp_joined).length;

  return {
    activeMembers: active.length,
    pendingMembers: pending.length,
    onboardingPending,
    whatsappPending,
  };
}

const EMPTY_STATS: CoachStats = {
  activeMembers: 0,
  pendingMembers: 0,
  onboardingPending: 0,
  whatsappPending: 0,
};

const MORNING_ZOOM =
  "https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1";
const EVENING_ZOOM =
  "https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1";

const MOCK_SESSIONS: LiveSessionRow[] = [
  {
    id: "s1",
    day_of_week: "Monday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING_ZOOM,
    sort_order: 1,
  },
  {
    id: "s2",
    day_of_week: "Tuesday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING_ZOOM,
    sort_order: 2,
  },
  {
    id: "s3",
    day_of_week: "Wednesday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING_ZOOM,
    sort_order: 3,
  },
  {
    id: "s4",
    day_of_week: "Thursday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING_ZOOM,
    sort_order: 4,
  },
  {
    id: "s5",
    day_of_week: "Friday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING_ZOOM,
    sort_order: 5,
  },
  {
    id: "s6",
    day_of_week: "Saturday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING_ZOOM,
    sort_order: 6,
  },
];

function mockDashboard(): CoachDashboardData {
  return {
    source: "mock",
    members: [],
    liveSessions: MOCK_SESSIONS,
    recordings: [],
    siteConfig: {
      whatsapp_invite_url: "",
      foundations_calendly_url: "",
      cohort_start_date: "",
    },
    stats: EMPTY_STATS,
  };
}

export async function fetchCoachDashboard(): Promise<CoachDashboardData> {
  if (!isSupabaseConfigured()) return mockDashboard();

  const supabase = getSupabase()!;

  const [profilesRes, membershipsRes, onboardingRes, intakeRes, liveRes, recRes, cfgRes] =
    await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("memberships").select("*").eq("product", "lean_kettlebell"),
      supabase.from("onboarding").select("*"),
      supabase.from("member_intake").select("*"),
      supabase.from("live_sessions").select("*").order("sort_order"),
      supabase.from("recordings").select("*").order("recorded_at", { ascending: false }),
      supabase.from("site_config").select("*"),
    ]);

  if (profilesRes.error) {
    throw new Error(profilesRes.error.message || "Could not load coach dashboard");
  }

  const memberships = (membershipsRes.data ?? []) as Membership[];
  const onboarding = (onboardingRes.data ?? []) as Onboarding[];
  const intakes = (intakeRes.data ?? []) as MemberIntake[];

  const members: CoachMember[] = ((profilesRes.data ?? []) as Profile[])
    .filter((p) => p.role === "member")
    .map((p) => ({
    ...p,
    membership: memberships.find((m) => m.user_id === p.id) ?? null,
    onboarding: onboarding.find((o) => o.user_id === p.id) ?? null,
    intake: intakes.find((i) => i.user_id === p.id) ?? null,
  }));

  const configMap = Object.fromEntries(
    ((cfgRes.data ?? []) as { key: string; value: string }[]).map((c) => [c.key, c.value]),
  );

  return {
    source: "supabase",
    members,
    liveSessions: (liveRes.data as LiveSessionRow[]) ?? [],
    // Coach sees the full library (including expired). Members still filter by expires_at.
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

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "-";
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
