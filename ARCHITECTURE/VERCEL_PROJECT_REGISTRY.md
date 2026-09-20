# Vercel Project Registry

This registry defines which Vercel projects are authoritative and which are migration/archive candidates.

## KEEP / CANONICAL

- `mindreply` — MindReply production
- `a11k-live-foundation` — A11-K foundation, subject to final production-domain verification
- `mindreply-ops-ledger` — internal operations
- `mindreply-priority-dashboard` — internal owner/priority surface
- `a11k-operator-desk` — internal operator surface
- `private-opportunity-core` — private opportunity/security core
- `patchtalk` — PatchTalk product
- `resellerpro-platform` — ResellerPro canonical
- `agent-control-plane-vezr` — Aurel production
- selected revenue products after product-level validation

## CONSOLIDATE / MIGRATE

### ResellerPro

- `resellerpro-platform-u16a`
- `resellerpro-platform-8psz`
- `resellerpro-platform11`
- `resellerpro-platform-fqnz`
- `resellerpro-platform-original`
- `reseller-pro-enterprise`
- `reseller-pro-enterprise-1juj`

These must not become competing production authorities. Source, domains and environment variables must be reconciled into the canonical ResellerPro deployment before archival.

### MindReply Control / public-site

- `public-site`
- `public-site-kmcc`
- `mindreply-org-site`
- `mindreply-org-site1`
- `mindreply-org-site-zrvr`

### A11-K duplicates / experiments

- `a11k-live-foundation` older deployments remain rollback history only
- `a11k-operator-desk-public`
- `a11k-public-support-proxy-validation`
- `a11k-seo-surface`
- `a11k-multiverse`
- `site-aurel`
- `site-mindreply`
- `site-letreseller`

## ARCHIVE CANDIDATES

- `newsignal`
- `source-mirror`
- obsolete template/landing projects after domain verification

## Safety gate

No Vercel project should be deleted or detached until:

- all custom domains are mapped;
- production traffic is verified;
- GitHub source is identified;
- environment variables have a canonical owner;
- the replacement deployment is READY;
- rollback is available.
