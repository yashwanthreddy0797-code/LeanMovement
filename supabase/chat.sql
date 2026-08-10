-- Portal 1:1 coach–member chat — run once in Supabase SQL Editor
-- Requires profiles, is_coach_or_admin(), has_active_membership() from schema.sql

create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  coach_id uuid not null references public.profiles(id) on delete cascade,
  member_last_read_at timestamptz,
  coach_last_read_at timestamptz,
  last_message_at timestamptz,
  last_message_preview text,
  created_at timestamptz not null default now(),
  unique (member_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint chat_messages_body_len check (
    char_length(trim(body)) > 0 and char_length(body) <= 2000
  )
);

create index if not exists chat_messages_thread_created_idx
  on public.chat_messages (thread_id, created_at);

create index if not exists chat_threads_last_message_idx
  on public.chat_threads (last_message_at desc nulls last);

create or replace function public.chat_messages_after_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.chat_threads
  set
    last_message_at = new.created_at,
    last_message_preview = left(new.body, 120)
  where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_after_insert on public.chat_messages;
create trigger chat_messages_after_insert
  after insert on public.chat_messages
  for each row execute function public.chat_messages_after_insert();

create or replace function public.is_chat_thread_participant(p_thread_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.chat_threads t
    where t.id = p_thread_id
      and (
        t.member_id = auth.uid()
        or (t.coach_id = auth.uid() and public.is_coach_or_admin())
        or public.is_coach_or_admin()
      )
  );
$$;

-- Members cannot select other profiles; this exposes only the primary coach id.
create or replace function public.get_primary_coach_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id
  from public.profiles
  where role in ('coach', 'admin')
  order by case when role = 'coach' then 0 else 1 end, created_at
  limit 1;
$$;

grant execute on function public.get_primary_coach_id() to authenticated;
grant execute on function public.get_primary_coach_id() to anon;

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "chat_threads_select" on public.chat_threads;
create policy "chat_threads_select" on public.chat_threads
  for select using (
    member_id = auth.uid()
    or public.is_coach_or_admin()
  );

drop policy if exists "chat_threads_insert_member" on public.chat_threads;
create policy "chat_threads_insert_member" on public.chat_threads
  for insert with check (
    member_id = auth.uid()
    and public.has_active_membership()
  );

drop policy if exists "chat_threads_insert_coach" on public.chat_threads;
create policy "chat_threads_insert_coach" on public.chat_threads
  for insert with check (
    public.is_coach_or_admin()
    and coach_id = auth.uid()
  );

drop policy if exists "chat_threads_update_member_read" on public.chat_threads;
create policy "chat_threads_update_member_read" on public.chat_threads
  for update using (member_id = auth.uid())
  with check (member_id = auth.uid());

drop policy if exists "chat_threads_update_coach_read" on public.chat_threads;
create policy "chat_threads_update_coach_read" on public.chat_threads
  for update using (public.is_coach_or_admin())
  with check (public.is_coach_or_admin());

drop policy if exists "chat_messages_select" on public.chat_messages;
create policy "chat_messages_select" on public.chat_messages
  for select using (public.is_chat_thread_participant(thread_id));

drop policy if exists "chat_messages_insert" on public.chat_messages;
create policy "chat_messages_insert" on public.chat_messages
  for insert with check (
    sender_id = auth.uid()
    and public.is_chat_thread_participant(thread_id)
    and (
      public.is_coach_or_admin()
      or public.has_active_membership()
    )
  );

-- Realtime (ignore if already added)
do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.chat_threads;
exception
  when duplicate_object then null;
end $$;
