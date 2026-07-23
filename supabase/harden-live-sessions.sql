-- Harden live_sessions for Lean Kettlebell Morning / Evening Zoom batches.
-- Safe to re-run. Apply via SQL Editor or: npm run supabase:harden-sessions

-- Helper functions (no RLS recursion)
create or replace function public.is_coach_or_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('coach', 'admin')
  );
$$;

create or replace function public.has_active_membership()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid() and status = 'active'
  );
$$;

alter table public.live_sessions enable row level security;

-- One session row per weekday
create unique index if not exists live_sessions_day_of_week_uidx
  on public.live_sessions (day_of_week);

-- Sensible defaults
alter table public.live_sessions
  alter column duration_minutes set default 60;

alter table public.live_sessions
  alter column timezone set default 'Asia/Kolkata';

-- Drop + recreate policies so USING + WITH CHECK are explicit
drop policy if exists "live_sessions_active_members" on public.live_sessions;
drop policy if exists "live_sessions_coach_write" on public.live_sessions;
drop policy if exists "live_sessions_coach_insert" on public.live_sessions;
drop policy if exists "live_sessions_coach_update" on public.live_sessions;
drop policy if exists "live_sessions_coach_delete" on public.live_sessions;

-- Paid members + coaches can read Zoom links
create policy "live_sessions_active_members"
  on public.live_sessions
  for select
  using (public.has_active_membership() or public.is_coach_or_admin());

-- Coaches manage schedule
create policy "live_sessions_coach_insert"
  on public.live_sessions
  for insert
  with check (public.is_coach_or_admin());

create policy "live_sessions_coach_update"
  on public.live_sessions
  for update
  using (public.is_coach_or_admin())
  with check (public.is_coach_or_admin());

create policy "live_sessions_coach_delete"
  on public.live_sessions
  for delete
  using (public.is_coach_or_admin());

-- Realtime: member dashboards refresh when coach saves a link
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'live_sessions'
  ) then
    alter publication supabase_realtime add table public.live_sessions;
  end if;
end $$;

-- Ensure the three morning Zoom sessions exist (idempotent upsert by day)
delete from public.live_sessions
where day_of_week in ('Monday', 'Wednesday', 'Friday');

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
