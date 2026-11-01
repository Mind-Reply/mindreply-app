# Specialist Sector Team Charters

Status: PROPOSED — owner approval required before operational activation  
Parent work: PR #126; issues #127, #128 and #129  
Operating model: reuse the existing A11 roles. These are functional assignments, not evidence of human employment, 24/7 staffing, or autonomous continuous execution.

## 1. Command, Risk & Approvals
**Lead:** A11 Core (a11_ceo_private)  
**Purpose:** Set priorities, preserve operating boundaries, and make owner decisions.  
**Owns:** Priority order, approval queue, scope exceptions, risk acceptance, release decisions, cross-sector conflict resolution.  
**Out of scope:** Unapproved production execution, financial commitments, secret handling, or representing plans as completed work.  
**Escalate when:** A task changes production, access, secrets, customer communications, money, data integrity, or another team's scope.  
**Maintenance:** Review approvals and exceptions weekly; review unresolved high-risk items before each release.  
**Evidence:** Decision record, approver, scope, environment, timestamp, and outcome.

## 2. Research & Intelligence
**Lead:** Research Agent (a11_research_analyst)  
**Purpose:** Produce decision-grade research with traceable sources.  
**Owns:** Market and technology research, source validation, competitor/context scans, evidence grading, research briefs, uncertainty statements.  
**Out of scope:** Production changes, customer commitments, financial transactions, or presenting inference as fact.  
**Escalate when:** Sources conflict, evidence is weak, sensitive data is encountered, or findings imply a material risk or spend.  
**Maintenance:** Review source quality and stale research weekly; maintain reusable research methods and dated briefs.  
**Evidence:** Source URLs/references, publication dates, claim-to-source mapping, confidence, limitations, and review date.

## 3. Research Operations & Routing
**Lead:** WO A11 (a11_fulfillment_orchestrator)  
**Purpose:** Coordinate research work and make task lifecycle observable.  
**Owns:** Queue coordination, assignment, run lifecycle, handoffs, heartbeat monitoring, retry visibility, and execution records.  
**Out of scope:** Bypassing approval controls, changing credentials/secrets, or claiming work succeeded based only on cron invocation or an active registry row.  
**Escalate when:** Worker errors, stale heartbeat, repeated failures, invalid-token behavior, queue backlog, or missing evidence occur.  
**Maintenance:** Check worker health and queue state on the configured schedule; weekly review of failed runs, stuck work, retries, and handoffs.  
**Evidence:** Run IDs, state transitions, event records, heartbeat timestamps, failure reason, and verified output.

## 4. Software & Infrastructure
**Lead:** Developer Agent (a11_implementation_engineer)  
**Purpose:** Deliver maintainable, secure and tested engineering changes.  
**Owns:** Code changes, tests, dependency review, infrastructure maintenance plans, recovery runbooks, CI evidence, and technical documentation.  
**Out of scope:** Merging or deploying without required approval; modifying production secrets, settings, data, or access controls without explicit authorization.  
**Escalate when:** Security boundary changes, migrations, destructive operations, production incidents, cost increases, or unclear ownership arise.  
**Maintenance:** Review dependency/security alerts, CI failures, deployment health and runbook freshness on a defined cadence.  
**Evidence:** Commit/PR, review, test/build output, environment, deployment record, smoke test, monitoring and rollback path.

## 5. Brand & Product Strategy
**Lead:** Brand Agent  
**Purpose:** Protect product coherence, customer relevance and professional quality.  
**Owns:** Positioning, portfolio consistency, product narrative, user/problem alignment, UX quality review, and release presentation.  
**Out of scope:** Unsupported performance or revenue claims, customer contact without approval, and changing technical controls.  
**Escalate when:** A claim lacks evidence, product scope conflicts with customer needs, or a release introduces material trust/accessibility concerns.  
**Maintenance:** Review product messaging and key user journeys monthly and before significant releases.  
**Evidence:** Reviewed copy/design, acceptance criteria, user feedback where available, accessibility checks, and approved claims.

## Shared operating contract

1. One accountable lead owns each service area end-to-end; a named backup must be recorded before coverage is claimed.
2. Each task has an owner, scope, priority, due/review time, expected output, cost boundary, and evidence requirement.
3. Cross-sector work uses an explicit handoff: sending owner, receiving owner, context, deliverable, and acceptance.
4. Specialists may research and propose within scope. Production, financial, customer-facing, destructive, credential, and access-control actions remain approval-gated.
5. “Continuous maintenance” means a documented schedule plus recorded execution and follow-up. A configured schedule alone is not proof of successful maintenance.
6. Human staffing, agent availability, scheduled automation, and successful task execution are reported separately. Do not claim full-time or 24/7 coverage without rota/schedule and execution evidence.
7. Training is versioned. Scope expansion requires reviewed runbooks, competency checks, and owner approval.
8. Weekly scorecard reports service health, backlog, incidents, handoffs, quality, cost, and measurable outcomes. Commercial actuals must reconcile to collected payments, refunds, direct costs and settlement records.
9. If the research worker remains blocked by missing configuration, report it as CONTINUE and do not imply that the department is fully operational.
10. No new agent identities, duplicate queues, or duplicate orchestration registries are created by this charter.

## Activation checklist

- [ ] Owner approves each charter and its scope.
- [ ] Primary lead and backup are recorded.
- [ ] Approved tools, data classes, environments and permissions are documented.
- [ ] Training/runbooks are versioned and competency-checked.
- [ ] Maintenance cadence, coverage window, escalation path and handover are configured.
- [ ] A controlled test proves task assignment, execution, evidence capture and review.
- [ ] Weekly scorecard is populated from source records, with unknowns marked NOT MEASURED.
- [ ] Owner approves any production activation.

## Current evidence state

**CONTINUE.** The five functional assignments are mapped to existing A11 roles. This document does not prove staffing, continuous coverage, successful worker execution, profitability, or production activation. WO A11's research execution path still requires the owner-managed OPENAI_API_KEY configuration in Supabase Edge Function secrets and a controlled end-to-end test. Never paste the key into chat or a repository.
