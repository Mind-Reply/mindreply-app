# Portfolio Unified Infrastructure Map

Status: VERIFIED architecture baseline — 2026-09-30

## Operating model

Personal portfolio
→ unified infrastructure and control conventions
→ independent product, runtime, security and compliance boundaries.

The goal is shared infrastructure without forcing unrelated applications into one codebase.

## Canonical roles

| Repository | Verified state | Role | Boundary |
|---|---|---|---|
| angellllkr-eng/mind-reply-core | public, main, active | Personal canonical core / shared control and source layer | Shared infrastructure + selected product code |
| angellllkr-eng/nowline | public, main, active | Nowline product/runtime | Independent product release/runtime |
| angellllkr-eng/reseller-pro | public, main, active | ResellerPro personal repo / deployment workstream | Independent product/runtime |
| angellllkr-eng/a11-evidence-surface | public, main, active | Evidence publication surface | Independent evidence/publication boundary |
| angellllkr-eng/A11-K | private, main, active | Owner/private operator system | Private security/runtime boundary |
| angellllkr-eng/patchtalk | private, main, active | PATCH Talk product/runtime | Private communications/runtime boundary |
| angellllkr-eng/novagaming | private, main, active | Regulated product/runtime | Strong isolation; no casual consolidation |

## Centralize in mind-reply-core

- Canonical portfolio/project registry
- Shared architecture and deployment standards
- Owner-control conventions
- Evidence and IntegrityLog schemas/interfaces
- Reusable packages only where dependency ownership is clear
- Cross-product contracts and integration documentation
- Security conventions and CI/CD patterns
- Non-destructive portfolio reconciliation records

## Keep separate

- Product-specific application code where releases differ
- Production credentials and secrets
- Runtime-specific infrastructure
- Regulated/compliance-sensitive systems
- PATCH Talk communications runtime
- Private owner-only systems
- Public evidence publication surface where independent publication is useful

## Current action policy

Do not delete, rename, archive, or merge repositories solely because they appear duplicative.
Reconcile implementation, runtime, deployment authority, domains, credentials, and evidence first.
Only then perform consolidation with an explicit migration record.

## Evidence basis

This baseline was derived from live GitHub repository metadata and public repository trees inspected on 2026-09-30. It is an architecture baseline, not a claim that any application is production-live.

Next controlled step: reconcile deployment authority and actual application roots for the highest-priority product repositories before any destructive consolidation.
