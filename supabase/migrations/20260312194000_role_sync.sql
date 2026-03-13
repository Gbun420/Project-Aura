create or replace function public.handle_role_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new.role)
  )
  where id = new.id;

  return new;
end;
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'profiles'
  ) then
    execute 'drop trigger if exists on_role_update on public.profiles';
    execute 'create trigger on_role_update
      after insert or update of role on public.profiles
      for each row execute function public.handle_role_update()';
  end if;
end;
$$;
