-- Final Cleanup for Personal Email Transition
-- Removing bundyglenn@gmail.com to allow for fresh Employer registration

DO $$
BEGIN
    -- 1. Remove from profiles (should cascade to related tables like applications)
    DELETE FROM public.profiles WHERE email = 'bundyglenn@gmail.com';
    
    -- 2. Remove from auth.users (Core identity)
    -- This ensures the email is free for a new signup
    DELETE FROM auth.users WHERE email = 'bundyglenn@gmail.com';
    
    RAISE NOTICE 'CLEANUP_COMPLETE: bundyglenn@gmail.com removed from AURA_CORE';
END
$$;
