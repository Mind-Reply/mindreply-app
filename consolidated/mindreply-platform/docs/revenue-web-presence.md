# MindReply Revenue Web Presence

## Deployment policy
Never claim production readiness, live payments, active subscriptions, real-time metrics, or successful deployments unless verified.

## Revenue surfaces
Pricing, protected account surfaces, entitlement-aware upgrade prompts, subscription/usage/purchase models where actually implemented, and verified revenue reporting.

## Payment safety
Keep payment credentials server-side, verify signed webhooks, use idempotent processing, record payment events in an auditable ledger, and require explicit owner approval before live billing.

## Product entitlements
Plans and limits must be server-side, not only UI conditions.

## Metrics
Where data exists, track MRR, ARR, subscriptions, churn, LTV, CAC and ARPU with explicit definitions and source timestamps.

## Testing
Verify products/prices, checkout, webhook signatures, ledger reconciliation, entitlements, cancellation/refund handling, Terms and Privacy, and explicit owner approval before live billing.
