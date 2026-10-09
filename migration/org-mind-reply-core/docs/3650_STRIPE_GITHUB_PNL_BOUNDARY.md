# 3650 Live — Stripe / GitHub P&L Boundary

## Canonical implementation

The canonical Worker remains:

`Mind-Reply/mind-reply-core/3650-live-worker`

WhatsApp usage telemetry enters through `POST /metrics/push` with the
`x-metrics-secret` header. The Worker records measured reply count, billable
count, direct AI cost, and cost-ceiling breaches in `PROOF_VAULT`.

## P&L contract

The Worker reports measured operational economics:

- `price_per_billable = $0.01`
- `total_replies_ever`
- `billable_events_ever`
- `ai_cost_ever`
- `gross_ever`
- `real_profit_ever`
- daily measured counters
- cost-ceiling breach counts

The $0.30 ceiling is a protection boundary. A breach is not treated as a
billable event.

At 5,000 billable events/day, the gross arithmetic is $50/day, $1,500 per
30-day month, and $18,250 per 365-day year before AI, Cloudflare, and Stripe
costs.

## Stripe boundary

Worker billable counters are usage evidence. They are **not Stripe revenue**.

Stripe revenue must be established from Stripe's own payment/invoice records.
Micro-events must be aggregated/bundled rather than creating a Stripe charge
for every $0.01 event. The Worker therefore does not call Stripe directly.

For a new usage-based billing integration, the Stripe-side usage layer should
be evaluated separately using Stripe's current usage-billing architecture.
Any live billing mutation requires its own verification and owner approval.

## Verification

The GitHub deployment workflow requires:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `PROOF_WRITE_TOKEN`
- `METRICS_SECRET`

After deployment it verifies `/monitor/public`, `/monitor/audit`, and the
`/metrics` contract.

No secret values belong in Git.
