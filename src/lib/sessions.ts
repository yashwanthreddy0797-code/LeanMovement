/** Fixed live session slots — Tue / Thu / Sat · 6:00–7:00 AM IST */

import { addDays, format, parseISO } from "date-fns";
import type { LiveSessionRow } from "@/lib/supabase/types";
import { getSessionTiming } from "@/lib/portal/live-session";
import type { SessionLiveState } from "@/lib/portal/live-session";

export type SessionWindow = "morning";

export type SessionSlot = {
  id: string;
  day: string;
  /** 0=Sun … 6=Sat (JS Date.getDay) */
  dayOfWeek: number;
  window: SessionWindow;
  timeLabel: string;
  startHour: number;
  endHour: number;
  focus: "Strength" | "Endurance" | "Hybrid";
  brief: string;
};

export const SESSION_SLOTS: SessionSlot[] = [
  {
    id: "tue-am",
    day: "Tuesday",
    dayOfWeek: 2,
    window: "morning",
    timeLabel: "6:00 AM – 7:00 AM",
    startHour: 6,
    endHour: 7,
    focus: "Strength",
    brief: "Heavy kettlebell work — presses, squats, pulls",
  },
  {
    id: "thu-am",
    day: "Thursday",
    dayOfWeek: 4,
    window: "morning",
    timeLabel: "6:00 AM – 7:00 AM",
    startHour: 6,
    endHour: 7,
    focus: "Endurance",
    brief: "Conditioning & engine — intervals, complexes",
  },
  {
    id: "sat-am",
    day: "Saturday",
    dayOfWeek: 6,
    window: "morning",
    timeLabel: "6:00 AM – 7:00 AM",
    startHour: 6,
    endHour: 7,
    focus: "Hybrid",
    brief: "Strength + endurance blend",
  },
];

export const SESSIONS_TO_PICK = SESSION_SLOTS.length;

/** Every member trains on the same three mornings. */
export const DEFAULT_SESSION_IDS = SESSION_SLOTS.map((slot) => slot.id);

export const SESSION_WINDOWS = [
  {
    id: "morning" as const,
    label: "Morning batch",
    time: "6:00 AM – 7:00 AM IST",
    days: "Tue · Thu · Sat",
  },
] as const;

export function getSlotById(id: string) {
  return SESSION_SLOTS.find((s) => s.id === id);
}

export function formatSelectedSessions(ids: string[]) {
  return ids
    .map((id) => getSlotById(id))
    .filter(Boolean)
    .map((s) => `${s!.day} ${s!.timeLabel} (${s!.focus})`)
    .join(" · ");
}

export function slotsForWindow(window: SessionWindow) {
  return SESSION_SLOTS.filter((s) => s.window === window);
}

export type SessionFocus = SessionSlot["focus"];

export function resolveSessionSlots(ids: string[]) {
  return ids.map((id) => getSlotById(id)).filter((slot): slot is SessionSlot => Boolean(slot));
}

const FOCUS_ORDER: SessionFocus[] = ["Strength", "Endurance", "Hybrid"];

/** Monday of the current week in IST (yyyy-MM-dd). */
export function getWeekStartDate(ref = new Date()): string {
  const ist = new Date(ref.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  ist.setDate(ist.getDate() + diff);
  return format(ist, "yyyy-MM-dd");
}

export function formatWeekRange(weekStart: string) {
  const start = parseISO(`${weekStart}T12:00:00`);
  const end = addDays(start, 6);
  return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
}

function dayOffsetFromWeekStart(dayOfWeek: number) {
  if (dayOfWeek === 0) return 6;
  return dayOfWeek - 1;
}

export function slotStartsAtThisWeek(slotId: string, weekStart: string) {
  const slot = getSlotById(slotId);
  if (!slot) return null;
  const base = parseISO(`${weekStart}T12:00:00`);
  const date = addDays(base, dayOffsetFromWeekStart(slot.dayOfWeek));
  date.setHours(slot.startHour, 0, 0, 0);
  return date;
}

export function joinUrlForSlot(slotId: string, liveSessions: LiveSessionRow[]) {
  const slot = getSlotById(slotId);
  if (!slot) return null;
  const row = liveSessions.find((session) => session.day_of_week === slot.day);
  return row?.join_url ?? null;
}

export function slotLiveState(
  slotId: string,
  weekStart: string,
  durationMinutes = 60,
  now = new Date(),
): SessionLiveState {
  const startsAt = slotStartsAtThisWeek(slotId, weekStart);
  if (!startsAt) return "later";
  return getSessionTiming(startsAt, durationMinutes, 15, now).liveState;
}

export function attendedFocuses(attendedSlotIds: string[]) {
  return [...new Set(resolveSessionSlots(attendedSlotIds).map((slot) => slot.focus))];
}

/** Fixed program — all three slots are always valid. */
export function validateSessionSelection(ids: string[], _attendedSlotIds: string[] = []) {
  const unique = [...new Set(ids)];
  if (unique.length !== SESSIONS_TO_PICK) {
    return {
      ok: false as const,
      message: `Program includes ${SESSIONS_TO_PICK} live sessions per week.`,
    };
  }

  const slots = resolveSessionSlots(unique);
  if (slots.length !== SESSIONS_TO_PICK) {
    return { ok: false as const, message: "Invalid session selection." };
  }

  return { ok: true as const, slots };
}

export function toggleSessionSelection(id: string, currentIds: string[]) {
  if (currentIds.includes(id)) {
    return currentIds.filter((slotId) => slotId !== id);
  }
  return [...currentIds, id];
}

export function isSessionDisabled(
  id: string,
  currentIds: string[],
  _attendedSlotIds: string[] = [],
) {
  if (currentIds.includes(id)) return false;
  return currentIds.length >= SESSIONS_TO_PICK;
}

export function focusProgress(
  pickedIds: string[],
  attendedSlotIds: string[],
): Record<SessionFocus, "empty" | "picked" | "attended"> {
  const picked = resolveSessionSlots(pickedIds);
  const attended = resolveSessionSlots(attendedSlotIds);
  return FOCUS_ORDER.reduce(
    (acc, focus) => {
      if (attended.some((slot) => slot.focus === focus)) acc[focus] = "attended";
      else if (picked.some((slot) => slot.focus === focus)) acc[focus] = "picked";
      else acc[focus] = "empty";
      return acc;
    },
    {} as Record<SessionFocus, "empty" | "picked" | "attended">,
  );
}
