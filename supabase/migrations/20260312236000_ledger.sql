-- Aura Financial Ledger for Fee Protection and Success Audits
create table if not exists public.ledger (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.applications(id) on delete cascade not null,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  final_salary numeric(12, 2),
  success_hash text not null, -- Cryptographic proof of the hire
  neural_match_snapshot integer, -- The score at time of hire
  created_at timestamptz default now()
);

alter table public.ledger enable row level security;

-- Only employers can view their own success records
create policy "Employers can view own ledger entries" 
on public.ledger for select 
using (auth.uid() = employer_id);

-- Admins can see all records
create policy "Admins can view all ledger entries" 
on public.ledger for select 
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
