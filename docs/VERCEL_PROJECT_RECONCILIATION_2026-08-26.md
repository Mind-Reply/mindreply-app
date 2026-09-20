# Vercel Project Reconciliation — 2026-08-26

## Current source of truth

Vercel team: `mindreply` (`team_0plIJmQLgZC1wVv9zI2eVf3B`)

GitHub source owner: `angellllkr-eng`

Canonical monorepo: `angellllkr-eng/mind-reply-core`

## Canonical production targets

| Platform | Canonical source | Canonical Vercel project | Decision |
|---|---|---|---|
| MindReply | mind-reply-core | mindreply | KEEP |
| ResellerPro | resellerpro-platform | resellerpro-platform | KEEP |
| A11-K | mind-reply-core / a11-k surfaces | a11-k-core + a11k-surface | KEEP / CONSOLIDATE |
| PatchTalk | patchtalk | patchtalk | KEEP |
| Aurel | agent-control-plane | agent-control-plane-vezr | KEEP |
| Revenue/Sales | consolidated selected repos | future canonical project | CONSOLIDATE |
| Automation/Tools | consolidated selected repos | future canonical project | CONSOLIDATE |

## Vercel project classification

### KEEP — canonical / active
- `mindreply` → Mind-Reply/mind-reply-core
- `resellerpro-platform` → angellllkr-eng/resellerpro-platform
- `patchtalk` → angellllkr-eng/patchtalk
- `a11-k-core` → currently unlinked; must reconnect to canonical GitHub source before production use
- `a11k-surface` → angellllkr-eng/a11k-surface
- `agent-control-plane-vezr` → angellllkr-eng/agent-control-plane
- `a11k-chat` → angellllkr-eng/chatbot (candidate for absorption into A11-K)
- `private-opportunity-core` → angellllkr-eng/private-opportunity-core (internal)

### CONSOLIDATE — duplicate ResellerPro
- `resellerpro-platform-u16a`
- `resellerpro-platform-8psz`
- `resellerpro-platform11`
- `resellerpro-platform-fqnz`
- `resellerpro-platform-original`

All point to `angellllkr-eng/resellerpro-platform`. Preserve until domains, env vars and rollback are verified against canonical `resellerpro-platform`.

### CONSOLIDATE — duplicate MindReply org site
- `mindreply-org-site`
- `mindreply-org-site1`
- `mindreply-org-site-zrvr`

All point to `angellllkr-eng/mindreply-org-site`. Keep one only if this surface remains necessary; otherwise absorb into MindReply.

### CONSOLIDATE — duplicate public site
- `public-site`
- `public-site-kmcc`

Both point to `angellllkr-eng/mindreply-control`. Absorb the useful surface into the canonical MindReply/control architecture.

### ABSORB / INTERNAL
- `mindreply-ops-ledger` — internal ops; currently unlinked
- `mindreply-priority-dashboard` — owner control; currently unlinked
- `a11k-operator-desk` — internal; currently unlinked
- `a11k-operator-desk-public` — public surface candidate; currently unlinked
- `a11k-public-support-proxy-validation` — validation only
- `mindreply-real-estate-recovery` — review before keeping
- `source-mirror` → angellllkr-eng/mindreply; preserve as archive/source mirror
- `a11k-seo-surface` — absorb into A11-K content architecture
- `site-mindreply` — absorb/retire after domain verification
- `site-aurel` — absorb into Aurel after domain verification
- `site-letreseller` — absorb/retire after domain verification

### PRODUCT EXPERIMENTS — evaluate, then consolidate
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

These should not automatically become separate production brands. Rank by real product usage, demand, conversion and differentiated value. Consolidate winners into Revenue/Sales or Automation/Tools.

### PAUSE
- `brushworks`
- `brushworks-seo-surface`

Do not expand or commercialize until brand/IP ownership and intended relationship are verified.

### REPAIR / REVIEW
- `reseller-pro-enterprise`
- `reseller-pro-enterprise-1juj`

Both point to `angellllkr-eng/reseller-pro-enterprise`; consolidate after selecting the correct source/build.

- `a11-k-live-foundation` → angellllkr-eng/mind-reply-core; keep as migration/validation candidate only if needed.
- `whatsapp-ai-router` → currently points to `angellllkr-eng/own`; verify whether it should be absorbed into `patchtalk` before any production use.
- `brillance-saas-landing-page` → Mind-Reply/MindReply; archive or absorb if still useful.
- `unapolagetic_cosmetics` → independent experiment; no relation to canonical platform portfolio unless intentionally retained.
- `newsignal` → NEW-SIGNAL-check; experiment/archive candidate.
- `a11-k-multiverse` → a11-k-multiverse-5d; absorb useful work into A11-K if still relevant.

## Unlinked Vercel projects requiring explicit GitHub reconciliation

- a11-k-core
- brushworks
- brushworks-seo-surface
- site-aurel
- site-letreseller
- site-mindreply
- a11k-seo-surface
- mindreply-real-estate-recovery
- a11k-public-support-proxy-validation
- a11k-operator-desk-public
- a11k-operator-desk
- mindreply-ops-ledger
- mindreply-priority-dashboard

No production logic should remain only inside these manually configured projects.

## Required migration gates

Before retiring any Vercel project:
1. inspect all domains;
2. inspect environment variable names and environment scope without exposing values;
3. identify latest production deployment and rollback candidate;
4. identify GitHub repo/branch and commit;
5. deploy canonical replacement;
6. smoke test routes, forms, auth, payments and integrations;
7. verify DNS and redirects;
8. monitor production errors;
9. preserve rollback;
10. archive only after successful cutover.

## Target state

Current Vercel sprawl should converge toward:

1. MindReply
2. ResellerPro
3. A11-K
4. PatchTalk
5. Aurel
6. Revenue/Sales Platform
7. Automation/Tools Platform
8. Internal/private control-plane deployments only where security or lifecycle requires separation

The goal is not minimum project count at any cost. The goal is minimum unnecessary duplication with maximum product quality and independent deployment safety.
