# MindReply Repository Authority

Status: CANONICAL ESTATE MAP — 2026-09-26

## Rule

One platform = one authoritative repository.

The canonical MindReply platform/product root is:

`Mind-Reply/mindreply-app`

Do not create another repository for the same MindReply platform under a spelling variant such as `MindReply`, `Mind-Reply`, `mindreply`, `mind-reply`, `mindreply-app`, `mind-reply-app`, `mindreply-next`, or `mindreply-platform`.

## KEEP — intentionally separate

| Repository | Role | Authority |
|---|---|---|
| `Mind-Reply/mindreply-app` | MindReply platform/product root | CANONICAL |
| `Mind-Reply/whatsapp-ai-router` | PatchTalk / WhatsApp edge runtime | SEPARATE RUNTIME |
| `Mind-Reply/mind-reply-core` | legacy/core migration source | MIGRATION ONLY |

The last two are separate only because they represent a distinct runtime boundary or migration source. Neither is a second MindReply product root.

## CONSOLIDATED

The following content has now been copied into this canonical repository:

- `mindreply-platform/apps/operator` → `docs/platform/a11pro-operator`
- `mindreply-platform/strategy/*` → `docs/strategy/*`
- `mindreply-docs/ESTATE_RUNTIME_CONTRACT_2026-09-13.md` → `docs/estate/*`

The old repositories remain only as provenance until GitHub repository administration permits safe archive/rename operations.

## DUPLICATE / HISTORICAL — do not use for new work

Known duplicate or historical roots include personal copies under `angellllkr-eng`, older `Mind-Reply` repositories, and similarly named archived repositories.

New commits for MindReply platform work go to `Mind-Reply/mindreply-app`.

## Naming standard

- Product: **MindReply**
- Canonical repository: **mindreply-app**
- Edge runtime: **whatsapp-ai-router** (PatchTalk)
- Migration source: **mind-reply-core** until fully reconciled

Repository names are infrastructure identifiers; public product naming remains MindReply.

## Change-control rule

Before creating a repository:
1. Check this map.
2. Confirm the capability cannot live inside the canonical platform.
3. If a separate runtime boundary is genuinely required, name it by function, not by another MindReply spelling.
4. Add it to this map before production use.

No duplicate production roots.
