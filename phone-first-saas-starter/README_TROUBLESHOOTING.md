# Troubleshooting

## Database connection fails

Check `DATABASE_URL` and `DIRECT_URL`, including SSL parameters. Supabase pooled connections are useful for runtime; use the direct connection for Prisma migrations when your provider exposes one. Then run `pnpm prisma:generate` and `pnpm prisma:migrate`.

## Prisma says the schema is out of sync

Inspect the migration history before changing production data. For a fresh prototype database, `pnpm db:reset` recreates it. For a shared database, generate and review a new migration instead.

## Clerk key errors

Confirm the publishable key is configured by Clerk automatically through its integration and that `CLERK_SECRET_KEY` is the matching development secret. Restart `pnpm dev` after changing environment variables. Do not paste the secret into client code.

## Stripe webhook signature error

Use the signing secret printed by the Stripe CLI listener for local development. Do not use the Dashboard endpoint secret with the CLI listener. Ensure the route receives the raw request body and that `STRIPE_WEBHOOK_SECRET` has no surrounding whitespace.

## Checkout does not open

Confirm `STRIPE_SECRET_KEY` is a test key, `STRIPE_PRICE_ID` is a test-mode recurring price, the application URL is correct, and the user is authenticated/synced.

## Customer Portal says no customer

A customer is created by Checkout in this prototype. Complete a successful test Checkout first, then use the portal action.

## Rate limiting seems inconsistent

The prototype limiter is process-local memory. It resets after a restart and does not coordinate across multiple instances. Replace it with a shared Redis implementation for production.

## E2E authentication

The public landing-page test runs immediately. The authenticated flow is skipped until you provide a deterministic Clerk test-session fixture and Stripe test environment. This avoids putting credentials in source control.
