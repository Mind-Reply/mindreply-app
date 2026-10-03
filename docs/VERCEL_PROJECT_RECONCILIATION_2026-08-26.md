# Vercel Project Reconciliation — 2026-08-26

## Current source of truth

Vercel team: `mindreply` (`team_0plIJmQLgZC1wVv9zI2eVf3B`)

GitHub source owner: `Mind-Reply`

Canonical monorepo: `Mind-Reply/mindreply-app`

## Canonical production targets

| Platform | Canonical source | Canonical Vercel project | Decision |
|---|---|---|---|
| MindReply | Mind-Reply/mindreply-app | mindreply | KEEP / RECONNECT |
| ResellerPro | canonical ResellerPro repository | resellerpro-platform | KEEP |
| A11-K | Mind-Reply/mindreply-app A11-K surfaces | a11-k-core + a11k-surface | KEEP / CONSOLIDATE |
| PatchTalk | canonical PatchTalk repository | patchtalk | KEEP |
| Aurel | canonical Aurel source | agent-control-plane-vezr | KEEP / VERIFY |
| Revenue/Sales | consolidated selected repos | future canonical project | CONSOLIDATE |
| Automation/Tools | consolidated selected repos | future canonical project | CONSOLIDATE |

## Vercel project classification

### KEEP — canonical / active
- `mindreply` → Mind-Reply/mindreply-app
- `resellerpro-platform` → canonical ResellerPro repository
- `patchtalk` → canonical PatchTalk repository
- `a11-k-core` → reconnect/verify against canonical A11-K source before use
- `a11k-surface` → verify against canonical A11-K source
- `agent-control-plane-vezr` → verify against canonical Aurel source
- `a11k-chat` → candidate for absorption into A11-K
- `private-opportunity-core` → internal/private

### CONSOLIDATE — duplicate ResellerPro
- `resellerpro-platform-u16a`
- `resellerpro-platform-8psz`
- `resellerpro-platform11`
- `resellerpro-platform-fqnz`
- `resellerpro-platform-original`

Preserve until domains, environment scopes and rollback evidence are reconciled against the canonical project.

### CONSOLIDATE — duplicate MindReply org site
- `mindreply-org-site`
- `mindreply-org-site1`
- `mindreply-org-site-zrvr`

### CONSOLIDATE — duplicate public site
- `public-site`
- `public-site-kmcc`

### ABSORB / INTERNAL
- `mindreply-ops-ledger`
- `mindreply-priority-dashboard`
- `a11k-operator-desk`
- `a11k-operator-desk-public`
- `a11k-public-support-proxy-validation`
- `mindreply-real-estate-recovery`
- `source-mirror`
- `a11k-seo-surface`
- `site-mindreply`
- `site-aurel`
- `site-letreseller`

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

These should not automatically become separate production brands. Rank by real product usage, demand, conversion and differentiated value.

### PAUSE
- `brushworks`
- `brushworks-seo-surface`

Do not expand or commercialize until brand/IP ownership and intended relationship are verified.

## Retirement continuity verification

Before retiring any Vercel project, record:
1. all domains;
2. environment variable names and scopes without exposing values;
3. current production deployment and rollback candidate;
4. GitHub repository, branch and commit;
5. canonical replacement deployment;
6. route, form, auth, payment and integration smoke results;
7. DNS and redirects;
8. production error observations;
9. rollback availability;
10. resulting legacy-project state.

This is a continuity and evidence checklist, not a production promotion gate. Domain, credential, billing and destructive-action authorization controls remain intact.

## Target state

1. MindReply
2. ResellerPro
3. A11-K
4. PatchTalk
5. Aurel
6. Revenue/Sales Platform
7. Automation/Tools Platform
8. Internal/private control-plane deployments only where security or lifecycle requires separation

The goal is minimum unnecessary duplication with maximum product quality and independent deployment safety.
