create table if not exists public.vacancies (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  compliance_score integer default 0,
  status text check (status in ('draft', 'published', 'flagged')) default 'draft',
  created_at timestamptz default now()
);

alter table public.vacancies enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'vacancies'
      and policyname = 'Employers can manage own vacancies'
  ) then
    execute 'create policy "Employers can manage own vacancies" on public.vacancies
      for all using (auth.uid() = employer_id)';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'vacancies'
      and policyname = 'Anyone can view published vacancies'
  ) then
    execute 'create policy "Anyone can view published vacancies" on public.vacancies
      for select using (status = ''published'')';
  end if;
end;
$$;
