# PRODUCTION BLOCKER RESOLUTION — 2026-09-26

Status: REPOSITORY-SIDE REMEDIATION EXECUTED.

## Cleared in this branch

- Removed the three unresolved gitlink entries from the canonical tree:
  - `apps/experimental/brushworks`
  - `apps/experimental/forge`
  - `infrastructure/nexus`
- Verified the historical gitlink targets before removal:
  - https://github.com/angellllkr-eng/brushworks/commit/d9ff06f2c5e3cbc4e075de3492601a2455d64c49
  - https://github.com/angellllkr-eng/forge/commit/aecc5e6e7c43b40cfc81069ba249cc23cf4651d3
  - https://github.com/angellllkr-eng/nexus-core/commit/72c2e3a6cbb049985ca295653f41fe991a2973da
- Synchronised `pnpm-lock.yaml` importer specifiers with the current manifests and removed stale direct Vercel package importer entries.
- Updated Frontier Modern CI to current GitHub Actions major releases and removed the invalid `setup-node` input that produced a workflow warning.
- Retired the push-triggered A11-K Vercel deployment workflow from the canonical MindReply repository.
- Converted the scheduled Reality Heartbeat and A11 Live Evidence workflows to manual, read-only checks so this repository does not create unrequested background monitoring.
- Kept TypeScript build errors release-blocking.

## Still externally gated

These are intentionally not marked resolved without provider evidence:

1. Credential rotation/revocation for every credential recorded as exposed in history.
2. Provider-side verification of GitHub/Vercel/Supabase/Stripe/SMTP/AI credentials.
3. DNS/hosting ownership and live production verification for mind-reply.com.
4. Canonical Cloudflare/ResellerPro deployment evidence.
5. GitHub organization administration for archiving/deleting duplicate repositories.

## Security truth rule

A current-tree cleanup does not prove historical credentials are harmless. Provider-side rotation and post-rotation verification remain required.
