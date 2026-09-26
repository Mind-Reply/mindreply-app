# GitHub Repository Registry

Status: CANONICAL REGISTRY
Updated: 2026-09-26

## Rule

One repository per real platform/project.

A second repository is allowed only when it is a genuinely separate product or a documented security/authority boundary. Historical copies, naming variants, and personal mirrors are migration sources, not parallel production roots.

Do not create `-copy`, `-new`, `-next`, `-app`, `-core`, `-platform`, `-control`, `-enterprise`, or similar variants for the same product without a written technical reason here.

## Canonical estate

| Platform / boundary | Canonical repository | Current state |
|---|---|---|
| A11pro / MindReply product | `Mind-Reply/mindreply-app` | ACTIVE CANONICAL |
| MindReply private owner-control / evidence boundary | `angellllkr-eng/agent-control-plane` | ACTIVE SEPARATE SECURITY/AUTHORITY BOUNDARY |
| ResellerPro organization destination | `Mind-Reply/resellerpro` | CANONICAL DESTINATION; CONTENT MIGRATION IN PROGRESS |
| ResellerPro current implementation source | `angellllkr-eng/resellerpro-platform` | SOURCE-FREEZE / MIGRATION SOURCE |
| NovaGaming | `angellllkr-eng/novagaming` | ACTIVE CANONICAL |
| A11-K organization surface | `Mind-Reply/A11-K` | ACTIVE ORGANIZATION SURFACE |
| PatchTalk | `angellllkr-eng/patchtalk` | ACTIVE CANONICAL SOURCE |

The private control plane is deliberately separate from the product repository because it is an authority/evidence boundary. It is not a second product runtime.

## MindReply duplicate family

### Organization repositories
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
- `Mind-Reply/mindreply-platform` — CONSOLIDATED; no production work.
- `Mind-Reply/mindreply-docs` — CONSOLIDATED; documentation belongs in canonical repo.
- `Mind-Reply/mind-reply-control` — ARCHIVED LEGACY.

### Personal repositories
- `angellllkr-eng/mindreply` — SOURCE-FREEZE / PERSONAL HISTORICAL COPY.
- `angellllkr-eng/mindreply-org-site` — SOURCE-FREEZE / PERSONAL HISTORICAL COPY.
- `angellllkr-eng/mindreply-control` — SOURCE-FREEZE / CONTROL-PLANE MIGRATION SOURCE.
- `angellllkr-eng/mind-reply-core` — MISLABELED NOVAGAMING SOURCE; not a MindReply repo.
- `angellllkr-eng/mind-reply` — EMPTY.
- `angellllkr-eng/mr-app-copy` — EMPTY.
- `angelkrustevtopa-jpg/MindReply` — EXTERNAL/PERSONAL OWNER; not an authoritative Mind-Reply source.

## ResellerPro duplicate family

- `Mind-Reply/resellerpro` — CANONICAL ORGANIZATION DESTINATION.
- `angellllkr-eng/resellerpro-platform` — CURRENT IMPLEMENTATION SOURCE; SOURCE-FROZEN for migration.
- `angellllkr-eng/reseller-pro-enterprise` — LEGACY SOURCE; SOURCE-FROZEN.
- `angellllkr-eng/reseller-pro` — LEGACY SOURCE; SOURCE-FROZEN.

Important: the organization destination and the current implementation source are intentionally distinguished until the implementation is actually transferred. No second ResellerPro product is authorized.

Current verified source candidate commits:
- `angellllkr-eng/resellerpro-platform` latest main: `126654afb58dd0d41594ef0749f0a98048938922`
- `Mind-Reply/resellerpro` latest main: `b30b6a0358bc3225ed2086b9b07166677109e747`

## NovaGaming naming correction

`angellllkr-eng/mind-reply-core` is not treated as a MindReply duplicate. Its package identity is `nova-gaming-digital-hall` and its source history references NovaGaming. Its repository notice now points to the actual NovaGaming canonical source:

`angellllkr-eng/novagaming`

## Control-plane naming correction

`angellllkr-eng/mindreply-control` is not an independent product. Its useful UI/runtime material is migration source only.

The constitutional private owner-control and evidence boundary is:

`angellllkr-eng/agent-control-plane`

Application/product code belongs in:

`Mind-Reply/mindreply-app`

## What is NOT a duplicate

Separate product repositories may remain separate when their product identity is real and documented. Examples: NovaGaming and PatchTalk.

## Cleanup state

Completed through the connected GitHub actions:
1. Canonical MindReply registry created.
2. Redundant MindReply repos explicitly labeled as consolidated/source-frozen where writable.
3. ResellerPro authority conflict corrected.
4. ResellerPro legacy repos labeled and pointed to the organization destination.
5. Misnamed `mind-reply-core` corrected to NovaGaming provenance.
6. Control-plane source clarified against the private owner-control boundary.

Still requires GitHub repository administration not exposed by the current connector:
- Archive or delete the final redundant repositories after reconciliation.
- Rename repositories where a misleading name should be removed.
- Transfer the ResellerPro implementation from the personal source into `Mind-Reply/resellerpro` (or otherwise complete the content absorption) before declaring the organization destination production-authoritative.
- Remove stale external deployment integrations/references after the source move.

## Non-negotiable truth rule

A repository name is not evidence of production authority. Runtime/deployment claims require runtime evidence. Historical repositories remain provenance until their useful content is reconciled and the repository is archived or deleted.
