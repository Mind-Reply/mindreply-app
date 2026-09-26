# GitHub Repository Registry

Status: CANONICAL REGISTRY
Updated: 2026-09-26

## Estate rule

**Mind-Reply organization = production authority.**

**Personal `angellllkr-eng` profile = development, recovery, migration and provenance source unless this registry explicitly designates a private/security boundary or a separate product.**

One product must have one active production repository. A repository name is not an authority claim.

## Canonical production map

| Product / boundary | Canonical production repository | Profile/source handling |
|---|---|---|
| MindReply / A11pro | `Mind-Reply/mindreply-app` | Profile MindReply copies are migration/provenance only |
| A11-K | `Mind-Reply/A11-K` | `angellllkr-eng/A11-K` is private migration source |
| ResellerPro | `Mind-Reply/resellerpro` | `angellllkr-eng/resellerpro-platform` is source-freeze implementation source |
| MindReply shared control module | `Mind-Reply/control-plane` | `angellllkr-eng/mindreply-control` is migration source; `agent-control-plane` is a separate private authority/evidence boundary |
| PatchTalk | `angellllkr-eng/patchtalk` pending organization destination | `patchtalk-ux` is design satellite |
| A11 RAG capability | `Mind-Reply/mindreply-app` | `angellllkr-eng/a11-rag-platform` is source-freeze capability source |
| A11 cloud execution capability | `Mind-Reply/mindreply-app` | `angellllkr-eng/a11-live-cloud-execution` is source-freeze capability source |
| FIN-A financial evidence boundary | `angellllkr-eng/fin-a-money-truth` | Separate private financial/evidence boundary; do not expose as public product |
| Nowline DSL | Personal/source project | `angellllkr-eng/nowline` is not the A11 product and is not a MindReply duplicate |
| Nowline/A11 regulated product surface | Separate product candidate | `angellllkr-eng/a11-nowline` remains separate until a distinct organizational destination is defined |

## MindReply duplicate family

### Organization
- `Mind-Reply/mindreply-app` — ACTIVE CANONICAL.
- `Mind-Reply/mind-reply-app` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-suite-private` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-next` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-studio` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-brands` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-portfolio-control` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-production-pack` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-priority-dashboard` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-org-site` — ARCHIVED LEGACY.
- `Mind-Reply/mind-reply-control` — ARCHIVED LEGACY.
- `Mind-Reply/mindreply-platform` — CONSOLIDATED; no production work.
- `Mind-Reply/mindreply-docs` — CONSOLIDATED; documentation belongs in canonical repo.
- `Mind-Reply/mind-reply-core` — MIGRATION SOURCE; actual product identity is A11-K surface material, not an independent MindReply production root.

### Personal
- `angellllkr-eng/mindreply` — SOURCE-FREEZE / PERSONAL HISTORICAL COPY.
- `angellllkr-eng/mindr` — PRIVATE ENGINEERING WORKSPACE / NOT CANONICAL.
- `angellllkr-eng/mr` — LEGACY MIGRATION SOURCE.
- `angellllkr-eng/mindreply-org-site` — SOURCE-FREEZE / PERSONAL HISTORICAL COPY.
- `angellllkr-eng/mindreply-control` — SOURCE-FREEZE / CONTROL-PLANE MIGRATION SOURCE.
- `angellllkr-eng/mind-reply` — EMPTY.
- `angellllkr-eng/mr-app-copy` — EMPTY.
- `angelkrustevtopa-jpg/MindReply` — EXTERNAL/PERSONAL OWNER; not an authoritative organization source.

## A11-K family

- `Mind-Reply/A11-K` — ACTIVE CANONICAL.
- `angellllkr-eng/A11-K` — PRIVATE MIGRATION SOURCE.
- Personal `a11-*` repositories are not automatically production products. Each must be explicitly classified before promotion or consolidation.

## ResellerPro family

- `Mind-Reply/resellerpro` — ORGANIZATION CANONICAL DESTINATION.
- `angellllkr-eng/resellerpro-platform` — CURRENT IMPLEMENTATION SOURCE / SOURCE-FREEZE.
- `angellllkr-eng/reseller-pro-enterprise` — LEGACY SOURCE / SOURCE-FREEZE.
- `angellllkr-eng/reseller-pro` — LEGACY SOURCE / SOURCE-FREEZE.

The organization destination is not called production-complete until the actual implementation tree, build/release contracts and validation evidence are present there.

Current transfer task:
https://github.com/Mind-Reply/resellerpro/issues/3

## Control-plane boundary

- `Mind-Reply/control-plane` — organization control-plane module.
- `angellllkr-eng/agent-control-plane` — private constitutional owner-control/evidence boundary.
- `angellllkr-eng/mindreply-control` — legacy application/control implementation awaiting reconciliation.

The private constitutional boundary is intentionally separate from the product runtime. It is not a second public product.

## A11 RAG / execution family

### A11 RAG
`angellllkr-eng/a11-rag-platform` is now SOURCE-FREEZE. Useful retrieval, evidence, signed-record and release-gate capabilities belong in `Mind-Reply/mindreply-app`.

### A11 cloud execution
`angellllkr-eng/a11-live-cloud-execution` is now SOURCE-FREEZE. Useful orchestration, governance, execution and evidence capabilities belong in `Mind-Reply/mindreply-app`.

### A11 Sovereign Nowline
`angellllkr-eng/a11-sovereign-nowline` is LEGACY/SOURCE-FREEZE and must not be treated as current deployment proof.

## PatchTalk

- `angellllkr-eng/patchtalk` — current canonical product source.
- `angellllkr-eng/patchtalk-ux` — design satellite only.
- `Mind-Reply/whatsapp-ai-router` — organization runtime/source that must be reconciled against PatchTalk before being designated as its production authority.

## What stays personal

Not every personal repository should be moved into the organization. Third-party mirrors, generic templates, unrelated open-source work, experiments, private evidence boundaries and genuinely separate products can remain personal.

The merge criterion is **business/product identity and operational authority**, not repository size.

## Consolidation status

### COMPLETED
- Organization-vs-profile authority rule established in `Mind-Reply/.github/README.md`.
- MindReply canonical root established.
- A11-K organization root established.
- ResellerPro organization destination established; personal source frozen.
- A11 RAG and A11 cloud-execution sources frozen for capability migration.
- Major personal MindReply copies labelled.
- Historical organization duplicates already archived where available.

### PENDING
- Transfer/synchronize the actual ResellerPro implementation tree into `Mind-Reply/resellerpro`.
- Reconcile unique A11 RAG and cloud-execution capabilities into `Mind-Reply/mindreply-app`.
- Reconcile `Mind-Reply/whatsapp-ai-router` and `angellllkr-eng/patchtalk` into one PatchTalk runtime authority.
- Final GitHub archive/delete/rename/transfer administration for redundant repositories.

## Connector limitation

The connected GitHub toolset currently exposes repository reads and Git object/file writes but does **not** expose repository administration operations for transfer, rename, archive or delete.

Those actions are therefore not falsely claimed as completed.

## Truth rule

**PRODUCTION AUTHORITY = canonical repository + verified implementation + validated release path + runtime evidence.**

Never use an old README, repository name, or historical deployment claim as live proof.
