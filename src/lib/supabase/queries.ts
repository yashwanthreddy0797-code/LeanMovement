import { getSupabase, isSupabaseConfigured } from "./client";
import type { CircuitRow, LiveSessionRow, RecordingRow } from "./types";
import { COACH } from "@/lib/lean-kettlebell";
import {
  countPastSessionsThisMonth,
  formatTimeIst,
  getNextOccurrence,
  getSessionTiming,
  pickNextLiveSession,
  todayWeekday,
} from "@/lib/portal/live-session";
import {
  circuits as mockCircuits,
  nextLiveSession as mockNextLive,
  recordings as mockRecordings,
  weeklySchedule as mockSchedule,
  whatsAppCommunity as mockWhatsApp,
} from "@/lib/portal/member-data";

export type PortalWeeklySession = {
  day: string;
  date: string;
  title: string;
  focus: string;
  time: string;
  status: "upcoming" | "scheduled";
  isToday: boolean;
  joinUrl: string;
  liveState: "live" | "soon" | "later";
};

export type PortalNextLive = {
  title: string;
  day: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  joinUrl: string;
  coach: string;
  startsAt: string;
  liveState: "live" | "soon" | "later";
  minutesUntilStart: number;
};

export type PortalRecording = {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: string;
  thumbnail: string;
  videoUrl: string;
};

export type PortalCircuit = {
  id: string;
  name: string;
  duration: string;
  rounds: string;
  difficulty: string;
  exercises: string[];
  description: string;
  videoUrl?: string | null;
};

export type PortalSiteConfig = {
  whatsappInviteUrl: string;
  foundationsCalendlyUrl: string;
  cohortStartDate: string;
};

export type PortalContent = {
  source: "supabase" | "mock";
  liveSessions: LiveSessionRow[];
  weeklySchedule: PortalWeeklySession[];
  nextLiveSession: PortalNextLive;
  recordings: PortalRecording[];
  circuits: PortalCircuit[];
  siteConfig: PortalSiteConfig;
  sessionsThisMonth: number;
  totalSessionsPerMonth: number;
};

function todayWeekdayLabel() {
  return todayWeekday();
}

function formatTime(t: string) {
  return formatTimeIst(t);
}

function mapLiveSession(row: LiveSessionRow): PortalWeeklySession {
  const isToday = row.day_of_week === todayWeekdayLabel();
  const startsAt = getNextOccurrence(row.day_of_week, row.start_time);
  const timing = getSessionTiming(startsAt, row.duration_minutes ?? 45);

  return {
    day: row.day_of_week,
    date: isToday ? "Today" : "This week",
    title: row.title ?? "Live session",
    focus: row.focus ?? "",
    time: formatTime(row.start_time),
    status: isToday ? "upcoming" : "scheduled",
    isToday,
    joinUrl: row.join_url ?? "#",
    liveState: isToday ? timing.liveState : "later",
  };
}

function mapNextLive(rows: LiveSessionRow[]): PortalNextLive {
  const pick = pickNextLiveSession(rows);
  if (!pick) return enrichMockNext(mockNextLive);

  const { row, startsAt, timing } = pick;
  return {
    title: row.title,
    day: row.day_of_week,
    date: startsAt.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: formatTime(row.start_time),
    duration: `${row.duration_minutes} min`,
    type: row.session_type,
    joinUrl: row.join_url,
    coach: COACH.name,
    startsAt: startsAt.toISOString(),
    liveState: timing.liveState,
    minutesUntilStart: timing.minutesUntilStart,
  };
}

function enrichMockNext(session: typeof mockNextLive): PortalNextLive {
  const startsAt = getNextOccurrence(session.day, "06:00");
  const timing = getSessionTiming(startsAt, 45);
  return {
    ...session,
    startsAt: startsAt.toISOString(),
    liveState: timing.liveState,
    minutesUntilStart: timing.minutesUntilStart,
  };
}

function isRecordingActive(row: RecordingRow, now = new Date()) {
  if (!row.expires_at) return true;
  return new Date(row.expires_at) > now;
}

function mapRecording(row: RecordingRow): PortalRecording {
  return {
    id: row.id,
    title: row.title,
    date: new Date(row.recorded_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    duration: row.duration ?? "45 min",
    type: row.session_type,
    thumbnail:
      row.thumbnail_url ??
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70&auto=format&fit=crop",
    videoUrl: row.video_url,
  };
}

function mapCircuit(row: CircuitRow): PortalCircuit {
  const exercises = Array.isArray(row.exercises) ? row.exercises : [];
  return {
    id: row.id,
    name: row.name,
    duration: row.duration ?? "",
    rounds: row.rounds ?? "",
    difficulty: row.difficulty ?? "",
    exercises,
    description: row.description ?? "",
    videoUrl: row.video_url,
  };
}

function mockContent(): PortalContent {
  const mockRows: LiveSessionRow[] = mockSchedule.map((s, i) => ({
    id: `mock-${i}`,
    day_of_week: s.day,
    title: s.title,
    session_type: "Morning",
    focus: s.focus || null,
    start_time: "06:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: mockNextLive.joinUrl,
    sort_order: i + 1,
  }));
  const sessionDays = mockRows.map((s) => s.day_of_week);

  return {
    source: "mock",
    liveSessions: mockRows,
    weeklySchedule: mockRows.map(mapLiveSession),
    nextLiveSession: enrichMockNext(mockNextLive),
    recordings: mockRecordings.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date,
      duration: r.duration,
      type: r.type,
      thumbnail: r.thumbnail,
      videoUrl: r.thumbnail,
    })),
    circuits: mockCircuits.map((c) => ({
      id: c.id,
      name: c.name,
      duration: c.duration,
      rounds: c.rounds,
      difficulty: c.difficulty,
      exercises: c.exercises,
      description: c.description,
    })),
    siteConfig: {
      whatsappInviteUrl: mockWhatsApp.inviteUrl,
      foundationsCalendlyUrl: "",
      cohortStartDate: "April 2026",
    },
    sessionsThisMonth: countPastSessionsThisMonth(sessionDays),
    totalSessionsPerMonth: 12,
  };
}

export async function fetchPortalContent(): Promise<PortalContent> {
  if (!isSupabaseConfigured()) return mockContent();

  try {
    const supabase = getSupabase()!;
    if (!supabase) return mockContent();

    const [liveRes, recRes, cirRes, cfgRes] = await Promise.all([
      supabase.from("live_sessions").select("*").order("sort_order"),
      supabase.from("recordings").select("*").order("recorded_at", { ascending: false }),
      supabase.from("circuits").select("*").order("sort_order"),
      supabase.from("site_config").select("*"),
    ]);

    if (liveRes.error || !liveRes.data?.length) {
      console.warn("[portal-content] live_sessions unavailable, using demo data", liveRes.error?.message);
      return mockContent();
    }

    const liveRows = (liveRes.data as LiveSessionRow[]).filter(
      (row) => row?.day_of_week && row?.start_time,
    );
    if (!liveRows.length) return mockContent();

    const configMap = Object.fromEntries(
      ((cfgRes.data ?? []) as { key: string; value: string }[]).map((c) => [c.key, c.value]),
    );
    const sessionDays = liveRows.map((r) => r.day_of_week);
    const fallback = mockContent();

    return {
      source: "supabase",
      liveSessions: liveRows,
      weeklySchedule: liveRows.map(mapLiveSession),
      nextLiveSession: mapNextLive(liveRows),
      recordings: recRes.data
        ? (recRes.data as RecordingRow[]).filter(isRecordingActive).map(mapRecording)
        : fallback.recordings,
      circuits: (cirRes.data as CircuitRow[] | null)?.map(mapCircuit) ?? fallback.circuits,
      siteConfig: {
        whatsappInviteUrl: configMap.whatsapp_invite_url ?? mockWhatsApp.inviteUrl,
        foundationsCalendlyUrl: configMap.foundations_calendly_url ?? "",
        cohortStartDate: configMap.cohort_start_date ?? "April 2026",
      },
      sessionsThisMonth: countPastSessionsThisMonth(sessionDays),
      totalSessionsPerMonth: 12,
    };
  } catch (err) {
    console.error("[portal-content] fetch failed, using demo data", err);
    return mockContent();
  }
}

export function isSupabaseReady() {
  return isSupabaseConfigured();
}
