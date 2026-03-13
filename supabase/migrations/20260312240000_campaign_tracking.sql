-- Add Campaign Tracking columns to profiles
alter table public.profiles 
add column if not exists acquisition_source text default 'direct',
add column if not exists campaign_id text;

-- Index for conversion analytics
create index if not exists idx_profiles_campaign 
on public.profiles(campaign_id) 
where campaign_id is not null;
