import type { LiveSessionRow } from "@/lib/supabase/types";

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type SessionLiveState = "live" | "soon" | "later";

export type SessionTiming = {
  startsAt: Date;
  endsAt: Date;
  liveState: SessionLiveState;
  minutesUntilStart: number;
};

function parseStartTime(startTime: string | null | undefined): { hours: number; minutes: number } {
  if (!startTime || typeof startTime !== "string") return { hours: 7, minutes: 0 };
  const [h, m] = startTime.split(":").map((v) => parseInt(v, 10));
  return { hours: Number.isFinite(h) ? h : 7, minutes: Number.isFinite(m) ? m : 0 };
}

export function getNextOccurrence(dayOfWeek: string, startTime: string, from = new Date()): Date {
  const targetDay = WEEKDAYS.indexOf(dayOfWeek as (typeof WEEKDAYS)[number]);
  const { hours, minutes } = parseStartTime(startTime);
  const now = new Date(from);

  const candidate = new Date(now);
  candidate.setHours(hours, minutes, 0, 0);

  let dayDiff = (targetDay === -1 ? 1 : targetDay) - now.getDay();
  if (dayDiff < 0 || (dayDiff === 0 && candidate.getTime() <= now.getTime())) {
    dayDiff += 7;
  }
  candidate.setDate(candidate.getDate() + dayDiff);
  return candidate;
}

export function getSessionTiming(
  startsAt: Date,
  durationMinutes: number,
  joinWindowMinutes = 15,
  now = new Date(),
): SessionTiming {
  const startMs = startsAt.getTime();
  const endMs = startMs + durationMinutes * 60 * 1000;
  const windowStartMs = startMs - joinWindowMinutes * 60 * 1000;
  const nowMs = now.getTime();

  let liveState: SessionLiveState = "later";
  if (nowMs >= windowStartMs && nowMs <= endMs) {
    liveState = nowMs >= startMs ? "live" : "soon";
  }

  const minutesUntilStart = Math.max(0, Math.round((startMs - nowMs) / 60_000));

  return {
    startsAt,
    endsAt: new Date(endMs),
    liveState,
    minutesUntilStart,
  };
}

export function formatTimeIst(t: string) {
  const { hours, minutes } = parseStartTime(t);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${String(minutes).padStart(2, "0")} ${ampm} IST`;
}

export function pickNextLiveSession(rows: LiveSessionRow[], now = new Date()) {
  const valid = rows.filter((row) => row?.day_of_week && row?.start_time);
  if (!valid.length) return null;

  const ranked = valid
    .map((row) => {
      const startsAt = getNextOccurrence(row.day_of_week, row.start_time, now);
      const timing = getSessionTiming(startsAt, row.duration_minutes ?? 45, 15, now);
      return { row, startsAt, timing };
    })
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  const liveNow = ranked.find((r) => r.timing.liveState === "live");
  if (liveNow) return liveNow;

  const startingSoon = ranked.find((r) => r.timing.liveState === "soon");
  if (startingSoon) return startingSoon;

  return ranked[0];
}

export function countPastSessionsThisMonth(sessionDays: string[], now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const daySet = new Set(sessionDays);
  let count = 0;

  for (let d = 1; d <= now.getDate(); d++) {
    const date = new Date(year, month, d, 12);
    if (daySet.has(WEEKDAYS[date.getDay()])) count += 1;
  }

  return count;
}

export function todayWeekday() {
  return WEEKDAYS[new Date().getDay()];
}
