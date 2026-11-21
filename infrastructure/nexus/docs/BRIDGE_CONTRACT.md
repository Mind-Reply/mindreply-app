# Nexus Bridge Contract

Nexus is the integration fabric. It should make external systems interchangeable rather than turning any single vendor into the architecture.

## Native vocabulary
- **Bridge** — a connector boundary.
- **Parcel** — validated input/output payload.
- **Contract** — schema and permission agreement.
- **Watch** — health and freshness monitor.
- **Replay** — safe retry using an idempotency key.

## Supported adapter classes
- workflow automation: n8n-compatible webhooks and schedules;
- lightweight automation: Zapier-compatible webhooks;
- retrieval: vector store adapter with provenance;
- billing: signed Stripe events;
- source control: GitHub app/API;
- data: Postgres/Supabase-compatible storage.

## Requirements
Every Bridge declares owner, credentials scope, input schema, output schema, timeout, retry policy, idempotency strategy, health endpoint/check, and data retention.

## Vector rule
Vectors are derived indexes. Source records remain authoritative. Retrieval results must carry source IDs and timestamps. Deleted source data must have a defined index deletion path.

## Failure rule
A failed Bridge must become visible as `DEGRADED` or `BLOCKED`; it must never silently drop a customer action.
