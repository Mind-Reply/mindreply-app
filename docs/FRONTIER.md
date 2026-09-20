# MindReply Core — Frontier 2026

Canonical production platform. This repository is the source of truth for the product implementation.

## Frontend baseline
Use the current Active LTS Next.js line, React 19, Tailwind 4, App Router conventions, accessible components, typed routes where appropriate, and Vercel preview-first delivery. Current Vercel templates are references for architecture patterns such as enterprise testing, observability, and SaaS structure—not dependencies to copy wholesale.

## Release gate
- PR -> validation -> Vercel Preview -> E2E/smoke -> merge -> production.
- `main` is production.
- No secrets in git.
- No destructive automation without explicit approval.
