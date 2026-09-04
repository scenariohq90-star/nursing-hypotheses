begin;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.learner_profiles
  alter column created_at set default now(),
  alter column updated_at set default now();
alter table public.learner_profiles
  add column if not exists history_cleared_at timestamptz not null default 'epoch'::timestamptz;
alter table public.learning_records
  alter column created_at set default now(),
  alter column updated_at set default now();
alter table public.entitlements
  alter column created_at set default now(),
  alter column updated_at set default now();

revoke insert, update, delete on table public.learning_records from authenticated;
grant select on table public.learning_records to authenticated;
revoke insert, update on table public.learner_profiles from authenticated;

alter policy learning_records_insert_own
on public.learning_records
with check (false);

alter policy learning_records_update_own
on public.learning_records
using (false)
with check (false);

alter policy learning_records_delete_own
on public.learning_records
using (false);

drop function if exists public.save_learning_records(jsonb);
drop function if exists public.delete_learning_history();

create or replace function public.save_learner_profile(
  p_expected_user_id uuid,
  p_preferred_language text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null or v_user_id <> p_expected_user_id then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_preferred_language is null
     or p_preferred_language not in ('ar', 'en') then
    raise exception 'Invalid preferred language' using errcode = '22023';
  end if;

  insert into public.learner_profiles (user_id, preferred_language)
  values (v_user_id, p_preferred_language)
  on conflict (user_id) do update set
    preferred_language = excluded.preferred_language;
end;
$$;

create or replace function public.save_learning_records(
  p_expected_user_id uuid,
  p_records jsonb
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_record jsonb;
  v_payload jsonb;
  v_client_record_id text;
  v_record_type text;
  v_activity_id text;
  v_completed_at timestamptz;
  v_record_limit integer;
  v_history_cleared_at timestamptz;
  v_saved integer := 0;
begin
  if v_user_id is null or v_user_id <> p_expected_user_id then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_records) <> 'array'
     or jsonb_array_length(p_records) not between 1 and 50 then
    raise exception 'Invalid record batch' using errcode = '22023';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );
  insert into public.learner_profiles (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;
  select history_cleared_at
    into v_history_cleared_at
    from public.learner_profiles
    where user_id = v_user_id
    for update;

  for v_record in
    select value from pg_catalog.jsonb_array_elements(p_records)
  loop
    if jsonb_typeof(v_record) <> 'object'
       or not (v_record ?& array[
         'client_record_id', 'record_type', 'activity_id', 'payload', 'completed_at'
       ])
       or exists (
         select 1
         from pg_catalog.jsonb_object_keys(v_record) as item(key)
         where item.key not in (
           'client_record_id', 'record_type', 'activity_id', 'payload', 'completed_at'
         )
       ) then
      raise exception 'Invalid learning record shape' using errcode = '22023';
    end if;

    v_client_record_id := v_record ->> 'client_record_id';
    v_record_type := v_record ->> 'record_type';
    v_activity_id := v_record ->> 'activity_id';
    v_payload := v_record -> 'payload';

    if v_client_record_id !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
       or v_activity_id !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
       or v_record_type not in ('scenario', 'question-set')
       or jsonb_typeof(v_payload) <> 'object'
       or octet_length(v_payload::text) > 8192
       or v_payload ->> 'id' <> v_client_record_id then
      raise exception 'Invalid learning record values' using errcode = '22023';
    end if;

    begin
      v_completed_at := (v_record ->> 'completed_at')::timestamptz;
    exception when others then
      raise exception 'Invalid completion timestamp' using errcode = '22007';
    end;
    if v_completed_at < now() - interval '5 years'
       or v_completed_at > now() + interval '5 minutes' then
      raise exception 'Completion timestamp outside accepted range' using errcode = '22007';
    end if;
    if v_completed_at <= v_history_cleared_at then
      continue;
    end if;

    if v_record_type = 'scenario' then
      if not (v_payload ?& array[
           'schemaVersion', 'id', 'scenarioId', 'contentVersion', 'completedAt', 'decisions'
         ])
         or exists (
           select 1
           from pg_catalog.jsonb_object_keys(v_payload) as item(key)
           where item.key not in (
             'schemaVersion', 'id', 'scenarioId', 'contentVersion', 'completedAt', 'decisions'
           )
         )
         or v_payload -> 'schemaVersion' <> '1'::jsonb
         or v_payload ->> 'scenarioId' <> v_activity_id
         or (v_payload ->> 'contentVersion') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
         or jsonb_typeof(v_payload -> 'completedAt') <> 'string'
         or jsonb_typeof(v_payload -> 'decisions') <> 'array'
         or jsonb_array_length(v_payload -> 'decisions') not between 1 and 20
         or exists (
           select 1
           from pg_catalog.jsonb_array_elements(v_payload -> 'decisions') as decision(value)
           where jsonb_typeof(decision.value) <> 'object'
              or not (decision.value ?& array['stepId', 'choiceId'])
              or (select count(*) from pg_catalog.jsonb_object_keys(decision.value)) <> 2
              or jsonb_typeof(decision.value -> 'stepId') <> 'string'
              or jsonb_typeof(decision.value -> 'choiceId') <> 'string'
              or (decision.value ->> 'stepId') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
              or (decision.value ->> 'choiceId') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
         ) then
        raise exception 'Invalid scenario payload' using errcode = '22023';
      end if;
      v_record_limit := 500;
    else
      if not (v_payload ?& array[
           'schemaVersion', 'id', 'examId', 'questionIds', 'decisions',
           'bankVersion', 'selectionMode', 'completionReason', 'completedAt'
         ])
         or exists (
           select 1
           from pg_catalog.jsonb_object_keys(v_payload) as item(key)
           where item.key not in (
             'schemaVersion', 'id', 'examId', 'questionIds', 'decisions',
             'bankVersion', 'selectionMode', 'completionReason', 'completedAt'
           )
         )
         or v_payload -> 'schemaVersion' <> '1'::jsonb
         or v_payload ->> 'examId' <> v_activity_id
         or (v_payload ->> 'bankVersion') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
         or v_payload ->> 'selectionMode' not in ('guided', 'manual', 'performance-focus')
         or v_payload ->> 'completionReason' not in ('completed', 'time-expired')
         or jsonb_typeof(v_payload -> 'completedAt') <> 'string'
         or jsonb_typeof(v_payload -> 'questionIds') <> 'array'
         or jsonb_array_length(v_payload -> 'questionIds') not between 1 and 100
         or exists (
           select 1
           from pg_catalog.jsonb_array_elements(v_payload -> 'questionIds') as question(value)
           where jsonb_typeof(question.value) <> 'string'
              or (question.value #>> '{}') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
         )
         or jsonb_typeof(v_payload -> 'decisions') <> 'array'
         or jsonb_array_length(v_payload -> 'decisions') > 100
         or exists (
           select 1
           from pg_catalog.jsonb_array_elements(v_payload -> 'decisions') as decision(value)
           where jsonb_typeof(decision.value) <> 'object'
              or not (decision.value ?& array['questionId', 'selectedOptionId'])
              or (select count(*) from pg_catalog.jsonb_object_keys(decision.value)) <> 2
              or jsonb_typeof(decision.value -> 'questionId') <> 'string'
              or jsonb_typeof(decision.value -> 'selectedOptionId') <> 'string'
              or (decision.value ->> 'questionId') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
              or (
                decision.value ->> 'selectedOptionId' <> ''
                and (decision.value ->> 'selectedOptionId') !~ '^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$'
              )
         ) then
        raise exception 'Invalid question-set payload' using errcode = '22023';
      end if;
      v_record_limit := 100;
    end if;

    v_payload := v_payload || pg_catalog.jsonb_build_object(
      'id', v_client_record_id,
      'completedAt', v_completed_at
    );

    if exists (
      select 1
      from public.learning_records
      where user_id = v_user_id
        and client_record_id = v_client_record_id
        and (record_type <> v_record_type or activity_id <> v_activity_id)
    ) then
      raise exception 'Record identity cannot be changed' using errcode = '22023';
    end if;

    if not exists (
      select 1
      from public.learning_records
      where user_id = v_user_id and client_record_id = v_client_record_id
    ) and (
      select count(*)
      from public.learning_records
      where user_id = v_user_id and record_type = v_record_type
    ) >= v_record_limit then
      delete from public.learning_records
      where id = (
        select id
        from public.learning_records
        where user_id = v_user_id and record_type = v_record_type
        order by completed_at asc, id asc
        limit 1
      );
    end if;

    insert into public.learning_records (
      user_id, client_record_id, record_type, activity_id, payload, completed_at
    ) values (
      v_user_id, v_client_record_id, v_record_type, v_activity_id, v_payload, v_completed_at
    )
    on conflict (user_id, client_record_id) do update set
      payload = excluded.payload,
      completed_at = excluded.completed_at,
      updated_at = now();
    v_saved := v_saved + 1;
  end loop;

  return v_saved;
end;
$$;

create or replace function public.delete_learning_history(p_expected_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_deleted integer;
begin
  if v_user_id is null or v_user_id <> p_expected_user_id then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_user_id::text, 0)
  );
  insert into public.learner_profiles (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;
  update public.learner_profiles
    set history_cleared_at = now()
    where user_id = v_user_id;
  delete from public.learning_records where user_id = v_user_id;
  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.save_learner_profile(uuid, text) from public, anon, authenticated;
revoke all on function public.save_learning_records(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.delete_learning_history(uuid) from public, anon, authenticated;
grant execute on function public.save_learner_profile(uuid, text) to authenticated;
grant execute on function public.save_learning_records(uuid, jsonb) to authenticated;
grant execute on function public.delete_learning_history(uuid) to authenticated;

commit;
