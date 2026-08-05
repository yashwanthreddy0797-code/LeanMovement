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
  whatsapp_joined boolean not null default false,
  session_ids text[] not null default '{}',
  sessions_selected_at timestamptz
);

-- Weekly session picks + attendance
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

-- Live session config (Morning Mon/Wed/Fri · Evening Tue/Thu/Sat)
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null,
  title text not null,
  session_type text not null,
  focus text,
  start_time text not null,
  timezone text not null default 'Asia/Kolkata',
  duration_minutes integer not null default 60,
  join_url text not null,
  sort_order integer not null default 0
);

create unique index if not exists live_sessions_day_of_week_uidx
  on public.live_sessions (day_of_week);

-- Recordings library
create table if not exists public.recordings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  session_type text not null,
  video_url text not null,
  thumbnail_url text,
  duration text,
  recorded_at timestamptz not null default now(),
  expires_at timestamptz,
  source text not null default 'manual',
  external_id text,
  meeting_id text
);

create unique index if not exists recordings_external_id_uidx
  on public.recordings (external_id)
  where external_id is not null;

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
alter table public.member_weekly_picks enable row level security;
alter table public.session_attendance enable row level security;
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
create policy "live_sessions_coach_insert" on public.live_sessions for insert with check (public.is_coach_or_admin());
create policy "live_sessions_coach_update" on public.live_sessions for update using (public.is_coach_or_admin()) with check (public.is_coach_or_admin());
create policy "live_sessions_coach_delete" on public.live_sessions for delete using (public.is_coach_or_admin());

create policy "recordings_coach_write" on public.recordings for all using (public.is_coach_or_admin());

create policy "circuits_coach_write" on public.circuits for all using (public.is_coach_or_admin());

create policy "site_config_coach_write" on public.site_config for all using (public.is_coach_or_admin());

-- Seed content (safe to re-run with on conflict)
insert into public.live_sessions (day_of_week, title, session_type, focus, start_time, duration_minutes, join_url, sort_order) values
  ('Tuesday', 'Lean Kettlebell - Morning', 'Morning', 'Strength', '06:00', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 1),
  ('Thursday', 'Lean Kettlebell - Morning', 'Morning', 'Endurance', '06:00', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 2),
  ('Saturday', 'Lean Kettlebell - Morning', 'Morning', 'Hybrid', '06:00', 60, 'https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1', 3)
on conflict do nothing;

insert into public.site_config (key, value) values
  ('whatsapp_invite_url', 'https://chat.whatsapp.com/demo-lean-kettlebell'),
  ('foundations_calendly_url', ''),
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

-- Contact form inbox (public form posts via service role only)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  message text not null,
  source text not null default 'contact_page',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_coach_read" on public.contact_messages;
create policy "contact_messages_coach_read" on public.contact_messages
  for select using (public.is_coach_or_admin());

drop policy if exists "contact_messages_coach_update" on public.contact_messages;
create policy "contact_messages_coach_update" on public.contact_messages
  for update using (public.is_coach_or_admin());

-- Post-payment member intake questionnaire
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
