---
name: supabase
description: "Use when doing ANY task involving Supabase. Triggers: Supabase products (Database, Auth, Edge Functions, Realtime, Storage, Vectors, Cron, Queues); client libraries and SSR integrations (supabase-js, @supabase/ssr) in Next.js, React, SvelteKit, Astro, Remix; auth issues (login, logout, sessions, JWT, cookies, getSession, getUser, getClaims, RLS); Supabase CLI or MCP server; schema changes, migrations, declarative schemas, security audits, Postgres extensions (pg_graphql, pg_cron, pg_vector)."
metadata:
  author: supabase
  version: "0.1.2"
---

# Supabase

## Core Principles

**1. Supabase changes frequently — verify against changelog and current docs before implementing.**
Do not rely on training data for Supabase features. Function signatures, config.toml settings, and API conventions change between versions.

First, fetch `https://supabase.com/changelog.md` (a lightweight summary index — not a heavy pull), scan for `breaking-change` tags relevant to your task, and follow the linked page for any that apply. Then look up the relevant topic using the documentation access methods below.

**2. Verify your work.**
After implementing any fix, run a test query to confirm the change works. A fix without verification is incomplete.

**3. Recover from errors, don't loop.**
If an approach fails after 2-3 attempts, stop and reconsider. Try a different method, check documentation, inspect the error more carefully, and review relevant logs when available.

**4. Exposing tables to the Data API:** Depending on the user's Data API settings, newly created tables may not be automatically exposed via the Data API. If this is the case, `anon` and `authenticated` roles need explicit grants. This is separate from RLS, which controls visible rows after a table is accessible. When granting public role access, always enable RLS too.

**5. RLS in exposed schemas.**
Enable RLS on every table in any exposed schema, including `public` by default. Create policies matching the actual access model rather than applying the same `auth.uid()` pattern everywhere.

**6. Security checklist.**

- Never use user-editable `user_metadata` claims for authorization; use `app_metadata`.
- Deleting a user does not invalidate existing tokens. Revoke sessions first and keep sensitive JWT lifetimes short.
- Never expose `service_role` or secret keys in public clients. Any `NEXT_PUBLIC_` value is sent to browsers.
- Views bypass RLS by default. On Postgres 15+, use `security_invoker = true`; otherwise revoke public roles or use an unexposed schema.
- UPDATE requires a SELECT policy and should include both `USING` and `WITH CHECK` ownership predicates.
- Prefer policy `TO` clauses; do not rely on deprecated `auth.role()` authorization checks.
- `TO authenticated` alone is not row authorization; combine it with an ownership predicate.
- `SECURITY DEFINER` bypasses RLS. Never add it merely to fix a permission error. If genuinely required, keep it in a non-exposed schema, check `auth.uid()`, restrict EXECUTE, and run database advisors.
- Storage upsert needs INSERT, SELECT, and UPDATE permissions.
- Pin package versions and commit lockfiles for Supabase dependencies.

## Supabase CLI

Discover commands with `--help`; never guess because the CLI changes between versions.

```bash
supabase --help
supabase <group> --help
supabase <group> <command> --help
```

Use Supabase MCP `execute_sql` or `psql` when CLI query support is unavailable. Use database advisors before committing schema changes.

## Supabase MCP Server

Use the official hosted endpoint and OAuth. Prefer project-scoped, read-only access while inspecting:

```text
https://mcp.supabase.com/mcp?project_ref=<project-ref>&read_only=true&features=database,docs
```

Troubleshooting order:
1. Verify server reachability.
2. Verify the project-scoped MCP URL.
3. Complete OAuth in the browser and reload the session.

## Supabase Documentation

Before implementing a feature:
1. Use MCP `search_docs`.
2. Fetch official docs pages as Markdown.
3. Use web search only when the correct page is unknown.

## Making and Committing Schema Changes

First identify the project workflow.

### Declarative schemas
Use this when `supabase/schemas/` exists or `config.toml` sets `schema_paths`. Edit the desired schema state, then generate and review a migration.

### Imperative migrations
Use MCP `execute_sql` or an appropriate CLI query command to test SQL directly. Do not create repeated migration-history entries while iterating. Before committing:
1. Run database advisors and fix issues.
2. Review RLS, views, functions, triggers, storage, and grants.
3. Generate a descriptive migration using the project's established workflow.
4. Verify the migration list and test the resulting schema.

## Reference Guides

- **Skill Feedback** → [references/skill-feedback.md](references/skill-feedback.md)
  **MUST read when** the user reports that this skill gave incorrect guidance or is missing information.
