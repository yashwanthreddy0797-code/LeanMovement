-- Weekly session picks + attendance (portal)
create table if not exists public.member_weekly_picks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  session_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.session_attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  session_slot_id text not null,
  attended_at timestamptz not null default now(),
  unique (user_id, week_start, session_slot_id)
);

create index if not exists member_weekly_picks_user_week_idx
  on public.member_weekly_picks (user_id, week_start desc);

create index if not exists session_attendance_user_week_idx
  on public.session_attendance (user_id, week_start desc);

alter table public.member_weekly_picks enable row level security;
alter table public.session_attendance enable row level security;

create policy "member_weekly_picks_select_own" on public.member_weekly_picks
  for select using (auth.uid() = user_id);
create policy "member_weekly_picks_insert_own" on public.member_weekly_picks
  for insert with check (auth.uid() = user_id);
create policy "member_weekly_picks_update_own" on public.member_weekly_picks
  for update using (auth.uid() = user_id);
create policy "member_weekly_picks_coach" on public.member_weekly_picks
  for select using (public.is_coach_or_admin());

create policy "session_attendance_select_own" on public.session_attendance
  for select using (auth.uid() = user_id);
create policy "session_attendance_insert_own" on public.session_attendance
  for insert with check (auth.uid() = user_id);
create policy "session_attendance_coach" on public.session_attendance
  for select using (public.is_coach_or_admin());
