-- HANDOVER RESET — run once in Supabase → SQL Editor before client go-live.
-- Wipes test members and demo inbox content. Keeps coach/admin accounts,
-- live_sessions schedule, site_config (Calendly, WhatsApp), and real Zoom recordings.
--
-- Review the counts below, then run the whole script.

-- Preview what will be removed
select 'member profiles' as item, count(*)::text as count
from public.profiles where role = 'member'
union all
select 'enrollment_intents', count(*)::text from public.enrollment_intents
union all
select 'contact_messages', count(*)::text from public.contact_messages
union all
select 'demo recordings', count(*)::text from public.recordings
where video_url like '%youtube.com/embed/dQw4w9WgXcQ%';

begin;

-- Pre-signup / test checkout rows
delete from public.enrollment_intents;

-- Contact form test messages
delete from public.contact_messages;

-- Seed placeholder videos (rickroll embeds from schema.sql)
delete from public.recordings
where video_url like '%youtube.com/embed/dQw4w9WgXcQ%';

-- Member accounts (cascades: profiles, memberships, onboarding, member_intake,
-- member_weekly_picks, session_attendance)
delete from auth.users
where id in (
  select id from public.profiles where role = 'member'
);

commit;

-- Coach dashboard should now show 0 active · 0 pending until real signups arrive.
