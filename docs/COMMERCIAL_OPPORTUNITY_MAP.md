# Commercial Opportunity Operating Map — Bulgaria & EU

Status: READY for product planning; NOT evidence of live features, customers, revenue, or funding.
Canonical product: Mind-Reply/mindreply-app.
Owner rule: system proposes; owner commands; automation executes only after approval.

## Purpose

Translate the Bulgaria/EU opportunity assessment into a small, measurable commercial portfolio. Do not implement all opportunities as separate products. Start with repeatable services, prove demand, then productize repeated work.

## Priority portfolio

### P0 — Sellable service packages
1. Site Rescue Desk — website and online-store fixes, broken forms/checkout, performance, SEO metadata, integration repair, and release verification.
2. Workflow Clinic — automate one bounded workflow such as enquiry intake, CRM follow-up, reporting, scheduling, or document processing.
3. Managed Reliability — monitoring, backups and recovery checks, dependency/security updates, and evidence-backed releases.
4. Integration Desk — connect approved APIs and business applications with documented failure handling.

### P1 — Repeatable vertical workflows
5. Commerce Operations — catalog quality, inventory synchronization, order-status handling, returns triage, product comparison and checkout integration.
6. Logistics Exception Desk — normalize shipment events, detect delays, prioritize exceptions and prepare recommended actions. Start read-only; dispatch changes require approval.
7. Owner Operations Console — consolidated live URLs, failed runs, blockers, evidence, usage, approvals and release state.

### P2 — Differentiated technical products
8. Research Desk — source-grounded literature and competitor monitoring, claim verification, dated evidence and implementation briefs.
9. Optimization Engine — constrained search for routing, scheduling, capacity or margin improvements; compare with a measured baseline and repeatable test set.
10. Private Shopping Assistant — product discovery and comparison over an approved catalog, with explicit checkout and data boundaries. Evaluate AWS Marketplace options against simpler implementations before buying or deploying.
11. Financial Signal Desk — reconciliation support, margin and cash-flow reporting; never initiate payouts or transfers without explicit owner authorization and provider-side verification.

## Product-to-market mapping

| Brand / product surface | Initial opportunity | Success measure |
|---|---|---|
| Site Rescue Desk | Website repair and conversion-path reliability | Critical path passes; defect count and time-to-repair |
| Workflow Clinic | One recurring manual workflow | Cycle time, error rate and human minutes saved |
| Fintech Signal Desk | Owner financial/operational visibility | Reconciliation coverage, stale records and variance detection |
| MindReply owner console | Evidence and controlled execution | Every action has owner, state, receipt and verification |
| Logistics Optimization Desk (candidate) | Shipment exception triage | Detection latency, resolution time and avoidable cost |
| Private Shopping Assistant (candidate) | Catalog-grounded product discovery | Search-to-product engagement, conversion and safe escalation |

These are candidate product mappings, not claims that all named surfaces or capabilities currently exist or are deployed.

## Standard delivery sequence

1. Discover the buyer, workflow, current tools, budget owner and measurable baseline.
2. Deliver a narrow paid assessment or service before building a general platform.
3. Use synthetic or read-only data first; do not ingest sensitive production data without an approved data path.
4. Define acceptance tests, rollback, data retention and human escalation before execution.
5. Implement the smallest reversible change in the canonical repository.
6. Run tests and verify the user-facing path, integrations and logs.
7. Record evidence, remaining limitations, cost to serve and customer outcome.
8. Productize only after repeated paid demand and a stable delivery process.

## Commercial qualification scorecard

Score each opportunity 0–5 for each factor before committing substantial engineering:
- Problem urgency and frequency
- Identifiable buyer and willingness to pay
- Measurable financial or operational outcome
- Time to first paid delivery
- Repeatability across customers
- Access to required data and integrations
- Regulatory/security burden (reverse score: lower burden scores higher)
- Differentiation and defensibility

Do not treat this score as market evidence. Validate through customer conversations, paid pilots and observed outcomes.

## Evidence and governance gates

- No synthetic customers, testimonials, revenue, savings, conversion, uptime or telemetry represented as real.
- Research claims need source URLs, publication dates and explicit uncertainty.
- Optimization claims need a baseline, objective function, constraints, test cases and reproducible results.
- Payment, payout, public communication, production dispatch and external commitments require the applicable owner approval.
- Production status requires exact commit/artifact plus current runtime evidence.
- Funding is upside, not a prerequisite; verify each call's open status, eligibility, deadline, eligible costs and co-financing before relying on it.
- Keep private owner-control logic and secrets out of public marketing surfaces and repositories.
- Keep the existing canonical repository boundary: Mind-Reply/mindreply-app is the product root; legacy/source-freeze repositories are not production roots.

## Initial 30-day execution order

1. Inventory the current website, pricing, lead capture, checkout/invoice path, analytics and release checks.
2. Select one P0 offer and one buyer segment in Bulgaria; test pricing and delivery with real prospects.
3. Build a repeatable delivery checklist and evidence record; measure time and outcome.
4. Offer the same bounded service to a small set of EU prospects in one chosen market.
5. Only then select the first vertical workflow based on evidence: commerce or logistics.
6. Review whether Jira should track delivery and whether Supabase should store structured evidence, after inspecting existing schemas and workspace access. Do not create duplicate sources of truth.

## Current status

- Opportunity map: documented here.
- Existing app integration, Jira project, database schema changes, AWS deployment, commercial demand, and revenue: UNVERIFIED until separately inspected and evidenced.
