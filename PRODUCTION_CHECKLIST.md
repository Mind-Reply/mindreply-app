# MindReply Continuous Delivery Verification

This document is a verification and operations checklist, not a production gate.

## Verification model

Deployment, security, payments, runtime health and monitoring checks are observable controls. A failed or unavailable check is recorded with its evidence and routed to remediation; it does not create a repository-level promotion lock.

## Security and credentials

- Rotate credentials when exposure or age requires it.
- Keep secrets in provider secret stores, never source control.
- Run secret scanning and dependency/security checks continuously.
- Record remediation evidence without embedding credentials.

## Hosting and domain

- Confirm the active deployment provider and domain mapping.
- Verify HTTPS and critical public routes.
- Keep the canonical repository and deployment mapping explicit.
- Record deployment commit/artifact identity.

## Product flow

Continuously verify:
- Homepage and service pages.
- Assessment/contact flows.
- API health/readiness/version endpoints.
- Checkout/payment paths when configured.
- Error handling and authentication.
- Browser-visible secret exposure.

## Service operations

Continuously verify:
- Uptime and runtime health.
- Error logging.
- Performance.
- Database backups and restore procedure.
- Rollback target availability.
- Regional routing and critical integrations.

## Security checks

Continuously run:
- Secret scanning.
- Dependency audit.
- OWASP-oriented application review.
- TLS/HTTPS checks.
- Authentication and authorization tests.

## Evidence

Each check should record:
- timestamp
- commit or deployment identity
- endpoint/tool used
- observed result
- remediation reference when needed

## Deployment path

The active delivery path is ResellerPro / Cloudflare as configured. GitHub source changes and deployment evidence remain independently observable.

## Operating status

Use descriptive states such as:
- DRAFT
- VERIFIED
- LIVE
- UNCONNECTED
- REMEDIATION_REQUIRED

Do not use GO/NO-GO or BLOCKED as a repository-level release mechanism.

## Rollback

Keep a known-good deployment available where the provider supports rollback. If runtime issues appear, use the provider rollback path and record the resulting evidence.

**Last updated:** 2026-10-03
