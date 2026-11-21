# Nexus Core

**Canonical source:** `Mind-Reply/mindreply-app/infrastructure/nexus/`
**Status:** source reconciliation in review; runtime and deployment are not implied.

Nexus defines shared routing, bridge, adapter, provenance, health and operator contracts. It is infrastructure, not an independently deployed product root.

## Operating rules

- One capability has one authoritative implementation.
- Source presence is not deployment evidence.
- Every bridge declares owner, scope, schemas, timeout, retry and idempotency behavior.
- Retrieval must preserve source provenance and visibility.
- Missing authorization, identity, configuration or verification fails closed.
- No credentials or private operational data belong in this directory.

The former `angellllkr-eng/nexus-core` satellite is preserved unchanged during review. Its contents are being reconciled here; it must not be retired until parity and ownership are reviewed.
