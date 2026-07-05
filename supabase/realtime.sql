-- Enable instant sync: when coach updates live_sessions, member dashboards refresh live.
-- Run once in Supabase SQL Editor (Dashboard → SQL → New query).

alter publication supabase_realtime add table public.live_sessions;
