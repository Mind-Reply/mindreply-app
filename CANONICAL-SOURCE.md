# MindReply Production Source Contract

## Canonical implementation

- Repository: `Mind-Reply/mindreply-app`
- Branch: `main`
- Role: active implementation source for the MindReply product (repository identity verified from GitHub metadata and repository instructions)
- Live production source/commit: **UNVERIFIED** in this document update.

## Deployment target

The production deployment provider is not established by repository identity alone. The active deployment guide currently specifies a GitHub validation and Cloudflare-oriented delivery path and explicitly says Vercel is not the canonical deployment target. Treat the Vercel `mindreply` project as a separate candidate until the provider binding, domain mapping, deployed commit, and health checks are verified.

## Stale claim corrected

An earlier version of this file stated that the production Vercel project serving `mind-reply.com` was associated with an archived `Mind-Reply/mindreply-app` repository. That statement is internally inconsistent with the current repository metadata and has not been independently substantiated in this pass. It must not be treated as current deployment evidence.

## Continuous release verification

For each release, record:
- GitHub source and commit.
- Build result.
- Actual provider/project and deployed commit.
- Runtime checks on the intended public domain.
- Required environment configuration state without exposing secret values.
- DNS/domain mapping and TLS.
- Deployment result and rollback candidate.
- `/api/health`, `/api/ready`, `/api/version`, `/api/services`, `/api/dependencies`, `/api/metrics`, and `/status` observations where implemented.

A successful build is READY, not VERIFIED, until the intended public runtime responds and the deployed release is identifiable. No provider, DNS, or production setting should be changed based on this contract alone.
