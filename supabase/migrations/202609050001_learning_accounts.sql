begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

revoke all on function public.touch_updated_at() from public, anon, authenticated;

create table if not exists public.learner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_language text not null default 'en'
    check (preferred_language in ('ar', 'en')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learning_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_record_id text not null
    check (char_length(client_record_id) between 1 and 120)
    check (client_record_id ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'),
  record_type text not null
    check (record_type in ('scenario', 'question-set')),
  activity_id text not null
    check (char_length(activity_id) between 1 and 120)
    check (activity_id ~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'),
  payload jsonb not null
    check (jsonb_typeof(payload) = 'object')
    check (octet_length(payload::text) <= 65536),
  completed_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, client_record_id)
);

comment on table public.learning_records is
  'Learner-owned, self-reported formative history. Never use as a credential, verified score, licensing decision, or paid entitlement.';
comment on column public.learning_records.payload is
  'Minimal structured identifiers and answers only. Never store patient data, free text, tokens, passwords, or payment data.';

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_code text not null
    check (plan_code in ('free', 'saudi-nursing', 'international-rn', 'computerized-practice', 'institutional')),
  status text not null
    check (status in ('trial', 'active', 'past_due', 'canceled', 'expired')),
  access_until timestamptz,
  source text not null default 'manual'
    check (source in ('manual', 'payment-webhook', 'institutional')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on table public.entitlements is
  'Server-managed access state. Browser clients may read their own row but must never write entitlement fields.';

create index if not exists learning_records_user_completed_idx
  on public.learning_records (user_id, completed_at desc);

drop trigger if exists learner_profiles_touch_updated_at on public.learner_profiles;
create trigger learner_profiles_touch_updated_at
before update on public.learner_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists learning_records_touch_updated_at on public.learning_records;
create trigger learning_records_touch_updated_at
before update on public.learning_records
for each row execute function public.touch_updated_at();

drop trigger if exists entitlements_touch_updated_at on public.entitlements;
create trigger entitlements_touch_updated_at
before update on public.entitlements
for each row execute function public.touch_updated_at();

alter table public.learner_profiles enable row level security;
alter table public.learner_profiles force row level security;
alter table public.learning_records enable row level security;
alter table public.learning_records force row level security;
alter table public.entitlements enable row level security;
alter table public.entitlements force row level security;

revoke all on table public.learner_profiles from anon, authenticated;
revoke all on table public.learning_records from anon, authenticated;
revoke all on table public.entitlements from anon, authenticated;

grant select, insert, update on table public.learner_profiles to authenticated;
grant select, insert, update, delete on table public.learning_records to authenticated;
grant select on table public.entitlements to authenticated;

drop policy if exists learner_profiles_select_own on public.learner_profiles;
create policy learner_profiles_select_own
on public.learner_profiles
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists learner_profiles_insert_own on public.learner_profiles;
create policy learner_profiles_insert_own
on public.learner_profiles
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists learner_profiles_update_own on public.learner_profiles;
create policy learner_profiles_update_own
on public.learner_profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists learning_records_select_own on public.learning_records;
create policy learning_records_select_own
on public.learning_records
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists learning_records_insert_own on public.learning_records;
create policy learning_records_insert_own
on public.learning_records
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists learning_records_update_own on public.learning_records;
create policy learning_records_update_own
on public.learning_records
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists learning_records_delete_own on public.learning_records;
create policy learning_records_delete_own
on public.learning_records
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own
on public.entitlements
for select to authenticated
using ((select auth.uid()) = user_id);

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

commit;
