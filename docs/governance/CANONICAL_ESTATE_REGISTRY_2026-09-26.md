# Canonical Estate Registry — 2026-09-26

**Purpose:** establish one verified repository authority map and stop duplicate product roots.

## VERIFIED authority map

| Product / boundary | Repository | State |
|---|---|---|
| MindReply | `Mind-Reply/mindreply-app` | **CANONICAL PRODUCT ROOT** |
| ResellerPro | `Mind-Reply/resellerpro` | **CANONICAL ORG DESTINATION / CONSOLIDATION IN PROGRESS** |
| PatchTalk / WhatsApp edge | `Mind-Reply/whatsapp-ai-router` | **SEPARATE RUNTIME BOUNDARY** |
| A11-K | `Mind-Reply/A11-K` | **SEPARATE PRODUCT AUTHORITY** |
| Nova Hall | `angellllkr-eng/a11-nowline` | **PRODUCT SOURCE / REPO RENAME PENDING** |
| MindReply historical/core source | `angellllkr-eng/mind-reply-core` | **SOURCE-FREEZE / MIGRATION SOURCE** |
| ResellerPro historical/current source | `angellllkr-eng/resellerpro-platform` | **SOURCE-FREEZE / MIGRATION SOURCE** |
| Legacy Nova Hall source | `angellllkr-eng/a11-sovereign-nowline` | **LEGACY / SOURCE-FREEZE** |
| Unrelated OSS Nowline | `angellllkr-eng/nowline` | **SEPARATE UNRELATED PROJECT — DO NOT REBRAND** |

## Rules now in force

1. One product has one canonical production repository.
2. A migration source is not a production authority.
3. A separate runtime boundary is not a second product root.
4. Repository names alone do not establish runtime truth.
5. A deployment is **UNVERIFIED** until an external runtime check or provider-native evidence proves it.
6. No credentials, payment secrets or customer data belong in Git.
7. No new duplicate repository should be created when an existing canonical destination exists.
8. Final archive/rename/delete administration is a separate GitHub administration action and must not be simulated by README edits.

## Current reconciliation priorities

### P0 — MindReply
- Keep `Mind-Reply/mindreply-app` as the only MindReply product root.
- Reconcile unique material from `angellllkr-eng/mind-reply-core`.
- Do not promote `mind-reply-core` back to authority.

### P0 — ResellerPro
- Continue migration from `angellllkr-eng/resellerpro-platform` into `Mind-Reply/resellerpro`.
- Treat the organization repository as the only destination for new ResellerPro work.
- Runtime remains **UNVERIFIED** until deployment and health evidence exists.

### P1 — Nova Hall
- Keep the public product identity **Nova Hall**.
- Keep `angellllkr-eng/a11-nowline` as the current verified source repository until a supported GitHub repository rename is performed.
- Do not alter `angellllkr-eng/nowline`; its README identifies an unrelated Nowline DSL project.

### P1 — Legacy A11
- Reconcile reusable material from `a11-sovereign-nowline` into `Mind-Reply/A11-K` or the appropriate canonical boundary before retirement.

## Evidence boundary

As of this registry:

- GitHub repository identity and repository contents are verified through the connected GitHub integration.
- GitHub repository state does **not** prove public HTTP availability, DNS correctness, Cloudflare deployment, Cloud Run deployment, or payment-provider readiness.
- No background monitoring or recurring process is activated by this registry.
