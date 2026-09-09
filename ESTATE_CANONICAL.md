# ESTATE CANONICAL CONTROL

**Effective:** 2026-09-09
**Status:** ACTIVE

This repository is the canonical MindReply/A11-K production source pending verified production cutover. All future MindReply implementation work must reconcile into this repository unless an explicit architecture decision supersedes this record.

## Non-negotiable operating rules

1. One canonical source. No competing "canonical" repositories.
2. Existing production remains protected until replacement is verified.
3. Inspect actual source before migrating functionality; repository names and planning documents are not evidence of implementation.
4. Unique functionality is migrated into this repository with provenance recorded.
5. Duplicates become migration sources, evidence-only archives, or are retired after verification.
6. Never copy secrets, credentials, payment data, or customer PII into the repository or model context.
7. Destructive actions are permitted when explicitly part of the consolidation objective, but only after the target implementation and rollback evidence exist.
8. Production is not considered healthy because a deployment is READY. Route, API, health, auth, data, and smoke tests must pass.
9. Every architectural decision is recorded here or in the repository decision log before another repository can be treated as authoritative.
10. No new parallel repository is created to solve a problem that belongs in this platform.

## Current estate disposition

- `angellllkr-eng/mind-reply-core` — CANONICAL TARGET.
- `Mind-Reply/mindreply` — migration/reconciliation source; not canonical.
- `resellerpro-platform` — ResellerPro implementation source; integrate only the verified required capabilities and preserve clear product boundaries.
- OneDrive/SharePoint — source/archive evidence only.
- Vercel — deployment infrastructure/evidence, never architectural source of truth.
- Figma — design source once the concrete file target is identified.

## Production gate

The current Vercel MindReply deployment is READY, but `/health` currently returns 404. Therefore the estate remains **NO-GO for claiming verified production health** until the canonical implementation provides and passes an explicit health endpoint plus route/API smoke tests.

## Change discipline

Use a branch/PR for structural consolidation where practical. Protect the canonical branch against accidental deletion/force-push and require verification before production merges. GitHub branch protections support blocking deletion/force-pushes and requiring status checks/reviews.

This file is the controlling architectural record. If another document contradicts it, the contradiction must be resolved here before implementation proceeds under the competing decision.
