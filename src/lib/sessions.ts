/** Available live session slots — members pick exactly 3. */

export type SessionWindow = "morning" | "evening";

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
    id: "mon-am",
    day: "Monday",
    dayOfWeek: 1,
    window: "morning",
    timeLabel: "7:00 AM – 8:00 AM",
    startHour: 7,
    endHour: 8,
    focus: "Strength",
    brief: "Heavy kettlebell work — presses, squats, pulls",
  },
  {
    id: "wed-am",
    day: "Wednesday",
    dayOfWeek: 3,
    window: "morning",
    timeLabel: "7:00 AM – 8:00 AM",
    startHour: 7,
    endHour: 8,
    focus: "Endurance",
    brief: "Conditioning & engine — intervals, complexes",
  },
  {
    id: "fri-am",
    day: "Friday",
    dayOfWeek: 5,
    window: "morning",
    timeLabel: "7:00 AM – 8:00 AM",
    startHour: 7,
    endHour: 8,
    focus: "Hybrid",
    brief: "Strength + endurance blend",
  },
  {
    id: "tue-pm",
    day: "Tuesday",
    dayOfWeek: 2,
    window: "evening",
    timeLabel: "7:00 PM – 8:00 PM",
    startHour: 19,
    endHour: 20,
    focus: "Strength",
    brief: "Heavy kettlebell work — presses, squats, pulls",
  },
  {
    id: "thu-pm",
    day: "Thursday",
    dayOfWeek: 4,
    window: "evening",
    timeLabel: "7:00 PM – 8:00 PM",
    startHour: 19,
    endHour: 20,
    focus: "Endurance",
    brief: "Conditioning & engine — intervals, complexes",
  },
  {
    id: "sat-pm",
    day: "Saturday",
    dayOfWeek: 6,
    window: "evening",
    timeLabel: "7:00 PM – 8:00 PM",
    startHour: 19,
    endHour: 20,
    focus: "Hybrid",
    brief: "Strength + endurance blend",
  },
];

export const SESSIONS_TO_PICK = 3;

export const SESSION_WINDOWS = [
  {
    id: "morning" as const,
    label: "Morning batch",
    time: "7:00 AM – 8:00 AM IST",
    days: "Mon · Wed · Fri",
  },
  {
    id: "evening" as const,
    label: "Evening batch",
    time: "7:00 PM – 8:00 PM IST",
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
