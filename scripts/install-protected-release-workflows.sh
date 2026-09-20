#!/usr/bin/env bash
set -euo pipefail

if [[ "${I_UNDERSTAND:-}" != "YES" ]]; then
  echo "Refusing to modify workflow files. Re-run with I_UNDERSTAND=YES after review." >&2
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

mkdir -p .github/workflows
cp ops/protected-release/validate-pr.yml .github/workflows/validate-pr.yml
cp ops/protected-release/promote-production.yml .github/workflows/promote-production.yml

cat > .github/workflows/deploy-prod.yml <<'YAML'
name: Legacy Production Deploy — Quarantined
on: { workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  quarantined:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Legacy workflow quarantined. Use Promote MindReply Production."
          exit 1
YAML

cat > .github/workflows/deploy-prod-optimized.yml <<'YAML'
name: Legacy Optimized Deploy — Quarantined
on: { workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  quarantined:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Legacy workflow quarantined. Use Promote MindReply Production."
          exit 1
YAML

cat > .github/workflows/build-deploy-mindreply.yml <<'YAML'
name: Legacy Build and Deploy — Quarantined
on: { workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  quarantined:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Legacy workflow quarantined. Use Promote MindReply Production."
          exit 1
YAML

echo "Protected release workflows installed locally. Review the diff before committing."
git diff -- .github/workflows
