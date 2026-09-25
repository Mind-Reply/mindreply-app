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
