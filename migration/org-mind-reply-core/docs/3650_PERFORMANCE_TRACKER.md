# 3650 LIVE — PERFORMANCE TRACKER

Date: 2026-10-03
Canonical repository: Mind-Reply/mind-reply-core
Worker: 3650-live-worker
Tracking principle: operational proof, commercial evidence, and profitability are separate states.

## Status

| Track | Current state | Evidence required to advance |
|---|---|---|
| Proof runtime | PROVEN path exists | Runtime proof receipt / hash-chain evidence |
| 7-day chain | 001142 established; 001143 next | Sequential proof write + verification |
| $49 license | LIVE Stripe Price enabled | Actual paid subscription/invoice |
| $0.001 usage | NOT LIVE | Meter + billability rule + reconciliation |
| Billable usage | NOT MEASURED in a verified /metrics surface | Real entitlement-based counter |
| Revenue | NOT ESTABLISHED | Stripe transaction/invoice/payment evidence |
| Net revenue | NOT ESTABLISHED | Revenue less fees/refunds |
| Infrastructure cost | Planning estimate only | Actual Cloudflare/runtime usage and invoice |
| Profitability | NOT ESTABLISHED | Positive net result with attributable cost evidence |

## Canonical performance ledger

For each reporting period, record:

- proof_blocks_verified
- total_replies_actual
- billable_events_actual
- billability_rule_version
- paying_licenses
- realized_license_revenue
- realized_usage_revenue
- Stripe_fees
- refunds_chargebacks
- Cloudflare_infrastructure_cost
- other_attributable_costs
- net_revenue
- net_profit
- evidence_commit
- evidence_runtime
- evidence_stripe

## Calculation rules

realized_usage_revenue = actual_billable_events × realized_contract_price

net_revenue = realized_revenue - Stripe_fees - refunds_chargebacks

net_profit = net_revenue - Cloudflare_infrastructure_cost - other_attributable_costs

Planning assumptions such as $0.001/event and $5.65/month infrastructure are not realized performance.

## 7-day evidence window

- 3650-001142 — SOFIA — established
- 3650-001143 — DUBAI — next
- 3650-001144 — NYC
- 3650-001145 — LONDON
- 3650-001146 — TOKYO
- 3650-001147 — PATCH / SHIP DAY
- 3650-001148 — TALK + LIVE

Each block is independently verified. A PROVEN block is not automatically revenue or profit evidence.

## Commercial gates

### Gate A — Measurement
[ ] Real billability rule defined
[x] Read-only proof-event measurement added without replacing proof-chain logic
[ ] /metrics deployed and verified against live KV

### Gate B — Billing
[ ] Stripe usage meter connected
[ ] Stable customer/workspace/license attribution
[ ] Usage reconciles to Stripe billing period
[ ] Webhook/payment state verified

### Gate C — Financial evidence
[ ] Realized Stripe revenue
[ ] Stripe fees
[ ] Refunds/chargebacks
[ ] Actual infrastructure cost
[ ] Net revenue
[ ] Net profit

## Evidence rule

Never infer commercial performance from:
- PROVEN status alone
- Worker request volume alone
- KV activity alone
- Supabase log counts
- planning scenarios
- catalog objects without customer payments

The canonical source of truth is GitHub documentation/code plus independently verifiable runtime and Stripe transaction evidence.

## Latest implementation evidence

- Metrics implementation commit: `c6e3e65d775aa15117233d9be5ad95174ae27aa4`
- The new `GET /metrics` surface reports paginated proof-event counts and deliberately leaves reply/billable counts unset until a real billability rule exists.
- No deployment claim is made from this commit alone.
