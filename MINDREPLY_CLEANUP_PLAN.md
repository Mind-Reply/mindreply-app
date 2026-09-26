# MINDREPLY CLEANUP PLAN — 2026-09-26

Target branch: `go-live-cleanup`
Canonical repo: https://github.com/Mind-Reply/mindreply-app

## Verified findings
1. `.gitignore` excludes real environment files and build artifacts.
2. No `.next` path was returned by repository code search.
3. `.env.example` and `.env.production.example` exist.
4. Repository contains a documented security rotation log.
5. Rotation log records exposed-in-history Stripe live key, Stripe webhook secret and Vercel deploy token as PENDING.
6. No open PR was observed before this branch was created.
7. Current HEAD is `45a679b9f3c12bf518f33f38ead6925c7a11eab7`.
8. `next.config.ts` currently ignores TypeScript build errors.
9. Repository README already declares `mindreply-app` as the canonical product root.

## Required cleanup
- verify repository history for secret material; remove any active secret from tracked content/history where found;
- rotate every credential listed in SECURITY_ROTATION_LOG before production;
- remove stale deployment instructions that contradict Cloudflare/ResellerPro direction;
- preserve useful historical documents under `docs/archive/`;
- make TypeScript errors release-blocking;
- verify Stripe checkout and raw-body webhook signature path in test mode;
- verify contact/package-request and invoice-first routes;
- add/confirm robots, sitemap, privacy, terms/support and ownership footer;
- produce preview deployment evidence before any production promotion.

## Important
This branch does not claim credentials are rotated. Rotation requires access to the respective provider control planes and must be independently evidenced.
