-- One-time cleanup after first Zoom sync:
-- 1) Remove seed YouTube placeholder recordings (rickroll embeds)
-- 2) Re-open the 7-day member window for synced Zoom rows so they appear in member Videos
-- Run in Supabase → SQL Editor.

delete from public.recordings
where coalesce(source, 'manual') = 'manual'
  and video_url like '%youtube.com/embed/dQw4w9WgXcQ%';

update public.recordings
set expires_at = now() + interval '7 days'
where source = 'zoom'
  and (expires_at is null or expires_at <= now());
