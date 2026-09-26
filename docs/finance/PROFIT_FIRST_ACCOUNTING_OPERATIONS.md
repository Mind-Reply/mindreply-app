# Profit-First Accounting Operations

Status: ACTIVE EXECUTION PRIORITY
Owner: A11ceo
Execution lead: A11pro
Financial evidence boundary: FIN-A Money Truth

## Objective

Make verified profit and accounting truth the first operating priority across the execution team. The system must make financial processing smooth, traceable, fail-closed, and immediately visible when fresh evidence exists.

## Priority order

1. Contribution profit and cash truth
2. Revenue collection and revenue recovery
3. Fully loaded CAC, LTV, payback, retention and expansion
4. Pricing and margin protection
5. Cost control and capital allocation
6. Operational throughput and growth

## Accounting processing loop

CAPTURE → VALIDATE → NORMALIZE → DEDUPLICATE → RECONCILE → CLASSIFY → CALCULATE → VERIFY → LEDGER → REPORT

Every financial record must retain source provenance, currency, accounting period, evidence timestamp, reconciliation state, and confidence/exception state.

## Live truth rules

- Never label stale, simulated, planned, or locally generated data as live.
- Fresh provider reads are the source for live financial state.
- FIN-A Money Truth is read-only and fail-closed until explicitly activated for write/reporting capabilities.
- Conflicts and missing provider capabilities remain visible; they are not silently resolved.
- Integer-cent accounting is required for monetary calculations.
- No charges, refunds, payouts, spending, or provider writes occur from this accounting layer without explicit owner approval and an authorized execution path.

## A11ceo / A11pro responsibilities

A11ceo: approve financial policy, irreversible spend, capital allocation, and release of financial actions.

A11pro: coordinate ingestion, reconciliation, exception handling, evidence capture, reporting, and handoff.

FIN-A: establish financial evidence and reconciliation truth.

Verification: prove freshness, source provenance, arithmetic consistency, duplicate handling, and reconciliation status before reporting.

## Operating dashboard

The live financial surface should expose:

- Revenue
- Gross profit
- Contribution profit
- Verified costs
- Fully loaded CAC
- LTV
- Payback
- Cash / payout state where source evidence exists
- Revenue recovery opportunities
- Reconciliation exceptions
- Data freshness
- Last verified evidence timestamp

Unknown values must remain UNKNOWN rather than being estimated as live facts.

## Hourly requirement

The user requested hourly live accounting visibility. The current automation scheduler does not support hourly recurring cadence, so no false hourly automation is claimed. Until an hourly runtime is actually available, live financial state must be retrieved on demand and clearly timestamped.

## Release gate

No financial action is promoted to EXECUTE unless:

UNDERSTAND → PROTECT → PLAN → VALIDATE → APPROVE → EXECUTE → VERIFY → RECORD

has passed.

## Success condition

The financial operation is considered smooth only when the team can trace a reported financial number back to verified source evidence, reconcile it deterministically, expose exceptions immediately, and preserve an auditable record of the result.
