# Product Design — Production Action Plan

Date: 2026-08-26
Status: ACTIVE — continuous implementation and runtime verification

## Objective

Create one coherent product experience across the active MindReply surfaces without exposing repository architecture as the user's navigation model.

## Canonical product surface

`mind-reply-core` remains the active product root. The product-facing information architecture should be organized around user outcomes:

1. Overview — what is live, what needs attention, and what can be done now.
2. Work — active customer/revenue workflows and tasks.
3. Proof — release, validation, evidence, and operational history.
4. Control — owner approvals, policies, access, and bounded actions.
5. Settings — integrations and configuration.

Internal component names remain implementation vocabulary, not primary navigation.

## Design principles

- Outcome-first navigation; architecture second.
- One primary action per high-risk state.
- Every operational claim must map to observable evidence.
- Failed, blocked, unknown, and pending states must be visually distinct.
- Destructive or production-affecting actions require explicit confirmation and evidence.
- Mobile-first layouts must preserve the same action hierarchy as desktop.
- Avoid dashboard decoration that does not improve a decision or action.
- Use branded terminology only where it improves recognition; always pair it with plain-English meaning.

## Priority UX changes

### P0 — Production trust

- Make deployment state explicit: `LIVE`, `BUILDING`, `FAILED`, `BLOCKED`, `UNKNOWN`.
- Show commit/release identity beside production status.
- Surface the exact next safe action when a deployment is failed.
- Never present a failed deployment as available merely because a build log is empty.

### P0 — Control surface

- Consolidate owner actions into a single action hierarchy.
- Separate observation from mutation.
- Make approval gates visible before an action is attempted.
- Preserve audit evidence for every production-affecting action.

### P1 — Product coherence

- Standardize typography, spacing, status indicators, buttons, cards, tables, empty states, and error states across active apps.
- Remove duplicate navigation concepts across A11-K, ReplyControl, and operational surfaces.
- Use consistent naming for the same object across screens.

### P1 — Revenue path

- Keep the commercial path short: problem → proof → offer → checkout → confirmation.
- Make the paid offer and next step visible without requiring users to understand the underlying platform.

### P2 — Refinement

- Motion only where it communicates state or hierarchy.
- Progressive disclosure for technical evidence.
- Accessibility pass for keyboard, focus, contrast, labels, and responsive behavior.

## Current deployment finding

The historical deployment referenced by this document is retained as evidence of the previous estate state. It is not a current production authority.

## Continuous verification

For each Product Design change, record the commit, validation, deployment identifier, live URL response, primary journey smoke result, runtime error state, and exact production source when verified. Missing or failed evidence becomes a remediation record rather than a production promotion lock.

## Immediate execution order

1. Stabilize the active Vercel deployment path.
2. Validate the canonical product surface.
3. Apply the P0 trust/control UX changes.
4. Run design QA against the rendered production candidate.
5. Open/complete review before production promotion.
