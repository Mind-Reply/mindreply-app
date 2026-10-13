# Frontier Capability Absorption

**Status:** experimental, owner-gated
**Branch:** `frontier/capability-absorption-2026-08-11`

## Purpose

Turn external capability signals into small, testable improvements to MindReply without importing dependencies or changing production behavior blindly.

## Current signals

| Signal | Useful primitive | Decision |
|---|---|---|
| HAR | isolated agent workspaces, exact-tree proof, deterministic validation, overlap/conflict detection | Prototype natively |
| ngrok AI Gateway | provider/model routing boundary | Evaluate as an adapter pattern; no production dependency yet |
| Coldtea | agentic coding/test execution | Evaluate workflow ergonomics, not vendor lock-in |
| oqoqo | task-specific evaluations and benchmarks | Add evaluation-first gate |
| Kubit | behavior-informed agent evaluation/optimization | Evaluate telemetry-to-evaluation loop |
| AI Group Call | multi-agent voice interaction | Evaluate only for Aurel/voice product surface |
| Remix | sandboxed product experimentation | Evaluate isolated preview/sandbox pattern |
| AdAnt AI | automated creative generation | Treat as market signal unless directly useful to Site Factory |

## Absorption protocol

1. Discover signal.
2. Record source and timestamp.
3. Separate capability from vendor/product.
4. Define one bounded experiment.
5. Isolate experiment on a frontier branch/worktree.
6. Define deterministic checks before implementation.
7. Bind evidence to exact commit/tree SHA.
8. Measure outcome against the existing implementation.
9. Promote only if measurable benefit exists and risk is acceptable.
10. Otherwise reject/archive the experiment with evidence.

## Agent isolation contract

Every parallel task must declare:

- task ID
- agent role
- repository
- branch/worktree
- owned paths
- read-only paths
- allowed tools
- forbidden actions
- validation commands
- evidence location
- approval level
- expiry/cleanup rule

No production deployment, secret rotation, DNS change, destructive migration, purchase, legal submission, or external commitment is permitted from a capability experiment.

## Proof contract

A capability experiment is not complete until its evidence identifies:

- source signal
- experiment ID
- exact commit SHA
- relevant files
- validation commands
- validation results
- E2E result where applicable
- measured benefit or rejection reason
- reviewer/owner gate if promotion is proposed

Stale or missing proof blocks promotion.

## Evaluation dimensions

Score each experiment 0–100 on:

- reliability
- speed
- cost
- developer/operator effort
- observability
- security
- isolation
- maintainability
- vendor independence
- commercial usefulness

A high score alone does not authorize production promotion; proof and risk gates remain mandatory.

## Why this exists

The capability radar should not become a bookmark feed. External launches are sensors. Useful primitives become controlled experiments; successful experiments become internal capability; weak ideas become documented rejections.


## GitHub-native AI pilot matrix — 2026-10-13

**Mode:** experiment only; no new skill, provider dependency, permission expansion, production write, or automatic merge.

| Existing lane | Candidate capability | First bounded trial | Required evidence | Promotion rule |
|---|---|---|---|---|
| Cartographer | Copilot cloud agent research/plan mode; GitHub code search | Inventory one release blocker across code, tests, workflows and docs; return a plan before edits | Paths and line references, exact base SHA, findings checked against source | Adopt only if it finds material evidence missed by the manual inventory |
| Proofkeeper | Copilot code review API + normal CI; CodeQL/agentic autofix only when a real alert exists | Review one small, non-production PR at balanced effort; compare findings with human review and test results | Review comments, false-positive/valid-finding counts, CI and security-analysis results | Never treat AI review as a required-check substitute or as approval to merge |
| Craftsperson | Copilot cloud agent with model selection and self-review | Implement one isolated, reversible bug/test improvement on a branch; do not open a PR until the diff is inspected | Before/after behavior, tests, diff, model/effort used, exact commit SHA | Keep only if tests pass and review confirms behavior and maintainability improved |
| Bridgekeeper | Copilot review with configured MCP context (read-only during review) | Give review access only to the minimum relevant documentation/service context; test one integration boundary | Actual tool access observed, returned context, permission scope, redaction check | No connector writes or secrets in prompts; fail closed when access/scope is unclear |
| Watcher | GitHub Actions deterministic checks first; Agentic Workflows as an opt-in technical-preview experiment | Run a non-mutating stale-doc/CI-failure summarizer on a sandbox branch or test repository | Run logs, permissions, sandbox boundaries, output accuracy, cost and repeatability | No autonomous production actions; preview status and permissions must remain explicit |
| Steward | Issue automation with rationale/confidence; Copilot-assisted documentation updates | Suggest labels/ownership and draft a docs correction for review rather than applying uncertain changes | Proposed changes, rationale, confidence, accepted/rejected outcomes, diff | Keep human approval for close/reassign/merge/release decisions; never let convenience approvals substitute for authorization |

### Trial sequence

1. **Baseline first:** capture the same task's manual time, findings and test outcomes before the AI run.
2. **One lane at a time:** use an isolated branch, explicit owned paths, read-only boundaries and no production credentials.
3. **Human review:** inspect the complete diff and independently run deterministic checks; an agent's self-report is not verification.
4. **Compare:** record accuracy, escaped defects, elapsed time, operator effort, cost, security findings and false positives.
5. **Decision:** promote, rerun with narrower scope, or reject. Record the exact source URL/date, model/tool, commit SHA and evidence.

### Guardrails

- Existing A11 skill mesh remains closed; these are trials of GitHub capabilities inside existing lanes, not new permanent skills.
- Cloud-agent availability, model choices, review API support, security scanning and MCP connections depend on plan, repository settings and granted permissions. Verify these in the target repository before relying on them.
- Agentic Workflows are a technical-preview candidate, not a production dependency.
- Never expose secret values to an agent, grant broader permissions for convenience, or allow an experiment to deploy, merge, change DNS, mutate production data, move money or contact external parties.
- An empty check result is not a passing check. Missing runtime evidence stays unverified.

### Official capability references

- Copilot cloud agent research/plan/branch workflow: https://github.blog/changelog/2026-03-31-research-plan-and-code-with-copilot-cloud-agent/
- Copilot code review agent skills and read-only MCP: https://github.blog/changelog/2026-07-31-copilot-code-review-agent-skills-and-mcp-now-generally-available/
- Copilot code review API and effort level: https://github.blog/changelog/2026-10-02-copilot-code-review-api-support-and-new-default-effort-level/
- Agentic autofix for code scanning: https://github.blog/changelog/2026-07-10-agentic-autofix-for-code-scanning-alerts-in-public-preview/
- GitHub Agentic Workflows technical preview: https://github.blog/ai-and-ml/automate-repository-tasks-with-github-agentic-workflows/
- Issue automation rationale, confidence and suggestions: https://github.blog/changelog/2026-07-23-agent-automation-controls-in-github-issues-in-public-preview/
