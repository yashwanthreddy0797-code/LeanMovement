-- Contact form inbox — run once in Supabase SQL Editor
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

-- Inserts only via service role (server); no public insert policy.
