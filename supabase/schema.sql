-- Lean Kettlebell — run in Supabase SQL Editor (Dashboard → SQL → New query)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('member', 'coach', 'admin')),
  created_at timestamptz not null default now()
);

-- Memberships
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product text not null default 'lean_kettlebell',
  plan text not null default 'monthly' check (plan in ('monthly', 'quarterly', 'founding')),
  status text not null default 'pending' check (status in ('pending', 'active', 'past_due', 'cancelled', 'expired')),
  amount_inr integer,
  razorpay_subscription_id text,
  razorpay_payment_id text,
  started_at timestamptz,
  renews_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, product)
);

-- Onboarding progress
create table if not exists public.onboarding (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  foundations_booked_at timestamptz,
  foundations_completed_at timestamptz,
  whatsapp_joined boolean not null default false
);

-- Pre-signup enrollment from /join (before Razorpay goes live)
create table if not exists public.enrollment_intents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  phone text,
  plan text not null default 'monthly' check (plan in ('monthly', 'quarterly', 'founding')),
  amount_inr integer not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'account_created', 'cancelled')),
  payment_method text not null default 'manual' check (payment_method in ('manual', 'razorpay')),
  payment_confirmed_at timestamptz,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enrollment_intents_email_idx on public.enrollment_intents (lower(email));
create index if not exists enrollment_intents_status_idx on public.enrollment_intents (status);

-- Live session config (Mon / Wed / Sat)
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null,
  title text not null,
  session_type text not null,
  focus text,
  start_time text not null,
  timezone text not null default 'Asia/Kolkata',
  duration_minutes integer not null default 45,
  join_url text not null,
  sort_order integer not null default 0
);

-- Recordings library
create table if not exists public.recordings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  session_type text not null,
  video_url text not null,
  thumbnail_url text,
  duration text,
  recorded_at timestamptz not null default now(),
  expires_at timestamptz
);

-- Kettlebell circuits
create table if not exists public.circuits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration text,
  rounds text,
  difficulty text,
  exercises jsonb not null default '[]',
  video_url text,
  sort_order integer not null default 0
);

-- Site / portal config (singleton rows by key)
create table if not exists public.site_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  intent_plan text;
  intent_amount integer;
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );

  select plan, amount_inr
  into intent_plan, intent_amount
  from public.enrollment_intents
  where lower(email) = lower(new.email)
    and status = 'pending_payment'
  order by created_at desc
  limit 1;

  insert into public.memberships (user_id, status, plan, amount_inr)
  values (
    new.id,
    'pending',
    coalesce(intent_plan, 'monthly'),
    intent_amount
  );

  if intent_plan is not null then
    update public.enrollment_intents
    set status = 'account_created', updated_at = now()
    where lower(email) = lower(new.email) and status = 'pending_payment';
  end if;

  insert into public.onboarding (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS helper functions (security definer avoids infinite recursion in policies)
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

-- RLS
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.onboarding enable row level security;
alter table public.enrollment_intents enable row level security;
alter table public.live_sessions enable row level security;
alter table public.recordings enable row level security;
alter table public.circuits enable row level security;
alter table public.site_config enable row level security;

-- Profiles: read own; coaches read all
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_select_coach" on public.profiles for select using (public.is_coach_or_admin());
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Memberships: members read own; coaches read/update all
create policy "memberships_select_own" on public.memberships for select using (auth.uid() = user_id);
create policy "memberships_select_coach" on public.memberships for select using (public.is_coach_or_admin());
create policy "memberships_update_coach" on public.memberships for update using (public.is_coach_or_admin());

-- Onboarding: own row
create policy "onboarding_select_own" on public.onboarding for select using (auth.uid() = user_id);
create policy "onboarding_update_own" on public.onboarding for update using (auth.uid() = user_id);
create policy "onboarding_select_coach" on public.onboarding for select using (public.is_coach_or_admin());

create policy "enrollment_intents_coach_read" on public.enrollment_intents
  for select using (public.is_coach_or_admin());

-- Content: active members + coaches can read
create policy "live_sessions_active_members" on public.live_sessions for select using (
  public.has_active_membership() or public.is_coach_or_admin()
);

create policy "recordings_active_members" on public.recordings for select using (
  public.has_active_membership() or public.is_coach_or_admin()
);

create policy "circuits_active_members" on public.circuits for select using (
  public.has_active_membership() or public.is_coach_or_admin()
);

create policy "site_config_active_members" on public.site_config for select using (
  public.has_active_membership() or public.is_coach_or_admin()
);

-- Coach write on content tables
create policy "live_sessions_coach_write" on public.live_sessions for all using (public.is_coach_or_admin());

create policy "recordings_coach_write" on public.recordings for all using (public.is_coach_or_admin());

create policy "circuits_coach_write" on public.circuits for all using (public.is_coach_or_admin());

create policy "site_config_coach_write" on public.site_config for all using (public.is_coach_or_admin());

-- Seed content (safe to re-run with on conflict)
insert into public.live_sessions (day_of_week, title, session_type, focus, start_time, join_url, sort_order) values
  ('Monday', 'Strength', 'Strength', 'Heavy KB · Carries · Presses · Squats', '07:00', 'https://meet.google.com/demo-lean-kettlebell', 1),
  ('Wednesday', 'Conditioning', 'Conditioning', 'EMOMs · Intervals · Complexes · HR work', '07:00', 'https://meet.google.com/demo-lean-kettlebell', 2),
  ('Saturday', 'Hybrid Athlete', 'Hybrid', 'Power · Core · Mobility · KB flow', '08:00', 'https://meet.google.com/demo-lean-kettlebell', 3)
on conflict do nothing;

insert into public.site_config (key, value) values
  ('whatsapp_invite_url', 'https://chat.whatsapp.com/demo-lean-kettlebell'),
  ('foundations_calendly_url', 'https://calendly.com/apex-coaching'),
  ('cohort_start_date', 'April 2026')
on conflict (key) do update set value = excluded.value;

insert into public.circuits (name, description, duration, rounds, difficulty, exercises, sort_order) values
  ('The Engine Builder', 'Build conditioning without sacrificing technique.', '20 min', '4 rounds', 'Intermediate', '["KB Swings × 20","Goblet Squats × 12","Push Press × 10","Rest 60s"]'::jsonb, 1),
  ('Strength Complex A', 'Heavy, controlled complex work.', '25 min', '5 sets', 'Intermediate', '["Clean × 5","Front Squat × 5","Press × 5","Rest 90s"]'::jsonb, 2),
  ('Travel KB Flow', 'Hotel-friendly. Keep the habit alive on the road.', '15 min', '3 rounds', 'All levels', '["Halos × 10/side","Goblet Squat × 15","Single-arm Row × 12"]'::jsonb, 3),
  ('Hybrid Finisher', 'Power, engine, and mental grit.', '18 min', 'EMOM 18', 'Advanced', '["Min 0: Swings × 15","Min 1: Cleans × 8","Min 2: Rest"]'::jsonb, 4),
  ('Mobility & Activation', 'Pre-session prep or recovery day.', '12 min', '2 rounds', 'All levels', '["World''s Greatest Stretch","KB Arm Bar","Hip CARs"]'::jsonb, 5)
on conflict do nothing;

insert into public.recordings (title, session_type, video_url, thumbnail_url, duration, recorded_at) values
  ('Strength — Heavy KB & Carries', 'Strength', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70&auto=format&fit=crop', '47 min', now() - interval '7 days'),
  ('Conditioning — EMOM Complex', 'Conditioning', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70&auto=format&fit=crop', '44 min', now() - interval '5 days'),
  ('Hybrid Athlete — Power & Flow', 'Hybrid', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=70&auto=format&fit=crop', '46 min', now() - interval '2 days'),
  ('Foundations — Swing & Clean Mechanics', 'Foundations', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70&auto=format&fit=crop', '58 min', now() - interval '12 days')
on conflict do nothing;
