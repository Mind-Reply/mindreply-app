# Canonical Reconstruction Audit

**Audit date:** 2026-09-08  
**Authority:** GitHub source of truth  
**Scope:** A11-K / MindReply across GitHub, Vercel, Figma and WebsitePublisher  
**Change policy:** Non-destructive. No DNS, domain, credential, billing, routing, data deletion, archive, transfer or external communication changes made.

## Executive disposition

| Area | Disposition | Evidence / next gate |
|---|---|---|
| `angellllkr-eng/mind-reply-core` | **Canonical product root** | Active implementation source; current main is the reconstruction authority. |
| `Mind-Reply/mindreply` | **Parallel / migration candidate** | Multiple delivery bindings exist; do not merge blindly. Harvest reusable modules only after file-level comparison. |
| A11-K | **Canonical surface inside core** | Core repository contains the A11-K surface and delivery configuration. |
| Vercel `a11-k-core` | **Repair applied; verification in progress** | Stale `functions.api/**` blocker was removed. New production deployments for `b598d592...` and `e421d994...` are queued; no new build error is currently reported for the latest deployment. |
| Vercel duplicate core projects | **Consolidation candidates** | Multiple Vercel projects bind to `mind-reply-core`. No project was retired because routing/domain/environment/data dependencies have not been proven safe to change. |
| WebsitePublisher project 24053 | **Design/publishing source to reconcile** | Five pages contain overlapping A11-K/MindReply surfaces. GitHub remains authoritative. No live page mutation performed. |
| Figma | **Verification blocked** | No authorized editable file key was available in the inspected context. No Figma mutation performed. |

## Verified technical findings

### GitHub

`mind-reply-core` package identity is `a11k-surface` v3.1.0 and uses Node 24 / pnpm 10, Next 16, React 19, Drizzle/Postgres, Playwright and Vercel integrations.

The production workflow currently runs install → typecheck → build → Docker image → Vercel/Railway deployment → health checks. The workflow is operationally broader than the Vercel-only delivery contract and remains a consolidation target after the current production path is green.

### Vercel failure root cause and repair

Deployment `dpl_8VzygSfFrgtw7jE6U9SJuyWL9wbi` failed with:

> The pattern `api/**` defined in `functions` doesn't match any Serverless Functions.

PR #110 removed the stale `functions` block. The current `vercel.json` contains no `functions` pattern and keeps Next.js, Fluid Compute and the Hobby-compatible `iad1` region.

A fresh production deployment was created from `b598d592...`, followed by another from the current reconstruction commit `e421d994...`. Both are presently queued rather than showing the former unmatched-function build error. The latest deployment has no error/stderr events at inspection time.

The GitHub `Production Deploy — Mind-Reply Core` run for `e421d994...` initially failed in `build-and-test`; its failed jobs were safely re-run. The rerun is currently queued. Deployment/health promotion remains **NO-GO until that run and the fresh Vercel deployment complete successfully**.

### Vercel estate duplication

The connected Vercel team currently contains several projects bound to the same `mind-reply-core` repository, including `a11-k-core`, `angellllkr-eng-mind-reply-core`, `angellllkr-eng-mind-reply-core-1`, and `angellllkr-eng-mind-rep` / related variants. This is genuine delivery duplication, not merely naming drift.

The canonical candidate remains `a11-k-core`. Existing READY production deployments include rollback candidates, so recovery capacity exists without changing routing. No rollback or project retirement was executed.

### WebsitePublisher

Project `24053` contains five pages including `home`, `control/index.html`, `landing-v2.html`, `admin`, and `index.html`. The `home`, `control` and `landing-v2` surfaces overlap in product language and visual tokens but represent separate design generations. This is design/content drift, not evidence for deletion.

### Figma

Figma could not yet be reconciled to code because an authorized editable file key/node was not available in the inspected context. No guessed file or mutation was used.

## Canonical product map

- **MindReply:** decision/product layer in `mind-reply-core`.
- **A11-K:** human-facing platform and dialogue/operations surfaces in `mind-reply-core`.
- **Private operations:** `angellllkr-eng/agent-control-plane`.
- **ResellerPro:** `angellllkr-eng/resellerpro-platform`.
- **PatchTalk:** `angellllkr-eng/patchtalk`.
- **Aurel:** designated A11-K/agent-control-plane surface where explicitly mapped.

## Consolidation rule

Do not create new thin properties when a route, page, feature or module can live inside a canonical platform. Do not retire duplicate deployments until custom domains, environment bindings, data dependencies, analytics, webhooks and rollback paths are checked.

## Remaining blockers / exact next actions

1. **CI:** wait for the re-run of `Production Deploy — Mind-Reply Core` for `e421d994...`; inspect the first failed step if it fails again.
2. **Vercel:** verify `dpl_snxCrF1TwFVHWoEz6HsnDuCpKACb` reaches READY and then perform production health/smoke verification.
3. **Vercel:** map duplicate project domains/environment metadata before proposing any retirement or routing change.
4. **GitHub:** complete file/module comparison of `Mind-Reply/mindreply` versus `angellllkr-eng/mind-reply-core` and classify reusable modules before any merge.
5. **Figma:** identify the authorized editable design file key, then inspect pages/components/variables and map them to the GitHub canonical surface.
6. **WebsitePublisher:** reconcile overlapping designs into a canonical design specification first; do not publish live changes until the owner explicitly approves the resulting page plan.
7. **Security:** verify server-only environment handling and dependency/security posture without exposing or moving secret values.

## Security gate

Configuration references server-only values such as database, Redis, payment and authentication secrets. Repository documentation requires secrets to remain in provider secret stores. Placeholder environment files were observed; no real credential value was exposed in this audit. Historical exposure is **unverified** and must not be asserted without evidence.

## Current GO/NO-GO

**Production consolidation: NO-GO until CI + fresh Vercel deployment + health/smoke evidence passes.**  
**Verified Vercel code repair: GO; stale unmatched-function configuration has been removed.**  
**Destructive consolidation: NO-GO pending domain/environment/data/rollback verification and explicit owner approval.**
