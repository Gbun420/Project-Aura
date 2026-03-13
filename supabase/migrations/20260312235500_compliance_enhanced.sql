-- Enhanced Compliance and Monetization Schema
alter table public.profiles 
add column if not exists tcn_expiry_date date,
add column if not exists tcn_verification_id uuid,
add column if not exists subscription_expires_at timestamptz;

-- Add compliance requirements to vacancies
alter table public.vacancies
add column if not exists requires_tcn_compliance boolean default false,
add column if not exists requires_bank_guarantee boolean default false;

-- Index for fast compliance filtering (Identità Malta 2026 requirement)
create index if not exists idx_profiles_tcn_compliance 
on public.profiles(tcn_status, tcn_expiry_date) 
where tcn_status = 'verified_skills_pass';

-- Ensure subscription_tier check is robust
alter table public.profiles 
drop constraint if exists profiles_subscription_tier_check;

alter table public.profiles 
add constraint profiles_subscription_tier_check 
check (subscription_tier in ('free', 'pro', 'enterprise', 'pulse_pro'));
