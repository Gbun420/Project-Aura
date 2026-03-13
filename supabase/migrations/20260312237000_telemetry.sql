-- Day 1 Telemetry and Event Tracking
create table if not exists public.system_telemetry (
  id uuid default gen_random_uuid() primary key,
  registrations_count integer,
  employer_count integer,
  candidate_count integer,
  pro_subscriptions_count integer,
  neural_matches_count integer,
  avg_api_latency_ms float,
  error_rate float,
  created_at timestamptz default now()
);

create table if not exists public.match_events (
  id uuid default gen_random_uuid() primary key,
  candidate_id uuid references public.profiles(id),
  job_id uuid references public.vacancies(id),
  match_score integer,
  is_blurred boolean default true,
  created_at timestamptz default now()
);

alter table public.system_telemetry enable row level security;
alter table public.match_events enable row level security;

-- Only admins can view telemetry
create policy "Admins can view telemetry" 
on public.system_telemetry for select 
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
