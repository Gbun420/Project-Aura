#!/bin/bash

# AURA_OS: SOVEREIGN_SENTINEL AUDIT v1.2
# This script fetches the Watchman report and performs a local integrity check.

echo ">>> SOVEREIGN_SENTINEL: Initiating Sweep..."
WATCHMAN_REPORT=$(curl -s -X POST https://shfaydzqdomkkfvnhcal.supabase.co/functions/v1/ghost-watchman)

# Check for errors in the fetch
if [[ $WATCHMAN_REPORT == *"Infected"* ]]; then
  echo ">>> ALERT: Watchman encountered an infection during the sweep."
  echo ">>> DIAGNOSTIC: $WATCHMAN_REPORT"
  exit 1
fi

# Manual Parsing (Local Brain)
echo ">>> AUDIT_COMPLETE: Analyzing Integrity..."
echo "------------------------------------------------"
echo "Timestamp:    $(echo $WATCHMAN_REPORT | grep -o '"timestamp":"[^"]*"' | cut -d'"' -f4)"
echo "HTTP Status:  $(echo $WATCHMAN_REPORT | grep -o '"httpStatus":[0-9]*' | cut -d':' -f2)"
echo "MIME Status:  $(echo $WATCHMAN_REPORT | grep -o '"isMimeValid":[a-z]*' | cut -d':' -f2)"
echo "Guard Status: $(echo $WATCHMAN_REPORT | grep -o '"isHardened":[a-z]*' | cut -d':' -f2)"
echo "------------------------------------------------"

GUARD_STATUS=$(echo $WATCHMAN_REPORT | grep -o '"isHardened":[a-z]*' | cut -d':' -f2)

if [ "$GUARD_STATUS" = "false" ]; then
  echo ">>> CRITICAL: CSP is NOT hardened. Vercel deployment pending."
  echo ">>> REQUIRED: git add vercel.json && git push"
else
  echo ">>> SOVEREIGN: All systems normalized. The Fortress is secure."
fi

# Internal Pulse Verification (Optional - Requires pg_net access)
# echo ">>> Checking Database Pulse Ledger..."
# curl -s -X POST -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" -d '{"sql_query":"SELECT count(*) FROM net._http_response;"}' https://shfaydzqdomkkfvnhcal.supabase.co/rest/v1/rpc/admin_sql_execute
