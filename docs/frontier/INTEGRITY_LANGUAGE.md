# A11pro Integrity Language

Status: ACTIVE / OWNER-GATED

## Purpose

This is the human-facing language layer for A11pro. It replaces unnecessary internal jargon with words people can understand while preserving the underlying engineering controls.

The design principle is simple:

> Know what is real. Understand what it means. Protect its integrity. Act only when justified. Prove what happened.

## Core sequence

**SEE → UNDERSTAND → CHECK → PROVE → DECIDE → ACT → CONFIRM**

The sequence is deliberately human-readable. Each step answers one question:

- **SEE** — What is present?
- **UNDERSTAND** — What does it mean?
- **CHECK** — Does it match the source?
- **PROVE** — What evidence supports it?
- **DECIDE** — Who has authority to proceed?
- **ACT** — What controlled change is being made?
- **CONFIRM** — What actually happened?

## Vocabulary

| Internal term | Human-facing term | Meaning |
|---|---|---|
| Agent | Worker | A bounded role that performs a defined task |
| Orchestrator | Coordinator | Connects work without owning authority |
| Source | Origin | Where information came from |
| Evidence | Proof | Material that supports a statement |
| Validation | Check | A deterministic test or inspection |
| Verification | Confirmed | A result supported by sufficient evidence |
| Approval | Permission | Explicit authority to proceed |
| Deployment | Release | Publishing a controlled change |
| Runtime | Live state | What is actually running now |
| Claim | Statement | What someone says is true |
| Conflict | Mismatch | Two sources or states do not agree |
| Blocker | Stop | A condition that prevents safe continuation |
| Audit | Review | Structured examination of work and evidence |
| Provenance | Origin Trail | The path showing where a statement came from |
| Control Plane | Command Centre | The place where governed work is coordinated |
| Capability | Skill | A bounded ability |
| Permission scope | Reach | What a worker is allowed to touch |
| Rollback | Undo | Reversing a controlled change |
| Migration | Move | Moving data or systems between controlled states |
| Reconciliation | Match-up | Comparing sources and resolving differences |
| Owner Gate | Your Decision | A decision reserved for the owner |
| Production | Live | The environment serving real users or operations |
| Experiment | Test Area | Isolated work that has not been promoted |
| Telemetry | Signals | Operational observations |
| Policy | Rule | A constraint that governs action |
| Escalation | Ask Owner | Request for a decision outside delegated authority |

## Integrity states

Use states that tell a person what they need to know, rather than internal process names.

- **CLEAR** — evidence agrees and no unresolved integrity issue is known.
- **CHECKING** — evidence collection or deterministic checks are still running.
- **MISMATCH** — sources or states disagree.
- **UNPROVEN** — a statement exists but sufficient proof is missing.
- **STOPPED** — a safety, permission, integrity, or dependency condition prevents continuation.
- **APPROVED** — the required authority has explicitly permitted the next bounded action.
- **LIVE** — provider/runtime evidence confirms the change is actually active.

Never use **LIVE**, **VERIFIED**, or equivalent language without the evidence required by the applicable release contract.

## Two-state truth model

Every important object should distinguish:

**REAL STATE**
What the connected source or runtime actually shows.

**STATED STATE**
What a person, document, agent, or interface says should be true.

The interface should expose a mismatch instead of silently choosing one.

## Integrity hierarchy

The product should make this hierarchy visible:

**TRUTH → UNDERSTANDING → INTEGRITY → DECISION → ACTION → PROOF**

Authority does not manufacture truth. A permission allows action; it does not make an unverified statement true.

## Existing A11pro grammar

The existing A11pro sequence remains the product architecture:

**SIGNAL → VECTOR → FORGE → RAIL → PROOFLINE → CROWNLINE → AFTERGLOW**

The integrity language sits across that sequence:

- **SIGNAL** establishes what was seen.
- **VECTOR** states what outcome is intended.
- **FORGE** creates the proposed work.
- **RAIL** limits how that work may act.
- **PROOFLINE** records what supports the result.
- **CROWNLINE** represents owner authority and permission.
- **AFTERGLOW** gives the concise final record.

## Interface rules

1. Prefer plain words when they preserve precision.
2. Keep specialist terms only where they carry real architectural meaning.
3. Never hide uncertainty behind polished status language.
4. Show mismatches explicitly.
5. Separate a statement from its proof.
6. Separate permission from execution.
7. Separate execution from confirmation.
8. Never imply background or recurring work unless explicitly invoked.
9. Keep owner-only actions visibly owner-controlled.
10. Every completed action should leave an understandable proof trail.

## Example surface language

Instead of:

> Agent verified deployment.

Use:

> **CONFIRMED** — Release is live. Runtime check passed. Proof recorded.

Instead of:

> Deployment blocked by policy.

Use:

> **STOPPED** — Permission is required before release.

Instead of:

> Source reconciliation failed.

Use:

> **MISMATCH** — The repository and estate record disagree. Nothing was promoted.

Instead of:

> Task awaiting human-in-the-loop approval.

Use:

> **ASK OWNER** — Your decision is required before this action can proceed.

## Design intent

The interface should feel like an instrument for understanding reality, not a screen that performs intelligence theatre.

Complexity may remain underneath. The visible language should stay calm, precise and understandable.

**Core contract:**

**SEE → UNDERSTAND → CHECK → PROVE → DECIDE → ACT → CONFIRM**

**No proof, no stronger claim.**
