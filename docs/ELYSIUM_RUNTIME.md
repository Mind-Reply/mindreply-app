# Elysium Runtime — Enablement Guide

Production wiring for Lumenforge edge + Veridex Supabase ledger.

## Feature flags / env

| Variable | Purpose |
|----------|---------|
| `ELYSIUM_AUDIT_LOOP=1` | Enable gate evaluation path |
| `VERIDEX_SUPABASE_URL` | Supabase project URL |
| `VERIDEX_SUPABASE_SERVICE_ROLE_KEY` | Server-only service role (never browser) |
| `VERIDEX_SUPABASE_TABLE` | Optional; default `veridex_envelopes` |

## 1. Supabase ledger

1. Run `packages/veridex/sql/veridex_envelopes.sql` in the SQL editor.
2. Set env on the host (Vercel / Docker) — service role only on server.
3. Call `POST /api/elysium/gate` with loop enabled; response `ledger: "supabase"` confirms append path.

Without env, stamps remain local (hash + signature only).

## 2. Edge Middleware

`apps/web-replycontrol/middleware.ts` mounts on `/` and `/api/elysium/*`:

- `x-elysium-substrate: mind-reply`
- `x-elysium-audit-loop: enabled|disabled`
- `x-lumenforge-edge: 1` on Elysium API routes

Heavy evaluation stays in the gate route (not on every page load).

Package helper: `runEdgeGate()` in `@mind-reply/lumenforge` for custom draft routes.

## 3. Gate contract

```bash
curl -s -X POST https://<host>/api/elysium/gate \
  -H 'content-type: application/json' \
  -d '{"requestId":"audit_demo","draft":"Executive findings..."}'
```

## Safety

- No secrets in repo
- Service role never shipped to client
- Public CTA / Stripe path untouched
- Default loop off = no-op pass
