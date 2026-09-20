# MindReply Production Canonical Contract

## Canonical source

- GitHub: `angellllkr-eng/mind-reply-core`
- Branch: `main`
- Status: active, public, writable

## Canonical Vercel target

- Intended project: `mindreply`
- Intended production domain: `mind-reply.com`
- Required source: `angellllkr-eng/mind-reply-core`
- Framework: Next.js
- Node: 24.x

## Required production surfaces

- `/`
- `/status`
- `/api/health`
- `/api/ready`
- `/api/version`
- `/api/services`

## Service contract

`/api/health` must provide process liveness without exposing secrets.

`/api/ready` must return readiness based on required runtime configuration and must not leak environment values.

`/api/version` must expose only safe release metadata.

`/api/services` must expose a safe service registry and current availability state.

`/status` must consume the service endpoints and present a useful operational view.

## Cutover rule

The Vercel project serving `mind-reply.com` must be connected to the canonical GitHub repository above. Until that is verified, a deployment from another repository is not considered the canonical production release.

## Verification

1. Confirm Vercel project Git connection.
2. Confirm production branch is `main`.
3. Deploy the canonical commit.
4. Confirm deployment is READY.
5. Check every required endpoint over HTTPS.
6. Check runtime errors.
7. Confirm the custom domain resolves to the intended production project.
8. Preserve the prior deployment as rollback until the new release passes all checks.

## Important

Do not delete or archive the existing source until the replacement is verified. GitHub archived repositories are read-only and must be unarchived before changes can be made.
