# MindReply Microservice Catalog

## Canonical source

`angellllkr-eng/mind-reply-core` is the active implementation source for this service layer.

## Public operational routes

| Route | Purpose | Safe for public probing |
|---|---|---|
| `GET /api/health` | Process liveness and runtime uptime | Yes |
| `GET /api/ready` | Deployment/configuration readiness gate | Yes |
| `GET /api/version` | Release identity and build metadata | Yes |
| `GET /api/services` | Service capability inventory | Yes |
| `/status` | Human-facing operating dashboard | Yes |
| `/services` | Human-facing service catalog | Yes |

## Autonomy boundaries

- Health checks may run automatically.
- Readiness checks may gate deployments.
- Version metadata may be consumed by monitoring.
- Service inventory may be consumed by control-plane automation.
- Recovery, release, deletion, billing, or other irreversible operations require explicit authorization.

## Verification rule

A service is not marked operational merely because its source route exists. It must be deployed, reachable, return the expected contract, and be associated with the intended production surface.

## Vercel source-alignment finding

The Vercel project currently named `mindreply` has `mind-reply.com` attached, but its Git integration currently points to the archived `Mind-Reply/mind-reply-core` repository. The active GitHub source is `angellllkr-eng/mind-reply-core`.

This is a release-blocking source-of-truth mismatch for promoting these new services to `mind-reply.com`.

## Safe migration sequence

1. Preserve the currently serving production deployment.
2. Validate the active repository build and routes.
3. Create/point the canonical Vercel project at `angellllkr-eng/mind-reply-core` using Vercel account controls.
4. Attach `mind-reply.com` only after the canonical deployment is verified.
5. Run `/api/health`, `/api/ready`, `/api/version`, `/api/services`, `/status` and `/services` against production.
6. Keep the previous deployment available for rollback during cutover.
