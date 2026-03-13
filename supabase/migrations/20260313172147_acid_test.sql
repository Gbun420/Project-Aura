-- ACID_TEST: Force a write-ready session for pg_net
SET default_transaction_read_only = OFF;

-- Trigger a probe to httpbin and capture the result
DO $$
DECLARE
  request_id BIGINT;
BEGIN
  -- Perform a POST request to ensure the Watchman can communicate
  SELECT net.http_post(
    url:='https://shfaydzqdomkkfvnhcal.supabase.co/functions/v1/ghost-watchman',
    headers:='{"Content-Type": "application/json"}'::jsonb,
    body:='{"source": "acid_test_probe"}'::jsonb
  ) INTO request_id;
  
  RAISE NOTICE 'ACID_TEST_ENQUEUED: request_id=%', request_id;
END $$;
