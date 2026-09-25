# A11 Continuity Ledger

Three persistent layers:

1. **Ledger** — append-only D1 Integrity Log with SHA-256 hash chaining.
2. **Memory** — one distilled KV record per bot/persona, keyed as `memory_<bot_id>`.
3. **Research** — Cloudflare Vectorize semantic retrieval over distilled knowledge.

The ledger is the authority layer. Memory is a hot projection of ledger-backed state. Research is a query layer; it does not replace the ledger.

Full chat bodies are stored separately with a 90-day expiry timestamp. They are not part of the permanent ledger.

## Runtime flow

`chat → ledger append → hot memory projection → embedding → Vectorize upsert`

`research query → embedding → Vectorize similarity + metadata filters → context`

The implementation does not claim that 3,600 personas exist. Existing persona data must be imported explicitly and verified.

## Integrity

- `integrity_log` has update/delete triggers that abort mutation.
- `ledger_chain_heads` is coordination state, not ledger history.
- D1 `batch()` is used to keep the append and chain-head update atomic. Cloudflare documents D1 batches as transactional and sequential. 
- Vectorize uses 768-dimensional embeddings from `@cf/baai/bge-base-en-v1.5`.
- Vectorize metadata filters can scope retrieval by `city_micro` and `purpose`.

## No ghost state

A memory record carries `last_ledger_hash`. If the memory projection is rebuilt or lost, it can be reconstructed from the permanent ledger events. Research vectors are replaceable projections and never become the authority.

## Deployment

This repository contains the implementation and deployment configuration only. Cloudflare resources and credentials are not fabricated or silently created. Deploy only after the actual D1 database ID, KV namespace ID, and owner-approved Cloudflare account are available.

## Communication evidence

The worker accepts normalized provider delivery events at `POST /v1/communications/webhook`. Requests require an HMAC-SHA256 signature in `x-a11-signature`, calculated over the exact request body with the Cloudflare secret `COMMUNICATION_WEBHOOK_SECRET`. Provider event IDs are unique per provider, so retries are recorded as duplicates rather than creating false delivery events.

The read-only `GET /v1/communications` route exposes recent evidence without message bodies. Recipient references should be masked or otherwise non-PII. Provider-specific webhook adapters must normalize their real provider callbacks before forwarding them here. This layer does not manufacture delivery evidence and does not claim provider connectivity until real callbacks are received.

Set the secret with Cloudflare secret storage; do not place it in `wrangler.toml` or source control.
