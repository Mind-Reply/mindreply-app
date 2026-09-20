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
