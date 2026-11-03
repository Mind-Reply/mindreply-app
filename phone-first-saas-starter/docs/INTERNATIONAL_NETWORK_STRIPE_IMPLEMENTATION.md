# International Intelligence Network — Stripe sandbox implementation

**Environment:** A11-K sandbox only  
**Stripe account:** `acct_1TztumA7TMSoVPDq`  
**Application location:** `phone-first-saas-starter` within `Mind-Reply/mindreply-app`  
**Implementation state:** code committed to a review branch; deployment and live route binding not verified.

## Executable surfaces

| Route | Purpose | Control |
|---|---|---|
| `POST /api/stripe/iin-checkout` | Hosted one-time or recurring Checkout from a server allowlist | Clerk-authenticated; idempotency key required |
| `POST /api/stripe/portal` | Customer subscription and payment-method self-service | Clerk-authenticated |
| `POST /api/stripe/invoices/draft` | Create a draft-only service invoice | Database role ADMIN; never finalizes or sends |
| `POST /api/stripe/usage` | Record usage against an organization | Clerk-authenticated; active subscription required; idempotent |
| `POST /api/stripe/usage/dispatch` | Forward eligible usage to a Stripe Billing Meter | ADMIN; sandbox key only; feature flag must be enabled |
| `POST /api/webhooks/stripe` | Verify and process Stripe event notifications | Raw-body signature verification; test-mode events only |

## Offer catalogue

The server accepts named offers, never arbitrary Price IDs supplied by the browser:

- Subscription: Operator, Sovereign, Enterprise.
- One-time services: Website Completion, Engineering, Research, Robotics, Creative, Enterprise.

Every named offer resolves to an environment-owned Price ID, then validates that the Price is active, belongs to test mode, uses the expected payment mode, and references an active Product. No code fallback to a hard-coded Price ID remains.

No new Prices or Products were created. No prices or service amounts are defined in code. Each commercial item requires an approved test-mode Product and Price before checkout becomes available.

## Usage lifecycle

1. A logged-in organization submits a usage event with a caller-generated idempotency key.
2. The application persists department, workload type, quantity, unit, customer reference and occurrence time.
3. The event remains `RECORDED_PENDING_METER` while meter definitions are absent or forwarding is disabled.
4. An ADMIN can dispatch queued usage only after `STRIPE_METER_BILLING_ENABLED=true`, sandbox credentials, customer meter event names, and corresponding metered Prices are configured.
5. Dispatch uses a stable event identifier. Any ambiguous network outcome is marked `SUBMISSION_UNKNOWN`; it is not blindly retried.
6. Reconcile Stripe meter usage against the internal usage ledger before invoice close.

Current default: `STRIPE_METER_BILLING_ENABLED=false`.

## Webhook reliability and evidence

The handler:
- verifies Stripe's signature against the raw request body before any JSON parsing;
- rejects live-mode events;
- persists an event receipt before business processing;
- atomically claims new/failed/stale events;
- stores retry state and acknowledges only processed events;
- returns retryable 5xx responses on processing failure;
- handles Checkout, subscription, invoice, payment, refund, dispute and payout lifecycle projections;
- records unknown event receipts without inventing business outcomes.

The event receipt stores event ID, type, object ID, environment and processing status. It intentionally does not archive the full raw webhook payload or unnecessary customer personal data.

## Expected webhook event families

Configure on the correct deployed sandbox endpoint after deployment identity is confirmed:

- Checkout: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`.
- Subscription: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
- Invoice: `invoice.paid`, `invoice.payment_failed`, `invoice.finalized`, `invoice.voided`, `invoice.marked_uncollectible`.
- Payment: `payment_intent.succeeded`, `payment_intent.payment_failed`.
- Refund: `charge.refunded`, `refund.created`, `refund.updated`.
- Dispute: `charge.dispute.created`, `charge.dispute.updated`, `charge.dispute.closed`.
- Payout: `payout.created`, `payout.updated`, `payout.paid`, `payout.failed`, `payout.canceled`.
- Meter administration: `billing.meter.created`, `billing.meter.updated`, `billing.meter.deactivated`, `billing.meter.reactivated`.

The Stripe account inspection found an existing endpoint for ResellerPro at `https://patch.mind-reply.com/api/stripe/webhook`. It is a separate endpoint and was not changed. The new application route path is `/api/webhooks/stripe`; do not repoint or reuse the ResellerPro endpoint until the correct deployment and domain binding are verified.

## Account inventory inspected

The A11-K sandbox currently contains:
- Active Product `PATCH Talk — Billable Reply` with a $0.01 one-time Price.
- Active `3650-live bundle` Product with a $1.00 Price whose metadata identifies a 100-reply bundle.
- Other unclassified test fixtures marked inactive/retired.
- No active, approved multi-department service catalogue was identified.
- No Billing Meter catalogue was returned by the account inventory lookup.

The existing one-cent reply Price and $1 bundle are not automatically assigned to new departments.

## Security and configuration

Required server-side configuration includes:
- `STRIPE_SECRET_KEY`: restricted test-mode API key.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the exact deployed webhook route.
- Explicit `STRIPE_PRICE_ID_*` values for each approved offer.
- `STRIPE_METER_EVENT_NAME_*` values only after meters exist.
- `STRIPE_METER_BILLING_ENABLED=false` until meter and recurring Price validation is complete.
- Clerk secrets and Prisma database URLs in the hosting secret manager.

No API key or webhook secret is committed. Live-mode credentials are rejected by the usage dispatcher, and the webhook route rejects live-mode events. Automatic tax is not enabled because tax registration and jurisdictional obligations have not been confirmed. Stripe Connect is not configured.

## Migration and tests

The Prisma schema and migration add:
- durable Stripe event receipts;
- department/workload usage ledger records;
- invoice projections;
- refund, dispute and payout adjustment projections.

Migration file:
`prisma/migrations/20261103100000_add_stripe_event_usage_ledger/migration.sql`

Tests added:
- Checkout allowlist, idempotency, quantity validation and missing-price behavior.
- Webhook signature verification, durable-first persistence, sandbox-only rejection, duplicate handling and retryable failures.

**Not yet evidenced:** Prisma migration applied to an isolated database, Prisma Client generation, TypeScript/lint/build/test results, sandbox event delivery through the deployed route, Checkout completion, customer portal, draft invoice creation, meter submission or reconciliation. No Stripe Product/Price/customer/session/invoice/meter/webhook endpoint was created or modified during this implementation work.
