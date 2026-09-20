# MindReply Production Source

## Canonical application source

- GitHub: `angellllkr-eng/mind-reply-core`
- Branch: `main`
- Product: MindReply
- Primary production domain: `mind-reply.com`

## Service surface

- `/api/health` — liveness
- `/api/ready` — configuration readiness
- `/api/version` — build/release identity
- `/api/services` — service catalog
- `/status` — human-readable service status

## Deployment rule

The production Vercel project serving `mind-reply.com` must ultimately point to this repository and `main`.

Until that Git source mapping is verified, the domain is not considered aligned with the canonical source.

## Comparison rule

Before promoting a deployment, compare:

1. GitHub repository and commit SHA
2. Vercel linked repository and commit SHA
3. production alias/domain
4. runtime health endpoints
5. application version

A mismatch is a release blocker unless explicitly approved and recorded.
