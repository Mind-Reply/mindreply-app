-- NEXUS-SPINE schema proposal
-- PROPOSAL ONLY: NOT A SUPABASE MIGRATION. DO NOT APPLY TO ANY ENVIRONMENT.
-- Target: isolated PostgreSQL schema; service-side access only.
-- This proposal intentionally contains no grants to anon/authenticated and no
-- worker activation, schedules, triggers, external delivery, or financial effects.

-- 1. Namespace boundary
create schema if not exists nexus_runtime;
revoke all on schema nexus_runtime from public, anon, authenticated;
grant usage on schema nexus_runtime to service_role;

-- 2. Immutable accepted-event receipt
create table nexus_runtime.event_receipts (
  receipt_id uuid primary key default gen_random_uuid(),
  producer_id text not null check (length(producer_id) between 1 and 128),
  tenant_scope text not null check (length(tenant_scope) between 1 and 128),
  idempotency_key text not null check (length(idempotency_key) between 1 and 256),
  event_id text not null check (length(event_id) between 1 and 128),
  event_type text not null check (length(event_type) between 1 and 128),
  schema_version integer not null check (schema_version > 0),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  correlation_id text not null,
  causation_id text,
  visibility text not null check (visibility in ('internal','tenant','restricted')),
  payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  constraint event_receipts_idempotency_uq
    unique (producer_id, tenant_scope, idempotency_key),
  constraint event_receipts_event_id_uq
    unique (producer_id, tenant_scope, event_id)
);

-- 3. Durable outbox; delivery is at-least-once and consumers must be idempotent.
create table nexus_runtime.outbox_messages (
  outbox_id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references nexus_runtime.event_receipts(receipt_id),
  consumer_id text not null,
  state text not null default 'queued'
    check (state in ('queued','leased','delivered','retry_wait','dead_letter')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 8 check (max_attempts between 1 and 32),
  available_at timestamptz not null default now(),
  lease_owner text,
  lease_token uuid,
  lease_expires_at timestamptz,
  last_error_code text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  constraint outbox_receipt_consumer_uq unique (receipt_id, consumer_id),
  constraint outbox_lease_state_ck check (
    (state = 'leased' and lease_owner is not null and lease_token is not null
      and lease_expires_at is not null)
    or
    (state <> 'leased' and lease_owner is null and lease_token is null
      and lease_expires_at is null)
  )
);
create index outbox_dispatch_idx
  on nexus_runtime.outbox_messages (available_at, created_at)
  where state in ('queued','retry_wait');
create index outbox_expired_lease_idx
  on nexus_runtime.outbox_messages (lease_expires_at)
  where state = 'leased';

-- 4. Explicit consumer and worker registries.
create table nexus_runtime.consumer_registry (
  consumer_id text primary key,
  enabled boolean not null default false,
  event_types text[] not null default '{}',
  schema_versions integer[] not null default '{}',
  capability_scope text[] not null default '{}',
  max_attempts integer not null default 8 check (max_attempts between 1 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table nexus_runtime.worker_registry (
  worker_id text primary key,
  consumer_id text not null references nexus_runtime.consumer_registry(consumer_id),
  worker_version text not null,
  deployment_identity text not null,
  capability_scope text[] not null default '{}',
  enabled boolean not null default false,
  state text not null default 'registered'
    check (state in ('registered','ready','claimed','running','degraded','blocked','disabled')),
  last_heartbeat_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index worker_heartbeat_freshness_idx
  on nexus_runtime.worker_registry (last_heartbeat_at)
  where enabled = true;

-- 5. Fenced task attempts and immutable evidence references.
create table nexus_runtime.task_runs (
  task_run_id uuid primary key default gen_random_uuid(),
  outbox_id uuid not null references nexus_runtime.outbox_messages(outbox_id),
  worker_id text not null references nexus_runtime.worker_registry(worker_id),
  attempt_number integer not null check (attempt_number > 0),
  lease_token uuid not null,
  state text not null
    check (state in ('claimed','running','succeeded','failed','retry_wait','dead_letter')),
  started_at timestamptz,
  finished_at timestamptz,
  safe_error_code text,
  created_at timestamptz not null default now(),
  constraint task_runs_attempt_uq unique (outbox_id, attempt_number)
);

create table nexus_runtime.evidence_records (
  evidence_id uuid primary key default gen_random_uuid(),
  task_run_id uuid not null references nexus_runtime.task_runs(task_run_id),
  evidence_kind text not null,
  evidence_uri text not null,
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  verification_state text not null
    check (verification_state in ('pending','accepted','rejected')),
  recorded_at timestamptz not null default now()
);

-- 6. Default-deny RLS. No client policies are defined in this proposal.
alter table nexus_runtime.event_receipts enable row level security;
alter table nexus_runtime.outbox_messages enable row level security;
alter table nexus_runtime.consumer_registry enable row level security;
alter table nexus_runtime.worker_registry enable row level security;
alter table nexus_runtime.task_runs enable row level security;
alter table nexus_runtime.evidence_records enable row level security;

revoke all on all tables in schema nexus_runtime from public, anon, authenticated;
grant select, insert on nexus_runtime.event_receipts to service_role;
grant select, insert, update on nexus_runtime.outbox_messages to service_role;
grant select, insert, update on nexus_runtime.consumer_registry to service_role;
grant select, insert, update on nexus_runtime.worker_registry to service_role;
grant select, insert, update on nexus_runtime.task_runs to service_role;
grant select, insert on nexus_runtime.evidence_records to service_role;

-- 7. Required RPC/transaction contract before implementation:
-- - Validate authenticated producer identity before calling this schema.
-- - Insert receipt by (producer_id, tenant_scope, idempotency_key).
-- - On conflict, compare payload_sha256; same digest is an idempotent replay,
--   different digest is a hard conflict and must not enqueue work.
-- - Insert one outbox row per enabled consumer in the same transaction.
-- - Claim via atomic row locking/lease issuance; every task write must present
--   the current lease_token so stale workers are fenced out.
-- - Revoke PUBLIC/anon/authenticated EXECUTE on any SECURITY DEFINER wrapper;
--   grant EXECUTE only to service_role, pin search_path, and review owner/grants.
-- - Keep any wrapper outside the public API surface unless explicitly exposed
--   with the same restricted grants.
-- - Add concurrency, duplicate, digest-conflict, lease-expiry, retry, dead-letter,
--   tenant-isolation, and partial-failure tests before any deployment.
