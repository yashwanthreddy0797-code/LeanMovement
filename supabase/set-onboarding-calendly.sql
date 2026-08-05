-- Paste your Calendly event link after copying from Calendly → Event types → Copy link
-- Example: https://calendly.com/mohith-thotakura/leanmovement-onboarding-call

insert into public.site_config (key, value, updated_at)
values (
  'foundations_calendly_url',
  'PASTE_YOUR_CALENDLY_EVENT_URL_HERE',
  now()
)
on conflict (key) do update
set value = excluded.value, updated_at = now();
