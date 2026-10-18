# EU Syndication Runtime — Deployment Gate

Status: **BLOCKED — design reviewed; not deployed or verified**

## Proposed topology

- GCP project: `mind-reply-496111` (project existence and billing/access not verified from this workspace).
- Runtime and Scheduler region: `europe-west3` (Frankfurt).
- Cloud Run service: `syndication-service`.
- Scheduler job: `syndication-daily-trigger`, daily at 09:00 UTC (`0 9 * * *`).
- Runtime image candidate: `europe-west3-docker.pkg.dev/mind-reply-496111/syndication/runner:v1` (image existence, digest, provenance, and deployment health unverified).
- Secret Manager secret name candidate: `api-credentials`. Never place real credentials in serialized design payloads, source files, command history, or logs.

## Evidence required before deployment

1. Verify project ID, billing state, organization policy, IAM permissions, and Artifact Registry image/digest.
2. Build and test the container from reviewed source; pin an immutable image digest rather than relying on the mutable `:v1` tag.
3. Create a dedicated runtime service account and a separate Scheduler caller service account. Grant only required permissions. Grant Secret Manager Secret Accessor on the specific secret to the runtime identity only; do not give the Scheduler identity secret access.
4. Confirm the service is private, validates authenticated OIDC requests, rejects unexpected methods/payloads, and has idempotency, timeouts, retries, rate limits, and audit logs.
5. Create the Scheduler job only after the real Cloud Run URL is returned by deployment. The supplied `https://syndication-service-<PROJECT_HASH>-ey.a.run.app` URI is a placeholder and must not be used.
6. Run a dry-run/sandbox execution and verify logs, delivery receipts, alerting, retry behavior, and a documented rollback. Do not dispatch public media or execute financial transactions during smoke tests.
7. Confirm data classification, retention, processor terms, and cross-border flows. Frankfurt placement alone does not establish full EEA/Bulgarian legal compliance; UK settlement accounts and third-party services need separate review.

## Treasury and yield claims — not verified

The stated APY/AER values (Tipton 4.25%, Kent Reliance 4.15%, Happen 4.00%), the alleged €818K liquidity figure, and the named projection/PDF artifacts were supplied as claims; underlying account statements, dated product terms, ownership, eligibility, and artifacts were not available for inspection here. Do not use these figures as verified balances or promise returns.

The runtime must not initiate bank transfers, rebalance funds, or change settlement destinations without explicit owner authorization, institution/API verification, per-transaction limits, dual-control where available, reconciliation, and a tested kill switch. An automated 09:00 trigger should initially run **read-only validation / dry-run mode** and emit evidence only.

## Current execution state

- Architecture documentation: prepared in this PR branch.
- GCP resources created: **not verified; no GCP management connector is available in this workspace**.
- Cloud Run deployment / Scheduler job: **not deployed**.
- Secret values: **not supplied or stored**.
- Treasury account verification / sweep execution: **not performed**.
- Production readiness: **BLOCKED** pending the evidence and approvals above.
