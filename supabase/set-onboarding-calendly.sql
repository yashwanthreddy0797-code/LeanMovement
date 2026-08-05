-- Lean Movement onboarding call (Calendly)
-- https://calendly.com/coach-leanmovement/30min

insert into public.site_config (key, value, updated_at)
values (
  'foundations_calendly_url',
  'https://calendly.com/coach-leanmovement/30min',
  now()
)
on conflict (key) do update
set value = excluded.value, updated_at = now();
