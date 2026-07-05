-- Run in Supabase SQL Editor after schema.sql
-- Enrollment intents: captured on /join before payment gateway is live

create table if not exists public.enrollment_intents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  phone text,
  plan text not null default 'monthly' check (plan in ('monthly', 'quarterly', 'founding')),
  amount_inr integer not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'account_created', 'cancelled')),
  payment_method text not null default 'manual' check (payment_method in ('manual', 'razorpay')),
  payment_confirmed_at timestamptz,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enrollment_intents_email_idx on public.enrollment_intents (lower(email));
create index if not exists enrollment_intents_status_idx on public.enrollment_intents (status);

alter table public.enrollment_intents enable row level security;

create policy "enrollment_intents_coach_read" on public.enrollment_intents
  for select using (public.is_coach_or_admin());

-- Link enrollment plan when member signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  intent_plan text;
  intent_amount integer;
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );

  select plan, amount_inr
  into intent_plan, intent_amount
  from public.enrollment_intents
  where lower(email) = lower(new.email)
    and status = 'pending_payment'
  order by created_at desc
  limit 1;

  insert into public.memberships (user_id, status, plan, amount_inr)
  values (
    new.id,
    'pending',
    coalesce(intent_plan, 'monthly'),
    intent_amount
  );

  if intent_plan is not null then
    update public.enrollment_intents
    set status = 'account_created', updated_at = now()
    where lower(email) = lower(new.email) and status = 'pending_payment';
  end if;

  insert into public.onboarding (user_id)
  values (new.id);

  return new;
end;
$$;
