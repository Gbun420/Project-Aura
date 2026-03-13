-- Add subscription and compliance columns to profiles
alter table public.profiles 
add column if not exists subscription_tier text check (subscription_tier in ('free', 'pro', 'enterprise')) default 'free',
add column if not exists tcn_status text check (tcn_status in ('not_applicable', 'pending_skills_pass', 'verified_skills_pass')) default 'not_applicable';

-- Update RLS to allow users to see their own subscription/compliance status
-- (Existing policies usually cover 'all' for auth.uid() = id, but good to be explicit if needed)
