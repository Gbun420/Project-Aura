-- 1. Function to safely remove a user by email
CREATE OR REPLACE FUNCTION public.remove_user_by_email(target_email TEXT)
RETURNS VOID AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID from auth.users (linked to profiles via PK)
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
    
    IF target_user_id IS NOT NULL THEN
        -- Profile will be removed via 'ON DELETE CASCADE' in schema
        -- If cascade is not set, we remove it manually first
        DELETE FROM public.profiles WHERE id = target_user_id;
        
        -- Remove from auth.users
        DELETE FROM auth.users WHERE id = target_user_id;
        
        RAISE NOTICE 'USER_REMOVED: %', target_email;
    ELSE
        RAISE NOTICE 'USER_NOT_FOUND: %', target_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Execute removal for any potential previous personal emails 
-- (Assuming the user will now use their personal email to register as employer)
-- We keep 'novajobs@proton.me' as the permanent Admin.

-- Note: We don't know the exact "personal" email, so we provide the tool 
-- to the user to run if they have access to SQL, or we can try to guess 
-- if they provided it in a previous turn (not found in history).

-- However, if the user means they want to remove their current profile
-- to start fresh, we can clear the profiles that are NOT the proton one.

-- DELETE FROM auth.users WHERE email != 'novajobs@proton.me';
