# MindReply Canonical Application Source

## Current source of truth

- Repository: `Mind-Reply/mindreply-app`
- Default branch: `main`
- Reconciliation branch: `chore/mindreply-app-reconstruction-2026-09-10`
- Product: MindReply Proofline

`angellllkr-eng/mind-reply-core` was the verified migration source for this reconstruction. It is retained as a rollback and provenance source until this repository passes the migration gate and the owner explicitly approves its retirement or archival.

## Migration gate

This repository is **not production-approved merely because code has been copied here**. Before a production source switch, all of the following must be recorded against the same immutable commit:

1. dependency installation, type checks, tests, and build pass;
2. secret and generated-artifact review passes;
3. public routes, APIs, authentication, and payments are smoke-tested in a preview environment;
4. the production deployment is associated with this repository and its exact commit;
5. HTTPS, health, readiness, status, and rollback are verified; and
6. owner approval is recorded for production promotion.

Until then, this repository is **built but NO-GO for production cutover**.

## Boundaries

MindReply product code lives here. The private owner control plane, credentials, deployment controls, and evidence systems remain separate, authenticated systems. No secrets, customer data, or production credentials belong in this repository.
