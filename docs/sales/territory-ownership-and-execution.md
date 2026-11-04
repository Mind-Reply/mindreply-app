# A11-K Sales & Territory Operations
## Territory ownership and execution specification

**Status:** READY for review  
**Programme:** A11-K ENERGY × COMPUTE GRID  
**Scope:** Planning and operating-model design only  
**Parent issue:** https://github.com/Mind-Reply/mindreply-app/issues/145

## 1. Territory structure

| Territory | Priority | Coverage rule | Entry condition |
|---|---:|---|---|
| Netherlands | 1 — pilot | National coverage, with regional account mapping | Approved first-market focus; account evidence still required |
| United Kingdom | 2 — next market | National coverage; maintain separate regulatory, grid and commercial assumptions | Start after Netherlands model is reviewed |
| Wider EU | 3 — expansion | Country-by-country activation; do not treat the EU as one uniform market | Local market, regulatory and delivery validation |

Territory priority is a sequencing decision, not evidence of market demand, customer availability, grid capacity or revenue.

## 2. Industry segments

1. Data-centre and colocation operators
2. Energy suppliers, generators and flexibility providers
3. Industrial and logistics operators
4. Compute buyers and infrastructure users
5. Infrastructure, connectivity and delivery partners

Segment accounts by their potential need, technical fit, geography, buying process and evidence quality. Do not label an organisation as a prospect or customer without a sourced basis.

## 3. Account ownership rules

- Every account has exactly one accountable account owner.
- Industry specialists may contribute across territories but do not create a second owner.
- Each opportunity has one accountable opportunity lead and named technical, energy/grid and finance contributors where relevant.
- Ownership changes require a recorded reason, previous owner, new owner, approver and timestamp.
- Duplicate accounts must be flagged for review; do not silently merge or delete records.
- No customer contact is initiated by this planning specification.

## 4. Qualification stages and evidence

| Stage | Required evidence | Exit decision |
|---|---|---|
| Research | Source-linked organisation facts; territory and segment rationale | READY for qualification |
| Qualified | Documented need, fit, buyer role and open questions | CONTINUE or advance for technical review |
| Technical review | Engineering and compute feasibility; energy/grid claims independently sourced | VERIFIED only for claims directly evidenced |
| Commercial review | Cost model, assumptions, pricing basis, risks and finance review | CONTRIBUTION for owner decision |
| Proposal preparation | Approved scope, terms, pricing and authority to issue | READY; external issue requires separate approval |
| Contract / order | Executed agreement and verified authority | Record only when evidence exists |
| Billing / collection | Stripe event, invoice/payment identifiers, webhook validation and reconciliation evidence | Separate invoiced, paid, collected and reconciled states |

A pipeline stage is not revenue. Forecasts, proposals, invoices and collected funds must remain separate.

## 5. Opportunity record — minimum fields

- Account ID and legal/display name
- Country, region and territory
- Industry segment and source links
- Account owner and opportunity lead
- Need / use case, recorded as customer-stated only when directly documented
- Product or service hypothesis
- Capacity, energy, site and connectivity assumptions with evidence status
- Stage, stage-entry evidence and last-reviewed timestamp
- Estimated value and currency, clearly marked as an estimate
- Cost, margin and pricing-review status
- Risks, dependencies and unresolved questions
- Next action, accountable owner and due date
- Approval state and approval evidence
- Separate proposal, invoice, payment, collection and reconciliation references

Do not store secrets, payment credentials or unnecessary personal information in the sales record.

## 6. Meeting minutes standard

Each meeting record must include:
- Date, time, timezone, account, territory and meeting purpose
- Participants and roles, using only details actually supplied or confirmed
- Customer-stated needs and constraints, clearly distinguished from internal interpretation
- Scope discussed, assumptions and indicative pricing (if any)
- Decisions made and decisions explicitly not made
- Open questions, risks and dependencies
- Actions, one accountable owner per action, due date and follow-up date
- Supporting documents and evidence links

Minutes are **DRAFT** until reviewed by an authorised human. Circulation, commitments, pricing promises and customer follow-up require the appropriate human approval. Never fabricate attendance, statements, consent or decisions.

## 7. Cross-team handoffs

| Sending function | Receiving function | Handoff package | Validation |
|---|---|---|---|
| Sales Research | Sales Operations | Sourced account facts, segment and territory rationale | Source and freshness check |
| Sales Operations | Engineering / Compute | Use case, requirements, unknowns and requested feasibility | Technical owner review |
| Engineering / Compute | Energy & Grid | Load profile and site/power assumptions | Grid/site evidence check |
| Energy & Grid | Finance | Verified constraints, costs and unresolved dependencies | Independent finance review |
| Finance | Sales Lead | Unit economics, pricing guardrails and sensitivities | Owner approval before offer |
| Sales Lead | Control Plane | Stage decision, owners, due dates and evidence links | Completeness and dependency check |
| Control Plane | All workstreams | Validator outcomes, exceptions, escalation and next actions | Evidence receipt and audit trail |

A handoff is accepted only when the receiving owner acknowledges the package or records the missing inputs.

## 8. Validator circulation

Every material claim has:
- Claim ID and linked deliverable
- Claim owner and independent validator
- Validation method, source and timestamp
- Result: VERIFIED / READY / CONTINUE / CONTRIBUTION
- Evidence link and quality assessment
- Failed or inconclusive checks, impact and next action
- Named owner and due date

A dashboard, issue, branch or written plan is evidence that planning work exists; it is not proof of physical capacity, a customer commitment, payment, revenue or production readiness.

## 9. Initial implementation sequence

1. Review and approve this territory and ownership specification.
2. Build a source-backed Netherlands account and territory research template; do not populate it with invented prospects.
3. Define pipeline fields, stage transitions and meeting-minutes workflow.
4. Draft the Supabase data model and RLS/access-test plan without production writes.
5. Specify Stripe sandbox-only recurring capacity reservation and reconciliation tests.
6. Run cross-team handoff tabletop checks with synthetic records.
7. Present evidence, failures, unresolved decisions and owner approvals in the control-plane review.

## 10. Approval boundaries

This document does not authorise customer outreach, binding proposals, contracts, spending, production database changes, live Stripe changes, secret handling, merge, deployment or physical infrastructure commitments. Each requires separate explicit owner approval.

## 11. Open decisions for owner review

- Confirm the named accountable owner for each territory and function.
- Confirm which service definition is sufficiently mature to qualify opportunities.
- Approve qualification thresholds and minimum evidence for proposal preparation.
- Approve any customer-facing communication workflow before it is enabled.
