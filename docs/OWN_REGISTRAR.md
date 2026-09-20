# OWN Registrar — E2E branded client registration & resell

**Path:** `apps/own-registrar/`  
**Wired to:** OWN Studio (`apps/a11k-studio/`)  
**Status:** Ready to use (local-first) · 2026-08-09

## What it is

End-to-end branded **client registrar** you can operate and resell:

1. **Register clients** under your brand (name, email, domain, plan, notes).
2. **Reseller mode** — set agency name, accent colour, support email, Studio base URL.
3. **Client registry** — local list with plan tags.
4. **Export JSON** — hand off to Stripe / CRM / Clerk orgs / Supabase tenants.
5. **Open OWN Studio** for the client with purpose/audience prefilled.

No secrets stored. No fake “live billing”. Structured for real backend swap.

## E2E flow (operator)

1. Open Registrar (deploy `apps/own-registrar` or open `public/index.html`).
2. **Reseller setup** → save your brand.
3. **Register client** → choose plan (€3k audit / Studio seat / reseller client).
4. **Open OWN Studio** → generate client-facing shell.
5. **Export JSON** → create Stripe customer / send outreach / load into auth.

## Resell for clients

| You sell | Client gets | You keep |
|----------|-------------|----------|
| Profit Audit | 7-day delivery via micro-swarm | Margin + evidence process |
| Studio seat | Branded shell + narrative tool | Brand + optional managed ops |
| Reseller client seat | Their customers under your registrar | Multi-tenant export + process |

## Deploy

Static host / Vercel project root: `apps/own-registrar`.  
Suggested: `registrar.a11-k.space` or under your agency domain.

Link Studio URL in reseller setup (default `../a11k-studio/` for monorepo-relative; use absolute URL in production).

## Backend upgrade path (when cash moves)

1. Map export JSON → Stripe Customers + Products.
2. Map client → Clerk Organization or Supabase tenant (saas-starter patterns).
3. Persist registry in Postgres; keep export for portability.
4. Gate Studio “publish” via Crownline / owner approval.

## Boundary

- Does not process payments (Stripe remains owner-operated).
- Does not email clients automatically.
- Does not claim production auth until wired.
- Dual-root: product surfaces in mind-reply-core; ops evidence in agent-control-plane.
