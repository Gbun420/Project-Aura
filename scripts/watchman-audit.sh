#!/bin/bash

# AURA_OS: SOVEREIGN_SENTINEL AUDIT v2.1 (CASCADE_ENABLED)
# This script fetches the Watchman report and the AI-powered Brain Analysis.

echo ">>> SOVEREIGN_SENTINEL: Initiating Multi-Heart Sweep..."
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
echo "HTTP Status:  $(echo $WATCHMAN_REPORT | grep -o '"status":[0-9]*' | head -1 | cut -d':' -f2)"
echo "Content-Type: $(echo $WATCHMAN_REPORT | grep -o '"contentType":"[^"]*"' | cut -d'"' -f4)"
echo "------------------------------------------------"
echo ">>> BRAIN_ANALYSIS (Powered by $(echo $WATCHMAN_REPORT | grep -o '"provider":"[^"]*"' | cut -d'"' -f4))"
echo ">>> Result: $(echo $WATCHMAN_REPORT | grep -o '"content":"[^"]*"' | cut -d'"' -f4)"
echo "------------------------------------------------"

ANALYSIS_RESULT=$(echo $WATCHMAN_REPORT | grep -o '"content":"[^"]*"' | cut -d'"' -f4)

if [[ $ANALYSIS_RESULT == *"FORTRESS_SECURE"* ]]; then
  echo ">>> SOVEREIGN: All systems normalized. The Fortress is secure."
else
  echo ">>> ACTION_REQUIRED: Brain has identified potential infections."
fi
