# Purchase Fulfilment Controller — Operating Runbook

**Purpose:** Evidence-gated, low-friction tracking from product preference through verified setup. This runbook records status; it does not itself authorize purchases, seller contact, private-account access, or delivery-detail changes.

## Canonical naming

Use these exact machine-readable state IDs everywhere (issues, dispatch summaries, dashboards, and evidence records):

1. `PREFERENCE_CONFIRMED`
2. `SELLER_CONFIGURATION_VERIFIED`
3. `PRICE_STOCK_VERIFIED`
4. `DELIVERY_VERIFIED`
5. `OWNER_PURCHASE_APPROVED`
6. `ORDER_PLACED`
7. `DISPATCHED`
8. `IN_TRANSIT`
9. `DELIVERED`
10. `SETUP_VERIFIED`

Human-readable titles should be short and consistent: “Preference confirmed”, “Seller/configuration verified”, “Price and stock verified”, “Delivery verified”, “Owner purchase approval”, “Order placed”, “Dispatched”, “In transit”, “Delivered”, and “Setup verified”.

## State transition contract

A state can advance only when its required evidence is linked in the evidence ledger. If evidence is missing, stale, contradictory, inaccessible, or not direct enough, retain the previous state and mark the next gate `BLOCKED` or `UNKNOWN`. Never infer later fulfilment from earlier milestones.

| State | Minimum evidence required |
|---|---|
| `PREFERENCE_CONFIRMED` | Owner-provided model, storage, and finish preference; record unknown attributes explicitly. |
| `SELLER_CONFIGURATION_VERIFIED` | Current seller-owned page confirms exact model, storage, and finish; direct URL and observed timestamp. |
| `PRICE_STOCK_VERIFIED` | Current seller/checkout evidence for exact configuration, stock or allocation, currency, payable price, tax, shipping, and mandatory fees where shown. Cached snippets do not qualify. |
| `DELIVERY_VERIFIED` | Seller checkout or delivery page verifies eligibility to the saved destination, estimated window, delivery fees, warranty, and returns. Do not expose or guess the destination. If private access is required but unavailable, record `UNKNOWN`. |
| `OWNER_PURCHASE_APPROVED` | Explicit approval for the exact seller, configuration, final total, delivery terms, warranty/returns, and payment terms. A general product preference or approval to edit this repository is not purchase approval. |
| `ORDER_PLACED` | Direct seller confirmation/receipt with order reference and timestamp. Never create or guess an order ID. |
| `DISPATCHED` | Seller dispatch confirmation or carrier acceptance evidence with a real tracking reference/link. A label-created event alone is not proof the carrier has the parcel. |
| `IN_TRANSIT` | Carrier tracking page shows a dated physical movement/acceptance event. Record event text and observation timestamp. |
| `DELIVERED` | Carrier proof of delivery or owner-provided evidence. Record only the minimum necessary and do not expose personal delivery data. |
| `SETUP_VERIFIED` | Owner confirmation or explicitly authorized direct evidence that initial setup completed. Do not access a private device/account without permission. |

## Per-run routine

1. Read the primary tracking issue and prior unresolved items before taking action.
2. Timestamp the run in the relevant local timezone (for Bulgaria, `Europe/Sofia`).
3. Recheck direct primary sources for all unresolved gates; record URLs and observation timestamps.
4. Compare current evidence with the last ledger entry. If no qualifying evidence changed, record `NO VERIFIED CHANGE`.
5. Update only the highest supported state; list the next unmet gate and exact missing evidence.
6. Ask for an owner decision only when a complete qualifying offer is verified. Present seller, exact configuration, final payable total/currency, stock evidence, delivery eligibility/estimate, warranty/returns, payment terms, and uncertainty together.
7. Never buy, pay, contact sellers, access private accounts, or change delivery details unless explicit authorization covers that exact action and an authorized capability is available.
8. After order placement, follow seller/carrier events in order. Each event requires its own evidence. Do not claim continuous monitoring unless an actual scheduled automation is configured and verified.
9. Keep the primary issue open until the requested workflow is complete or the owner explicitly stops it. Do not close it merely because a plan or document was created.

## Evidence ledger format

Append one compact entry per run:

- **Run:** ISO 8601 timestamp with timezone
- **Result:** `PASS`, `PARTIAL`, or `BLOCKED`
- **Current state:** canonical ID plus human-readable title
- **Evidence checked:** source, direct URL, observation timestamp, relevant fact
- **Changes:** verified change or `NO VERIFIED CHANGE`
- **Offer fields:** model/storage/finish, seller, price/currency, taxes/fees, stock/allocation, delivery eligibility/window/source, warranty/returns, uncertainties
- **Blockers:** exact missing evidence or unavailable connection/access
- **Owner decision:** exact decision required, or `NONE`
- **Next action:** responsible party and objective verification condition

## Reporting structure

Every user-facing run uses this exact order:

1. **RUN RESULT:** PASS / PARTIAL / BLOCKED
2. **PURCHASE STATE:** current state + evidence
3. **VERIFIED CHANGES SINCE LAST RUN**
4. **PRICE / STOCK / DELIVERY COMPARISON:** direct links
5. **BLOCKERS:** precise missing evidence/access
6. **OWNER DECISION REQUIRED:** if any
7. **NEXT ACTION:** responsible party + verification condition

Use `VERIFIED`, `READY`, `BLOCKED`, `FAILED`, or `UNVERIFIED` for evidence status. Do not invent prices, stock, order references, tracking numbers, addresses, delivery dates, or completion claims.

## Current tracked purchase

Primary issue: https://github.com/Mind-Reply/mindreply-app/issues/84

The iPhone 18 Pro Max 512GB preference is not proof of an order. Current seller price/stock and destination-specific delivery must be reverified before any purchase decision. Any price ceiling or seller delegation is bounded and does not waive the evidence gates or authorize substitutions.
