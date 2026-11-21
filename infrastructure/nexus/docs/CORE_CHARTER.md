# Nexus Core Charter

Purpose: shared technical primitives and contracts. No customer-facing promise belongs here.

Vocabulary:

- **Anchor** — authoritative state.
- **Relay** — transport between boundaries.
- **Facet** — a projection of state for a consumer.
- **Seal** — validation that prevents an invalid state transition.
- **Echo** — emitted event describing a completed transition.

Core rules:

1. Stable interfaces before vendor-specific implementations.
2. Idempotency for externally retried events.
3. Explicit error states rather than silent fallback.
4. Structured audit records for consequential changes.
5. No secrets in shared packages.

Vector retrieval, webhooks and automation belong behind adapters. The core must remain usable without a particular SaaS vendor.
