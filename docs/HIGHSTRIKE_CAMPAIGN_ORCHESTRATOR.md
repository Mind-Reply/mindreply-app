# HighStrike Campaign Orchestrator

Status: operating design only. This document does not prove that campaigns, integrations, or production automation are live.

## Objective

Coordinate measurable, owner-governed growth for MindReply and, after the canonical repository and service boundaries are confirmed, AKV Transport. Remove avoidable internal stalls without bypassing consent, review, security, spend, or release controls.

## Execution lanes

1. **Research and qualification (read-only):** record target segment, region, operational pain, evidence URL, observation date, confidence, and appropriate contact route. Competitor claims require reproducible public evidence; never infer outages, losses, or latency from missing data.
2. **Diagnostic assets:** draft a one-page teardown with public evidence, labeled assumptions, an estimated impact range and calculation, a recommended next step, and a correction/contact route. Do not expose private data or present estimates as measured facts.
3. **Localized funnels:** prepare /uk/, /de/, and /bg/ pages only where offer, language review, pricing/currency clarity, privacy notice, consent-aware analytics, and a working destination exist. Test canonical URLs, accessibility, mobile layout, forms, and conversion events before promotion.
4. **Approval and dispatch:** maintain draft, audience criteria, provenance, consent/suppression status, copy variant, CTA, budget, owner, and approver. Default to dry-run. External email, DMs, paid promotion, event invitations, and publishing require explicit campaign approval and an appropriate recipient basis. Apply opt-outs and suppression lists before dispatch; no indiscriminate scraping or bulk messaging.
5. **Events and demos:** define objective, audience, event owner, venue/platform, hardware readiness, safety/accessibility, privacy notice, registration cap, RSVP confirmation, contingency plan, telemetry consent, and follow-up. Bookings, travel, sponsorships, purchases, and spend remain approval-gated.
6. **Conversion and onboarding:** route approved interest to a clear proposal, checkout, or invoice-first assisted close. Use Stripe only through an authorized, tested integration; never collect or log card details directly. SLA promises require scope, exclusions, response windows, service capability, and escalation ownership.
7. **Recovery:** use idempotent jobs, bounded retries with backoff, dead-letter handling, replay controls, operator alerts, and a daily exception queue. Failed deliveries must be visible and actionable, not retried forever.

## Security and evidence controls

### Webhook HMAC

- Require a configured secret per integration; fail closed if absent.
- Verify HMAC-SHA-256 over exact raw request bytes before parsing or enqueueing.
- Use a timing-safe comparison; reject malformed encodings and length mismatches.
- Validate timestamp freshness when supported and maintain replay/idempotency keys.
- Enforce request-size limits, content-type checks, rate limits, and strict schema validation.
- Never log secrets, authorization headers, raw sensitive payloads, or unnecessary personal data.
- Rotate secrets using the provider's documented procedure. Test valid, invalid, missing, stale, replayed, and malformed signatures.

Illustrative Node.js verification pattern only; adapt to the provider's documented signature format and test it before use:

    import { createHmac, timingSafeEqual } from "node:crypto";

    export function verifyHmacSha256(
      rawBody: Buffer,
      suppliedHex: string | undefined,
      secret: string | undefined,
    ): boolean {
      if (!secret || !suppliedHex || !/^[a-fA-F0-9]{64}$/.test(suppliedHex)) {
        return false;
      }
      const expected = createHmac("sha256", secret).update(rawBody).digest();
      const supplied = Buffer.from(suppliedHex, "hex");
      return supplied.length === expected.length && timingSafeEqual(expected, supplied);
    }

This example is not wired into a route or verified against a specific provider. Header prefixes, timestamp formats, canonicalization, and signature headers differ by provider and must follow official documentation.

### Durable audit and metrics

- Record append-only envelopes with event/campaign IDs, timestamp, actor/service, action, outcome, correlation ID, and schema version.
- Send logs to access-controlled cloud storage with encryption, retention, integrity protection/object lock where supported, and recovery procedures. Do not call storage immutable unless permissions and retention enforce it.
- Separate aggregate campaign metrics from personal data. Define retention, access controls, and deletion rules.
- Track eligible audience, approved/suppressed counts, attempted/delivered/bounced, opt-outs/complaints, landing sessions, qualified leads, booked demos, paid conversions, refunds/cancellations, and campaign cost. Define denominators and attribution windows before comparison.

### Escalation

Alert the operator channel on repeated signature failures, queue-age breaches, provider errors, dead-letter growth, unexpected spend, opt-out processing failure, or telemetry outage. Include severity, first/last seen, integration/campaign, correlation IDs, runbook, owner, and next action. Deduplicate alerts and define acknowledgement timers. Do not promise zero downtime; publish measured SLOs and incident history.

## Rollout gates

- **Gate 0 — Ownership:** confirm canonical repositories, production URLs, providers, data flows, regional responsibilities, consent requirements, and owners. Identify AKV Transport's canonical repository before changing AKV code.
- **Gate 1 — Research-only:** implement evidence capture, qualification, copy drafts, campaign registry, and approval states. No external dispatch.
- **Gate 2 — Security:** implement provider-specific signature validation, idempotency, schema validation, rate limiting, secrets handling, audit, and alerts. An integration is not VERIFIED until an end-to-end test is evidenced.
- **Gate 3 — Conversion:** add consent-aware analytics and test events; reconcile application events with payment-provider evidence. Clicks and webhook receipt are not revenue.
- **Gate 4 — Dry-run:** use synthetic recipients and provider sandbox/test mode. Verify suppression, opt-out, retries, replay, dead-letter, alert, and rollback behavior.
- **Gate 5 — Approved pilot:** require audience/source review, copy approval, applicable privacy/legal review, budget cap, provider readiness, kill switch, and named operator. Start with a small bounded cohort.
- **Gate 6 — Evidence-led scale:** expand only after delivery quality, opt-out/complaint rates, qualified-lead rate, attribution, costs, and incident thresholds meet predeclared criteria.

## Definition of ready

A campaign is READY FOR OWNER APPROVAL only when its objective, audience, region, offer, budget cap, owner, and approver are named; claims have dated source evidence; consent, suppression, unsubscribe, privacy, and retention checks pass; pages/forms/accessibility/analytics/conversion routes are tested; provider security and recovery tests pass; and dry-run evidence, rollback controls, and a runbook exist.

A campaign is LIVE only with evidence of deployed version, enabled provider/configuration, successful controlled test, and owner authorization. A repository change or passing CI does not prove production deployment or campaign outcomes.

## Current status and next actions

- **UNVERIFIED:** campaign registry, localized funnels, RSVP/telemetry, live dispatch, durable immutable storage, operator alerts, Stripe conversion wiring, and production HMAC verification. This document does not establish any of them as implemented.
- **BLOCKED:** AKV Transport implementation until its canonical repository and production service boundary are identified.
- **NEXT:** map existing MindReply routes, event/webhook handlers, analytics, Stripe integration, deployment configuration, and tests; then implement against confirmed code paths in a focused PR. Keep external dispatch disabled until rollout gates pass.

For every work item record status (VERIFIED / READY / BLOCKED / FAILED / UNVERIFIED), source URL or run ID, observed evidence, commit/deployment identifier, risk, owner, next action, and timestamp. Never use a successful test as proof of a production deployment or campaign outcome.
**Status:** IMPLEMENTATION SPECIFICATION — not a claim that campaigns, analytics, event bookings, outbound dispatch, or production billing are active.

**Scope:** MindReply commercial acquisition and events, with a reusable integration boundary for AKV Transport once its canonical repository and operating systems are identified.

## Operating objective

Create one controlled path from evidence-backed demand discovery to qualified assessment, approved proposal, verified payment, fulfilled delivery, and measurable follow-up. Every stage must have an owner, a durable record, a success condition, and a stop/escalation rule. No campaign should depend on an unverified deployment, unapproved spend, invented market evidence, or a human remembering to follow up.

## Current architecture facts

The following are code/repository observations, not runtime health claims:

- The active product repository is `Mind-Reply/mindreply-app`.
- Regional delivery pages already exist under `apps/web-replycontrol/app/regions`; the locale configuration includes `uk`, `de`, and `bg`. Each regional route and localized copy still needs URL, accessibility, analytics-consent, and conversion-path smoke tests before promotion.
- The current `apps/web-replycontrol/app/contact/ContactBriefForm.tsx` compiles a brief in the browser and explicitly does not submit or store it. It is not a lead-capture integration.
- `app/api/intake/route.ts` issues a short-lived pressure receipt from validated text. It is not evidence of a CRM pipeline or a paid conversion.
- The repository contains a Stripe webhook route in the phone-first starter that uses Stripe's `constructEvent` signature verification and an idempotency claim in the event handler. This is code-level evidence only; production configuration, delivery, persistence, retries, and reconciliation have not been verified.
- Existing marketing measurement docs define event names and UTM conventions but explicitly do not claim a live analytics connection.
- No canonical AKV Transport repository or connected operating system was identified in the current connected GitHub search. Do not write to a guessed repository or create a parallel production source.

## Operating pipeline

`DISCOVER → VERIFY EVIDENCE → QUALIFY → DIAGNOSE → APPROVE → CONTACT → ASSESS → PROPOSE → BILL → FULFIL → REVIEW`

Each transition is recorded as an event with a stable record ID, timestamp, actor/system, previous state, next state, evidence pointer, and failure reason where relevant. State transitions must be idempotent and safe to retry. A retry must not create duplicate leads, sends, payments, bookings, or fulfillment actions.

## Pillar 1 — inbound growth and content

### Evidence-led leak audits

1. Select a defined segment and a specific operational hypothesis (e.g. response delay, missed lead handoff, repeated manual entry, or unobservable fulfillment).
2. Gather public, attributable evidence and capture source URL, observation date, method, and confidence.
3. Separate observed facts from estimates and hypotheses. Never assert a competitor's outage, loss, latency, security weakness, or customer outcome without independently verifiable evidence.
4. Produce a one-page diagnostic: observed signal, likely business impact (labelled estimate), questions to validate, proposed low-risk test, and next step.
5. Require a human review before external publication or personalized outbound dispatch.

### Regional landing paths

Use the existing localized app structure as the first implementation surface. Proposed routes are `/uk/`, `/de/`, and `/bg/`, subject to route-resolution tests. Each locale needs:

- region-specific problem framing and plain-language service scope;
- locally appropriate contact, privacy, cookie/analytics consent, and invoicing/tax review;
- a single primary CTA leading to a working intake path;
- region and language attached to the lead record, not inferred from sensitive personal attributes;
- canonical URL, hreflang, metadata, accessibility, mobile, and form-error checks.

Do not launch paid traffic to a route until it is deployed, reachable, has a working submission destination, and records test conversions correctly.

### Programmatic authority assets

Build reusable templates for operational checklists, cost-audit explainers, service reliability reviews, and anonymized case studies. Public claims require citations and a freshness date. No synthetic testimonials, fabricated benchmarks, fake customer counts, or unsupported savings promises. Publish a benchmark only when the method, sample, period, limitations, and sources can be disclosed.

### Channel and attribution discipline

Use the existing lowercase UTM convention from `marketing/operations/measurement.md`. Capture campaign/source/medium/content, landing locale, consent state, and funnel stage only where lawful and necessary. Never put message text, email addresses, phone numbers, secrets, or other personal/sensitive content in analytics events. Do not activate ad spend until the owner-approved budget, audience, destination, stop threshold, and reporting cadence are recorded.

## Pillar 2 — events and demonstrations

Represent each event as a record with: objective, event type, proposed date/window, region, organizer, venue/platform, budget owner, risk assessment, accessibility plan, capacity, registration URL, RSVP state, consent text/version, communication preference, and evidence folder.

Event lifecycle:

`IDEA → FEASIBILITY → OWNER APPROVAL → BOOKING → REGISTRATION OPEN → REMINDERS → DELIVERED → ATTENDANCE RECONCILED → FOLLOW-UP → RETROSPECTIVE`

- Digital demonstrations can be staged before physical events, but the demo environment and any limitations must be disclosed.
- Physical hardware milestones require a named hub, equipment/transport owner, safety and insurance review where applicable, and a tested fallback. No venue, supplier, sponsor, travel, or hardware spend is committed without approval.
- RSVP messages must be opt-in where required, respect unsubscribes and channel preferences, and avoid exposing attendee lists.
- Track aggregate invitation delivery, RSVP conversion, attendance, stream health, and post-event next steps. Do not claim real-time telemetry until the stream and data source have been verified.
- If the demo fails, switch to a prepared recording or static walkthrough and record the incident; never silently report a failed live demonstration as successful.

## Pillar 3 — outbound high-strike funnel

### Qualification

Score accounts using transparent, non-sensitive business criteria: fit with the service, observable operational signal, likely urgency, serviceability, and confidence in the evidence. Store the reason for each score. Do not infer personal traits or use private/scraped data. Respect regional direct-marketing law, lawful basis, consent/opt-out requirements, and suppression lists; where rules are unclear, hold dispatch for review.

### Diagnostic and dispatch

Generate a one-page teardown from an approved template. Every generated claim must point to evidence or be explicitly labelled a hypothesis. Store a draft first. Human approval is required for first contact, claims about named firms, and any high-impact/reputationally sensitive message. Dispatch must be rate-limited, deduplicated, monitored, and able to stop globally. Log provider message ID, destination class (not full PII in logs), status, timestamp, retry count, and final outcome.

### Conversion and fulfillment

The CTA must route to a tested assessment/intake flow. Billing may only be offered from an owner-approved offer and verified price. Use Stripe Checkout with allowlisted price IDs, server-side validation, and a signed webhook as the payment authority; a browser redirect is not proof of payment. Persist idempotent payment/order events and connect them to the lead/engagement record. Fulfillment starts only after the expected payment state and offer match are verified. Refunds, tax settings, live prices, payouts, subscriptions, and payment mode changes remain owner-controlled.

## Failure-proof safeguards

### Webhook authenticity and replay protection

- For Stripe, use the official SDK's raw-body `constructEvent` validation with the configured webhook signing secret; never parse and reserialize the body before signature validation.
- For other webhook providers, validate HMAC-SHA-256 over the exact provider-defined canonical payload using the correct secret and `crypto.timingSafeEqual`. Reject missing, malformed, expired, or mismatched signatures before queue insertion.
- Enforce timestamp tolerance where the provider protocol supports it, plus a unique provider event ID/idempotency key. A valid signature does not itself prevent replay.
- Keep secrets in the provider's secret store/environment configuration, not source code, logs, analytics, or pull-request bodies.
- Test valid signature, invalid signature, stale timestamp, duplicate event, out-of-order event, handler timeout, retry, and dead-letter recovery.

### Durable and tamper-evident records

Use an append-only event model with least-privilege writers, unique event IDs, UTC timestamps, retention policy, access audit, and backup/recovery evidence. Where supported, enable storage-level immutability/WORM retention and verify it with a read-only test. Hash chaining alone is tamper-evident, not immutable storage. The current repository does not establish that immutable cloud storage is configured; treat this as a release blocker for any promise of immutable logs.

### Escalation and recovery

Define thresholds for rejected signatures, webhook lag, retry exhaustion, email bounce, queue backlog, missing conversion events, checkout errors, failed deployments, and event/demo failure. Route alerts to the canonical operator channel configured by the owner (current repository policy names `mind.repl@gmail.com` for operational notices); never add WhatsApp or expose customer content in alert payloads. Alerting is not active until delivery is tested end-to-end. Every alert includes severity, affected component, timestamp, correlation/event ID, safe evidence pointer, owner, runbook action, and recovery status.

### Stop conditions

Pause the affected campaign automatically or manually when any of these occur: destination health fails; consent/opt-out enforcement fails; duplicate dispatch is detected; webhook signature validation fails unexpectedly; payment reconciliation diverges; data exposure is suspected; spend exceeds the approved limit; event safety or venue requirements are unresolved; or claims cannot be sourced. A pause is a successful safety action, not an operational failure.

## Minimum data model

Implement these as versioned entities only after choosing the canonical persistence layer:

- `Campaign`: id, owner, goal, region, audience rule, budget cap, approval state, start/stop window.
- `Asset`: id, campaign id, channel, locale, version, claim/source references, approval state.
- `Lead`: id, source, locale, business fit, evidence references, consent/lawful-basis record, suppression state, owner, next action.
- `Diagnostic`: id, lead id, evidence set, hypotheses, confidence, reviewer, revision.
- `Dispatch`: id, asset version, destination reference, provider message id, delivery state, retries, opt-out state.
- `Event` / `RSVP`: event id, attendee reference, consent version, response state, attendance result, communications history.
- `Conversion`: lead id, offer/version, Stripe session/payment IDs, verified payment state, currency/amount, event idempotency key, fulfillment state.
- `AuditEvent`: immutable event ID, timestamp, actor, action, entity reference, previous/next state, safe evidence pointer.

Do not store unnecessary personal data. Define access, retention, deletion, export, and breach-response procedures before collecting production records.

## Implementation sequence and release gates

### P0 — before external activation
1. Confirm the canonical campaign data store and owner-approved operator/escalation channel.
2. Turn the contact brief into an authenticated or abuse-protected server-side intake with consent notice, validation, rate limits, deduplication, and a durable record. Current browser-only brief form is not sufficient.
3. Verify the exact deployed regional routes and wire each CTA to that intake.
4. Verify Stripe sandbox checkout, signature validation, idempotent webhook handling, payment reconciliation, and fulfillment before any live campaign CTA is enabled.
5. Add integration tests for signature failures, replay, duplicate delivery, retries, and checkout mismatch.

### P1 — controlled pilot
1. Start with one region and one narrow business segment.
2. Approve a small batch of evidence-backed diagnostics manually.
3. Use owned/consented channels first; enforce suppression and global stop.
4. Run a sandbox event/demo and measure the full funnel with synthetic test data clearly labelled as test.
5. Review delivery, qualified assessment rate, payment reconciliation, opt-outs, complaint rate, and support load before expansion.

### P2 — scale only after evidence
Automate asset variants, scoring assistance, RSVP reminders, dashboards, and additional regions after the pilot proves data quality, consent enforcement, failure recovery, and positive unit economics. Do not scale because impressions or generated content volume increased.

## Definition of ready

A campaign is **READY FOR OWNER REVIEW** only when the target audience, evidence set, offer, locale, destination, consent text, budget cap, stop conditions, measurement plan, responsible owner, rollback/pause path, and test results are attached.

A campaign is **LIVE / VERIFIED** only after the production URL, actual provider delivery, conversion source, Stripe payment evidence where applicable, fulfillment outcome, and escalation route are independently verified. Repository files, draft assets, a successful build, or a PR do not prove live operation.

## AKV Transport integration boundary

No AKV Transport repository or connected source was verified in the current GitHub inventory. Until the owner identifies its canonical repo and systems:

- keep the campaign model provider-neutral;
- do not import MindReply customer data, credentials, billing, or operational records into AKV;
- require AKV-specific service scope, dispatch rules, event/hardware safety checks, and owner approval;
- do not promise a transport integration, live telemetry, regional hub, or service-level agreement without operational evidence;
- add a separate adapter and access boundary only after repository ownership and data-sharing authority are confirmed.
