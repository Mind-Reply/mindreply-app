# Department Operating Scorecard

**Purpose:** Make the AI Engineering & Research Department traceable, commercially accountable and professionally differentiated.

**Control rule:** The system proposes; the owner decides. No production, financial, customer-facing or destructive action is authorised by this scorecard.

## 1. Weekly executive snapshot

Complete once per week. Leave unknown values as `NOT MEASURED`; never substitute estimates for actuals.

| Measure | This period | Previous period | Evidence/source | Owner | Status |
|---|---:|---:|---|---|---|
| Work items opened / closed | NOT MEASURED | NOT MEASURED | GitHub issues/PRs | Department lead | CONTINUE |
| Verified deliverables | NOT MEASURED | NOT MEASURED | Commits, CI, tests, acceptance | Engineering lead | CONTINUE |
| Research runs completed successfully | NOT MEASURED | NOT MEASURED | Research run/event records | Research lead | CONTINUE |
| On-time accepted delivery rate | NOT MEASURED | NOT MEASURED | Due dates + acceptance records | Operations lead | CONTINUE |
| Collected revenue (actual) | NOT MEASURED | NOT MEASURED | Payment + settlement records | Finance owner | CONTINUE |
| Refunds / chargebacks | NOT MEASURED | NOT MEASURED | Processor records | Finance owner | CONTINUE |
| Direct delivery costs | NOT MEASURED | NOT MEASURED | Provider invoices + usage records | Finance owner | CONTINUE |
| Gross profit / gross margin | NOT MEASURED | NOT MEASURED | Reconciled revenue and costs | Finance owner | CONTINUE |
| Contribution margin | NOT MEASURED | NOT MEASURED | Revenue less attributable costs | Finance owner | CONTINUE |
| Runtime success / failure rate | NOT MEASURED | NOT MEASURED | Run outcomes + heartbeat | Runtime lead | CONTINUE |
| Security / policy exceptions | NOT MEASURED | NOT MEASURED | CI, audit and incident evidence | Security lead | CONTINUE |

## 2. Metric definitions and evidence rules

| Metric | Definition | Accepted evidence | Exclusions / cautions |
|---|---|---|---|
| Collected revenue | Funds successfully captured and settled, net of refunds and chargebacks for the reporting period | Processor transaction IDs, payout/settlement IDs, reconciled ledger entries | Pipeline, quotes, invoices, authorisations, test-mode payments and PaymentIntents alone are not collected revenue |
| Direct delivery cost | Costs directly attributable to delivering the measured work | Cloud/provider invoices, metered usage, approved contractor invoices, transaction fees | Do not use guessed allocations; label any allocation method |
| Gross profit | Collected revenue minus direct delivery costs | Reconciled revenue and cost records | Do not count projected revenue |
| Gross margin | Gross profit divided by collected revenue, where collected revenue is greater than zero | Same as above | Report N/A when revenue is zero or denominator is unavailable |
| Contribution margin | Gross profit less attributable sales, support and other variable operating costs | Cost ledger with documented allocation | Keep fixed overhead separate unless explicitly included |
| Delivery lead time | Elapsed time from accepted work start to accepted completion | Issue/run timestamps and acceptance record | Exclude paused time only when pause reason and timestamps are recorded |
| Acceptance rate | Accepted deliverables divided by deliverables submitted for acceptance | Customer/owner acceptance record | A merged PR or green CI alone is not customer acceptance |
| Runtime success rate | Successful completed runs divided by all terminal runs in the same window | Run state transitions, event records, heartbeat | Cron invocation, registry `active` flags and log volume do not prove successful work |
| Rework rate | Deliverables returned for material correction divided by submitted deliverables | Review outcomes and follow-up issues | Define what counts as material rework before reporting |

## 3. Work-item tracking contract

Every active work item must have:
- A unique GitHub issue, PR, research-run or execution identifier.
- One accountable existing role and one human decision owner.
- A specific outcome, acceptance criteria and due date or review point.
- One status: `VERIFIED`, `READY`, `CONTINUE` or `CONTRIBUTION`.
- Evidence links: source, commit, CI run, test, log, acceptance or payment record.
- Opened/updated/completed timestamps, elapsed time and next action.
- Approved budget and attributable cost where applicable.

Use `VERIFIED` only when direct evidence exists in the correct environment. `READY` means the next safe step is prepared, not that the work is complete. `CONTINUE` means work remains and must state the next action and owner. `CONTRIBUTION` means a human decision or input is required.

## 4. Department quality scorecard

| Dimension | Standard | Evidence required before claiming success |
|---|---|---|
| Research quality | Relevant, current, traceable and reproducible findings | Source links, publication dates, method, limitations and decision summary |
| Engineering quality | Tested, reviewable, secure and recoverable changes | Diff, CI, tests, security checks, deployment evidence where applicable, rollback plan |
| Product/brand alignment | Work solves a defined user or market problem and communicates clearly | User/problem statement, acceptance criteria, positioning review and observed feedback |
| Operational reliability | Work is processed and completed predictably | Run outcomes, queue transitions, heartbeat freshness, error/retry records and alert ownership |
| Governance | Least privilege, approval traceability and environment separation | Approval record, access/policy review, audit trail and test/live distinction |

## 5. Weekly review agenda

1. Review last week's commitments against evidence.
2. Review blocked dependencies and assign one next action and owner to each.
3. Reconcile commercial actuals against payment settlements and attributable costs.
4. Review delivery quality, rework, incidents and customer acceptance.
5. Select the next highest-value work based on expected outcome, effort, risk and evidence readiness.
6. Record owner decisions and approvals before any controlled action.

## 6. Initial known baseline

| Item | Current evidence-based position | Next action |
|---|---|---|
| Department framework | PR #126 is open and unmerged; latest reported CI workflows passed | Human review before merge |
| Commercial tracking | Issue #128 records the scorecard requirement; no reconciled profitability figures supplied | Populate first reporting period from source records |
| WO A11 runtime | Worker previously reported configuration-required due to missing `OPENAI_API_KEY`; cron success alone did not establish task success | Owner configures secret in Supabase; then run one controlled test and inspect run/event/heartbeat evidence |
| Agent roster | Existing A11 Core, Brand Agent, Developer Agent, Research Agent and WO A11 roles are to be reused | Keep role ownership explicit; do not create duplicate agents or orchestration tables |

## 7. Reporting discipline

- Show actuals, forecasts and targets in separate columns.
- Include the reporting window, currency, environment and source of truth.
- Record missing data as `NOT MEASURED`, not zero.
- Do not claim profitability until revenue, refunds, settlements and attributable costs reconcile.
- Do not claim production readiness from documentation, green CI or test-environment evidence alone.
- Do not publish customer-sensitive data, credentials, tokens or private transaction details in public repository documentation.

## 8. First reporting cycle

**Status: CONTINUE.** The template is ready for population, but no current financial baseline is asserted here.

First cycle owner actions:
1. Confirm the reporting period and currency.
2. Export/inspect payment and settlement totals from the authorised finance source.
3. Collect attributable infrastructure and usage costs for the same period.
4. Reconcile refunds/chargebacks and calculate gross profit and margin.
5. Link each reported figure to restricted evidence; publish only safe aggregate values.
6. Review work-item throughput and runtime outcomes from source records.

**Decision boundary:** A11 Core remains the owner decision authority. The scorecard measures performance; it does not grant agents authority to spend, change production settings, contact customers or execute financial actions.