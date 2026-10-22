# Repository Governance

The authoritative repository-role map is maintained in
[`angellllkr-eng/agent-control-plane/CANONICAL.md`](https://github.com/angellllkr-eng/agent-control-plane/blob/main/CANONICAL.md).

For MindReply, the canonical customer-facing product source is
`Mind-Reply/mindreply-app`. The private owner control plane, inventory,
approvals, release evidence, and rollback coordination belong in
`angellllkr-eng/agent-control-plane`; it is not a customer product runtime.

Do not treat similarly named historical repositories as canonical by name
alone. Compare unique code, history, deployment references, and runtime
evidence before changing repository classifications. Preserve existing
archives and history. Do not delete, empty, rename, transfer, or archive
repositories as part of routine cleanup.

## Rules

1. `main` is production-facing and must remain releasable.
2. Changes land through pull requests unless an emergency recovery is required.
3. Frontend changes require browser E2E validation.
4. Production workflow changes require explicit owner review.
5. Secrets must never be committed; use approved provider secret stores.
6. Database changes require migration review and a rollback/forward-fix plan.
7. Keep tightly coupled product surfaces in the canonical monorepo unless a
   documented security, scaling, deployment, or failure-isolation reason
   justifies a separate service.
8. Experimental work must be isolated from production paths.
9. Preserve repositories with historical or unique value; classify before
   proposing any administrative disposition.
10. A successful CI run does not by itself authorize production deployment;
    deployment health and the exact deployed source commit must also be
    verified.
11. Mark a product LIVE only when its exact source commit, deployment, domain,
    health behavior, and release evidence have been verified.
12. Require explicit owner approval for destructive repository administration,
    production changes, financial actions, or credential-sensitive operations.

## Canonical ownership

Owner: `@angellllkr-eng`

## Current frontend baseline

See `docs/FRONTEND_E2E_HARDENING.md`.

## Release evidence

See `docs/PRODUCTION-CANON.md` for the MindReply source and deployment
verification contract. The production deployment binding remains UNVERIFIED
until provider-side evidence confirms the linked repository, deployed commit,
domain, health behavior, and rollback candidate.
