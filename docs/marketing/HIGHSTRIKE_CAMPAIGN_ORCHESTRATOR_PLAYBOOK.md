# HighStrike Campaign Orchestrator — implementation playbook

**Status:** SPECIFICATION / NOT LIVE  
**Canonical product root:** `Mind-Reply/mindreply-app`  
**Related ecosystem:** AKV Transport (`https://akv-transport.co.uk`, live status not verified here)  
**Purpose:** Turn approved growth, event, and outbound workflows into a measurable, failure-aware campaign pipeline without implying that dispatch, telemetry, billing, or physical operations are already active.

## 1. Operating contract

Every campaign follows:

`PLAN → QUALIFY → APPROVE → STAGE → AUTHENTICATE → DISPATCH → VERIFY → MEASURE → REVIEW`

- Default mode is **dry-run / staged**. Live email, SMS, media outreach, paid ads, event invitations, public publishing, physical hardware operations, and billing changes remain disabled until an owner-approved campaign record names the audience, channel, region, budget, schedule, accountable operator, destination, and stop conditions.
- Each action must emit an evidence-backed receipt. A planned or queued action is not a delivery; a delivery is not a conversion; a checkout link is not revenue.
- No synthetic testimonials, customer names, performance results, competitor allegations, telemetry, RSVP counts, revenue, or uptime claims.
- Keep the canonical MindReply product root as the source of truth. Do not write to archived repositories or create a parallel production root.

## 2. Campaign objects and state machine

Each campaign record should include:
- `campaign_id`, immutable `event_id`, name, owner, objective, status, created/updated timestamps, and approval reference;
- brand/product, locale (`uk`, `de`, `bg`), channel, source/medium/campaign/content attribution;
- audience definition, provenance, lawful basis/consent where required, suppression-list version, and retention deadline;
- approved asset/version, destination URL, budget ceiling, schedule/time zone, retry policy, and stop conditions;
- evidence references, delivery provider IDs, correlation/idempotency keys, error/dead-letter state, and measured outcome source.

Use explicit states such as `draft`, `needs_approval`, `approved`, `staged`, `dispatching`, `delivered`, `failed`, `cancelled`, and `completed`. Only a validated, authorized transition may change state. Keep an append-only event history; never rewrite a prior event to make a failed action appear successful.

## 3. Inbound growth and content

### Leak-audit showcases
1. Offer a diagnostic checklist or audit with a clearly scoped methodology.
2. Capture only the minimum information needed to respond; provide a privacy notice and appropriate consent/marketing controls.
3. Label estimates and assumptions. Competitor downtime, latency, cost, or availability comparisons require dated, reproducible, comparable evidence and a source record. Do not publish unsupported allegations or imply access to non-public competitor systems.
4. Use a reviewed template and human approval before public distribution.

### Regional funnels
- Support localized landing routes `/uk/`, `/de/`, and `/bg/` only when each page has reviewed language, currency, legal/privacy text, contact route, and an actually working destination.
- Preserve UTM attribution and campaign IDs through the funnel; do not put email addresses, message bodies, sensitive data, or raw personal identifiers in analytics.
- Validate page response, form validation, consent behavior, accessibility, and destination health before activating traffic. Region route presence alone does not prove conversion readiness.

### Programmatic authority assets
- Generate drafts from versioned templates and verified public evidence; store source URLs, observation date, method, and caveats.
- Run factual, legal/reputation, privacy, and brand review. Block automated publication when evidence is stale, missing, or not comparable.
- Track impressions, qualified visits, CTA events, accepted leads, activation, and attributable revenue separately.

## 4. Events, demos, and hardware milestones

- Each showcase needs an owner, run-of-show, venue/platform, accessibility and safety checklist, operator roster, equipment readiness evidence, contingency plan, and cancellation trigger.
- RSVP flows must record consent/preferences and allow withdrawal; expose only attendee information required by each operator.
- Live-stream telemetry must state its source and freshness. Distinguish planned capacity, invitations sent, confirmed RSVPs, actual attendance, stream health, and post-event conversions.
- Hardware demonstrations require an explicit site/hub authorization, responsible safety lead, tested equipment, stop procedure, and evidence-backed readiness sign-off. Software campaign status must never be treated as proof that a physical asset is ready.
- Send reminders only through approved channels and within applicable contact preferences. No invitations, bookings, livestreams, or physical dispatches are activated by this specification.

## 5. Outbound targeting and diagnostic teardown

1. Define an objective, region, eligible firm profile, exclusion rules, and lawful/proportionate data sources before collecting leads.
2. Score candidates only from documented business-relevant signals; retain source, observation date, confidence rationale, and a correction/opt-out path.
3. Generate a one-page diagnostic with the evidence, methodology, limitations, estimated impact range, and a clear next step. Keep unverified estimates visibly labeled.
4. Require human review of each target list and diagnostic before first contact. Enforce suppression lists, channel-specific consent/legitimate-interest review, applicable UK/EU/BG rules, and unsubscribe handling.
5. Record an idempotent dispatch receipt and provider response. Retries must not duplicate outreach. Failures go to a dead-letter queue and operator escalation; repeated failure pauses the campaign.
6. Link to an approved offer/checkout and SLA onboarding flow. Do not create charges, subscriptions, invoices, price changes, or contractual commitments automatically. Confirm terms, price, currency, tax treatment, fulfilment capacity, and cancellation/refund terms before enabling billing.

## 6. Webhook security gate (mandatory before queue entry)

For every outbound callback or event-driven webhook:
- Read the raw request bytes before JSON parsing; compute HMAC-SHA-256 with a secret held only in the provider secret manager.
- Parse a strict signature format and compare equal-length byte buffers using a timing-safe comparison (`crypto.timingSafeEqual` or the runtime's equivalent). Reject missing, malformed, or mismatched signatures.
- Authenticate a timestamp and enforce a bounded clock-skew window; use an event ID/nonce plus durable idempotency storage to reject replay and duplicate processing.
- Validate content type, payload size, schema, required fields, and event type. Authorize the event/source against an explicit allowlist.
- Only after signature, freshness, schema, authorization, and replay checks succeed may the event enter a processing queue.
- Return generic rejection responses without exposing signature details. Rate-limit abuse and avoid logging secrets or full personal payloads.
- Test valid signature, wrong secret, altered body, missing/malformed header, unequal-length signature, stale timestamp, replay, duplicate delivery, oversized body, unknown event type, and queue outage.

**Release gate:** do not claim HMAC protection until the actual deployed endpoint and negative-path tests have been verified. A written requirement is not evidence of implementation.

## 7. Logging, durability, and escalation

- Emit structured records with `event_id`, `campaign_id`, `source`, `observed_at`, `received_at`, `state`, `correlation_id`, `idempotency_key`, `actor/authorization`, `evidence_ref`, attempt count, and sanitized error category.
- Keep personal data out of general logs. Apply least-privilege access, retention limits, encryption in transit/at rest, and documented deletion/subject-rights handling.
- For audit-grade immutability, use a cloud storage configuration that provides verified retention/object-lock or WORM semantics, restricted deletion permissions, and access audit trails. Ordinary append-only application code or a successful upload is not proof of immutable storage.
- Retry transient errors with bounded exponential backoff and jitter. Never retry permanent validation/authentication errors as if transient. Send exhausted jobs to a dead-letter queue.
- Escalate delivery failures, invalid signatures, replay attempts, queue saturation, stale telemetry, and destination/checkout health failures to a configured operator channel. Include severity, campaign/event IDs, evidence link, first/last observed time, retry state, and runbook. Verify that the alert destination itself is healthy; if not, use a documented secondary route.
- Set explicit SLOs and alert thresholds per workflow. “Zero downtime” is an objective, not a guarantee.

## 8. Measurement and commercial proof

Report each metric with its source, time window, attribution method, freshness, denominator, and known gaps:
- delivery success/failure and provider latency;
- qualified visits, CTA rate, valid form submissions, accepted leads, RSVP conversion, attendance, and demo completion;
- checkout starts, confirmed paid transactions, refunds/cancellations, fulfilled work, and contribution after acquisition/fulfilment costs.

Do not count clicks, generated leads, queued messages, test transactions, or forecast values as revenue. Verify actual Stripe payment/invoice evidence and fulfilled delivery before marking a conversion as commercially proven. Use test mode for integration validation and keep live billing disabled until explicitly approved.

## 9. Phased delivery and acceptance criteria

### Phase 0 — inventory and safeguards
- Map existing campaign routes, providers, queues, data stores, webhook endpoints, secrets references, and operator destinations.
- Record what is present, missing, and live-tested. No secrets are copied into Git.

### Phase 1 — dry-run core
- Add typed campaign/event schemas, explicit state transitions, validation, idempotency, structured receipts, and dry-run adapters.
- Unit-test invalid transitions, duplicate events, retries, redaction, and failure escalation.
- Prove that dry-run cannot contact external recipients, publish content, charge money, or actuate hardware.

### Phase 2 — secured ingress and durable processing
- Implement raw-body HMAC verification, replay protection, authorization, queue handoff, dead-letter handling, and immutable-log provider configuration.
- Pass all security cases in section 6 and prove logs cannot be silently altered/deleted under the configured retention policy.

### Phase 3 — reviewed growth and event workflows
- Build region-aware funnel and RSVP validations, evidence-linked audit assets, target scoring, suppression/opt-out enforcement, and human approval checkpoints.
- Test with synthetic fixtures only; never use synthetic results as real performance claims.

### Phase 4 — gated provider integrations
- Connect approved providers in sandbox/test mode; validate provider receipts and failure cases.
- Production activation requires owner approval, privacy/security review, budget and audience caps, an operator/rollback plan, a monitored canary, and explicit confirmation of the exact campaign and live side effects.

### Phase 5 — controlled launch and review
- Activate one bounded campaign at a time after all gates pass. Monitor the canary, stop on threshold breach, and publish an evidence-based post-campaign report.
- Expand only after demonstrated delivery quality, conversion integrity, and acceptable unit economics.

## 10. Current verification checklist

The following are **not verified by this playbook** and must remain blocked until inspected:
- live regional landing pages, analytics, RSVP or streaming telemetry;
- live webhook HMAC enforcement, replay protection, durable queue, and operator alerts;
- cloud immutable/WORM logging;
- active outbound target data, lawful contact controls, and provider delivery;
- live Stripe checkout/SLA onboarding and paid conversion evidence;
- AKV Transport domain, operations, hub readiness, or hardware telemetry.

**Next implementation action:** inventory the canonical repository and connected services, then implement the smallest independently testable dry-run slice. Keep production dispatch disabled until the gates above are evidenced.
