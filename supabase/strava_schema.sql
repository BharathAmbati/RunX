-- Strava integration schema for RunX
--
-- Apply this in your Supabase SQL Editor (or via migrations if you use the Supabase CLI).
-- It creates:
-- - public.strava_accounts: per-user Strava OAuth tokens
-- - public.runs: imported Strava activities (runs)
--
-- Notes:
-- - Tokens are sensitive; keep RLS enabled and only allow users to access their own rows.
-- - You can rotate your Strava client secret at any time; users may need to reconnect.

begin;

-- 1) Strava accounts (OAuth tokens per app user)
create table if not exists public.strava_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  athlete_id bigint not null,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null, -- epoch seconds
  scope text,
  token_type text,

  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint strava_accounts_user_id_key unique (user_id),
  constraint strava_accounts_athlete_id_key unique (athlete_id)
);

alter table public.strava_accounts enable row level security;

do $$
begin
  -- Read own token row
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'strava_accounts' and policyname = 'strava_accounts_select_own'
  ) then
    create policy strava_accounts_select_own on public.strava_accounts
      for select to authenticated
      using (auth.uid() = user_id);
  end if;

  -- Insert own token row
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'strava_accounts' and policyname = 'strava_accounts_insert_own'
  ) then
    create policy strava_accounts_insert_own on public.strava_accounts
      for insert to authenticated
      with check (auth.uid() = user_id);
  end if;

  -- Update own token row
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'strava_accounts' and policyname = 'strava_accounts_update_own'
  ) then
    create policy strava_accounts_update_own on public.strava_accounts
      for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  -- Delete own token row
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'strava_accounts' and policyname = 'strava_accounts_delete_own'
  ) then
    create policy strava_accounts_delete_own on public.strava_accounts
      for delete to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists strava_accounts_user_id_idx on public.strava_accounts (user_id);

-- 2) Imported activities (runs)
create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  strava_activity_id bigint not null,
  name text,
  sport_type text,

  start_date timestamptz not null,
  start_date_local timestamptz,
  timezone text,

  distance_m double precision not null default 0,
  moving_time_s integer not null default 0,
  elapsed_time_s integer,
  total_elevation_gain_m double precision,
  average_speed_mps double precision,
  max_speed_mps double precision,
  calories double precision,
  average_heartrate_bpm double precision,
  max_heartrate_bpm double precision,

  map_summary_polyline text,
  raw jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint runs_user_strava_activity_id_key unique (user_id, strava_activity_id)
);

alter table public.runs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'runs' and policyname = 'runs_select_own'
  ) then
    create policy runs_select_own on public.runs
      for select to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'runs' and policyname = 'runs_insert_own'
  ) then
    create policy runs_insert_own on public.runs
      for insert to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'runs' and policyname = 'runs_update_own'
  ) then
    create policy runs_update_own on public.runs
      for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'runs' and policyname = 'runs_delete_own'
  ) then
    create policy runs_delete_own on public.runs
      for delete to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists runs_user_start_date_idx on public.runs (user_id, start_date desc);

commit;

