-- Add Platform Owner flag to profiles
alter table public.profiles 
add column if not exists is_platform_owner boolean default false;

-- Update RLS to allow owners full access
create policy "Owners have full access to profiles"
on public.profiles for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_platform_owner = true
  )
);

create policy "Owners have full access to vacancies"
on public.vacancies for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_platform_owner = true
  )
);

create policy "Owners have full access to applications"
on public.applications for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_platform_owner = true
  )
);

create policy "Owners have full access to ledger"
on public.ledger for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and is_platform_owner = true
  )
);
