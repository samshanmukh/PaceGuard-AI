create extension if not exists pgcrypto;

create table if not exists public.paceguard_events (
  id uuid primary key default gen_random_uuid(),
  team_id text not null,
  athlete_id text not null,
  event_type text not null check (event_type in ('plan.approved', 'checkin.created', 'checkin.requested')),
  actor_role text not null check (actor_role in ('coach', 'athlete')),
  payload jsonb not null default '{}'::jsonb,
  consent_scope text not null default 'coach:read',
  created_at timestamptz not null default now()
);

create index if not exists paceguard_events_team_created_idx
  on public.paceguard_events (team_id, created_at desc);
create index if not exists paceguard_events_athlete_created_idx
  on public.paceguard_events (athlete_id, created_at desc);

-- Publish inserts from an InsForge database trigger to channel paceguard:<team_id>
-- with event name paceguard_event. Configure the trigger in the InsForge dashboard
-- after applying this migration so browser subscribers receive persisted events.
