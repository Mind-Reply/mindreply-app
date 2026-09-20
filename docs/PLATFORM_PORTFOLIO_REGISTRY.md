# Platform Portfolio Registry

Status: active reconstruction plan — 2026-08-26

## Strategy

Replace the thin-site factory with a platform factory: fewer canonical properties, substantially more useful experiences per property. Existing code is harvested into canonical platforms; empty or duplicate deployments are retired only after domain, environment, data and rollback checks.

## Canonical production portfolio

| Platform | Canonical source | Vercel role | Target surface |
|---|---|---|---|
| MindReply | `Mind-Reply/mind-reply-core` | `mindreply` | Business automation, agents, communication, tools, resources, proof |
| ResellerPro | `angellllkr-eng/resellerpro-platform` | `resellerpro-platform` | Reselling/sourcing workflow, tools, guides, pricing, dashboard |
| A11-K | `angellllkr-eng/mind-reply-core` + A11-K apps | `a11k-live-foundation` / `a11k-surface` | Platform, chat, tools, developer, docs, research, security |
| PatchTalk | `angellllkr-eng/patchtalk` | `patchtalk` | Voice/chat/WhatsApp/business/developer/security/docs |
| Aurel | `angellllkr-eng/agent-control-plane` | `agent-control-plane-vezr` | Product, proof, experience, documentation |

## Consolidation candidates

### ResellerPro

Keep `resellerpro-platform` as canonical. The following are duplicate deployment candidates and must be checked for unique domains/envs before retirement:

- `resellerpro-platform-u16a`
- `resellerpro-platform-8psz`
- `resellerpro-platform11`
- `resellerpro-platform-fqnz`
- `resellerpro-platform-original`

Enterprise projects remain separate until their useful functionality is migrated and the build is repaired:

- `reseller-pro-enterprise`
- `reseller-pro-enterprise-1juj`

### MindReply control/site duplicates

Review and consolidate:

- `public-site`
- `public-site-kmcc`
- `mindreply-org-site`
- `mindreply-org-site1`
- `mindreply-org-site-zrvr`
- `site-mindreply`
- `source-mirror`

### A11-K

Canonical direction:

- core/platform: `a11-k-live-foundation`
- public surface: `a11k-surface`
- chat: `a11k-chat`
- operator tooling: `a11k-operator-desk` (private)

Review/archive after verification:

- `a11-k-core`
- `a11-k-multiverse`
- `a11k-seo-surface`
- `a11k-operator-desk-public`
- `a11k-public-support-proxy-validation`

### Non-canonical product experiments

Do not delete. First evaluate whether their strongest capabilities should become pages/features inside a revenue or automation platform:

- `revenuepulse`
- `empirepulse`
- `dealforge`
- `leadrevive`
- `marginpilot`
- `leadatlas`
- `uptimepilot`
- `cloudtrim`
- `intentrank`
- `auditforge-brand`
- `docparse`

## Brushworks

Paused. The existing `brushworks` and `brushworks-seo-surface` projects must not be expanded until brand/IP ownership and intended commercial relationship are verified.

## Production rules

1. GitHub is source of truth.
2. Vercel is deployment infrastructure.
3. One canonical Vercel project per independently operated platform surface.
4. Multiple Vercel projects may share the same monorepo when they have genuinely independent deployment boundaries.
5. Prefer route/page consolidation over creating new domains for thin concepts.
6. Never retire a project before checking custom domains, environment variables, data dependencies, analytics, webhooks and rollback.
7. No SEO-only pages without substantive user value.
8. Shared UI, auth, SEO metadata, analytics, observability and validation belong in shared packages where practical.
9. Production promotion remains owner-governed.

## Current verification notes

- MindReply: no runtime errors observed in the last 7 days.
- PatchTalk: no runtime errors observed in the last 7 days.
- ResellerPro canonical: runtime errors observed in domain search/quote routes caused by an invalid API-key format; repair before treating the platform as fully production-clean.
- `whatsapp-ai-router`: Vercel currently links to `angellllkr-eng/own`; do not assume it is the canonical PatchTalk deployment without correcting and verifying the repository relationship.

## Page quality standard

A page should exist because it serves a real user intent: product capability, tool, solution, use case, industry workflow, comparison, documentation, research, case study, pricing or conversion. Avoid creating pages merely to capture keyword variants.
