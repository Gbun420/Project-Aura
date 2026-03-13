-- PHASE 1: Substrate Initialization
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- PHASE 2: Permission Hardening
-- Ensure the postgres role can execute the cron logic
GRANT USAGE ON SCHEMA cron TO postgres;

-- PHASE 3: Sentinel Scheduling
-- We use 'cron.schedule' (calling the function via the pg_catalog schema to be safe)
SELECT cron.schedule(
  'watchman-pulse',
  '0 * * * *', -- At the start of every hour
  $$
  SELECT net.http_post(
    url:='https://shfaydzqdomkkfvnhcal.supabase.co/functions/v1/ghost-watchman',
    headers:='{"Content-Type": "application/json"}'::jsonb
  );
  $$
);
