# Repository Governance

`mind-reply-core` is the canonical MindReply monorepo for the unified platform and branded frontend surfaces.

## Rules

1. `main` is production-facing and must remain releasable.
2. Changes land through pull requests unless an emergency recovery is required.
3. Frontend changes require browser E2E validation.
4. Production workflow changes require explicit owner review.
5. Secrets must never be committed; use GitHub/Vercel/Supabase secret stores.
6. Database changes require migration review and a rollback/forward-fix plan.
7. Product surfaces should live in the monorepo rather than as accidental submodules.
8. Experimental work must be isolated from production paths.
9. Archive rather than delete obsolete repositories when history has value.
10. A successful CI run does not by itself authorize production deployment; deployment health must also be verified.

## Canonical ownership

Owner: `@angellllkr-eng`

## Current frontend baseline

See `docs/FRONTEND_E2E_HARDENING.md`.
