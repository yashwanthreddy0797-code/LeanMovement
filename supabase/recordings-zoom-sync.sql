-- Zoom auto-sync fields for recordings library
-- Run in Supabase → SQL Editor once.

alter table public.recordings
  add column if not exists source text not null default 'manual',
  add column if not exists external_id text,
  add column if not exists meeting_id text;

create unique index if not exists recordings_external_id_uidx
  on public.recordings (external_id)
  where external_id is not null;

comment on column public.recordings.source is 'manual | zoom';
comment on column public.recordings.external_id is 'Zoom recording file id (dedupe key)';
comment on column public.recordings.meeting_id is 'Zoom meeting id / uuid';
