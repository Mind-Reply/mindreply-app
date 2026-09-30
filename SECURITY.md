# Security Baseline

Status: IMPLEMENTED baseline; historical secret exposure status remains UNKNOWN until full Git history scanning and provider-side rotation are verified.

## Repository rules

- Real `.env`, `.env.local`, `.env.production` and similar files stay outside source control.
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

Current-tree scanning alone cannot establish complete estate cleanliness.

## Release security gates

A release should fail when a secret scanner detects a credential, a critical route is broken, an authentication boundary is bypassed, or a production webhook cannot be verified.

## Status semantics

Security and production records use **VERIFIED** as the terminal verification label; evidence gaps remain explicit until resolved.

## Current audit boundary

The connected GitHub integration covers repository contents, commits, pull requests and issues. Organization-level secrets, Actions secrets, deployment secrets, OAuth configuration, deploy keys, and provider consoles require their respective verification surfaces.
