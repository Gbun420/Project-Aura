-- AURA_OS: SOVEREIGN_IDENTITY_REPAIR v1.0
-- Target: bundyglenn@gmail.com

-- 1. Restore the Triggers (If dropped or inactive)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_role_update ON public.profiles;
CREATE TRIGGER on_role_update
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_role_update();

-- 2. Force Metadata Reconstruction for the JWT
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb), 
  '{role}', 
  '"employer"'
)
WHERE email = 'bundyglenn@gmail.com';

-- 3. Force Profile Realignment
-- This ensures the public.profiles table matches the auth.users role
UPDATE public.profiles 
SET role = 'employer' 
WHERE email = 'bundyglenn@gmail.com';

-- 4. Invalidate Previous Stale Sessions
UPDATE auth.users 
SET last_sign_in_at = NULL 
WHERE email = 'bundyglenn@gmail.com';
