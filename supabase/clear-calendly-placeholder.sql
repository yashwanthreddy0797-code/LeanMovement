-- Clear demo/placeholder Foundations Calendly URL so the member popup
-- only appears after a real coach event link is saved in Coach → Settings.
update public.site_config
set value = ''
where key = 'foundations_calendly_url'
  and value in (
    'https://calendly.com/apex-coaching',
    'https://calendly.com/demo'
  );
