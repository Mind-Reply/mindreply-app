# Pressure Agent Contract

The bot loop is intentionally narrow:

```text
Bot
  → POST /api/intake { pressure_text }
  → { receipt_id }
  → GET /api/agent?receipt_id=<receipt_id>
  → {
       synthesis,
       mindset_protection,
       calmer_move,
       one_action,
       risk_gate,
       receipt
     }
  → Bot executes one_action only
```

## Execution boundary

The API does not execute external actions.

It returns exactly one proposed action. The bot may execute that action only when `risk_gate.status === "clear"`.

A `hold` gate means the bot must stop and require the applicable human/owner verification before committing the action.

No multi-action plan is emitted by the execution contract.

## Receipt security

The receipt is an encrypted, short-lived bearer token. Raw `pressure_text` is not placed in the URL.

- Default receipt lifetime: 15 minutes.
- Encryption: AES-256-GCM.
- Secret: `PRESSURE_AGENT_SECRET`.
- Minimum secret length: 32 characters.
- Expired or malformed receipts return 404.
- Responses are marked `Cache-Control: no-store`.

## Endpoint contract

### POST /api/intake

Request:

```json
{
  "pressure_text": "..."
}
```

Response:

```json
{
  "ok": true,
  "receipt_id": "...",
  "expires_at": "...",
  "next": "/api/agent?receipt_id=<receipt_id>"
}
```

### GET /api/agent?receipt_id=...

Response:

```json
{
  "ok": true,
  "synthesis": "...",
  "mindset_protection": "...",
  "calmer_move": "...",
  "one_action": {
    "id": "...",
    "instruction": "...",
    "reversible": true
  },
  "risk_gate": {
    "status": "clear|hold|block",
    "reason": "..."
  },
  "receipt": {
    "id": "...",
    "issued_at": "...",
    "expires_at": "..."
  },
  "execution": {
    "mode": "single_action",
    "execute_only": "one_action",
    "executable": true
  }
}
```

## Design direction

The visual treatment should follow the supplied reference: near-black field, restrained graphite/silver structure, cold-blue horizon light and a single warm signal. The interface should make the one actionable move visually dominant while keeping the synthesis and risk gate quiet and legible.
