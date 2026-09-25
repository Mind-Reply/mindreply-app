# MindReply Core — Frontier 2026

Canonical production platform. This repository is the source of truth for the product implementation.

## Frontend baseline
Use the current Active LTS Next.js line, React 19, Tailwind 4, App Router conventions, accessible components, typed routes where appropriate, and ResellerPro-first delivery. External templates may be used only as architecture references; they are not production dependencies.

## Release gate
- Change -> deterministic validation -> evidence -> owner gate -> ResellerPro release verification -> production.
- `main` is production.
- No secrets in git.
- No destructive automation without explicit approval.


## A11pro frontier execution
The comprehensive bounded worktree assignments live in `docs/frontier/A11PRO_WORKTREE_ASSIGNMENTS.md`. Eight isolated frontier branches are provisioned from `main`; each owns explicit paths and must attach validation evidence to its exact commit SHA. Frontier work does not imply continuous/background execution.
