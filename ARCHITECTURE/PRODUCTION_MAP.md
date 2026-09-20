# MindReply Production Architecture Map

Status: canonical consolidation plan — 2026-08-26

## Canonical source of truth

`angellllkr-eng/mind-reply-core` is the canonical GitHub control repository for the MindReply platform and shared A11-K application surfaces.

## Production domains / Vercel projects

| Product | Canonical GitHub source | Canonical Vercel project | Rule |
|---|---|---|---|
| MindReply | `angellllkr-eng/mind-reply-core` | `mindreply` | Primary production platform |
| A11-K core/surfaces | `angellllkr-eng/mind-reply-core` | `a11k-live-foundation` / approved A11-K surfaces | Shared monorepo; no duplicate foundations |
| Private opportunity core | `angellllkr-eng/private-opportunity-core` | `private-opportunity-core` | Separate security boundary |
| PatchTalk | `angellllkr-eng/patchtalk` | `patchtalk` | Canonical product repo/project |
| ResellerPro | canonical ResellerPro repository | `resellerpro-platform` | One canonical Vercel project; legacy duplicates are non-canonical |
| Aurel | approved Aurel repository | `agent-control-plane-vezr` | Keep independent production boundary |

## Consolidation rules

1. GitHub is the source of truth for application code.
2. Vercel is the deployment/delivery layer, not a second source tree.
3. One production product gets one canonical Vercel project unless a deliberate security/runtime boundary requires more.
4. Duplicate projects must not receive new production domains.
5. Experimental work belongs under `apps/experimental` or an explicitly separate repository.
6. Internal control-plane applications must not be exposed through public product domains.
7. Custom domains must be verified before any project is archived or detached.
8. No secrets are committed to GitHub; Vercel environment variables remain environment-owned.

## Current monorepo application families

- `apps/a11k` — primary A11-K application
- `apps/a11k-chat` — chat surface
- `apps/a11k-forge` — generation/production tooling
- `apps/a11k-nexus` — orchestration/integration surface
- `apps/a11k-sites` — site surfaces
- `apps/a11k-studio` — studio/control surface
- `apps/experimental` — non-production experiments
- `apps/own-registrar` — registrar tooling
- `apps/web-replycontrol` — ReplyControl web surface
- `apps/mindreply-ios` — iOS application source

## Vercel hygiene

Canonical projects should deploy from GitHub `main` and use project-level build settings only where required. Invalid legacy `vercel.json` keys are removed from the canonical source. Analytics/observability integrations are configured in Vercel rather than as unsupported `vercel.json` properties.

## Do not delete automatically

Legacy Vercel projects remain preserved until their custom domains, environment variables, and production traffic are verified against the canonical project. They are considered migration candidates, not production authorities.
