-- 1. Purge the recursive policies
DROP POLICY IF EXISTS "Users can view all profiles if employer" ON public.profiles;
DROP POLICY IF EXISTS "Employers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Establish Base Sovereign Access (Self)
CREATE POLICY "Users can view own profile"
  ON public.profiles 
  FOR SELECT 
  USING ( auth.uid() = id );

-- 3. Establish the Architect/Employer Override (Using JWT instead of table query)
-- This extracts the role from the token, completely eliminating the recursion loop.
CREATE POLICY "Employers can view all profiles"
  ON public.profiles 
  FOR SELECT 
  USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'employer' );

-- 4. Ensure RLS is enforced
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
