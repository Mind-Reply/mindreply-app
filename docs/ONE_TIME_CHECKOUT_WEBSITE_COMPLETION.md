# Website Completion Package — one-time Checkout

## Offer contract
- Package key: `website_completion_gbp_600`
- Price: GBP 600, one-time payment (60,000 pence)
- Checkout mode: Stripe-hosted Checkout, `mode: payment`
- Price ID is supplied only by server-side `STRIPE_PRICE_ID_WEBSITE_COMPLETION`.
- The endpoint validates the retrieved Price is active, one-time, GBP, and exactly 60,000 pence. The browser cannot choose a price or amount.
- A checkout session is not proof of payment or revenue. Only a signature-verified, successfully paid Checkout Session may create/update the order ledger.

## Required configuration
- `STRIPE_SECRET_KEY`: restricted server-side key for the intended Stripe account and environment.
- `STRIPE_WEBHOOK_SECRET`: secret for the exact deployed webhook endpoint.
- `STRIPE_PRICE_ID_WEBSITE_COMPLETION`: explicitly identified active one-time GBP 600 Price. Never reuse the current generic custom-amount prices without verified identity.
- `NEXT_PUBLIC_APP_URL`: exact deployed app origin. Verify success/cancel routes exist before enabling.

## Verification gates
1. Configure and validate a clearly identified GBP 600 one-time Price in Stripe test mode.
2. Apply the Prisma migration to a disposable/test database; regenerate Prisma Client.
3. Send signed test webhook events to the actual route; test paid, unpaid, duplicate, invalid signature, cancelled, and delayed/failed payment cases.
4. Confirm idempotency and order-ledger correctness, including environment separation.
5. Verify build/typecheck/tests and preview routes.
6. Confirm the actual production site/deployment owns this route and its environment variables.
7. Request explicit owner approval before creating/modifying live Stripe resources, changing webhook endpoints, or deploying.

## Safety
- Do not fulfil an order from the success redirect or an unverified client payload.
- Do not treat test orders as revenue.
- Do not mark unpaid/async sessions as paid.
- Do not expose secret values in logs, source, or browser code.
- This change does not create Stripe products/prices, sessions, or webhook endpoints by itself.
