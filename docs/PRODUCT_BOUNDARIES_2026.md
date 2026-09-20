# MindReply Product Boundaries — 2026

## Purpose

MindReply is the commercial communication/product layer. It should make communication work clearer and more reliable; it should not present itself as a magical autonomous intelligence.

## Product vocabulary

MindReply uses a different language from the private A11 control plane:

- **Replyline** — the next useful communication action.
- **Signal** — an observed piece of customer/context evidence.
- **Open Thread** — a conversation or business item that still needs resolution.
- **Handback** — a deliberate return of control to a person.
- **Proofmark** — evidence that an action actually happened.
- **Quiet Fix** — a reversible correction that does not interrupt the user.
- **Bridge** — an integration boundary between systems.

These names are product language only. Internal APIs should use stable technical identifiers.

## Non-negotiables

1. A feature is not marked live until its route, data path, error path and production deployment are verified.
2. Marketing copy must not claim capabilities that are represented only by stubs or mock data.
3. Human approval remains available for consequential customer communication, billing and destructive operations.
4. Every public route gets a smoke test and a useful fallback.
5. Every integration has a health state: CONNECTED, DEGRADED, UNCONNECTED or DISABLED.
6. Vector retrieval is optional infrastructure and must never be confused with authoritative source data.

## Integration architecture

MindReply may use n8n for orchestration, Zapier for business automations, webhooks for event transport and Postgres/pgvector for retrieval. Product logic must remain portable through adapters.

## Revenue-first order

1. reliable customer-facing communication workflow;
2. measurable conversion or retention outcome;
3. billing and entitlement correctness;
4. observability and supportability;
5. advanced automation;
6. experimental interfaces.

The estate should prefer one working revenue path over ten impressive but unverified features.
