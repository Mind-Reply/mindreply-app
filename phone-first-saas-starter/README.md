# Phone-first SaaS Starter

A compact Next.js 14 App Router prototype using Clerk, Supabase Postgres/Storage, Prisma, Stripe test mode, Zod, Vitest and Playwright. It is designed to be portable to Vercel, Render, Fly.io or a self-hosted Node VM.

## 30-minute local setup

1. Requirements: Node 20+, pnpm 9+, a Supabase project, Clerk development instance and Stripe test account.
2. `cd phone-first-saas-starter`
3. `pnpm install`
4. `cp .env.example .env.local`
5. Fill `DATABASE_URL`, `DIRECT_URL`, Clerk keys, Stripe test keys/price and public Supabase values.
6. `pnpm prisma:generate`
7. `pnpm prisma:migrate` (or use `pnpm prisma:migrate:deploy` for an already-created migration history).
8. `pnpm prisma:seed`
9. `pnpm dev`
10. Open the local app and create a Clerk test user.

## Stripe test webhooks

Install and authenticate the Stripe CLI separately, then run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. Copy the displayed webhook signing secret into `STRIPE_WEBHOOK_SECRET`. Use only test-mode keys and prices.

Test the application with `pnpm test`, then `pnpm test:e2e`. The authenticated Playwright flow is intentionally a skeleton because real Clerk sessions require test credentials/session fixtures.

## Architecture

- Next.js App Router + React 18 + Tailwind.
- Clerk protects application routes. `src/lib/clerk.ts` provides server authentication and a safe Prisma upsert for the Clerk user ID.
- Prisma is the application data layer. Supabase provides managed Postgres and optional Storage; the application does not require proprietary database APIs.
- Stripe Checkout and Customer Portal are server-only. The webhook verifies the Stripe signature and uses `IdempotencyRecord` to reject duplicate event IDs.
- The rate limiter is intentionally in-memory for a prototype. Replace it with a shared Redis/Upstash-style atomic store before horizontal scaling.
- Sentry files are stubs: provide a DSN and replace the console hooks with the Sentry SDK when desired.

## Security

Never expose `DATABASE_URL`, `DIRECT_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` or a Supabase service-role key to browser code. Only `NEXT_PUBLIC_*` variables are permitted in client modules.

Stripe webhooks must use raw request bodies and signature verification; do not parse JSON before `constructEvent`. Authentication is handled by Clerk. For state-changing browser endpoints, prefer same-origin server actions or same-site cookies. If you add public JSON APIs, explicitly configure CORS and CSRF protections rather than allowing `*`.

## Production hardening checklist

- [ ] Replace in-memory rate limiter with shared Redis.
- [ ] Add Clerk webhook signature verification for authoritative user lifecycle synchronization.
- [ ] Add database connection pooling and separate migration credentials.
- [ ] Replace Sentry stubs with the official SDK.
- [ ] Add CSP/security headers and strict CORS where APIs are exposed.
- [ ] Add Stripe event replay/dead-letter monitoring.
- [ ] Add backups, alerting, structured logs and audit retention.
- [ ] Run E2E against isolated test credentials before production.
- [ ] Use live Stripe keys only after a separate production review; this starter intentionally defaults to test mode.
