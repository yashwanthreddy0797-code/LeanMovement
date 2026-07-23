import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  endOfYear,
  startOfYear,
  eachMonthOfInterval,
} from "date-fns";
import type { LiveSessionRow } from "@/lib/supabase/types";
import { formatSessionTime } from "@/lib/portal/coach-queries";

export type CalendarView = "year" | "month" | "week" | "day";

export type CalendarOccurrence = {
  session: LiveSessionRow;
  date: Date;
  start: Date;
  end: Date;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseTime(startTime: string) {
  const [h, m] = startTime.split(":").map(Number);
  return { hours: h ?? 7, minutes: m ?? 0 };
}

export function sessionsOnDate(date: Date, sessions: LiveSessionRow[] = []) {
  const dayName = format(date, "EEEE");
  return sessions.filter((s) => s?.day_of_week === dayName);
}

export function toOccurrence(date: Date, session: LiveSessionRow): CalendarOccurrence {
  const { hours, minutes } = parseTime(session.start_time);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + (session.duration_minutes ?? 45));
  return { session, date, start, end };
}

export function occurrencesInRange(
  from: Date,
  to: Date,
  sessions: LiveSessionRow[] = [],
): CalendarOccurrence[] {
  const days = eachDayOfInterval({ start: from, end: to });
  const result: CalendarOccurrence[] = [];
  for (const day of days) {
    for (const session of sessionsOnDate(day, sessions)) {
      result.push(toOccurrence(day, session));
    }
  }
  return result.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function navigateDate(date: Date, view: CalendarView, dir: -1 | 1) {
  switch (view) {
    case "year":
      return addYears(date, dir);
    case "month":
      return addMonths(date, dir);
    case "week":
      return addWeeks(date, dir);
    case "day":
      return addDays(date, dir);
  }
}

export function periodLabel(date: Date, view: CalendarView) {
  switch (view) {
    case "year":
      return format(date, "yyyy");
    case "month":
      return format(date, "MMMM yyyy");
    case "week": {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      const end = endOfWeek(date, { weekStartsOn: 0 });
      return `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
    }
    case "day":
      return format(date, "EEEE, d MMMM yyyy");
  }
}

export function monthGridDays(anchor: Date) {
  const start = startOfWeek(startOfMonth(anchor), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(anchor), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function weekDays(anchor: Date) {
  const start = startOfWeek(anchor, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function yearMonths(anchor: Date) {
  return eachMonthOfInterval({
    start: startOfYear(anchor),
    end: endOfYear(anchor),
  });
}

/** Morning vs Evening batch helpers for calendar colouring. */
export function isEveningSession(session: Pick<LiveSessionRow, "start_time" | "title" | "session_type">) {
  const label = `${session.title ?? ""} ${session.session_type ?? ""}`.toLowerCase();
  if (label.includes("evening")) return true;
  if (label.includes("morning")) return false;
  const hour = parseInt(String(session.start_time ?? "07:00").split(":")[0] ?? "7", 10);
  return hour >= 12;
}

export function sessionBatchLabel(session: Pick<LiveSessionRow, "start_time" | "title" | "session_type">) {
  return isEveningSession(session) ? "Evening" : "Morning";
}

/** Morning = black, Evening = red — inline hex so colors always ship. */
export function sessionBatchHex(session: Pick<LiveSessionRow, "start_time" | "title" | "session_type">) {
  return isEveningSession(session) ? "#E11D2A" : "#111111";
}

export function sessionBatchColor(session: Pick<LiveSessionRow, "start_time" | "title" | "session_type">) {
  return isEveningSession(session)
    ? "bg-[#E11D2A] text-white"
    : "bg-[#111111] text-white";
}

export { WEEKDAYS, formatSessionTime, isSameDay, isSameMonth, isToday, format, getHours, getMinutes };
