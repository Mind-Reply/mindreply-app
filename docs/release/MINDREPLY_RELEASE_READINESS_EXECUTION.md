# MindReply Release Readiness — Execution Checklist

Status: BLOCKED until each gate has fresh evidence tied to a commit SHA.
Scope: source/build repair, security review, commercial path verification, deployment provenance.
Safety: no production DDL/DML, secret changes, live payment actions, production setting changes, merge, or deployment under this checklist without separate owner approval.

## Gate 1 — Build reproducibility
- [ ] Confirm package manager and pinned pnpm version from repository metadata.
- [ ] Add the compatible `@ai-sdk/openai` dependency to the package that imports it; regenerate and commit the lockfile using pnpm (never hand-edit the lockfile).
- [ ] Confirm compatibility with the pinned `ai` package and provider API; add/adjust focused tests.
- [ ] Identify all supported BotID package exports for the installed version. Map middleware/proxy and protected routes before changing implementation.
- [ ] Preserve fail-closed behavior for sensitive routes; add tests for missing/invalid verification and expected allow cases.
- [ ] Run frozen install, typecheck, unit tests, E2E tests where configured, app build, root build and repository integrity checks.
- [ ] Record command, result, run URL, commit SHA and failure excerpts. Do not weaken or bypass required checks to obtain green status.

## Gate 2 — Public website and deployment provenance
- [ ] Trace DNS/domain -> provider -> project -> deployment -> commit SHA using provider records.
- [ ] Confirm whether Cloudflare/ResellerPro or Vercel is the approved delivery path; do not infer from repository docs alone.
- [ ] Verify homepage, pricing, contact, checkout and health routes against the actual deployed host.
- [ ] Compare rendered content and metadata to the intended source commit.
- [ ] Verify rollback candidate and the actual rollback procedure without executing a production rollback.
- [ ] Distinguish live telemetry from static/demo indicators. Remove or relabel unsupported "continuous verification" claims.

## Gate 3 — Commercial path
- [ ] Confirm intended Stripe account ID and exact products/prices for each offer.
- [ ] Keep invoice-first assisted close until the intended fixed price, checkout route, webhook delivery and fulfilment are verified.
- [ ] Use test mode for successful, declined, cancelled, unpaid, duplicate and invalid-signature event cases.
- [ ] Verify idempotency and ledger reconciliation without live charges, refunds or payouts.
- [ ] Determine whether the contact brief is local-only or a real lead-intake route; public copy must match actual behavior.
- [ ] No live checkout activation or Stripe production mutation without separate explicit owner approval.

## Gate 4 — Supabase and financial safety
- [ ] Review leaked-password protection warning and document the owner-approved decision; do not change production auth settings in this workstream.
- [ ] Review every RLS-enabled table with no policies; establish intended access path and prove deny-by-default behavior before proposing policies.
- [ ] Inspect Edge Function code and deployment metadata for environment, destination restrictions, amount caps, replay behavior and approval boundary.
- [ ] Never invoke the payout function or perform production DDL/DML in this release-readiness task.
- [ ] Record findings without exposing secret values or personal data.

## Gate 5 — CI and repository estate
- [ ] Diagnose workflow `startup_failure` at workflow/configuration/permissions level; zero jobs is not a pass or a test failure.
- [ ] Rerun affected workflows and require evidence for the exact PR head SHA.
- [ ] Inventory all Vercel projects/deployments read-only and reconcile each domain and repository to its owner-approved canonical purpose.
- [ ] Compare active duplicate repositories for unique code, history, secrets references and deployment bindings.
- [ ] Do not merge PRs, archive/delete repositories, rotate secrets or alter hosting settings without separate approval.

## Gate 6 — Release decision
A release may be marked READY only when all required checks pass on the candidate SHA, deployment provenance and rollback are verified, user-facing routes match actual behavior, security blockers have an approved disposition, and payment/fulfilment checks pass in test mode.

Evidence vocabulary:
- VERIFIED: direct artifact/result supports the statement.
- READY: all prerequisite gates have passed.
- BLOCKED: known unresolved prerequisite.
- FAILED: an executed check failed.
- UNVERIFIED: evidence unavailable or insufficient.

## Opportunity pilot order
1. QuoteCapture for home services: qualify intent, route to a human, measure response time and booked outcomes.
2. Website Completion Package: bounded scope, invoice-first, documented acceptance criteria.
3. Proposal Rescue for agencies/consultants: pilot only after intake and fulfilment are measurable.
4. Patient Intake: defer until privacy, retention, access and operational controls are independently reviewed.

No conversion uplift or revenue recovery claims until measured against a documented baseline and pilot results.
