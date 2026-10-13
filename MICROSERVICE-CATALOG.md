# MindReply Microservice Catalog

## Canonical source

`Mind-Reply/mindreply-app` is the active canonical product repository. Route presence in source does not establish a live deployment.

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

Historical note: an earlier repository record reported that the Vercel project named `mindreply` was linked to archived `Mind-Reply/mind-reply-core`. That live binding was not rechecked in this documentation pass. Verify the current provider Git link, deployed commit, domain and health endpoints before deciding whether a source mismatch remains. The intended canonical GitHub source is `Mind-Reply/mindreply-app`.

## Safe migration sequence

1. Preserve the currently serving production deployment.
2. Validate the active repository build and routes.
3. Create/point the canonical Vercel project at `angellllkr-eng/mind-reply-core` using Vercel account controls.
4. Attach `mind-reply.com` only after the canonical deployment is verified.
5. Run `/api/health`, `/api/ready`, `/api/version`, `/api/services`, `/status` and `/services` against production.
6. Keep the previous deployment available for rollback during cutover.
