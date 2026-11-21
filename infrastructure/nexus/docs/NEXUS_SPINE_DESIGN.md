# NEXUS-SPINE — Event and Worker Runtime Design

**Status:** DESIGN PROPOSAL — NOT IMPLEMENTED
**Scope:** event contracts, durable delivery, worker lifecycle and evidence
**Safety boundary:** no database objects, schedules, secrets, provider settings or workers are changed by this document.

## 1. Runtime boundary

Nexus separates five responsibilities:

1. **Ingress** validates caller identity, signature, schema and visibility.
2. **Receipt** records an idempotent event identity and immutable payload digest.
3. **Outbox** records work that must be delivered after the source transaction commits.
4. **Dispatcher** leases eligible outbox rows and sends them to registered consumers.
5. **Worker** claims a task, executes within its declared capability scope, and emits a result with evidence.

An ingress acknowledgement means only that the event was durably accepted. It does not mean a worker completed the work.

## 2. Event envelope

Required fields: event_id, event_type, schema_version, occurred_at, received_at, producer, tenant_scope, correlation_id, causation_id, idempotency_key, visibility, payload_digest and payload.

Reject unknown producer identities, missing tenant scope, unsupported schema versions, malformed timestamps and payloads that exceed configured size limits. Do not silently coerce a missing identity or visibility field.

## 3. Durable data model proposal

These are logical entities, not applied migrations:

- **event_receipts** — unique producer + tenant_scope + idempotency_key; stores event ID, payload digest, accepted/rejected state and timestamps.
- **outbox_messages** — event ID, destination, state, attempt count, available time, lease owner/expiry and last safe error code.
- **consumer_registry** — consumer ID, supported event types/schema versions, capability scope, enabled state and health policy.
- **worker_registry** — worker ID, version, declared capabilities, deployment identity, last heartbeat, lease and lifecycle state.
- **task_runs** — task ID, event ID, worker ID, attempt, state, start/end timestamps and evidence reference.
- **evidence_records** — immutable references to logs, test results, output digests and verification outcome.

Use foreign keys and uniqueness constraints for identity and idempotency. Enforce tenant/visibility scope in database policies and dispatcher authorization. Payload retention and deletion policy must be defined before production use.

## 4. Delivery and retry semantics

- Accept once by unique idempotency key; identical replay returns the original receipt.
- Same idempotency key with a different payload digest is a conflict and must be quarantined.
- Dispatcher claims work using a short lease and an atomic compare-and-set or SKIP LOCKED transaction.
- External delivery is at-least-once. Consumers must be idempotent.
- Retry transient failures with bounded exponential backoff and jitter.
- Permanent schema, authorization or visibility failures go to a dead-letter state with a safe reason code.
- A worker must heartbeat/renew its lease; expired leases become retryable only after the previous attempt is fenced from writing.
- Mark a task complete only after required outputs and evidence references are durably recorded.
- Use an outbox transaction at the producer boundary; never assume a multi-step client-side write is atomic.

## 5. Worker lifecycle

Allowed states: REGISTERED → READY → CLAIMED → RUNNING → SUCCEEDED.

Exceptional states: DEGRADED, BLOCKED, RETRY_WAIT, DEAD_LETTER, DISABLED.

A registry entry is a definition, not proof of a running worker. RUNNING requires a fresh heartbeat plus an active task lease. Unknown or stale health is not healthy. Disabled workers cannot be scheduled or claimed.

## 6. Evidence and authority

Every run records input event and schema version; authenticated worker identity and capability scope; task and attempt identifiers; start/end time and outcome; output digest and evidence reference; retry/failure reason; and any human decision reference.

Workers may inspect, research, reconcile, prepare changes and run reversible internal tasks within scope. Spend, funds movement, credential changes, destructive actions and other irreversible external effects remain behind explicit authority checks.

## 7. Existing integration constraints

The existing telemetry ingress is not, by itself, a durable event bus or worker fan-out system. Existing finance-oriented event records must not be repurposed as a general-purpose Nexus queue without schema, RLS, retention and ownership review. Existing scheduled research workers remain disabled until caller identity, token contract, retry semantics and evidence output are verified. Intentionally paused workers remain paused.

## 8. Implementation sequence

1. Inventory existing tables, policies, indexes, function ownership and event consumers.
2. Confirm whether an existing safe receipt/outbox implementation already exists.
3. Produce a migration diff and rollback plan for review; do not apply it to production.
4. Implement pure envelope validation and idempotency tests.
5. Implement receipt/outbox against a disposable database.
6. Test duplicate delivery, digest conflict, concurrent claims, lease expiry, retry, dead-letter and partial failure.
7. Integrate one non-financial synthetic consumer.
8. Verify heartbeat freshness, task fencing and evidence persistence.
9. Only then consider a narrowly scoped production rollout.

## 9. Acceptance criteria

- Concurrent duplicate deliveries create one receipt and one logical task.
- A changed payload under an existing idempotency key is rejected.
- No task is dispatched across tenant or visibility boundaries.
- Worker leases prevent stale attempts from overwriting newer results.
- Retries are bounded and observable.
- No accepted event is silently lost.
- A task cannot become SUCCEEDED without required evidence.
- Disabled or stale workers are never reported as active.
- No production migration or external side effect occurs during the design phase.
