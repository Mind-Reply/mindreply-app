# Canonical Reconstruction Audit

**Audit date:** 2026-09-08  
**Authority:** GitHub source of truth  
**Scope:** A11-K / MindReply across GitHub, Vercel, Figma and WebsitePublisher  
**Change policy:** Non-destructive. No DNS, domain, credential, billing, routing, data deletion, archive, transfer or external communication changes made.

## Executive disposition

| Area | Disposition | Evidence / next gate |
|---|---|---|
| `angellllkr-eng/mind-reply-core` | **Canonical product root** | README explicitly identifies this as the active product root; `agent-control-plane` is the private operational root. |
| `Mind-Reply/mindreply` | **Parallel / migration candidate** | Multiple Vercel projects point to it; do not merge blindly. Harvest useful modules only after file-level comparison. |
| A11-K | **Canonical surface inside core** | Core repository documents A11-K apps and the `a11k-surface` delivery surface. |
| Vercel `a11-k-core` | **Delivery blocked, repair applied** | Production build failed on stale unmatched `functions.api/**`; PR #110 removed the stale functions block and was squash-merged as `b598d592b272743307482ed3ae76149387a384f9`. Fresh production verification is still required. |
| Vercel duplicate core projects | **Consolidation candidates** | `angellllkr-eng-mind-reply-core`, `angellllkr-eng-mind-reply-cors`, `angellllkr-eng-mind-reply-core-1`, and `a11-k-core` all bind to `mind-reply-core`. No project was retired. |
| WebsitePublisher project 24053 | **Design/publishing source to reconcile** | Five pages contain overlapping A11-K/MindReply surfaces and visibly separate design generations. GitHub remains authoritative. |
| Figma | **Verification blocked** | No authorized file key was available in the inspected context. No Figma mutation performed. |

## Verified technical findings

### GitHub

`mind-reply-core` package identity is `a11k-surface` v3.1.0 and uses Node 24 / pnpm 10, Next 16, React 19, Drizzle/Postgres, Playwright and Vercel integrations. Its README describes ReplyControl, A11-K Dialogue Console, Asset Bridge, Crownline boundary, Patternwright and Venture Foundry as distinct product areas.

The repository operating model explicitly separates product runtime from the private `agent-control-plane`, and requires evidence before promoting system state from planned → built → tested → deployed → live.

### Vercel failure root cause and repair

Deployment `dpl_8VzygSfFrgtw7jE6U9SJuyWL9wbi` failed with:

> The pattern `api/**` defined in `functions` doesn't match any Serverless Functions.

PR #110 removed the stale `functions` block while preserving Next.js, Fluid Compute, headers and the Hobby-compatible `iad1` region. It was merged to `main` as commit `b598d592b272743307482ed3ae76149387a384f9`.

The next required evidence is a fresh Vercel production deployment from that merge, followed by health/smoke verification. Existing READY deployments remain available as recovery evidence; no rollback was executed.

### WebsitePublisher

Project `24053` currently contains five pages:

- `home` — premium A11-K / MindReply operating surface;
- `control/index.html` — A11-K Flight Deck control surface;
- `landing-v2.html` — second MindReply product surface;
- `admin` — minimal non-indexed admin placeholder;
- `index.html` — redirect to `/`.

The `home`, `control` and `landing-v2` pages overlap in product language and visual tokens but are not one canonical implementation. This is design/content drift, not evidence for deletion. Reconciliation should move the strongest concepts into the GitHub canonical surface, then treat WebsitePublisher as a publishing/export surface.

## Canonical product map

- **MindReply:** decision/product layer in `mind-reply-core`.
- **A11-K:** human-facing platform and dialogue/operations surfaces in `mind-reply-core`.
- **Private operations:** `angellllkr-eng/agent-control-plane`.
- **ResellerPro:** `angellllkr-eng/resellerpro-platform`.
- **PatchTalk:** `angellllkr-eng/patchtalk`.
- **Aurel:** `angellllkr-eng/agent-control-plane` surface where explicitly designated.

## Consolidation rule

Do not create new thin properties when a route, page, feature or module can live inside a canonical platform. Do not retire duplicate deployments until custom domains, environment bindings, data dependencies, analytics, webhooks and rollback paths are checked.

## Remaining blockers

1. **Vercel:** verify a new production deployment from `b598d592...`; then run health/smoke checks. If it fails, inspect the new build log rather than rolling back automatically.
2. **Vercel:** inspect duplicate project bindings and domain/environment metadata before any retirement proposal.
3. **GitHub:** compare `mindreply` and `mind-reply-core` at file/module level and classify reusable modules before any merge.
4. **Figma:** obtain/identify the authorized editable design file key, then inspect actual pages/components/tokens against the GitHub product design canonical portfolio.
5. **WebsitePublisher:** reconcile the three overlapping public/control designs into one canonical experience without publishing changes until owner-approved.

## Security gate

Configuration references server-only values such as database, Redis, payment and authentication secrets. The repository documentation requires secrets to remain in provider secret stores. Placeholder environment files were observed; no real credential value was exposed in this audit. Historical exposure is **unverified** and must not be asserted without evidence.

## Current GO/NO-GO

**Production consolidation: NO-GO until fresh deployment + smoke evidence passes.**  
**Code repair: GO for the verified Vercel build blocker; PR #110 is merged.**  
**Destructive consolidation: NO-GO pending domain/environment/data/rollback verification and owner approval.
