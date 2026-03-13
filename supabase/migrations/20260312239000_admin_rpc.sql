-- Grant full admin access to a user
create or replace function public.grant_admin_access(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Update the profiles table
  update public.profiles
  set 
    role = 'admin',
    is_platform_owner = true,
    subscription_tier = 'pulse_pro'
  where id = target_user_id;

  -- Update auth.users app_metadata for JWT role detection
  update auth.users
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"platform_owner"'
  )
  where id = target_user_id;
end;
$$;
