# Fulfilment Worker Protocol

**Status:** READY FOR REVIEW — proposed on branch `ops/fulfilment-worker-gates`  
**Scope:** Evidence collection and validation for fulfilment workflows. This protocol does not place orders or grant private-account access.

## Operating model

Workers are bounded specialists; the coordinator owns the state machine and audit trail.

| Worker | Responsibility | Must stop / escalate when |
|---|---|---|
| Coordinator / State Controller | Runs the stages in order, deduplicates observations, compares with prior run, and advances only when evidence requirements pass. | Required evidence is absent, stale, contradictory, or inaccessible. |
| Seller Evidence | Checks seller-owned pages for exact model, capacity, finish/SKU, listing price, stock/preorder language, warranty and returns. | Search snippets conflict with seller page; exact configuration is unclear. |
| Price & Allocation | Separates displayed price from final payable total; captures VAT, delivery and mandatory fees; verifies allocated stock. | Checkout/account access is needed, or no direct allocation proof exists. Return UNKNOWN/BLOCKED; never sign in or submit checkout. |
| Delivery & Policy | Verifies shipping scope, estimate, cost, warranty and return terms. | Saved-destination eligibility cannot be confirmed through authorized evidence. Record UNKNOWN; do not expose or change address details. |
| Ledger QA | Validates schema, source, timestamp, exact configuration, contradictions and change-vs-prior-run. | Missing source/timestamp, stale evidence, contradictory stock or unsupported claims. |
| Owner Approval Gate | Presents one fully qualified offer with seller, exact configuration, final total and terms. | Any gate is incomplete. Approval must identify the exact offer and terms. |
| Fulfilment Watcher | Starts only after a real order reference exists; follows dispatch, carrier events, delivery proof and owner-confirmed setup. | No seller/carrier evidence. Never synthesize status or claim continuous monitoring unless an actual scheduler is configured and observed. |

## State machine

1. `PREFERENCE_CONFIRMED`
2. `SELLER_CONFIGURATION_VERIFIED`
3. `PRICE_STOCK_VERIFIED`
4. `DELIVERY_VERIFIED`
5. `OWNER_PURCHASE_APPROVED` — exact seller, configuration, final total and terms
6. `ORDER_PLACED` — seller confirmation and order reference
7. `DISPATCHED` — seller/carrier dispatch evidence
8. `IN_TRANSIT` — carrier event
9. `DELIVERED` — proof of delivery
10. `SETUP_VERIFIED` — owner-confirmed setup

Never skip a state. A displayed listing price is not a final payable total. “In stock” snippets are not allocation evidence. If sources conflict, the record remains BLOCKED until resolved.

## Evidence record contract

Each observation is an append-only JSON record under `evidence/fulfilment/` with:
- run timestamp in ISO 8601 including timezone;
- status: `VERIFIED`, `BLOCKED`, `FAILED`, or `UNVERIFIED`;
- observation type, exact configuration, source URL, observed value and next action;
- explicit missing-evidence list;
- stock state: `allocated`, `in_stock_unallocated`, `preorder`, `out_of_stock`, or `unknown`;
- displayed price and final payable total kept as separate fields.

Do not put personal delivery addresses, secrets, session cookies, payment data or private account information in this public repository. Destination-specific delivery remains `UNKNOWN` unless authorized direct evidence can be recorded without disclosing the destination.

## Activation and permissions

- Evidence workers can inspect public seller pages and write evidence records on the branch.
- Static validation runs on pull requests and manual workflow dispatch.
- No automatic purchase, seller contact, checkout submission, payment, private-account access, or delivery-detail mutation is implemented or permitted by this protocol.
- The fulfilment watcher is dormant until a verified order reference exists.
- Do not describe these workers as continuously running: this PR provides role contracts and validation. A live scheduled worker requires a configured scheduler, authorized data source, successful run evidence and operational monitoring.

## Acceptance checks

- Missing or malformed timestamps, source URLs, status, or configuration fail validation.
- Stock state and price fields are typed and explicit.
- Unknown destination delivery does not pass the delivery gate.
- Repeated runs do not advance state without new qualifying evidence.
- Owner approval is required for one exact offer before any purchase execution.
- No order/dispatch/transit/delivery/setup state is accepted without its own direct evidence.
