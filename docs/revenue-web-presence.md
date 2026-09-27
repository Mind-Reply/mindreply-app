# MindReply Revenue Web Presence

This is an implementation specification, not proof of live billing. Production, payments, subscriptions, metrics, and deployments must be verified before being described as live.

## Deployment
Current direction: Cloudflare / ResellerPro. Do not make Vercel the default deployment path.

## Revenue architecture
- Pricing and plan comparison.
- Protected customer/operator dashboard surfaces.
- Server-side entitlements and usage limits.
- Subscription, usage-based, one-time purchase, and referral models only where implemented.
- Revenue reporting from verified payment/subscription data.

## Payment controls
- Keep payment secrets server-side and out of git.
- Verify signed webhooks and make handlers idempotent.
- Record payment events in an auditable ledger.
- Do not trigger irreversible fulfillment/payout from an unverified event.
- Keep live billing disabled until explicit owner approval and successful test-mode verification.

## Metrics
MRR, ARR, active subscriptions, churn, LTV, CAC, and ARPU must have defined calculations and source timestamps. Assumptions must never be presented as observed revenue.

## Launch verification
1. Verify payment products/prices.
2. Test checkout in test mode.
3. Verify webhook signature and idempotency.
4. Verify ledger reconciliation.
5. Verify entitlement transitions.
6. Verify cancellation/refund handling.
7. Verify Terms and Privacy pages.
8. Obtain explicit owner approval before live billing.

## Multi-app contract
ResellerPro, Nowline, Market Intelligence, OTA Suite, and future products should share a common revenue/entitlement contract where practical.
