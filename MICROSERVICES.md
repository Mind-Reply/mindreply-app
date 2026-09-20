# MindReply Production Service Architecture

## Canonical source

`angellllkr-eng/mind-reply-core` is the active, non-archived source repository for the MindReply core application.

## Service contract

| Service | Route | Purpose | Health signal |
|---|---|---|---|
| web | `/` | Public/product surface | HTTP 200 |
| health | `/api/health` | Liveness | `status=ok` |
| readiness | `/api/ready` | Runtime/config readiness | `ready=true` |
| version | `/api/version` | Release identity | commit/version payload |
| service registry | `/api/services` | Service inventory | declared services |
| status UI | `/status` | Human-facing operations status | checks visible |

## Extension services

The architecture is ready for independently deployable domains without forcing premature infrastructure fragmentation:

- identity/authentication
- AI/model routing
- knowledge/RAG
- communications
- billing/commerce
- automation/workflows
- analytics/observability
- deployment/control

Each extension must have:

1. explicit API contract;
2. authentication/authorization boundary;
3. health/readiness behavior;
4. structured logging;
5. retry/idempotency strategy where applicable;
6. failure isolation;
7. test coverage;
8. production verification;
9. documented owner and data boundary.

## Vercel boundary

Keep tightly coupled Next.js UI/API services in the same Vercel project when same-origin routing and shared deployment are beneficial. Split into separate Vercel projects only when independent scaling, security, deployment cadence, or failure isolation materially justifies it.

## Comparison contract

Before promotion, compare:

1. GitHub canonical source and commit.
2. Vercel project and Git integration.
3. Production domain mapping.
4. Known-good deployment/rollback candidate.
5. Runtime telemetry.

Production is GREEN only when these agree.

## Production gate

A service is not production-ready merely because its code exists. Verify:

`source -> build -> deployment -> endpoint -> domain -> runtime -> monitoring`

before marking it GREEN.

Secrets must never be returned by health/readiness endpoints or committed to the repository.
