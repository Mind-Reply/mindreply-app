# 3650 GitHub ↔ Stripe Integration Boundary

Status: PARTIALLY ENABLED / USAGE BILLING NOT YET ENABLED

Date: 2026-10-03

## GitHub

Canonical implementation:
- Repository: Mind-Reply/mind-reply-core
- Worker: 3650-live-worker
- Evidence/P&L model: docs/PROOF_CHAIN_3650_7DAY_2026-10-03.md
- Operating branch: x31-worktree

GitHub is the source of truth for Worker code, proof-chain logic, measurement definitions, and evidence documentation.

## Stripe LIVE

Active LIVE Stripe account verified:
- Account: A11-K
- Account ID: acct_1TztuKAQ1te7GXAz

LIVE catalog objects created and tagged to the canonical GitHub repo:
- 3650 LIVE Usage product: `prod_VMzLsWk8iGSTAa`
- 3650 LIVE License product: `prod_VMzL3CG16cLo8d`
- 3650 LIVE License monthly $49 price: `price_1UMFMrAQ1te7GXAzgOnaZKXf`
- License lookup key: `3650_live_license_monthly_usd49`

The $49 monthly license is now represented as an active LIVE recurring Stripe Price.

## Usage billing

The $0.001/event model is NOT yet activated as a LIVE usage-billing meter. New usage-based billing is intended to use a metering system rather than micro-charges, and the current Stripe integration path does not expose a meter creation operation through this session.

Do not create a Stripe charge for each $0.001 event.

Before usage billing is activated:
1. Define the Worker billability entitlement.
2. Aggregate billable events by billing period.
3. Connect the usage meter/billing provider.
4. Record a stable customer/workspace/license identifier for attribution.
5. Reconcile Worker counters against Stripe invoices/payment records.
6. Record refunds/chargebacks and attributable Stripe fees.
7. Verify net revenue from transaction-level evidence.

## Evidence rule

`billable_events_ever` is usage evidence only. It is not Stripe revenue.

Stripe revenue is established only by realized Stripe transaction/invoice/payment evidence attributable to measured usage or a paid license.

No customer payment was created or charged by this setup action.

## Current state

- GitHub ↔ 3650 Worker: CANONICAL / RECORDED
- Stripe LIVE account: VERIFIED
- 3650 LIVE License product: ENABLED
- 3650 LIVE License monthly price: ENABLED
- 3650 usage product shell: CREATED
- $0.001 usage billing: NOT ENABLED
- Worker billing code/webhook reconciliation: NOT VERIFIED LIVE
- Profitability: NOT ESTABLISHED
