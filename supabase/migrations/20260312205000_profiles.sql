create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'employer', 'candidate')) default 'candidate',
  company_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can view own profile'
  ) then
    execute 'create policy "Users can view own profile" on public.profiles
      for select using (auth.uid() = id)';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update own profile'
  ) then
    execute 'create policy "Users can update own profile" on public.profiles
      for update using (auth.uid() = id)';
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'handle_role_update'
  ) then
    execute 'drop trigger if exists on_role_update on public.profiles';
    execute 'create trigger on_role_update
      after insert or update of role on public.profiles
      for each row execute function public.handle_role_update()';
  end if;
end;
$$;
