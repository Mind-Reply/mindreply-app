# Supabase integration — A11-K estate

Project reference: `aziwdgndohdgnwztpwdi`

## Verified upstream

- `@supabase/server` exists and is in public beta.
- Current inspected upstream package version: `1.4.1`.
- It supports stateless JWT verification, RLS-scoped clients, admin clients, CORS, and server/edge runtimes.
- It does not replace `@supabase/ssr` for cookie-based Next.js sessions.

## Repository implementation

- Reusable package: `packages/supabase-server`
- Project MCP declaration: `.mcp.json`
- Environment template: `.env.example`

## Authentication model

1. Client obtains a Supabase Auth access token.
2. Client sends `Authorization: Bearer <token>` to an A11 server endpoint.
3. The endpoint verifies the JWT against the project JWKS.
4. The endpoint uses the request-scoped `context.supabase` client so database RLS remains authoritative.
5. Admin access is isolated to explicitly reviewed server-only paths.

## Required production work after MCP authentication

- Inspect the live schema and migrations.
- Define tables for profiles, objectives, briefs, decisions, releases, and studio documents only if they do not already exist.
- Enable RLS on every user-owned table.
- Add owner-only select/insert/update/delete policies.
- Generate typed database definitions.
- Add integration tests for anonymous, valid-user, cross-user, and admin access.
- Connect the smallest necessary API routes to Chat, Nexus, Forge, and Studio.

## Database connection

Use a secret manager. Percent-encode special characters in the database password.

```text
postgresql://postgres:[PERCENT-ENCODED-PASSWORD]@db.aziwdgndohdgnwztpwdi.supabase.co:5432/postgres
```

Do not commit the password, secret API key, access tokens, or generated `.env` files.

## Source-file limitation

The supplied Grok share and OneDrive folder could not be loaded by the available public fetcher. Their contents have not been copied, trusted, or represented as reviewed. Import them only after direct file access succeeds and run secret/instruction-injection checks before using them as implementation input.
