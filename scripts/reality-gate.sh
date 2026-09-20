#!/usr/bin/env bash
set -euo pipefail

# Deterministic production-truth gate.
# Usage: BASE_URL=https://example.com ./scripts/reality-gate.sh
# Optional: REALITY_ROUTES="/ /pricing /contact /checkout /api/health"
# Optional: EXPECTED_RELEASE_SHA="..." and RELEASE_SHA_URL="/api/release"
# This script intentionally does not infer uptime, revenue, customer count,
# deployment state, or health from repository metadata.

BASE_URL="${BASE_URL:-}"
ROUTES="${REALITY_ROUTES:-/ /pricing /contact /checkout /api/health}"
EXPECTED_RELEASE_SHA="${EXPECTED_RELEASE_SHA:-}"
RELEASE_SHA_URL="${RELEASE_SHA_URL:-/api/release}"

if [[ -z "$BASE_URL" ]]; then
  echo "BASE_URL is required" >&2
  exit 2
fi

BASE_URL="${BASE_URL%/}"
checked_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
failures=0

printf '{"checked_at":"%s","source":"reality-gate","targets":[' "$checked_at"
first=1

for route in $ROUTES; do
  url="${BASE_URL}${route}"
  response_file="$(mktemp)"
  headers_file="$(mktemp)"
  status="000"
  curl_exit=0
  status="$(curl -L -sS -D "$headers_file" -o "$response_file" -w '%{http_code}' --max-time 20 "$url" 2>/dev/null || true)"

  tls="unknown"
  if [[ "$url" == https://* ]]; then tls="required"; fi

  result="pass"
  if [[ "$status" != 2* && "$status" != 3* ]]; then
    result="fail"
    failures=$((failures + 1))
  fi

  if [[ "$first" -eq 0 ]]; then printf ','; fi
  first=0
  printf '{"target":"%s","checked_at":"%s","source":"reality-gate","result":"HTTP %s","freshness":"%s","tls":"%s","state":"%s"}' \
    "$url" "$checked_at" "$status" "0s" "$tls" "$([ "$result" = pass ] && echo VERIFIED || echo DOWN)"

  rm -f "$response_file" "$headers_file"
done

release_result="not_checked"
if [[ -n "$EXPECTED_RELEASE_SHA" ]]; then
  release_url="${BASE_URL}${RELEASE_SHA_URL}"
  release_body="$(curl -L -sS --max-time 20 "$release_url" 2>/dev/null || true)"
  if grep -Fq "$EXPECTED_RELEASE_SHA" <<< "$release_body"; then
    release_result="verified"
  else
    release_result="mismatch"
    failures=$((failures + 1))
  fi
fi

printf '],"release":{"expected_sha":"%s","result":"%s"},"state":"%s"}\n' \
  "$EXPECTED_RELEASE_SHA" "$release_result" "$([ "$failures" -eq 0 ] && echo VERIFIED || echo BLOCKED)"

if [[ "$failures" -gt 0 ]]; then
  exit 1
fi
