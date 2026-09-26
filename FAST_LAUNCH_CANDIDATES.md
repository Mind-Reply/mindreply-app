# FAST LAUNCH CANDIDATES — 2026-09-26

## Candidate 1 — MindReply
Repository: https://github.com/Mind-Reply/mindreply-app
Observed homepage metadata: https://mindreply.vercel.app
Status: NO-GO today.

Why it is closest:
- active canonical repo
- recent commits
- Next.js production stack
- existing public-site structure
- documented release/security gates
- existing payment/webhook code paths

Blocking evidence:
- SECURITY_ROTATION_LOG records Stripe live API key, Stripe webhook secret and Vercel deploy token as exposed-in-history and PENDING rotation.
- package.json has `typescript.ignoreBuildErrors: true`.
- current config contains Vercel-specific image/deployment assumptions.
- production URL and smoke-test evidence were not verified in this cycle.

## Candidate 2 — A11/K11 public surface
Existing claimed domain: https://a11-k.space
Status: HOLD.

Reason:
- URL was not fetchable through the available web verification path.
- Exact canonical production repository and current deployment target were not established in this cycle.
- Therefore no live/production claim is made.

## Immediate launch gate
The first two safe launches become GO candidates only after:
1. secret-history remediation and credential rotation,
2. clean build/type/test evidence,
3. preview deployment,
4. mobile smoke test,
5. HTTPS/DNS verification,
6. monitoring and rollback evidence,
7. owner approval for production promotion.
