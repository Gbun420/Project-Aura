-- Trust Engine Upgrade: Powering the 2026 "Verified Active" Signaling
alter table public.vacancies 
add column if not exists last_activity_at timestamptz default now(),
add column if not exists response_rate float default 0,
add column if not exists total_applications_processed integer default 0;

-- Index for performance on active job filtering
create index if not exists idx_vacancies_last_activity on public.vacancies(last_activity_at desc);

comment on column public.vacancies.last_activity_at is 'Tracks when an employer last interacted with applicants for this role.';
comment on column public.vacancies.response_rate is 'The percentage of applicants that have received a status update beyond "applied".';
