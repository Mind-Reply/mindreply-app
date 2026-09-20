# MindReply Canonical Estate Control

**Effective:** 2026-09-10  
**Status:** reconciliation in progress

## Decision

`Mind-Reply/mindreply-app` is the canonical MindReply product-source target. The current complete implementation was imported from `angellllkr-eng/mind-reply-core` into branch `chore/mindreply-app-reconstruction-2026-09-10` and must pass the recorded migration gate before `main` or production changes.

## Non-negotiable rules

1. One canonical repository per product capability.
2. Existing source and deployment remain rollback candidates until verified cutover.
3. Unique functionality is reconciled with provenance; duplicate folders are not silently overwritten.
4. No secrets, customer data, payment data, or local environment files enter Git.
5. Build, test, preview smoke tests, health evidence, and owner approval are required before production promotion.
6. A11-K and the private owner control plane retain separate product and security boundaries.

## Current disposition

| Asset | Disposition |
| --- | --- |
| `Mind-Reply/mindreply-app` | Canonical MindReply target — built, verification pending |
| `angellllkr-eng/mind-reply-core` | Migration source and rollback candidate — retain until verified cutover |
| `mind-reply-core-inspect` local copy | Evidence copy — no unique files missing from current source |
| OneDrive MindReply folders | Archive/evidence sources — do not import generated or vendor material without review |

## Production truth

No existing deployment has been reconfigured or claimed as healthy by this migration. Production remains **NO-GO** until the release gate in `CANONICAL-SOURCE.md` passes.
