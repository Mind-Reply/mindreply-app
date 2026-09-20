# MindReply Production Canonical Contract

## Canonical source

- GitHub: `angellllkr-eng/mind-reply-core`
- Branch: `main`
- Repository status: active / non-archived

## Canonical Vercel target

The production domain currently belongs to the Vercel project `mindreply` and includes `mind-reply.com` plus related domains. Do not treat similarly named Vercel projects as production until their domain and source mapping are verified.

## Required comparison before promotion

Compare the intended GitHub commit against:

- Vercel project Git link
- production deployment commit
- production domain
- health/readiness/version endpoints
- runtime errors

If any layer disagrees, mark the release NO-GO.

## Service checks

- `/api/health`
- `/api/ready`
- `/api/version`
- `/api/services`
- `/status`

## Deployment model

Keep tightly coupled Next.js routes in one Vercel project initially. Extract a service only when it has a clear security, scaling, deployment, or failure-isolation reason.

## Rollback

Retain a verified READY deployment as rollback candidate. Never remove the last known-good deployment before a replacement passes production verification.
