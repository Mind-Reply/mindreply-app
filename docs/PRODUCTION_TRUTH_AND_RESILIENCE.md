# Production Truth & Resilience

## Status vocabulary
LIVE = externally reachable and smoke-tested.
READY = deployable and checks pass, but reachability is not verified.
DEGRADED = reachable with a known failing capability.
BLOCKED = intentionally unavailable.
PLANNED = not deployed.
UNKNOWN = no trustworthy current signal.

A status monitor must never upgrade PLANNED, UNKNOWN, or CLAIMED into LIVE without a fresh probe.

## No-404 policy
Every production release should run route discovery plus HTTP smoke tests for the homepage, navigation targets, auth entry points, API health endpoints, checkout entry points, legal pages, robots.txt and sitemap.xml. Broken links fail release promotion unless explicitly waived and recorded.

## Resilience architecture
Use a provider adapter boundary:
- Primary: Vercel.
- Plan B: Cloudflare Workers/Pages or another compatible edge/static deployment adapter.
- Plan C: Render/Fly/self-hosted container deployment.

Application code must remain provider-neutral. Provider credentials, domains and deployment commands live in adapter configuration rather than application modules.

## Automation
Hourly checks should inspect deployments, HTTP status, DNS/SSL, CI, dependency/security alerts, integration health, webhook failures and revenue-critical paths. n8n or an equivalent scheduler may orchestrate checks; vector storage is for retrieval/knowledge, not authoritative runtime state.

## Recovery
Safe reversible repairs can be automated. Credential rotation, destructive database operations, public DNS changes, financial actions and production migrations require owner approval.
