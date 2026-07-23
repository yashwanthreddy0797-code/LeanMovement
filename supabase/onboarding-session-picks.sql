-- Member weekly session picks (portal, after payment)
alter table public.onboarding
  add column if not exists session_ids text[] not null default '{}';

alter table public.onboarding
  add column if not exists sessions_selected_at timestamptz;
