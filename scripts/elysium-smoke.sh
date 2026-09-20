#!/usr/bin/env bash
# Elysium E2E smoke — status → gate → pack
# Usage: HOST=https://your-host ./scripts/elysium-smoke.sh
#        HOST=http://localhost:3000 ./scripts/elysium-smoke.sh
set -euo pipefail

HOST="${HOST:-http://localhost:3000}"
RID="audit_smoke_$(date +%Y%m%d_%H%M%S)"
DRAFT='Executive findings: delivery drag is visible in CI. Recommendations are bounded and reversible. No guarantee language.'

echo "== HOST $HOST"
echo "== requestId $RID"
echo

echo "-- GET /api/elysium/status"
curl -sS "$HOST/api/elysium/status" | head -c 2000
echo -e "\n"

echo "-- POST /api/elysium/gate"
curl -sS -X POST "$HOST/api/elysium/gate" \
  -H 'content-type: application/json' \
  -d "{\"requestId\":\"$RID\",\"draft\":\"$DRAFT\"}" | head -c 4000
echo -e "\n"

echo "-- POST /api/elysium/pack"
curl -sS -X POST "$HOST/api/elysium/pack" \
  -H 'content-type: application/json' \
  -d "{\"requestId\":\"$RID\",\"draft\":\"$DRAFT\",\"clientLabel\":\"Smoke Test\"}" | head -c 4000
echo -e "\n"

echo "== smoke complete"
