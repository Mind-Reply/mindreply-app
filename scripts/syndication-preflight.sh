#!/usr/bin/env bash
set -euo pipefail

readonly FILES=(
  "cision-global-wire-dispatch-v1.json"
  "prco-newsroom-config-v1.json"
)

for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "[FAIL] Required manifest missing: $file" >&2
    exit 1
  fi
  if ! jq -e 'type == "object"' "$file" >/dev/null; then
    echo "[FAIL] Manifest must be a valid JSON object: $file" >&2
    exit 1
  fi
done

# Vendor endpoints/auth methods supplied in an unverified draft are not
# sufficient evidence that a write API is supported. This job never publishes.
if ! jq -e '.dispatch_enabled == false' "cision-global-wire-dispatch-v1.json" >/dev/null; then
  echo "[FAIL] Cision dispatch must remain disabled until vendor API and billing are verified." >&2
  exit 1
fi
if ! jq -e '.publish_enabled == false' "prco-newsroom-config-v1.json" >/dev/null; then
  echo "[FAIL] PR.co publishing must remain disabled until a supported write path is verified." >&2
  exit 1
fi

echo "[PASS] JSON manifests exist and parse."
echo "[PASS] External dispatch/publishing is explicitly disabled."
echo "[INFO] No credentials were read and no external network calls were made."
