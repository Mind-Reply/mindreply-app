# HighStrike Campaign Orchestrator

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
