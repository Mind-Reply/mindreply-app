# Quiet Routing

Nexus routes work by intent and consequence, not by whichever model or connector happens to be available.

## Route classes

| Route | Purpose | Default authority |
|---|---|---|
| **Whisper** | low-risk lookup | automatic |
| **Weave** | combine approved context | automatic |
| **Forge** | prepare an artifact/change | automatic |
| **Checkpoint** | consequential proposal | owner review |
| **Handback** | return control to a person | explicit |
| **Recovery** | restore known-good state | policy-bounded |

## Provider neutrality

The router may send work to n8n, Zapier, GitHub Actions, a queue, a vector store or another compatible service. Provider selection is implementation detail and must not alter user-facing semantics.

## Vector retrieval contract

Every retrieval result carries `source`, `visibility`, `updated_at`, `provenance` and `confidence_basis`. Missing provenance makes a result unusable for consequential decisions.

## Failure behavior

No silent fallback may cross a security or visibility boundary. If a route fails, return a useful open loop with the attempted route, reason and next safe action.
