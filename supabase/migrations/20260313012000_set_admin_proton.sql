-- Set the admin role for the proton email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'aurajobs@proton.me';

-- Ensure future signups with this email are automatically promoted
CREATE OR REPLACE FUNCTION public.handle_admin_promotion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'aurajobs@proton.me' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_admin_promotion ON public.profiles;
CREATE TRIGGER tr_admin_promotion
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_admin_promotion();
