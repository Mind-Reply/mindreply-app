# Deployment

## Vercel

Import the repository/project and set the environment variables from `.env.example`. Set `NEXT_PUBLIC_APP_URL` to the deployed origin. Build command: `pnpm build`. After deployment, create a Stripe test webhook endpoint targeting `/api/webhooks/stripe` and copy its signing secret to `STRIPE_WEBHOOK_SECRET`. Use the Supabase connection string as `DATABASE_URL` and run migrations with `pnpm prisma:migrate:deploy` from a controlled environment.

## Render

Create a Node web service. Build: `pnpm install && pnpm prisma:generate && pnpm build`. Start: `pnpm start`. Set the same environment variables. Configure the Stripe test webhook URL to the Render origin plus `/api/webhooks/stripe`.

## Fly.io

Deploy as a normal Node/Next.js application using the project's Docker/Node build process or a generated Fly Dockerfile. Set secrets with the platform secret mechanism. Run Prisma migrations during release/deploy, not during every application boot. Point Stripe test webhooks at the public `/api/webhooks/stripe` endpoint.

## Self-hosted VM

Install Node 20 and pnpm, clone the project, set `.env.local` or process environment, run `pnpm install`, `pnpm prisma:generate`, `pnpm prisma:migrate:deploy`, `pnpm build`, then `pnpm start`. Put a TLS reverse proxy in front of the Node process. Keep the webhook endpoint public but signature-protected.

## Required environment groups

Server: DATABASE_URL, DIRECT_URL, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID. Optional SENTRY_DSN.

Client-safe: NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SENTRY_DSN.

Do not put secrets in `NEXT_PUBLIC_*` variables.
