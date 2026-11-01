# Commercial attribution contract

Status: measurement design only; no Stripe mutations or financial claims.

## Separate the ledgers

- Provider usage ledger: source of model/API input and output units, cached units, request IDs, rates, credits and invoice line items.
- Stripe commercial ledger: source of customer payment intents/charges, refunds, disputes, fees, balance transactions, invoices and payouts where applicable.
- Product event ledger: source of workflow, customer, product, run and attribution identifiers.

Stripe does not provide model token usage costs. Provider billing does not establish collected customer revenue.

## Attribution keys

Use stable, non-sensitive identifiers: product_id, workflow_id, customer_reference (pseudonymous), benchmark_run_id, provider_request_id, stripe_payment_intent_id and invoice_id. Never place secrets or raw customer content in metadata.

## Metrics

For each workflow and reporting period, calculate separately:
- gross captured revenue;
- refunds and disputes;
- Stripe processing fees;
- net collected revenue after those adjustments;
- provider usage cost from provider invoices/usage exports;
- other directly attributable delivery costs;
- contribution = net collected revenue minus attributable delivery costs.

Do not label gross payment volume as profit. Do not attribute a payment to a model unless an auditable workflow/run relationship exists. Avoid allocating shared costs without a documented allocation method.

## Current read-only account observation

A fresh live Stripe balance read returned GBP 0 available and GBP 0 pending at the time checked. This is a balance snapshot only; it does not prove no revenue across all channels, no historical activity, or zero profit. No charges, refunds, payouts, account settings or payment objects were changed in this task.
