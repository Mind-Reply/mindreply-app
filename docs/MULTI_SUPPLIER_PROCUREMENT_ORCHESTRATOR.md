# Multi-Supplier Procurement Orchestrator

**Status:** implementation contract / draft. This document does not authorize supplier contact, purchasing, payment, address changes, or deployment.

## Purpose

Provide a reusable, evidence-first procurement workflow for hardware purchases and multi-item bills of materials. The first tracked use case is the owner's preferred iPhone 18 Pro Max 512GB purchase; this is a sourcing priority, not evidence that an order exists.

## Reuse existing fulfilment controls

Before adding a parallel evidence system, reuse and extend the existing fulfilment controls:

- `docs/FULFILMENT_WORKER_PROTOCOL.md` for event/evidence semantics.
- `scripts/validate_fulfilment_evidence.py` and `tests/test_validate_fulfilment_evidence.py` for evidence validation.
- `.github/workflows/fulfilment-evidence-gate.yml` as the CI gate for related changes.
- Existing API conventions and database schema in `app/api` and `lib/db`; inspect before introducing new tables or routes.

Do not create a second competing source of truth for fulfilment events.

## State machine

A purchase may advance only through the following ordered states:

1. `PREFERENCE_CONFIRMED`
2. `SELLER_CONFIGURATION_VERIFIED`
3. `PRICE_STOCK_VERIFIED`
4. `DELIVERY_TO_DESTINATION_VERIFIED`
5. `OWNER_PURCHASE_APPROVAL`
6. `ORDER_PLACED`
7. `DISPATCHED`
8. `IN_TRANSIT`
9. `DELIVERED`
10. `SETUP_VERIFIED`

Every transition must validate evidence for that state. A prior state does not imply a later state. General product acceptance is not purchase authorization.

### Required transition evidence

| State | Minimum evidence |
|---|---|
| Preference confirmed | Exact model/configuration and requested quantity; finish marked unknown if not chosen |
| Seller/configuration verified | Seller-owned source, exact SKU/configuration, observation timestamp and timezone |
| Price/stock verified | Current price and currency, VAT/tax treatment, mandatory fees, explicit available/allocated stock evidence, source and timestamp |
| Delivery verified | Destination eligibility, delivery charge and ETA from seller/carrier evidence; never persist or log full address unless strictly necessary |
| Owner approval | Explicit approval bound to exact seller, SKU/configuration, final total, delivery terms, warranty and returns; approval expires if any material term changes |
| Order placed | Direct seller/order confirmation and unique order reference |
| Dispatched | Seller dispatch evidence or carrier acceptance/dispatch event plus tracking reference |
| In transit | Carrier event with timestamp and shipment reference |
| Delivered | Carrier proof-of-delivery or equivalent direct evidence |
| Setup verified | Owner-provided confirmation or a verified setup checklist completed by the owner |

If evidence is missing, stale, contradictory or inaccessible, report `BLOCKED` or `UNKNOWN`; do not advance.

## Supplier and BOM record

Each supplier quote / line item should capture:

- Supplier identity and supplier-owned source URL
- Region / fulfilment warehouse where evidenced
- Manufacturer, SKU, exact description and quantity
- Currency; unit and line totals excluding and including VAT where available
- Shipping, insurance and other mandatory fees
- Stock state (`IN_STOCK`, `ALLOCATED`, `PREORDER`, `BACKORDER`, `UNAVAILABLE`, `UNKNOWN`)
- Lead time and delivery estimate with source and observation timestamp
- Warranty, returns/cancellation terms, substitutions and quote expiry
- Evidence status (`VERIFIED`, `UNVERIFIED`, `UNKNOWN`, `BLOCKED`) and missing-evidence list

Never treat a cached snippet, old crawl, generic shipping policy, or “notify me” page as current allocated stock or destination-specific delivery evidence.

## RFQ and purchase-order controls

- Generate RFQs and purchase orders as **DRAFT** only.
- Supplier communication remains disabled until the owner explicitly authorizes the named recipients, message content and purpose and an authorized communication connector is available.
- Purchase execution remains disabled until explicit owner approval is recorded for the exact seller, configuration, total, currency and terms.
- Any material change to price, stock, configuration, delivery, warranty or returns invalidates the approval and returns the workflow to the relevant verification state.
- Do not invent supplier contacts, VAT IDs, delivery details, stock, order references or tracking numbers.
- Never substitute a seller automatically.

## Sourcing gates

Apply only relevant technical checks for the category:

- Compatibility and exact configuration.
- Manufacturer lineage, cell grade and firmware for battery/power/control equipment.
- Closed-loop communication compatibility for power/control equipment.
- Full transit insurance coverage where required.
- Warranty, returns, cancellation and regional compliance.

Do not impose battery-specific criteria on unrelated consumer electronics.

## Privacy and security

- Ask only for the minimum destination input required to check delivery eligibility.
- Keep full delivery addresses out of logs, public issue comments, evidence snapshots and generated reports.
- Store source references and redacted evidence; use access-controlled storage for any sensitive order documents.
- Never access private seller or payment accounts unless a supported connection and explicit authorization exist.
- Never initiate payment, place an order, message suppliers or mutate delivery details as a side effect of quote comparison.

## Structured run report

Every run must output:

1. `RUN RESULT`: PASS / PARTIAL / BLOCKED
2. `PURCHASE STATE`: current state and direct evidence
3. `VERIFIED CHANGES SINCE LAST RUN`: or `NO VERIFIED CHANGE`
4. `PRICE / STOCK / DELIVERY COMPARISON`: direct links and evidence freshness
5. `BLOCKERS`: exact missing evidence or access
6. `OWNER DECISION REQUIRED`: exact decision, if any
7. `NEXT ACTION`: responsible party and verification condition

## Acceptance criteria

- [ ] A single validated state-transition function prevents skipping or reversing gates without an explicit audited correction.
- [ ] Unit tests cover every transition, missing/stale/contradictory evidence, price changes, unknown destination eligibility, duplicate order references and unauthorized actions.
- [ ] RFQ/PO generation is draft-only by default.
- [ ] Approval is bound to an immutable snapshot of seller, SKU, total, currency and terms.
- [ ] Any material offer change invalidates approval.
- [ ] UI/API distinguish `VERIFIED`, `UNKNOWN`, `BLOCKED`, `DRAFT` and `OWNER_APPROVAL_REQUIRED`.
- [ ] Audit events contain timestamps, actor/action and evidence references without unnecessary private data.
- [ ] Existing fulfilment evidence validation and CI remain passing.
- [ ] Build/tests/security review pass before merge; deployment and production health are verified independently.

## Implementation sequence

1. Inspect current fulfilment protocol, validator, evidence records, DB schema and API conventions.
2. Extend existing evidence schema/validator for supplier quote, price, stock, delivery, approval and BOM evidence.
3. Add typed procurement domain model and guarded transition validator with unit tests.
4. Add supplier comparison and structured handoff output.
5. Add draft-only RFQ/PO rendering.
6. Add persistence and access control only after schema and auth review.
7. Add UI and API only after domain/validator tests pass.
8. Open a PR with test evidence; deploy only after review, CI and environment checks pass.

## Initial tracked priority

iPhone 18 Pro Max 512GB. Finish is not treated as confirmed unless the owner confirms it. Current purchase must remain blocked until a current seller offer, allocated stock, final total, delivery eligibility and terms are evidenced. This record does not authorize a purchase or supplier contact.
