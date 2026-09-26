# Google Finance Workflow Contract

Status: IMPLEMENTATION-READY / NOT DEPLOYED
Owner: A11ceo
Execution lead: A11pro
Boundary: FIN-A Money Truth

## Purpose

Define the first Google Cloud Workflows implementation boundary for profit/accounting reconciliation without creating a second product root, exposing credentials, or claiming live execution before deployment evidence exists.

## Workflow

`COMMAND → VALIDATE → LOAD EVIDENCE → PARALLEL SOURCE READS → NORMALIZE → RECONCILE → VERIFY → RECEIPT → HANDOFF`

The workflow is orchestration only. Financial truth remains owned by FIN-A Money Truth and its authorized source adapters.

## Input contract

Required:
- `execution_id`
- `requested_at`
- `accounting_period`
- `correlation_id`
- `sources`

Optional:
- `mode` — `read_only` by default
- `idempotency_key`
- `requested_by`

The workflow must reject missing execution identity, accounting period, or source declarations.

## Safety boundary

Default mode is `read_only`.

The workflow must not:
- charge, refund, payout, spend, or mutate provider financial state;
- bypass A11ceo approval;
- resolve contradictory source values silently;
- treat generated estimates as source truth;
- store credentials in workflow source;
- report LIVE unless source evidence is fresh and the execution receipt proves verification.

## Failure policy

Transient provider/network failure:
`RETRY → VERIFY → CONTINUE`

Validation failure:
`STOP → RECORD → ESCALATE`

Source conflict:
`STOP → PRESERVE EVIDENCE → ESCALATE`

Unauthorized write:
`STOP → NO SIDE EFFECT → ESCALATE TO A11ceo`

## Receipt contract

A completed execution must return:
- `execution_id`
- `status`
- `source_evidence_timestamps`
- `step_results`
- `retry_count`
- `reconciliation_state`
- `verification_state`
- `exceptions`
- `completed_at`

A successful workflow without a verifiable receipt is not considered complete.

## Deployment boundary

This contract is committed to the canonical repository only. No Google Cloud project, scheduler, credential, endpoint, or recurring hourly process is provisioned by this file.

Deployment requires an explicitly authorized Google Cloud environment plus execution verification.

## Acceptance tests

1. Missing `execution_id` fails closed.
2. Missing `accounting_period` fails closed.
3. Read-only execution produces no financial side effect.
4. A transient source failure is bounded by the configured retry policy.
5. Conflicting source values remain visible as an exception.
6. Successful reconciliation emits a structured receipt.
7. No execution is labelled LIVE without fresh evidence.
8. No credential appears in workflow source or logs.

## Release gate

`DESIGN → SOURCE REVIEW → SECURITY REVIEW → TEST → DEPLOY → EXECUTION TEST → EVIDENCE CHECK → APPROVE`

A11ceo retains final approval authority.
