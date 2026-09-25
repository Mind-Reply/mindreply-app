# A11pro Frontier Worktree Assignment Matrix

Status: ACTIVE / OWNER-GATED
Repository: Mind-Reply/mindreply-app
Base: main
Rule: one bounded task per branch/worktree; no production mutation from frontier branches.

## Control rule
Every task must carry: task ID, role, branch/worktree, owned paths, read-only paths, allowed tools, forbidden actions, validation commands, evidence path, approval level, cleanup rule.

## Assignments

| Task | Role | Branch/worktree | Owned paths | Objective | Validation | Release gate |
|---|---|---|---|---|---|---|
| A11P-001 | Orchestrator | frontier/a11pro-orchestrator | docs/frontier/assignments/*, docs/frontier/coordination/* | Maintain task graph, dependency order, conflict detection and handoff records | schema/lint + path-overlap check | Owner review |
| A11P-002 | Frontend | frontier/a11pro-frontend | app/*, apps/web-replycontrol/app/components/*, selected styles | Complete A11pro public/private surface IA, responsive behavior and accessibility without inventing live state | typecheck + build + accessibility smoke | Owner review |
| A11P-003 | Visual Systems | frontier/a11pro-visual-systems | docs/visual-frontiers/*, visual tokens/styles | Push Signal → Vector → Forge → Rail → Proofline → Crownline into a coherent visual system | visual regression + mobile/desktop review | Owner review |
| A11P-004 | Security / Proof | frontier/a11pro-security-proof | packages/security/*, governance/*, security docs | Enforce fail-closed boundaries, release authorization, artifact binding and telemetry policy | unit + negative tests | Owner approval for promotion |
| A11P-005 | Evidence / Ledger | frontier/a11pro-evidence-ledger | packages/evidence/*, docs/evidence/* | Bind execution records, hashes, manifests and sealed evidence packages to exact commits | deterministic fixtures + hash verification | Owner review |
| A11P-006 | Integration | frontier/a11pro-integration | packages/integrations/*, integration docs | Normalize connectors and event boundaries; keep external mutations gated | contract tests + mocked integration tests | Owner approval |
| A11P-007 | Research | frontier/a11pro-research | docs/research/*, docs/frontier/signals/* | Evaluate frontier capabilities as bounded experiments; record source, timestamp, benefit and rejection/promotion evidence | evidence completeness check | Owner review |
| A11P-008 | Verification / Red Team | frontier/a11pro-verification | tests/*, docs/verification/* | Attack assumptions, test failure paths, verify no unsupported live claims and inspect cross-task consistency | full regression + negative-path suite | Owner release gate |

## Shared read-only paths

All assignments may inspect:
- docs/A11_PRIVATE_AGENT_HIERARCHY.md
- docs/A11PRO_BRAND_SYSTEM.md
- docs/A11PRO_ENTERPRISE_AGENT_SPEC.md
- docs/frontier/AGENT_TASK_CONTRACT.yml
- docs/frontier/CAPABILITY_ABSORPTION.md
- existing tests and package manifests

## Forbidden actions

No frontier assignment may:
- deploy production;
- change DNS;
- alter payment settlement;
- rotate or expose secrets;
- change IAM/network policy;
- actuate physical equipment;
- perform destructive migrations;
- make external commitments;
- claim live status without exact evidence.

## Naming and public language

Use A11pro/system/operator/execution/decision/evidence terminology where useful.
Do not expose internal agent topology publicly.
Do not mention model vendors or the term AI in public-facing copy unless specifically required for a strategic, factual purpose.

## Completion contract

DONE = implementation + deterministic validation + exact commit SHA + evidence record.
PROMOTION = DONE + owner approval.
PRODUCTION = PROMOTION + release verification.

No background or recurring execution is implied by this matrix; work is performed only when explicitly invoked.
