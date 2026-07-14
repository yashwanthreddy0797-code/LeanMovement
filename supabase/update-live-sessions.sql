-- Replace demo Mon/Wed/Sat Meet links with Lean Kettlebell Zoom batches.
-- Morning: Mon / Wed / Fri 7:00 AM IST
-- Evening: Tue / Thu / Sat 7:00 PM IST
--
-- Run in Supabase → SQL Editor, or:
--   npm run supabase:update-sessions

truncate table public.live_sessions;

insert into public.live_sessions
  (day_of_week, title, session_type, focus, start_time, timezone, duration_minutes, join_url, sort_order)
values
  (
    'Monday',
    'Lean Kettlebell - Morning',
    'Morning',
    null,
    '07:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1',
    1
  ),
  (
    'Tuesday',
    'Lean Kettlebell - Evening',
    'Evening',
    null,
    '19:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1',
    2
  ),
  (
    'Wednesday',
    'Lean Kettlebell - Morning',
    'Morning',
    null,
    '07:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1',
    3
  ),
  (
    'Thursday',
    'Lean Kettlebell - Evening',
    'Evening',
    null,
    '19:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1',
    4
  ),
  (
    'Friday',
    'Lean Kettlebell - Morning',
    'Morning',
    null,
    '07:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1',
    5
  ),
  (
    'Saturday',
    'Lean Kettlebell - Evening',
    'Evening',
    null,
    '19:00',
    'Asia/Kolkata',
    60,
    'https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1',
    6
  );
