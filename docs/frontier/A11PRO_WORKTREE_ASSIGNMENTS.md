# A11pro Frontier Worktree Assignment Matrix

Status: ACTIVE / OWNER-GATED
Repository: `Mind-Reply/mindreply-app`
Base: `main`
Base commit: `0627ef22b158aa59215cfef438377de300412ac4`
Rule: one bounded task per branch/worktree; frontier branches never deploy production.

## Control rule
Every task carries: task ID, role, branch/worktree, owned paths, read-only paths, allowed tools, forbidden actions, validation commands, evidence path, approval level, cleanup rule.

## Assignments

| Task | Role | Branch/worktree | Owned paths | Objective | Validation | Release gate |
|---|---|---|---|---|---|---|
| A11P-001 | Orchestrator | `frontier/a11pro-orchestrator` | `docs/frontier/assignments/*`, `docs/frontier/coordination/*` | Dependency graph, path-overlap control, handoffs and promotion queue | YAML/JSON/schema checks + overlap audit | Owner review |
| A11P-002 | Frontend | `frontier/a11pro-frontend` | `app/*`, `apps/web-replycontrol/app/components/*`, `apps/web-replycontrol/app/*.css` | A11pro information architecture, responsive interaction and accessibility without invented live state | typecheck + build + Playwright/accessibility smoke | Owner review |
| A11P-003 | Visual Systems | `frontier/a11pro-visual-systems` | `docs/visual-frontiers/*`, `packages/aurelia/src/*`, visual-system documentation | Signal → Vector → Forge → Rail → Proofline → Crownline visual grammar | visual review + token consistency + build impact check | Owner review |
| A11P-004 | Security / Proof | `frontier/a11pro-security-proof` | `SECURITY.md`, `SECURITY_ROTATION_LOG.md`, `docs/security/*`, `docs/PROTECTED_RELEASE_RUNBOOK.md`, `docs/RELEASE_GATE.md` | Fail-closed policy, release authorization, secret-boundary and claim discipline | negative tests + policy consistency scan | Owner approval for promotion |
| A11P-005 | Evidence / Ledger | `frontier/a11pro-evidence-ledger` | `evidence/*`, `app/evidence/*`, `docs/DESIGN_AUDIT_A11_EVIDENCE_CONSOLE.md` | Exact-commit evidence, hashes/manifests, continuity and sealed proof records | deterministic fixtures + hash/manifest verification | Owner review |
| A11P-006 | Integration | `frontier/a11pro-integration` | `packages/config/lib/integrations.ts`, `packages/config/lib/cms-integration.ts`, `ops/integration-fabric.yml`, `docs/INTEGRATION_MESH.md`, `docs/integrations/*` | Normalize connectors and event boundaries; external mutation remains gated | contract tests + mocked integration tests | Owner approval |
| A11P-007 | Research | `frontier/a11pro-research` | `docs/frontier/*` except assignment/coordination files, `docs/strategy/*` | Convert frontier signals into bounded experiments with source, timestamp, benefit and rejection/promotion evidence | evidence completeness + provenance check | Owner review |
| A11P-008 | Verification / Red Team | `frontier/a11pro-verification` | `tests/*`, `lib/**/*.test.ts`, `docs/verification/*`, `.github/workflows/*` | Attack assumptions, negative paths, cross-task consistency and CI truth | full regression + negative-path suite | Owner release gate |

## Shared read-only paths

All assignments may inspect:
- `AGENTS.md`
- `docs/A11_PRIVATE_AGENT_HIERARCHY.md`
- `docs/A11PRO_BRAND_SYSTEM.md`
- `docs/A11PRO_ENTERPRISE_AGENT_SPEC.md`
- `docs/frontier/AGENT_TASK_CONTRACT.yml`
- `docs/frontier/CAPABILITY_ABSORPTION.md`
- package manifests and existing tests

## Dependency order

1. A11P-001 establishes the task graph and detects overlap.
2. A11P-007 records research inputs before capability adoption.
3. A11P-004 defines security/proof constraints consumed by implementation.
4. A11P-005 defines evidence shape consumed by execution surfaces.
5. A11P-006 normalizes integration boundaries.
6. A11P-002 and A11P-003 implement the product/visual surfaces.
7. A11P-008 attacks and validates the combined result.
8. A11P-001 records handoff and promotion readiness.

Parallel work is permitted only when owned paths do not overlap.

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
- claim live status without exact evidence;
- create recurring/background automation.

## Completion contract

DONE = implementation + deterministic validation + exact commit SHA + evidence record.
PROMOTION = DONE + owner approval.
PRODUCTION = PROMOTION + ResellerPro release verification.

No background or recurring execution is implied. Work occurs only when explicitly invoked.
