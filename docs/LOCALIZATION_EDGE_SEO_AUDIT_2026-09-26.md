# Localization / Edge / SEO Audit — 2026-09-26

## VERIFIED IN GIT

MindReply's canonical web surface now defines the requested locale matrix in `apps/web-replycontrol`:

- `en` — x-default/global
- `uk` — en-GB
- `bg` — bg-BG
- `de` — de-DE
- `es` — es-ES
- `pt-br` — pt-BR
- `tr` — tr-TR

Implemented:
- Cloudflare-aware country detection through `cf-ipcountry`
- Accept-Language fallback
- explicit subdirectory routing
- stable root `/` as x-default
- non-crawler 307 locale redirect from root when a regional preference is detected
- crawler preservation of the x-default root
- request locale propagation to the HTML `lang` attribute
- canonical URLs and reciprocal hreflang metadata
- x-default hreflang
- locale-aware sitemap alternates
- robots rules for all public locale roots

The previous French locale was removed from the active matrix rather than silently leaving an extra indexable variant.

## IMPORTANT CORRECTION

Repository state does **not** prove that `mind-reply.com` or `resellerpro.mind-reply.com` currently return HTTP 200 in production. Direct external verification from this environment could not establish those responses; therefore the supplied "Verified (HTTP 200)" claims remain UNVERIFIED.

The same applies to:
- Cloudflare deployment state
- registrar / DNS delegation
- production edge routing
- Google indexing
- Search Console submission
- payment-account settlement routing
- legal-entity assignment per locale
- SEPA/BACS/Stripe account routing
- GCP load-balancer / Cloud Run / Pub/Sub / AlloyDB topology
- 60-second monitoring
- systemd persistence
- automated snapshots
- Terraform prevent-destroy state

No production-live claim is made from repository code alone.

## ResellerPro BOUNDARY

`Mind-Reply/resellerpro` remains the canonical organization repository, but its README explicitly records that the larger personal implementation is still a source-freeze migration source. The organization repository currently does not contain the migrated Next.js application tree needed to truthfully claim that the localization runtime is deployed there.

Therefore the correct release state is:

**READY FOR MIGRATION / RUNTIME UNVERIFIED**

Localization code should not be split into a second implementation while the ResellerPro source reconciliation is unfinished.

## Supabase

Two active projects were verified:
- `MindR` — ACTIVE_HEALTHY
- `resellerpro-prod` — ACTIVE_HEALTHY

On `resellerpro-prod`, `public."AcquisitionEvent"` exists and currently contains 40 rows.

A read-only schema search did **not** find a `sovereign_treasury_ledger`, `distressed_acquisition_pipeline`, `revenue_ledger`, or `revenue_profit_summary` table in `resellerpro-prod`.

This means the supplied "sovereign-profit-database-engine" description cannot be treated as verified production database state.

## Release rule

**CODE → CI → DEPLOYMENT → EXTERNAL HTTP → INDEXING → EVIDENCE**

Each stage must be proven separately. No "live", "verified", "active", or "operating autonomously" status is inferred from configuration text.

## Security / Operations

The requested autonomous treasury transfers, acquisition novations, kernel daemons, continuous watchdogs, and external financial routing are not activated by this audit. They require separate infrastructure evidence, credentials, provider authorization, and explicit owner approval before any irreversible execution.
