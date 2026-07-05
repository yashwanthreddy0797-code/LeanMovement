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

export function sessionTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case "strength":
      return "bg-[#000000] text-white";
    case "conditioning":
      return "bg-[#E11D2A] text-white";
    case "hybrid":
      return "bg-[#737373] text-white";
    default:
      return "bg-[#FEE2E2] text-[#000000]";
  }
}

export { WEEKDAYS, formatSessionTime, isSameDay, isSameMonth, isToday, format, getHours, getMinutes };
