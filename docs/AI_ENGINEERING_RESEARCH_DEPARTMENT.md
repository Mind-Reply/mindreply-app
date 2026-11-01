# AI Engineering & Research Department

Status: READY — operating charter and implementation plan. This document defines specialist workstreams and agent-assisted operating procedures. It does not claim that human staff have been hired, agents are persistently running, external research partnerships exist, or production systems have been changed.

## Mandate

Build, research, evaluate, maintain and safely release software products and the engineering capabilities that build them. The department combines technical research, software delivery, agent engineering, infrastructure, data, payments, quality and operational evidence under one owner-governed workflow.

The department works inside the canonical product root, `Mind-Reply/mindreply-app`. It must not create a parallel production root or revive archived repositories. Owner-control implementation remains subject to the active owner-control source and repository governance.

## Leadership and specialist workstreams

These are role definitions, not appointments or claims of staffed teams.

| Role / workstream | Accountability | Required output |
|---|---|---|
| Engineering Director | Priorities, architecture decisions, dependencies and delivery coordination | Ranked engineering queue, decision records and delivery review |
| Research Director | Research agenda, source quality, synthesis and handoff to engineering | Research briefs with sources, confidence, unknowns and recommendations |
| Repository Intelligence Lead | Repository inventory, branch/PR/issue analysis, dependency and ownership mapping | Repository map, risk register and actionable GitHub work |
| Architecture Research Lead | System boundaries, design alternatives, reliability and maintainability | Architecture decision records and reviewed diagrams |
| Agent Engineering Lead | Specialist agent specifications, tool boundaries, evaluation and orchestration | Agent contracts, test sets and execution traces |
| Application Engineering Lead | Product implementation, APIs, UI, integrations and maintainability | Reviewable pull requests and reproducible test evidence |
| Infrastructure & Runtime Lead | Cloudflare, GCP/GKE, networking, deployment and runtime operations | Configuration reviews, deployment plans, health evidence and rollback |
| Data Engineering Lead | Supabase/Postgres, data contracts, migrations, access models and integrity | Schema maps, migration proposals, RLS/access tests and reconciliation |
| Payments Engineering Lead | Stripe integration, webhook durability, idempotency and ledger reconciliation | Test-mode evidence, event lifecycle records and payment integrity checks |
| Quality & Security Lead | Independent code review, CI, secret hygiene, privacy and threat analysis | Findings, test results, severity and remediation verification |
| Product Engineering Lead | Customer problems, workflows, usability and product acceptance | Requirements, prototypes, acceptance criteria and user-task evidence |
| Reliability & Evidence Lead | Monitoring, incidents, release receipts and operational reporting | Timestamped evidence register, incident reports and rollback references |

A lead may coordinate multiple specialist agents or human contributors. A role name must never be presented as a named or employed person unless separately evidenced.

## Research operating model

Research is a first-class engineering activity, not an informal prelude. Every research assignment follows:

1. **Intake:** record the question, decision it supports, scope, owner, deadline and constraints.
2. **Source discovery:** prefer primary documentation, source repositories, changelogs, standards, provider status and reproducible technical evidence.
3. **Independent examination:** where material, ask separate specialist reviewers to test the leading hypothesis and challenge it.
4. **Synthesis:** separate observed facts, source-derived claims, inference, recommendation and unresolved questions.
5. **Engineering handoff:** produce acceptance criteria, dependencies, risk, implementation options and verification steps.
6. **Outcome review:** compare implementation results with the original research hypothesis and update the knowledge record.

Research brief minimum fields:
- question and decision supported
- scope, date and source freshness
- primary sources and direct links
- findings with evidence
- competing explanations or alternatives
- confidence and known limitations
- security, privacy, cost and operational implications
- recommendation and rejected alternatives
- proposed owner, next action and verification method

No model-generated citation, benchmark, vendor claim, repository status or external fact is accepted without checking the underlying source. Conflicting sources remain visible rather than being silently reconciled.

## Engineering delivery lifecycle

`INTAKE → RESEARCH → SPECIFICATION → DESIGN REVIEW → IMPLEMENTATION → INDEPENDENT REVIEW → TEST → PREVIEW → OWNER-CONTROLLED RELEASE → MONITOR → LEARN`

Each work item must identify:
- accountable workstream and lead role
- canonical repository and branch
- user or operational outcome
- scope and explicit non-goals
- dependencies and affected systems
- acceptance criteria
- test plan and security considerations
- evidence location
- rollback or recovery path
- owner approval requirement, if any

Prefer small, isolated, reversible changes. Use synthetic data for tests. Keep secrets out of source, fixtures, logs, prompts and issue comments.

## Agent operating contract

Specialist agents are task executors under the responsible lead, not independent authorities. Each agent must have:
- a narrow role and task-specific instructions
- minimum required repository and tool permissions
- explicit read/write/action boundaries
- approved source systems and data classification
- time or task bounds and a stop condition
- structured output and evidence links
- failure reporting without hiding uncertainty
- a human escalation path

Agent roles may include Research Analyst, Repository Cartographer, Architecture Reviewer, Application Builder, Test Engineer, Security Reviewer, Data Analyst, Runtime Operator and Evidence Keeper.

Agents may inspect, research, draft, test in safe environments and prepare reviewable changes. They must not independently perform destructive cleanup, change production secrets or access controls, make material financial commitments, charge or refund customers, contact external parties, sign agreements, or deploy production changes where owner/provider authorization is required.

## GitHub operating standard

GitHub is the authoritative record for source, branches, pull requests, review discussion, CI and repository-level work.

- Work from the canonical repository; check archive status before writing.
- Use a dedicated branch for each bounded change.
- Prefer pull requests over direct commits to the default branch.
- Require independent review for security-sensitive, payment, data-access and release-path changes.
- Run the repository's documented checks; record exact commands and results.
- Treat workflow startup failure, skipped jobs or missing checks as unavailable evidence, not a pass.
- Link the exact commit, PR, workflow run and artifact used for a release claim.
- Never merge, archive, delete or rewrite repository history as an incidental step.

## Supabase and data engineering standard

Supabase is a data and backend platform, not an assumed source of truth for every product. Before changing a project:
1. Identify the exact project and environment from provider metadata.
2. Read the existing schema, migrations, grants, RLS policies, functions and relevant logs.
3. Confirm the application data contract and canonical ownership of each table.
4. Check current Supabase documentation and security/performance advisors.
5. Design a least-privilege access model; do not add permissive policies merely to silence an advisor.
6. Test changes in a development branch or other isolated environment.
7. Generate a reviewable migration, test expected access for anon/authenticated/service roles, and record rollback.
8. Apply to production only through the applicable owner-controlled release process.

Never expose service-role or secret keys in browser code. Authorization must not rely on user-editable JWT metadata. Exposed-schema tables require RLS and deliberate grants/policies. Views and privileged functions require explicit security review.

## Payments and commercial integrity

Stripe work starts in test mode. Verify signature handling, timestamp tolerance, durable event receipt, idempotency, retry behavior, database writes, ledger consistency and redacted observability. Do not equate a checkout event, payment intent, gross receipt, payout or projected amount with collected profit. Live billing, refunds, transfers and other material money movement remain separately authorized actions.

## Status vocabulary and evidence

- **VERIFIED:** directly supported by evidence from the correct environment.
- **READY:** prepared for the next safe action; not proof of execution.
- **CONTINUE:** work remains, with the exact next action and accountable role.
- **CONTRIBUTION:** a human decision, input or authorization is required.

Every status record should include action, evidence, risk, owner role, next action and timestamp. Distinguish code/documentation evidence from CI, preview, production runtime and provider evidence. Do not use "live", "deployed", "passed" or "complete" without the corresponding evidence.

## Department scorecard

Track measurable outcomes only when the underlying data exists:
- research briefs accepted and converted into engineering work
- lead time from approved intake to reviewed PR
- CI success rate and unavailable-run rate
- test coverage of critical workflows
- escaped defects and incident recurrence
- security findings by severity and remediation age
- deployment success and rollback readiness
- data integrity and reconciliation exceptions
- payment webhook duplicate/failed processing rates
- product task completion and customer outcomes
- actual delivery cost and measured runtime cost
- evidence completeness for release decisions

Do not invent targets or populate the scorecard with synthetic operational activity represented as real.

## Initial implementation sequence

### Phase 1 — Establish the operating baseline
- Confirm canonical repositories, owners, archive state and active work queues.
- Map existing engineering, research, agent, security and release documentation.
- Identify current CI/build blockers and existing work before creating duplicate issues.
- Inventory connected Supabase projects and determine each project's product/environment ownership.
- Record access failures and unavailable provider evidence without guessing.

### Phase 2 — Activate research-to-engineering flow
- Create a research intake template and evidence register.
- Define specialist role prompts and output contracts.
- Route each accepted finding to an existing GitHub issue or a new issue only when no suitable item exists.
- Assign a responsible lead role and measurable acceptance criteria.
- Use independent review for material architecture, security, data and payments decisions.

### Phase 3 — Build the engineering capability
- Add or improve repository inventory, CI evidence, test automation and release receipts.
- Implement agent orchestration only after the required tools, permissions, audit trail and evaluations are defined.
- Keep provider integrations model-agnostic and benchmark on representative, redacted tasks.
- Use preview/development environments before production.

### Phase 4 — Operationalize and improve
- Publish a department scorecard backed by real source data.
- Review incidents, failed tasks, cost and quality on a recurring cadence.
- Retire duplicate workflows only after ownership and migration evidence are established.

## Current execution record

- Canonical product repository identified: `Mind-Reply/mindreply-app` (public, active, default branch `main`).
- `Mind-Reply/mind-reply-core` is archived; its README explicitly directs new product work to `mindreply-app`.
- `Mind-Reply/control-plane` is archived/source-freeze; it is not a second production root.
- Supabase project inventory returned `MindR` (EU West) and `resellerpro-prod` (EU Central), both reported ACTIVE_HEALTHY by project metadata.
- Supabase table/advisor inspection was not completed in this execution: the connected database request returned an authentication failure, and a subsequent advisor request reported the project as hibernated. No database schema, policy, credential or production setting was changed.
- This charter is documentation only. It does not create staffed teams, persistent agents, external partnerships or production capability by itself.

## First review checkpoint

The first engineering review should verify the repository inventory and CI baseline, then retry Supabase read-only schema/advisor access through a healthy authenticated connection. Only after that should the department propose a data model or runtime orchestration implementation.
