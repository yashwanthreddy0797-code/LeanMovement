-- Run this in Supabase SQL Editor if you see "infinite recursion" on profiles policies

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

-- Drop policies that cause recursion
drop policy if exists "profiles_select_coach" on public.profiles;
drop policy if exists "memberships_select_coach" on public.memberships;
drop policy if exists "memberships_update_coach" on public.memberships;
drop policy if exists "onboarding_select_coach" on public.onboarding;
drop policy if exists "live_sessions_active_members" on public.live_sessions;
drop policy if exists "recordings_active_members" on public.recordings;
drop policy if exists "circuits_active_members" on public.circuits;
drop policy if exists "site_config_active_members" on public.site_config;
drop policy if exists "live_sessions_coach_write" on public.live_sessions;
drop policy if exists "recordings_coach_write" on public.recordings;
drop policy if exists "circuits_coach_write" on public.circuits;
drop policy if exists "site_config_coach_write" on public.site_config;

-- Recreate with helper functions (no recursion)
create policy "profiles_select_coach" on public.profiles for select using (public.is_coach_or_admin());

create policy "memberships_select_coach" on public.memberships for select using (public.is_coach_or_admin());
create policy "memberships_update_coach" on public.memberships for update using (public.is_coach_or_admin());

create policy "onboarding_select_coach" on public.onboarding for select using (public.is_coach_or_admin());

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

create policy "live_sessions_coach_write" on public.live_sessions for all using (public.is_coach_or_admin());
create policy "recordings_coach_write" on public.recordings for all using (public.is_coach_or_admin());
create policy "circuits_coach_write" on public.circuits for all using (public.is_coach_or_admin());
create policy "site_config_coach_write" on public.site_config for all using (public.is_coach_or_admin());
