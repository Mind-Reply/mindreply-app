#!/usr/bin/env bash
set -euo pipefail

: "${KV_ID:?Set KV_ID to an existing Cloudflare KV namespace ID before deployment}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

python3 - <<'PY'
from pathlib import Path
import os
p = Path("wrangler.jsonc")
s = p.read_text()
s = s.replace("REPLACE_WITH_REAL_KV_ID", os.environ["KV_ID"])
p.write_text(s)
PY

npx wrangler deploy

echo "Verifying six routes..."
for h in \
  dubai.mind-reply.com \
  nyc.mind-reply.com \
  london.mind-reply.com \
  sofia.mind-reply.com \
  tokyo.mind-reply.com \
  live.shipbythurs.day; do
  echo "=== $h ==="
  curl --fail --silent --show-error "https://$h/monitor/public"
  echo
 done
