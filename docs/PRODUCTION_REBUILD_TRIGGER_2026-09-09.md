# Production rebuild trigger — 2026-09-09

Purpose: force the connected Vercel Git deployment to consume the current `main` state after the production `/health` and Next.js 16 build-mode fixes.

## Required verification

- deployment commit SHA matches `main`
- build succeeds
- `/health` returns HTTP 200
- `/api/health` returns HTTP 200
- existing production routes remain intact
- rollback candidate remains available

This file contains no secrets and does not activate payments, messaging, posting, DNS changes, or external side effects.
