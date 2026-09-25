# POWERSON ZERO — Execution Register — 2026-09-25

Status: ACTIVE  
Authority: A.K. / owner-controlled  
Operating rule: VERIFY → PROVE → PROTECT → EXECUTE → RECORD → CONTINUE

## 1. Organisation baseline — VERIFIED

Connected GitHub organisation: `Mind-Reply`

Current inventory:
- 85 repositories
- 33 active
- 52 archived
- 39 public
- 46 private

The inventory contains multiple historical, experimental, product, control-plane, integration and duplicate-like repositories. No repository is treated as a production target solely because it exists.

## 2. Canonical MindReply product root — VERIFIED

Canonical active product repository:
`Mind-Reply/mindreply-app`

Default branch:
`main`

Current main commit after CI-gate repair:
`20d8b56582043b873a6aecafe03166db8b90d86d`

Repository README explicitly identifies `Mind-Reply/mindreply-app` as the canonical product root and states that similarly named personal or historical repositories are source material until reconciled.

## 3. Historical source — VERIFIED

`Mind-Reply/mind-reply-core` is retained as migration/provenance and rollback source.

Its `CANONICAL-SOURCE.md` identifies `Mind-Reply/mindreply-app` as the target repository.

Its migration provenance records:
- source commit: `8781d29c738b8c9752d9dfb1ec64cec396e7fd64`
- target: `Mind-Reply/mindreply-app`
- reconciliation branch: `chore/mindreply-app-reconstruction-2026-09-10`

Production cutover was explicitly recorded as not yet approved in that provenance document.

## 4. A11-K — ACTIVE / VERIFIED SOURCE STATE

Repository:
`Mind-Reply/A11-K`

Default branch:
`main`

The repository is active and contains a large branch estate with multiple product, revenue, reality-proof, deployment and design branches.

Its README states that A11-K is a distinct product and not the canonical MindReply public web root.

A11-K currently includes legacy Vercel-related dependencies in its package manifest. This is source evidence only and does not prove a live Vercel deployment.

## 5. Reverse profit engineering — BUILT / VERIFIED MERGE

Merged pull request:
`#7 — feat: reverse-profit engineer known applications`

Merge commit:
`ed185ced702856170b8c37d0d74c56dd847ec051`

The merged implementation adds a deterministic reverse-profit contract covering:
A11-K, Chat, Nexus, Forge, Studio, OWN Registrar, ReplyControl and MindReply Local.

The implementation explicitly separates revenue opportunity from realized revenue and keeps real-money, outreach and irreversible actions owner-approved.

Open competing PR:
`#6 — feat: start reverse profit engineering applications`

Status:
OPEN and divergent from current main. Its unique profit-engineering page has not been merged.

No automatic closure was performed because its unique content must be reconciled before disposition.

## 6. CI reality — VERIFIED FAILURE / REPAIR APPLIED

The reverse-profit merge triggered three workflow outcomes:

- Frontend E2E: STARTUP_FAILURE
- Frontier Modern: FAILURE
- Personal Estate Automation: FAILURE

Frontier Modern failure was directly diagnosed from the runner log:
`pnpm` was not available when `actions/setup-node@v5` attempted package-manager caching.

Repair applied directly to `main`:
- pinned `pnpm/action-setup@v4` to pnpm `10.32.1`
- explicitly enabled pnpm cache
- made checkout submodule behaviour explicit

Repair commit:
`20d8b56582043b873a6aecafe03166db8b90d86d`

The repair itself is VERIFIED in GitHub source. A fresh successful workflow result has not yet been observed, so CI is not marked green.

## 7. Repository-structure integrity — UNVERIFIED / NEEDS REPAIR

The canonical repository contains three Gitlink entries without a corresponding `.gitmodules` file:

- `apps/experimental/brushworks`
- `apps/experimental/forge`
- `infrastructure/nexus`

The GitHub Actions cleanup log reported:
`fatal: No url found for submodule path 'apps/experimental/brushworks' in .gitmodules`

The referenced commit SHAs could not be resolved through the connected organisation search. No replacement repository URL is being invented.

Disposition:
PRESERVE → IDENTIFY → REPAIR, not delete.

## 8. ResellerPro — BLOCKED / SOURCE CONFLICT

`Mind-Reply/resellerpro` is explicitly marked as a legacy repository pointer.

Its README identifies the intended canonical source as:
`angellllkr-eng/resellerpro-platform`

That personal repository is not available through the current connected GitHub installation.

Therefore:
- `Mind-Reply/resellerpro` is not treated as a production build target.
- No duplicate production repository is created.
- No ResellerPro feature work is written here.
- Canonical ResellerPro production state remains UNVERIFIED from this connection.

## 9. Control plane — ACTIVE / SEPARATE BOUNDARY

Repository:
`Mind-Reply/control-plane`

Purpose:
owner/control implementation for command surfaces, policy boundaries, approvals, billing/security controls and operational evidence.

The repository itself states that it is not the public MindReply production site and should not silently become a second public product root.

Its documentation still references the obsolete `Mind-Reply/mindreply` name, which conflicts with the verified current canonical repository `Mind-Reply/mindreply-app`.

This is recorded as documentation drift, not as a new production source.

## 10. Duplicate-control policy now applied

Current classification rule:
- canonical active product: `Mind-Reply/mindreply-app`
- migration/rollback source: `Mind-Reply/mind-reply-core`
- control plane: `Mind-Reply/control-plane`
- A11-K product: `Mind-Reply/A11-K`
- ResellerPro legacy pointer: `Mind-Reply/resellerpro`
- other similarly named repositories: preserve → compare → reconcile → archive only after evidence

No historical repository has been deleted or blindly overwritten.

## 11. Current state

COMPLETED
- organisation inventory
- canonical repository identification
- branch inspection on priority repositories
- reverse-profit branch reconciliation review
- direct CI precondition repair on canonical main
- evidence register created

VERIFIED
- canonical product root = `Mind-Reply/mindreply-app`
- reverse-profit implementation from PR #7 is merged
- Frontier Modern failure cause = missing pnpm before setup-node cache
- repository contains unresolved gitlinks without `.gitmodules`

PREPARED
- CI validation rerun path
- submodule-origin investigation
- competing PR #6 reconciliation review

BLOCKED
- canonical ResellerPro source cannot be verified from the current GitHub connection
- unresolved gitlink origins prevent a clean structural disposition

PROTECTED
- no production database, payment, DNS, credential, ownership or customer-facing irreversible action was performed

NEXT
Repair the canonical CI/checkout estate, then reconcile the remaining high-value branches and duplicate-like repositories against `Mind-Reply/mindreply-app` without deleting unique history.
