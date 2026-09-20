# Elysium Execution — Frontends & Runtime

**Issues:** #39 Aurelia · #40 Lumenforge · #41 Veridex · #42 (merged)  
**Epic:** #38

## What is live on this branch

### Packages (implementation, not scaffold-only)

| Package | Capability |
|---------|------------|
| `@mind-reply/aurelia` | Rule-based NL → Helix contract compiler (`compileExpertIntent`) |
| `@mind-reply/lumenforge` | Token estimate, banned-vocab (word-boundary), tone soft-check, `decideGateAction` |
| `@mind-reply/veridex` | Real SHA-256 (`crypto.subtle`), `.epack` signature, optional `appendWriter`, `toSupabaseRow` |
| `@mind-reply/elysium-core` | Orchestration loop + `gateProfitAuditDraft` (feature-flagged) |

### Frontend (web-replycontrol)

- Home page section **Elysium Stack** (A / L / V cards) — educational, does not change CTA
- Nav link `#elysium`
- Stripe audit CTA unchanged

### API execution

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/elysium/status` | GET | Read-only flag + layer list |
| `/api/elysium/gate` | POST | Run loop on `{ requestId, draft, promptVersion? }` |

Gate is **feature-flagged** via `ELYSIUM_AUDIT_LOOP=1`. Default off = safe no-op pass.

### Example gate call

```bash
curl -s -X POST https://<host>/api/elysium/gate \
  -H 'content-type: application/json' \
  -d '{"requestId":"audit_demo_1","draft":"Executive findings for repository X..."}'
```

Response includes `passed`, `blocked`, `action` (`allow` | `block` | `rewrite_once` | `localized_fallback`), evaluation, and envelope hash when enabled.

## Enabling in an environment

```bash
ELYSIUM_AUDIT_LOOP=1
```

Optional later: Supabase service role + `appendWriter` wiring for append-only `veridex_envelopes` table (schema in Veridex JSDoc).

## Safety

- No secrets committed
- Public CTA / Stripe URL unchanged
- Gate validates JSON and caps draft size (200k chars)
- Human review required before production flag enablement on customer traffic
