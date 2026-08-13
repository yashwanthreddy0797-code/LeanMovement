import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { pickNextLiveSession } from "@/lib/portal/live-session";
import { DEFAULT_SESSION_IDS } from "@/lib/sessions";
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
  /** Soft failures (e.g. intake table RLS) — page still loads. */
  warnings?: string[];
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

export function getDemoCoachMembers(): CoachMember[] {
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

  const baseMembership = (userId: string, status: Membership["status"], days: number): Membership => ({
    id: `mem-${userId}`,
    user_id: userId,
    product: "lean_kettlebell",
    plan: "monthly",
    status,
    amount_inr: 6969,
    razorpay_subscription_id: null,
    razorpay_payment_id: null,
    started_at: daysAgo(days),
    renews_at: daysAgo(days - 30),
    cancelled_at: null,
    created_at: daysAgo(days),
  });

  return [
    {
      id: "demo-rahul",
      email: "rahul.mehta@example.com",
      full_name: "Rahul Mehta",
      role: "member",
      created_at: daysAgo(12),
      membership: baseMembership("demo-rahul", "active", 12),
      onboarding: {
        user_id: "demo-rahul",
        foundations_booked_at: daysAgo(10),
        foundations_completed_at: daysAgo(8),
        whatsapp_joined: true,
        session_ids: [...DEFAULT_SESSION_IDS],
        sessions_selected_at: daysAgo(11),
      },
      intake: {
        user_id: "demo-rahul",
        full_name: "Rahul Mehta",
        age: 34,
        height: "178 cm",
        weight: "82 kg",
        occupation: "Product manager",
        goal: "Lose 8kg and get stronger for weekend treks.",
        biggest_struggle: "Travel weeks wreck my consistency.",
        training_experience: "Intermediate",
        training_days_per_week: "3",
        why_now: "Wedding season in 4 months and energy is low.",
        instagram_handle: "rahul.moves",
        phone: "+91 98765 43210",
        completed_at: daysAgo(11),
        updated_at: daysAgo(11),
      },
    },
    {
      id: "demo-priya",
      email: "priya.sharma@example.com",
      full_name: "Priya Sharma",
      role: "member",
      created_at: daysAgo(6),
      membership: baseMembership("demo-priya", "active", 6),
      onboarding: {
        user_id: "demo-priya",
        foundations_booked_at: daysAgo(4),
        foundations_completed_at: null,
        whatsapp_joined: false,
        session_ids: [...DEFAULT_SESSION_IDS],
        sessions_selected_at: daysAgo(5),
      },
      intake: {
        user_id: "demo-priya",
        full_name: "Priya Sharma",
        age: 29,
        height: "162 cm",
        weight: "68 kg",
        occupation: "Consultant",
        goal: "Get lean and build a sustainable training habit.",
        biggest_struggle: "Late client calls — mornings are the only free slot.",
        training_experience: "Beginner",
        training_days_per_week: "3",
        why_now: "Tired of restarting every January.",
        instagram_handle: "priya.trains",
        phone: "+91 98111 22334",
        completed_at: daysAgo(5),
        updated_at: daysAgo(5),
      },
    },
    {
      id: "demo-karan",
      email: "karan.malhotra@example.com",
      full_name: "Karan Malhotra",
      role: "member",
      created_at: daysAgo(3),
      membership: baseMembership("demo-karan", "active", 3),
      onboarding: {
        user_id: "demo-karan",
        foundations_booked_at: null,
        foundations_completed_at: null,
        whatsapp_joined: false,
        session_ids: [...DEFAULT_SESSION_IDS],
        sessions_selected_at: daysAgo(2),
      },
      intake: {
        user_id: "demo-karan",
        full_name: "Karan Malhotra",
        age: 41,
        height: "175 cm",
        weight: "91 kg",
        occupation: "Founder",
        goal: "Drop belly fat and feel athletic again.",
        biggest_struggle: "No structure — I overdo it then burn out.",
        training_experience: "Advanced",
        training_days_per_week: "4",
        why_now: "Back pain and poor sleep finally forced the change.",
        instagram_handle: "karan.kb",
        phone: "+91 99000 11223",
        completed_at: daysAgo(2),
        updated_at: daysAgo(2),
      },
    },
    {
      id: "demo-neha",
      email: "neha.arora@example.com",
      full_name: "Neha Arora",
      role: "member",
      created_at: daysAgo(2),
      membership: baseMembership("demo-neha", "active", 2),
      onboarding: {
        user_id: "demo-neha",
        foundations_booked_at: null,
        foundations_completed_at: null,
        whatsapp_joined: false,
        session_ids: [],
        sessions_selected_at: null,
      },
      intake: null,
    },
    {
      id: "demo-aditya",
      email: "aditya.singh@example.com",
      full_name: "Aditya Singh",
      role: "member",
      created_at: daysAgo(9),
      membership: baseMembership("demo-aditya", "pending", 9),
      onboarding: {
        user_id: "demo-aditya",
        foundations_booked_at: daysAgo(7),
        foundations_completed_at: daysAgo(6),
        whatsapp_joined: false,
        session_ids: [...DEFAULT_SESSION_IDS],
        sessions_selected_at: daysAgo(8),
      },
      intake: {
        user_id: "demo-aditya",
        full_name: "Aditya Singh",
        age: 27,
        height: "180 cm",
        weight: "76 kg",
        occupation: "Software engineer",
        goal: "Build strength without living in the gym.",
        biggest_struggle: "Desk job posture and evening fatigue.",
        training_experience: "Intermediate",
        training_days_per_week: "3",
        why_now: "Want a coached system I can stick to.",
        instagram_handle: "adi.lifts",
        phone: "+91 98222 44556",
        completed_at: daysAgo(8),
        updated_at: daysAgo(8),
      },
    },
  ];
}

function mockDashboard(): CoachDashboardData {
  const members = getDemoCoachMembers();
  return {
    source: "mock",
    members,
    liveSessions: MOCK_SESSIONS,
    recordings: [],
    siteConfig: {
      whatsapp_invite_url: "https://chat.whatsapp.com/demo-invite",
      foundations_calendly_url: "https://calendly.com/leanmovement/foundations",
      cohort_start_date: "",
    },
    stats: computeStats(members),
    warnings: ["Showing preview members — connect Supabase for live data."],
  };
}

export async function fetchCoachDashboard(): Promise<CoachDashboardData> {
  if (!isSupabaseConfigured()) return mockDashboard();

  const supabase = getSupabase()!;
  const warnings: string[] = [];

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
  if (membershipsRes.error) {
    warnings.push(`Memberships: ${membershipsRes.error.message}`);
  }
  if (intakeRes.error) {
    warnings.push(`Questionnaires unavailable: ${intakeRes.error.message}`);
  }
  if (onboardingRes.error) {
    warnings.push(`Onboarding status unavailable: ${onboardingRes.error.message}`);
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

  // Only fall back to demos when there are no real member profiles yet.
  if (members.length === 0) {
    const demo = mockDashboard();
    return {
      ...demo,
      siteConfig: {
        ...demo.siteConfig,
        ...Object.fromEntries(
          ((cfgRes.data ?? []) as { key: string; value: string }[]).map((c) => [c.key, c.value]),
        ),
      },
      liveSessions: (liveRes.data as LiveSessionRow[]) ?? demo.liveSessions,
      recordings: (recRes.data as RecordingRow[]) ?? [],
      warnings: [
        "No members yet — showing preview profiles so you can try the flow.",
        ...warnings,
      ],
    };
  }

  const configMap = Object.fromEntries(
    ((cfgRes.data ?? []) as { key: string; value: string }[]).map((c) => [c.key, c.value]),
  );

  return {
    source: "supabase",
    members,
    liveSessions: (liveRes.data as LiveSessionRow[]) ?? [],
    recordings: (recRes.data as RecordingRow[]) ?? [],
    siteConfig: {
      whatsapp_invite_url: "",
      foundations_calendly_url: "",
      cohort_start_date: "",
      ...configMap,
    },
    stats: computeStats(members),
    warnings: warnings.length ? warnings : undefined,
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

/** How long a member stays flagged as newly subscribed in the coach console. */
export const NEW_MEMBER_DAYS = 7;

export function isNewMember(member: Pick<CoachMember, "created_at" | "membership">) {
  const joined = member.membership?.started_at ?? member.created_at;
  if (!joined) return false;
  const started = new Date(joined).getTime();
  if (!Number.isFinite(started)) return false;
  return Date.now() - started <= NEW_MEMBER_DAYS * 24 * 60 * 60 * 1000;
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
