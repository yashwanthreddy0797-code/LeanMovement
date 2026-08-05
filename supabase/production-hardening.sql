-- Run once in Supabase SQL Editor for production hardening.

-- 1) New signups are always members (coach via scripts/create-coach.mjs only)
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
    'member'
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

-- 2) Members cannot self-promote to coach via profile update
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );
