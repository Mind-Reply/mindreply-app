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
