-- Post-payment member intake — run once in Supabase SQL Editor
create table if not exists public.member_intake (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  full_name text not null,
  age smallint,
  height text,
  weight text,
  occupation text,
  goal text not null,
  biggest_struggle text,
  training_experience text not null,
  training_days_per_week text not null,
  why_now text,
  instagram_handle text,
  phone text,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_intake enable row level security;

drop policy if exists "member_intake_select_own" on public.member_intake;
create policy "member_intake_select_own" on public.member_intake
  for select using (auth.uid() = user_id);

drop policy if exists "member_intake_select_coach" on public.member_intake;
create policy "member_intake_select_coach" on public.member_intake
  for select using (public.is_coach_or_admin());

-- Inserts/updates via service role (server functions) only.
