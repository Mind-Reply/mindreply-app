# Product Design — Production Action Plan

Date: 2026-08-26
Status: ACTIVE — implementation evidence required before production promotion

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

Vercel project `a11k-live-foundation` is linked to `angellllkr-eng/mind-reply-core` and its latest production deployment for commit `d9c8917e053c77c93c361d8b5791b49d2b5ed965` is currently reported as `ERROR`.

The build-log error filter returned no error/stderr/exit events, and runtime-error logs for that deployment are empty. Therefore the failure is not yet proven to be a source-build failure. Production promotion must remain blocked until the deployment state is reconciled with an observable successful health check.

## Release gate

Do not promote a Product Design change to production until all are true:

- design change is committed on a reviewable branch;
- automated validation passes;
- Vercel deployment reaches a confirmed successful state;
- live URL is reachable;
- primary user journey is manually/automatically smoke-tested;
- no critical runtime errors are present;
- exact production commit is recorded.

## Immediate execution order

1. Stabilize the active Vercel deployment path.
2. Validate the canonical product surface.
3. Apply the P0 trust/control UX changes.
4. Run design QA against the rendered production candidate.
5. Open/complete review before production promotion.
