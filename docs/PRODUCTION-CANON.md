# MindReply Production Canonical Contract

## Canonical source

- GitHub: `angellllkr-eng/mind-reply-core`
- Branch: `main`
- Repository status: active / non-archived

## Canonical deployment target

The deployment target is the selected provider mapped to `mind-reply.com`. Current provider/domain/source mappings are recorded as evidence and can be reconciled independently.

## Required comparison before promotion

Compare the intended GitHub commit against:

- Vercel project Git link
- production deployment commit
- production domain
- health/readiness/version endpoints
- runtime errors

If layers disagree, record the discrepancy and continue with the applicable verification or remediation workflow; this contract does not create a promotion gate.

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
