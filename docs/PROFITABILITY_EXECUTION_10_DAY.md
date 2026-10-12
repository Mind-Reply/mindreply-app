# MindReply 10-Day Profitability Execution

Status: execution plan; not proof of production readiness, sales, or revenue.
Window: 2026-10-12 through 2026-10-21.
Objective: first reliable, fulfilled, reconciled customer sale.
Risk posture: balanced; protect customer data, cash, production, and owner approval boundaries.

## Evidence baseline

- Canonical product repository: `Mind-Reply/mindreply-app`.
- Default-branch README documents a GBP 600 Website Completion Package, invoice-first assisted close, and MRagent free entry. This is repository documentation, not proof of a live or completed sale.
- The profit-engineering branch documents a EUR 3,000 GitHub + Python Profit Audit and a Stripe checkout URL. This is repository evidence only; provider-side price status, successful checkout, payout, delivery, and current availability remain unverified.
- These are two different commercial offers and currencies. Do not silently merge them, change live prices, or advertise both as one offer. Before outreach, owner must select one lead offer and confirm its scope, currency, price, tax treatment, fulfillment capacity, and actual payment route.
- Existing go-live cleanup documentation requires build/typecheck, public route checks, checkout/webhook validation, secret-leak checks, preview smoke tests, and runtime evidence before a production claim.
- Current connected Supabase security-advisor evidence includes disabled leaked-password protection and two integration tables with RLS enabled but no policies. Review ownership and intended access before changing policies; do not blindly apply a migration.

## Ten-day execution

### Day 1 — Commercial and system truth
- Confirm one lead offer and its customer, promised outcome, scope, exclusions, delivery time, price/currency, refund/acceptance terms.
- Verify canonical production URL, deployment provider, current commit/artifact, enquiry destination, invoice/checkout route, and owner of fulfillment.
- Reconcile current Stripe live/test account context and existing products/prices against the selected offer.
- Exit: one approved offer definition and a list of evidenced blockers.

### Day 2 — Unit economics
- Estimate delivery hours and direct costs using explicit assumptions; identify payment fees, infrastructure/API costs, subcontracting, refunds, tax, and support burden.
- Set a minimum contribution-margin floor and capacity limit. No discounts or paid ads until economics are known.
- Exit: per-sale contribution model with assumptions labeled, not a forecast.

### Day 3 — Conversion path
- Walk the full prospect-to-enquiry and enquiry-to-payment path on mobile and desktop.
- Verify forms, email/contact routing, confirmation states, legal/privacy/terms links, scope, pricing, and next steps.
- Fix only proven high-impact conversion blockers in a branch and PR.
- Exit: reproducible customer journey and test evidence.

### Day 4 — Fulfillment and measurement
- Define a repeatable delivery checklist, acceptance criteria, status owner, customer update points, and handoff.
- Add or validate tracking for qualified lead, proposal/invoice sent, payment confirmed, work started, delivered, accepted, refunded, and repeat opportunity.
- Do not collect unnecessary personal data.
- Exit: each opportunity and order can be traced from source to outcome.

### Day 5 — Qualified demand
- Define one narrow ideal customer profile and observable qualification criteria.
- Prepare a small researched prospect list and personalized message/demonstration. Draft and stage only; external outreach requires the applicable owner approval.
- Exit: qualified list, rationale, and ready-to-approve outreach.

### Day 6 — Release and security gate
- Run the documented frozen install, typecheck, build, automated tests, and relevant workflow checks.
- Review Supabase advisor findings and payment/webhook implementation. Fix only findings whose intended access and impact are understood.
- Verify no secrets are committed or exposed in client bundles, logs, or responses; never print secret values.
- Exit: pass/fail evidence and ranked remediation, with no unresolved critical issue concealed.

### Day 7 — Payment and deployment verification
- Test checkout/webhook behavior in Stripe test mode, including duplicate webhook delivery, failed payment, and idempotent order state.
- Verify live configuration read-only; no live price/product changes, refunds, transfers, or setting changes without explicit authorization.
- Preview deploy and smoke-test first. Production promotion requires the established approval gate and rollback path.
- Exit: exact commit/artifact, test outcomes, preview URL, and runtime checks recorded. No claim of live operation without live evidence.

### Day 8 — Close qualified opportunities
- Follow up with approved prospects, answer objections, and clarify scope and delivery timing.
- Send an approved proposal/invoice or direct customers to the verified checkout.
- Record source, stage, value, expected decision date, and next action. Never invent pipeline or conversion numbers.
- Exit: actual opportunity status, including losses and reasons.

### Day 9 — Deliver and reconcile
- For a paid order, verify provider-side payment status, order association, fulfillment, customer acceptance, direct costs, and refunds/obligations.
- Distinguish payment initiated, payment succeeded, payout pending, and cash settled.
- If no sale occurred, document the observed funnel and the single largest bottleneck; do not relabel activity as revenue.
- Exit: reconciled order evidence or an honest zero-sale diagnosis.

### Day 10 — Decision and next cycle
- Calculate actual collected revenue, variable costs, contribution profit, sales-cycle time, delivery hours, conversion by stage, and remaining liabilities.
- Compare actuals against the Day 2 assumptions and revise them.
- Decide whether to repeat, refine, or stop the offer based on evidence.
- Exit: owner-facing scorecard, top three next actions, named risks, and next 30-day plan.

## Daily scorecard

Track: qualified prospects contacted; positive responses; qualified conversations; proposals/invoices; payments succeeded; cash settled; orders delivered/accepted; refunds/disputes; delivery hours; variable cost; contribution profit; production errors.

For every metric store its source, timestamp/window, definition, and whether it is VERIFIED, ESTIMATED, or UNKNOWN. A dashboard is not evidence unless its underlying data is validated.

## Commercial math

- Net sales exclude refunds and discounts; tax treatment must be explicit.
- Contribution profit = net sales excluding applicable tax − payment fees − direct fulfillment cost − variable infrastructure/API/support costs.
- Cash received, payout settled, accounting revenue, and profit are distinct states.
- Scenario math must not be presented as a forecast or guarantee.
- Do not increase ad spend until at least one offer has demonstrated a working payment-to-fulfillment path and measured unit economics.

## Guardrails

- No production DDL/DML, secret rotation, live billing configuration changes, refunds/transfers, external outreach, paid spend, merge, or production promotion without the applicable explicit approval.
- No repository archive/delete or branch-protection changes as part of this plan.
- Never commit credentials, request users to paste secrets, or expose secret values in logs.
- Never claim deployment, security, checkout, payout, customer acceptance, or revenue without current evidence.
- Prefer small, reversible changes with a PR, tests, rollback path, and evidence.
- If a gate fails, record the exact blocker and continue non-dependent work; do not bypass the gate.

## End-state definition

Success is not “ten days elapsed.” Success means a verified offer, a tested payment and fulfillment path, a real customer transaction if demand converts, a reconciled financial result, and a repeatable acquisition/delivery process. First reliable revenue is a target, not a guaranteed outcome.
