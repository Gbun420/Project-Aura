-- Add metadata column to ledger for additional tracking
alter table public.ledger 
add column if not exists metadata jsonb default '{}'::jsonb;
