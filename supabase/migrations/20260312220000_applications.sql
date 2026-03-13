create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.vacancies(id) on delete cascade not null,
  candidate_id uuid references public.profiles(id) on delete cascade not null,
  match_score integer not null,
  ai_analysis jsonb,
  status text check (status in ('applied', 'shortlisted', 'rejected', 'interview', 'offered', 'hired')) default 'applied',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(job_id, candidate_id)
);

alter table public.applications enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'applications'
      and policyname = 'Candidates can view and manage own applications'
  ) then
    execute 'create policy "Candidates can view and manage own applications" on public.applications
      for all using (auth.uid() = candidate_id)';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'applications'
      and policyname = 'Employers can view applications for their jobs'
  ) then
    execute 'create policy "Employers can view applications for their jobs" on public.applications
      for select using (
        exists (
          select 1 from public.vacancies
          where vacancies.id = applications.job_id
            and vacancies.employer_id = auth.uid()
        )
      )';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'applications'
      and policyname = 'Employers can update status of applications for their jobs'
  ) then
    execute 'create policy "Employers can update status of applications for their jobs" on public.applications
      for update using (
        exists (
          select 1 from public.vacancies
          where vacancies.id = applications.job_id
            and vacancies.employer_id = auth.uid()
        )
      )';
  end if;
end;
$$;
