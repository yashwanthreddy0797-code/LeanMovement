-- Lean Program schedule: Tue / Thu / Sat · 6:00–7:00 AM IST (3 sessions/week)
-- Run in Supabase SQL Editor (safe to re-run).

-- ON CONFLICT (day_of_week) needs this unique index — older DBs may not have it yet.
delete from public.live_sessions a
using public.live_sessions b
where a.day_of_week = b.day_of_week
  and a.id > b.id;

create unique index if not exists live_sessions_day_of_week_uidx
  on public.live_sessions (day_of_week);

-- Remove old Mon / Wed / Fri rows
delete from public.live_sessions
where day_of_week in ('Monday', 'Wednesday', 'Friday');

-- Upsert the three morning sessions
insert into public.live_sessions
  (day_of_week, title, session_type, focus, start_time, timezone, duration_minutes, join_url, sort_order)
values
  ('Tuesday', 'Lean Kettlebell - Morning', 'Morning', 'Strength', '06:00', 'Asia/Kolkata', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 1),
  ('Thursday', 'Lean Kettlebell - Morning', 'Morning', 'Endurance', '06:00', 'Asia/Kolkata', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 2),
  ('Saturday', 'Lean Kettlebell - Morning', 'Morning', 'Hybrid', '06:00', 'Asia/Kolkata', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 3)
on conflict (day_of_week) do update set
  title = excluded.title,
  session_type = excluded.session_type,
  focus = excluded.focus,
  start_time = excluded.start_time,
  timezone = excluded.timezone,
  duration_minutes = excluded.duration_minutes,
  join_url = excluded.join_url,
  sort_order = excluded.sort_order;
