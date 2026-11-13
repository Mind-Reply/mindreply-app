# web-replycontrol

This app hosts the public MindReply web surface and the Stripe checkout scaffold for the Website Completion Package.

## What is included

- Public marketing and pricing pages
- `/api/checkout` for creating a server-side Stripe Checkout Session
- `/api/webhooks/stripe` for verifying Stripe webhook signatures
- `/billing/success` and `/billing/cancel` callback pages

## Important

- Use Stripe test-mode keys during local development.
- Never commit live credentials or publishable keys to Git.
- Completion must be confirmed by a verified Stripe webhook before granting access or marking work as paid.

## Local setup

1. Create a Stripe test-mode product/price.
2. Add values to `.env.local`.
3. Start the app and visit `/pricing`.
4. Use the Stripe CLI or a secure test endpoint to validate webhook events.
