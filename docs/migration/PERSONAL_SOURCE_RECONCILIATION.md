# Personal MindReply Source Reconciliation

Status: NON-DESTRUCTIVE REVIEW STAGE
Source: `angellllkr-eng/mindreply`
Target: `Mind-Reply/mindreply-app`
Branch: `consolidate/personal-mindreply-file-review`

## Verified file-level inventory

- Source files: 1,036
- Target files: 450
- Exact path + blob matches: 0
- Same-path conflicts with different content: 14
- Source-only files: 1,022

## Files preserved in this review branch

The following source files were copied under `docs/migration/personal-mindreply/` so their provenance is explicit and no target files were overwritten:

- `API_CONTRACT.md`
- `MICROSERVICE-ESTATE.md`
- `SECURITY_ROTATION.md`
- `SECURITY_FIXES.md`

## Deliberate exclusions

No source workflow, deployment configuration, application package, lockfile, executable/script, binary/archive, or environment file was copied automatically.

Reason: the two repositories are materially different applications. Automatic replacement would risk changing the target runtime, deployment path, security posture, or dependencies.

The source also contains historical documents that make stale production/Vercel claims. Those were not promoted into the active canonical configuration.

## Conflict policy

The 14 same-path conflicts remain untouched. The target version wins provisionally until each conflict is reviewed file-by-file.

## Next consolidation gate

Review source-only application/code trees and the 14 conflicts for:
1. unique production value,
2. compatibility with the target Next.js application,
3. secret/security exposure,
4. Cloudflare/ResellerPro compatibility,
5. duplication with existing target functionality.

Only reviewed files should be promoted into the canonical repository.
