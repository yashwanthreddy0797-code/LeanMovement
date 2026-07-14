import { useMemo, useState } from "react";
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
  sessionBatchColor,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border-b border-[var(--border)] bg-[#FAFAF6]/80">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-[#E11D2A]" />
          <h2 className="font-serif text-xl md:text-2xl">Session calendar</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-0.5 rounded-xl bg-white border border-[var(--border)]">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] rounded-[10px] transition-colors ${
                  view === v.id
                    ? "bg-[#000000] text-white"
                    : "text-[#737373] hover:text-[#000000]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => go(-1)} label="Previous" />
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] rounded-lg border border-[var(--border)] hover:bg-[#FAFAF6] transition-colors"
          >
            Today
          </button>
          <NavBtn onClick={() => go(1)} label="Next" />
        </div>
        <div className="font-serif text-lg md:text-xl text-[#000000]">{periodLabel(anchor, view)}</div>
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
      <div className="flex flex-wrap gap-4 px-5 md:px-6 py-4 border-t border-[var(--border)] bg-[#FAFAF6]/50 text-[11px] uppercase tracking-[0.12em] text-[#737373]">
        <LegendDot className="bg-[#111111]" label="Morning · 7 AM" />
        <LegendDot className="bg-[#E11D2A]" label="Evening · 7 PM" />
        <span className="text-[#A3A3A3]">IST</span>
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
      className="p-2 rounded-lg hover:bg-[#F5F5F5] text-[#737373] hover:text-[#000000] transition-colors"
    >
      {label === "Previous" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${className}`} />
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
  return (
    <div
      className={`rounded-md px-2 py-1 text-[10px] font-semibold truncate ${sessionBatchColor(occ.session)} ${
        compact ? "leading-tight" : ""
      }`}
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
              className={`min-h-[88px] md:min-h-[100px] p-1.5 md:p-2 text-left bg-white transition-colors hover:bg-[#FAFAF6] ${
                !inMonth ? "opacity-40" : ""
              } ${isSelected ? "ring-2 ring-inset ring-[#E11D2A]" : ""}`}
            >
              <div
                className={`text-xs font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
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
    <div className="overflow-x-auto">
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
                className={`text-lg font-serif mt-0.5 ${
                  isToday(day) ? "text-[#E11D2A]" : "text-[#000000]"
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
                      className={`absolute left-1 right-1 rounded-lg px-2 py-1.5 text-[10px] leading-snug overflow-hidden shadow-sm ${sessionBatchColor(occ.session)}`}
                      style={{ top: `${top}px`, height: `${Math.max(height, 40)}px` }}
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
          className="p-2 rounded-lg hover:bg-[#F5F5F5]"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#737373]">
            {format(date, "EEEE")}
          </div>
          <div className="font-serif text-3xl mt-1">{format(date, "d MMMM yyyy")}</div>
        </div>
        <button
          type="button"
          onClick={() => onShift(addDays(date, 1))}
          className="p-2 rounded-lg hover:bg-[#F5F5F5]"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {occs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[#737373] text-sm">
          No live sessions scheduled this day.
          <br />
          <span className="text-xs mt-2 block">
            Morning Mon · Wed · Fri · Evening Tue · Thu · Sat
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {occs.map((occ) => (
            <div
              key={occ.session.id}
              className="rounded-xl border border-[var(--border)] p-5 bg-white hover:border-[#FCA5A5] transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-block text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full mb-2 ${sessionBatchColor(occ.session)}`}
                  >
                    {sessionBatchLabel(occ.session)}
                  </span>
                  <h3 className="font-serif text-2xl">
                    Lean Kettlebell — {sessionBatchLabel(occ.session)}
                  </h3>
                  <p className="text-sm text-[#737373] mt-1">
                    {formatSessionTime(occ.session.start_time)} · {occ.session.duration_minutes} min ·
                    IST
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={occ.session.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] text-white text-xs font-medium"
                  >
                    <Play size={14} /> Host
                  </a>
                  <a
                    href={occ.session.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-xs"
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
