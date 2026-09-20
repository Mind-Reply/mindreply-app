# Integration Mesh

This is the implementation contract for external automation. It intentionally does not pretend that credentials or live connections exist.

## n8n
Use n8n for long-running workflows, schedules, retries and human approval pauses. Recommended flows:
- `estate.hourly.reality-scan`
- `estate.release-watch`
- `estate.opportunity-watch`
- `estate.owner-digest`
- `estate.recovery-candidate`

## Zapier
Use Zapier for simple SaaS-to-SaaS edges where n8n would add unnecessary operational weight. Every Zap should terminate in a durable audit event and have a disabled-by-default write action until verified.

## Vector retrieval
Use a vendor-neutral embedding interface. Store document identity, source, version, consent/scope, embedding model, created time and deletion state alongside vectors. Retrieval must be scoped before similarity search; similarity alone is not authorization.

## Event contract
```json
{
  "event_id": "uuid",
  "kind": "release|incident|opportunity|approval|sync",
  "source": "repo-or-service",
  "occurred_at": "ISO-8601",
  "subject": "stable-id",
  "severity": "info|attention|urgent",
  "evidence": [],
  "requires_owner": false
}
```

## Live-status rule
A dashboard may show **connected**, **healthy**, **degraded**, **stale**, or **unverified**. It must never infer health from the existence of configuration alone.
