# Security Baseline

Status: IMPLEMENTED baseline; historical secret exposure status remains UNKNOWN until full Git history scanning and provider-side rotation are verified.

## Repository rules

- Real `.env`, `.env.local`, `.env.production` and similar files must not be committed.
- `.env.example` and `.env.production.example` may contain placeholders only.
- Never commit API keys, access tokens, database credentials, webhook secrets, private keys, service-account material or deployment credentials.
- Server-only secrets must never be referenced from client components. Browser-visible configuration must use `NEXT_PUBLIC_` variables only.
- Supabase service-role credentials, database credentials and Stripe webhook secrets are server-only.

## Credential incident rule

If a real credential has ever been committed, treat it as compromised even after the file is deleted from the current branch.

Required response:

1. Identify credential/provider without publishing the value.
2. Revoke or rotate the credential at the provider.
3. Remove the credential from the current tree.
4. Search Git history for the credential and related secret files.
5. Decide whether history rewriting is necessary.
6. Re-run secret scanning after remediation.
7. Verify deployment/provider secrets independently.

Do not claim the estate is clean from a current-tree search alone.

## Release security gates

A release should fail when a secret scanner detects a credential, a critical route is broken, an authentication boundary is bypassed, or a production webhook cannot be verified.

## Status semantics

Security and production state must use explicit states such as `UNKNOWN`, `BLOCKED`, `DEGRADED`, `VERIFIED`, and `PRODUCTION`. Absence of evidence is not a healthy state.

## Current audit boundary

The connected GitHub integration can inspect repository contents, commits, pull requests and issues. It does not expose all organization-level secrets, Actions secrets, deployment secrets, OAuth configuration, deploy keys, or provider consoles. Those controls remain `UNKNOWN` until directly verified through the appropriate connected provider or GitHub administration surface.
