# Personal GitHub → Vercel Production Portfolio

Date: 2026-08-26
Owner: A.K. / `angellllkr-eng`
Vercel team: `mindreply`

## Objective

Reduce the personal GitHub/Vercel estate from duplicated and thin deployments into a small number of strong platforms. Build substantive pages and product experiences inside canonical platforms instead of creating a new site/project for every page.

## Canonical production platforms

| Platform | Canonical GitHub source | Canonical Vercel project | Decision |
|---|---|---|---|
| MindReply | `angellllkr-eng/mind-reply-core` | `mindreply` | KEEP |
| ResellerPro | `angellllkr-eng/resellerpro-platform` | `resellerpro-platform` | KEEP / CONSOLIDATE |
| A11-K | `angellllkr-eng/mind-reply-core` + `a11k-surface` | `a11-k-live-foundation` + deliberate public surface | KEEP / REPAIR |
| PatchTalk | `angellllkr-eng/patchtalk` | `patchtalk` | KEEP |
| Aurel | `angellllkr-eng/agent-control-plane` | `agent-control-plane-vezr` | KEEP / VERIFY |
| Revenue/Sales | validated revenue repositories | future canonical platform | CONSOLIDATE |
| Automation/Tools | validated tool repositories | future canonical platform | CONSOLIDATE |

## Vercel reconciliation

### Canonical projects

- `mindreply` → `Mind-Reply/mind-reply-core`
- `resellerpro-platform` → `angellllkr-eng/resellerpro-platform`
- `patchtalk` → `angellllkr-eng/patchtalk`
- `a11-k-live-foundation` → `angellllkr-eng/mind-reply-core`
- `a11k-surface` → `angellllkr-eng/a11k-surface`
- `agent-control-plane-vezr` → `angellllkr-eng/agent-control-plane`
- `private-opportunity-core` → `angellllkr-eng/private-opportunity-core`

### ResellerPro duplicates

`resellerpro-platform-u16a`, `resellerpro-platform-8psz`, `resellerpro-platform11`, `resellerpro-platform-fqnz`, and `resellerpro-platform-original` all point to the same repository as `resellerpro-platform`.

**Target:** one canonical production project. Retire duplicates only after domain, environment, webhook, alias and rollback verification.

### MindReply org-site duplicates

`mindreply-org-site`, `mindreply-org-site1`, and `mindreply-org-site-zrvr` all point to `angellllkr-eng/mindreply-org-site`.

**Target:** absorb useful content into MindReply and retain at most one justified standalone surface.

### Public-site duplicates

`public-site` and `public-site-kmcc` both point to `angellllkr-eng/mindreply-control`.

**Target:** one owner/control surface; no duplicate deployment.

### Unlinked Vercel projects requiring explicit decision

- `brushworks-seo-surface` — PAUSE; brand/IP verification required.
- `site-aurel` — absorb into Aurel unless independent lifecycle is proven.
- `site-letreseller` — absorb into ResellerPro if still relevant.
- `site-mindreply` — absorb into MindReply.
- `a11k-seo-surface` — absorb into A11-K; no SEO-only deployment.
- `a11-k-core` — reconcile with `a11-k-live-foundation`; one core only.
- `mindreply-real-estate-recovery` — REVIEW.
- `a11k-public-support-proxy-validation` — temporary validation only.
- `a11k-operator-desk` / `a11k-operator-desk-public` — retain only the justified private/public split and connect to source.
- `mindreply-ops-ledger` / `mindreply-priority-dashboard` — internal apps; connect to source or absorb into owner control plane.
- `brushworks` — PAUSE.

### Special source mismatch

`whatsapp-ai-router` currently points to `angellllkr-eng/own`, not `patchtalk`. Do not silently relink. Review `own`; if it is PatchTalk functionality, migrate intentionally into `patchtalk`, validate, then retire the old deployment.

### Other Vercel projects

`docparse`, `auditforge-brand`, `intentrank`, `revenuepulse`, `empirepulse`, `cloudtrim`, `dealforge`, `uptimepilot`, `leadrevive`, `marginpilot`, and `leadatlas` are useful source assets. They should become modules/routes in consolidated platforms unless evidence proves an independent product deserves its own lifecycle.

## GitHub source policy

1. `angellllkr-eng/mind-reply-core` is the shared MindReply/A11-K platform source.
2. Independent commercial products retain independent repositories when domain, security or deployment lifecycle genuinely differs.
3. Never create a repository merely for a page.
4. Never create a Vercel project merely for a page.
5. Prefer branches and pull requests over duplicated repositories.
6. Production repositories require README/security hygiene appropriate to their visibility.

## Platform page standard

Each platform should target approximately 10–30 substantive pages only when justified:

- product
- solutions
- use cases
- industry/workflow pages
- tools/calculators/demos
- comparisons
- guides
- documentation
- research/benchmarks
- case studies/proof
- pricing
- conversion/contact

No doorway pages or keyword-only variants.

## Production safety gate before retirement

A Vercel project or repository may only be retired after:

- custom domains mapped and verified
- production alias identified
- latest successful deployment identified
- environment dependency mapped without exposing secrets
- webhook/integration dependency mapped
- analytics/observability dependency mapped
- source repository/branch confirmed
- replacement deployment READY
- redirects/canonical URLs prepared
- rollback path retained
- no unique production/customer functionality remains

## Target architecture

```text
PERSONAL GITHUB
└── angellllkr-eng
    ├── mind-reply-core
    │   ├── MindReply
    │   ├── A11-K
    │   └── shared packages
    ├── resellerpro-platform
    ├── patchtalk
    ├── agent-control-plane
    ├── internal control repositories
    └── validated product source
             ↓
          VERCEL
    ├── MindReply
    ├── ResellerPro
    ├── A11-K
    ├── PatchTalk
    ├── Aurel
    └── selected validated platforms
```

## Operating principle

Build fewer, substantially better platforms. A page must earn its existence through user value, product functionality, evidence, useful information, or conversion purpose. Optimize for qualified usage, product usage, conversion, retention and search/AI visibility—not project or URL count.
