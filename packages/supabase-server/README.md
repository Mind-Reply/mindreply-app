# @mindreply/supabase-server

A reviewed server-side integration boundary for the A11-K platform estate.

## Why this package exists

- Verify Supabase user JWTs through `@supabase/server`.
- Create request-scoped clients that preserve Row Level Security.
- Keep secret keys and database credentials out of browser bundles.
- Give all A11-K sites one consistent backend contract.

## Install

The workspace installs dependencies with pnpm:

```bash
pnpm install
pnpm --filter @mindreply/supabase-server typecheck
```

The package currently pins the public-beta server API to `@supabase/server` v1 semantics. Review release notes before major upgrades.

## Environment

Required outside Supabase Edge Functions:

```env
SUPABASE_URL=https://aziwdgndohdgnwztpwdi.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_JWKS_URL=https://aziwdgndohdgnwztpwdi.supabase.co/auth/v1/.well-known/jwks.json
```

`SUPABASE_SECRET_KEY` and `SUPABASE_DATABASE_URL` are server-only. Store them in the Vercel or Supabase secret manager and never prefix them with `NEXT_PUBLIC_`.

## Security boundary

- Prefer `context.supabase` for user-facing operations; RLS applies.
- `context.supabaseAdmin` bypasses RLS and requires a separate reviewed code path.
- Do not accept arbitrary table names from untrusted HTTP input. `readOwnedRows` is a library helper for reviewed callers, not a public generic endpoint.
- Add database policies and tests before exposing any table to a site.

## MCP

The repository-level `.mcp.json` declares the project-scoped Supabase MCP endpoint. Authentication remains an interactive OAuth step and is not stored in Git.
