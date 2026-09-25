# MindReply Microservice Estate

## Canonical intent

MindReply is operated as a set of small, observable service contracts rather than one opaque application.

## Core services

| Service | Endpoint | Responsibility | Failure posture |
|---|---|---|---|
| Health | `/api/health` | Liveness/process health | No cache; fast response |
| Readiness | `/api/ready` | Required production configuration | 503 when not ready |
| Version | `/api/version` | Release/build identity | Deterministic metadata |
| Services | `/api/services` | Service discovery/catalog | Read-only |
| Status | `/status` | Human operator visibility | Read-only |

## Planned platform services

- Intake / request normalization
- Reply orchestration
- Knowledge retrieval
- Model routing
- Evidence recording
- Connector execution
- Notification delivery
- Billing/checkout boundary
- Deployment control
- Audit/status aggregation

## Rules

- Each service gets a narrow responsibility and explicit contract.
- Services must expose health/readiness semantics when operationally meaningful.
- No service may silently perform destructive actions.
- External calls require bounded timeouts and failure handling.
- Retries must be bounded and idempotency-aware.
- Secrets stay server-side.
- Customer data should be minimized and never copied into diagnostics unnecessarily.
- Production claims require live verification.

## Comparison gate

Before release, compare the intended commit with the deployed commit and verify the primary domain points at the intended Vercel project. Check `/api/health`, `/api/ready`, `/api/version`, and `/status` after deployment.
