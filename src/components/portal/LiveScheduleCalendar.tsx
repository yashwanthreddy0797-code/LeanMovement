import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Play,
  ExternalLink,
} from "lucide-react";
import type { LiveSessionRow } from "@/lib/supabase/types";
import {
  type CalendarOccurrence,
  type CalendarView,
  WEEKDAYS,
  formatSessionTime,
  isSameDay,
  isSameMonth,
  isToday,
  monthGridDays,
  navigateDate,
  occurrencesInRange,
  periodLabel,
  sessionBatchHex,
  sessionBatchLabel,
  isEveningSession,
  sessionsOnDate,
  toOccurrence,
  weekDays,
  yearMonths,
} from "@/lib/portal/schedule-calendar";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { SoftCard } from "@/components/portal/ui";

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "year", label: "Year" },
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
];

const HOUR_START = 6;
const HOUR_END = 21;

type Props = {
  sessions?: LiveSessionRow[];
};

export function LiveScheduleCalendar({ sessions = [] }: Props) {
  const [view, setView] = useState<CalendarView>("month");
  const [anchor, setAnchor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      if (mq.matches) setView((v) => (v === "month" || v === "year" ? "day" : v));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = (dir: -1 | 1) => setAnchor((d) => navigateDate(d, view, dir));
  const goToday = () => {
    const now = new Date();
    setAnchor(now);
    setSelected(now);
  };

  const weekOccurrences = useMemo(() => {
    const start = startOfWeek(anchor, { weekStartsOn: 0 });
    const end = endOfWeek(anchor, { weekStartsOn: 0 });
    return occurrencesInRange(start, end, sessions);
  }, [anchor, sessions]);

  const monthDays = useMemo(() => monthGridDays(anchor), [anchor]);

  return (
    <SoftCard className="!p-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border bg-surface/80 p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="shrink-0 text-accent" />
          <h2 className="font-display text-xl uppercase tracking-[0.04em] md:text-2xl">Session calendar</h2>
        </div>

        <div className="inline-flex w-full overflow-x-auto border border-border bg-white p-0.5 sm:w-auto">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`min-h-10 flex-1 px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors sm:flex-none ${
                view === v.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col justify-between gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:px-5 md:px-6">
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => go(-1)} label="Previous" />
          <button
            type="button"
            onClick={goToday}
            className="portal-btn portal-btn-ghost !min-h-10 !px-3 !py-1.5"
          >
            Today
          </button>
          <NavBtn onClick={() => go(1)} label="Next" />
        </div>
        <div className="truncate font-display text-base uppercase tracking-[0.04em] text-foreground sm:text-lg md:text-xl">
          {periodLabel(anchor, view)}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {view === "year" && (
          <YearView
            anchor={anchor}
            sessions={sessions}
            selected={selected}
            onSelectMonth={(d) => {
              setAnchor(d);
              setSelected(d);
              setView("month");
            }}
          />
        )}
        {view === "month" && (
          <MonthView
            days={monthDays}
            anchor={anchor}
            sessions={sessions}
            selected={selected}
            onSelectDay={(d) => {
              setSelected(d);
              setView("day");
            }}
          />
        )}
        {view === "week" && (
          <WeekView
            days={weekDays(anchor)}
            occurrences={weekOccurrences}
            selected={selected}
            onSelectDay={setSelected}
          />
        )}
        {view === "day" && (
          <DayView
            date={selected}
            sessions={sessions}
            onShift={(d) => setSelected(d)}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 border-t border-border bg-surface/50 px-5 py-4 text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:px-6">
        <LegendDot className="bg-foreground" label="Morning · 7 AM" />
        <LegendDot className="bg-accent" label="Evening · 7 PM" />
        <span className="text-muted-foreground/70">IST</span>
      </div>
    </SoftCard>
  );
}

function NavBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid min-h-10 min-w-10 place-items-center text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
    >
      {label === "Previous" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 ${className}`} />
      {label}
    </span>
  );
}

function SessionPill({
  occ,
  compact,
}: {
  occ: CalendarOccurrence;
  compact?: boolean;
}) {
  const batch = sessionBatchLabel(occ.session);
  const hex = sessionBatchHex(occ.session);
  return (
    <div
      className={`rounded-md px-2 py-1 text-[10px] font-semibold truncate text-white ${
        compact ? "leading-tight" : ""
      }`}
      style={{ backgroundColor: hex }}
      title={`${batch} · ${formatSessionTime(occ.session.start_time)}`}
    >
      {compact ? batch : `${batch} · ${formatSessionTime(occ.session.start_time)}`}
    </div>
  );
}

function YearView({
  anchor,
  sessions,
  selected,
  onSelectMonth,
}: {
  anchor: Date;
  sessions: LiveSessionRow[];
  selected: Date;
  onSelectMonth: (d: Date) => void;
}) {
  const months = yearMonths(anchor);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {months.map((monthStart) => {
        const days = monthGridDays(monthStart);
        const sessionDays = days.filter(
          (d) => isSameMonth(d, monthStart) && sessionsOnDate(d, sessions).length > 0,
        ).length;

        return (
          <button
            key={monthStart.toISOString()}
            type="button"
            onClick={() => onSelectMonth(monthStart)}
            className={`text-left rounded-xl border p-3 transition-colors hover:border-[#FCA5A5] hover:bg-[#FAFAF6] ${
              isSameMonth(selected, monthStart)
                ? "border-[#E11D2A] bg-[#FEE2E2]/20"
                : "border-[var(--border)]"
            }`}
          >
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#737373] mb-2">
              {format(monthStart, "MMMM")}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-[8px] text-center text-[#A3A3A3]">
                  {d[0]}
                </div>
              ))}
              {days.map((day) => {
                const inMonth = isSameMonth(day, monthStart);
                const daySessions = inMonth ? sessionsOnDate(day, sessions) : [];
                const hasSession = daySessions.length > 0;
                const evening = hasSession && daySessions.some(isEveningSession);
                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square rounded-sm text-[9px] flex items-center justify-center ${
                      !inMonth
                        ? "opacity-0"
                        : hasSession
                          ? evening
                            ? "bg-[#E11D2A]/20 text-[#E11D2A] font-semibold"
                            : "bg-[#111111]/15 text-[#111111] font-semibold"
                          : isToday(day)
                            ? "ring-1 ring-[#E11D2A]/40"
                            : "text-[#A3A3A3]"
                    }`}
                  >
                    {inMonth ? format(day, "d") : ""}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-[10px] text-[#737373]">{sessionDays} session days</div>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({
  days,
  anchor,
  sessions,
  selected,
  onSelectDay,
}: {
  days: Date[];
  anchor: Date;
  sessions: LiveSessionRow[];
  selected: Date;
  onSelectDay: (d: Date) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] uppercase tracking-[0.16em] text-[#737373] py-2"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
        {days.map((day) => {
          const inMonth = isSameMonth(day, anchor);
          const daySessions = sessionsOnDate(day, sessions);
          const isSelected = isSameDay(day, selected);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`min-h-[72px] sm:min-h-[88px] md:min-h-[100px] p-1 sm:p-1.5 md:p-2 text-left bg-white transition-colors hover:bg-[#FAFAF6] ${
                !inMonth ? "opacity-40" : ""
              } ${isSelected ? "ring-2 ring-inset ring-[#E11D2A]" : ""}`}
            >
              <div
                className={`text-[11px] sm:text-xs font-medium mb-1 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                  isToday(day) ? "bg-[#000000] text-white" : "text-[#404040]"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {daySessions.slice(0, 2).map((s) => (
                  <SessionPill key={s.id} occ={toOccurrence(day, s)} compact />
                ))}
                {daySessions.length > 2 && (
                  <div className="text-[9px] text-[#737373] pl-1">+{daySessions.length - 2} more</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  days,
  occurrences,
  selected,
  onSelectDay,
}: {
  days: Date[];
  occurrences: CalendarOccurrence[];
  selected: Date;
  onSelectDay: (d: Date) => void;
}) {
  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <p className="md:hidden text-[10px] uppercase tracking-[0.14em] text-[#A3A3A3] mb-2 px-1">
        Swipe for full week →
      </p>
      <div className="min-w-[640px]">
        <div className="grid grid-cols-8 border-b border-[var(--border)]">
          <div className="p-2" />
          {days.map((day) => (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`p-2 text-center border-l border-[var(--border)] transition-colors hover:bg-[#FAFAF6] ${
                isSameDay(day, selected) ? "bg-[#FEE2E2]/30" : ""
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-[#737373]">
                {format(day, "EEE")}
              </div>
              <div
                className={`text-lg font-display mt-0.5 tracking-[0.04em] ${
                  isToday(day) ? "text-accent" : "text-foreground"
                }`}
              >
                {format(day, "d")}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-8 relative" style={{ minHeight: `${hours.length * 56}px` }}>
          <div className="border-r border-[var(--border)]">
            {hours.map((h) => (
              <div
                key={h}
                className="h-14 text-[10px] text-[#A3A3A3] pr-2 text-right -translate-y-2"
              >
                {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
              </div>
            ))}
          </div>
          {days.map((day) => (
            <div key={day.toISOString()} className="relative border-l border-[var(--border)]">
              {hours.map((h) => (
                <div key={h} className="h-14 border-b border-[var(--border)]/50" />
              ))}
              {occurrences
                .filter((o) => isSameDay(o.date, day))
                .map((occ) => {
                  const top =
                    (occ.start.getHours() - HOUR_START + occ.start.getMinutes() / 60) * 56;
                  const height = ((occ.session.duration_minutes ?? 45) / 60) * 56;
                  return (
                    <div
                      key={`${occ.session.id}-${day.toISOString()}`}
                      className="absolute left-1 right-1 rounded-lg px-2 py-1.5 text-[10px] leading-snug overflow-hidden shadow-sm text-white"
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(height, 40)}px`,
                        backgroundColor: sessionBatchHex(occ.session),
                      }}
                    >
                      <div className="font-semibold truncate">{sessionBatchLabel(occ.session)}</div>
                      <div className="opacity-90 truncate">
                        {formatSessionTime(occ.session.start_time)}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DayView({
  date,
  sessions,
  onShift,
}: {
  date: Date;
  sessions: LiveSessionRow[];
  onShift: (d: Date) => void;
}) {
  const daySessions = sessionsOnDate(date, sessions);
  const occs = daySessions.map((s) => toOccurrence(date, s));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => onShift(addDays(date, -1))}
          className="p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {format(date, "EEEE")}
          </div>
          <div className="mt-1 font-display text-3xl uppercase tracking-[0.04em]">
            {format(date, "d MMMM yyyy")}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onShift(addDays(date, 1))}
          className="p-2 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {occs.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No live sessions scheduled this day.
          <br />
          <span className="mt-2 block text-xs">
            Morning Mon · Wed · Fri · Evening Tue · Thu · Sat
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {occs.map((occ) => (
            <div
              key={occ.session.id}
              className="border border-border bg-white p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span
                    className="mb-2 inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white"
                    style={{ backgroundColor: sessionBatchHex(occ.session) }}
                  >
                    {sessionBatchLabel(occ.session)}
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-[0.04em]">
                    Lean Kettlebell - {sessionBatchLabel(occ.session)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatSessionTime(occ.session.start_time)} · {occ.session.duration_minutes} min ·
                    IST
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={occ.session.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn"
                  >
                    <Play size={14} /> Host
                  </a>
                  <a
                    href={occ.session.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portal-btn portal-btn-ghost"
                  >
                    <ExternalLink size={14} /> Link
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
