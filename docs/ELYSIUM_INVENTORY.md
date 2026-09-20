# Elysium Inventory — GitHub surface map

**Repo:** `angellllkr-eng/mind-reply-core`  
**Branch:** `main`  
**Open PRs (elysium):** none  
**Open issues (elysium):** none

This file is the no-gaps checklist. Everything listed is on `main`.

## Packages

| Package | Path | Role |
|---------|------|------|
| `@mind-reply/elysium-core` | `packages/elysium-core` | Types, Helix, orchestration, profit-audit gate |
| `@mind-reply/aurelia` | `packages/aurelia` | NL → Helix compiler |
| `@mind-reply/lumenforge` | `packages/lumenforge` | Evaluate + edge helpers |
| `@mind-reply/veridex` | `packages/veridex` | SHA-256 stamp, Supabase writer, delivery pack |

## Contracts

- `packages/elysium-core/contracts/helix.example.yaml`
- `packages/elysium-core/contracts/profit-audit.helix.json`
- In-code: `PROFIT_AUDIT_CONTRACT`

## SQL

- `packages/veridex/sql/veridex_envelopes.sql`

## web-replycontrol APIs

| Method | Path | Layer |
|--------|------|-------|
| GET | `/api/elysium/status` | Core |
| POST | `/api/elysium/compile` | Aurelia |
| POST | `/api/elysium/gate` | Lumenforge + Veridex |
| POST | `/api/elysium/pack` | Full pack + receipt |
| GET | `/api/health` | Readiness |

## Frontends

| Surface | Path | Notes |
|---------|------|-------|
| mindreply public | `apps/web-replycontrol/app/page.tsx` | Human Signal copy; Stripe CTA |
| Operator | `apps/web-replycontrol/app/operator` | Gate + pack console |
| Edge | `apps/web-replycontrol/middleware.ts` | Substrate headers |
| A11-K estate | `apps/a11k` | Human Signal rooms |
| Chat / Nexus / Forge / Studio | `apps/a11k-*` | Layer-mapped copy |

## Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/elysium-e2e-local.mjs` | Offline evaluate → stamp → pack |
| `bash scripts/elysium-smoke.sh` | HTTP status → gate → pack |

## Docs

- `ELYSIUM_STACK.md` — architecture
- `ELYSIUM_E2E.md` — runbook + acceptance
- `ELYSIUM_RUNTIME.md` — env enablement
- `ELYSIUM_AUDIT_LOOP.md` — audit consumer
- `ELYSIUM_EXECUTION.md` — frontend/API map
- `ELYSIUM_FRONTEND_V0.md` — v0/Lovable prompts
- `HUMAN_SIGNAL_LEXICON.md` — anti-generic dictionary
- `ELYSIUM_INVENTORY.md` — this file

## Env (server-only, never commit)

```
ELYSIUM_AUDIT_LOOP=0|1
VERIDEX_SUPABASE_URL=
VERIDEX_SUPABASE_SERVICE_ROLE_KEY=
VERIDEX_SUPABASE_TABLE=veridex_envelopes
```

See `apps/web-replycontrol/.env.example`.

## Intentionally not in-repo (host actions)

These are not code gaps — they require owner credentials on the deploy host:

1. Apply SQL in Supabase project
2. Set `ELYSIUM_AUDIT_LOOP=1` + Veridex env on Vercel/Docker
3. Run HTTP smoke against production HOST

## Safety

- No secrets in git
- Public Stripe CTA URL unchanged
- Default loop off = safe no-op
- Ledger append fail-soft
