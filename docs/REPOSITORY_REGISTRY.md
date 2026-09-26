# GitHub Repository Registry

Status: CANONICAL REGISTRY
Updated: 2026-09-26

## Rule

One repository per real platform/project. Supporting material belongs inside that canonical repository unless there is a documented, technically necessary separation.

Do not create `-copy`, `-new`, `-next`, `-app`, `-core`, `-platform`, `-control`, `-enterprise`, or similar variants for the same product without a written reason in this registry.

Archived repositories are history, not active sources.

## Canonical active sources

| Platform / project | Canonical repository | Current role |
|---|---|---|
| A11pro / MindReply core operating layer | Mind-Reply/mindreply-app | Canonical implementation + governed frontier work |
| ResellerPro | Mind-Reply/resellerpro | Canonical ResellerPro implementation |
| NovaGaming | angellllkr-eng/novagaming | Canonical NovaGaming implementation |
| A11-K organization surface | Mind-Reply/A11-K | Canonical A11-K organization repository pending deeper reconciliation |
| PatchTalk | angellllkr-eng/patchtalk | Canonical PatchTalk implementation |

## Confirmed duplicate / legacy families

### MindReply family

Active or legacy names found include:

- Mind-Reply/mindreply-app — ACTIVE CANONICAL
- Mind-Reply/mind-reply-app — ARCHIVED LEGACY
- Mind-Reply/mindreply-suite-private — ARCHIVED LEGACY
- Mind-Reply/mindreply-next — ARCHIVED LEGACY
- Mind-Reply/mindreply-studio — ARCHIVED LEGACY
- Mind-Reply/mindreply-brands — ARCHIVED LEGACY
- Mind-Reply/mindreply-portfolio-control — ARCHIVED LEGACY
- Mind-Reply/mindreply-production-pack — ARCHIVED LEGACY
- Mind-Reply/mindreply-priority-dashboard — ARCHIVED LEGACY
- Mind-Reply/mindreply-org-site — ARCHIVED LEGACY
- Mind-Reply/mindreply-platform — ACTIVE, requires reconciliation before being treated as a separate product
- Mind-Reply/mindreply-docs — ACTIVE, supporting repository; documentation should be reconciled into the canonical implementation where practical
- Mind-Reply/mind-reply-control — ARCHIVED LEGACY
- angellllkr-eng/mindreply — ACTIVE PERSONAL COPY / RECONCILIATION REQUIRED
- angellllkr-eng/mind-reply — EMPTY PERSONAL REPOSITORY
- angellllkr-eng/mind-reply-core — ACTIVE PERSONAL COPY / RECONCILIATION REQUIRED
- angellllkr-eng/mindreply-org-site — ACTIVE PERSONAL COPY / RECONCILIATION REQUIRED
- angellllkr-eng/mr-app-copy — EMPTY PERSONAL COPY
- angelkrustevtopa-jpg/MindReply — EXTERNAL/PERSONAL OWNER; not an authoritative Mind-Reply organization source

### ResellerPro family

Confirmed sources include:

- Mind-Reply/resellerpro — CANONICAL
- angellllkr-eng/resellerpro-platform — ACTIVE PERSONAL IMPLEMENTATION / RECONCILIATION REQUIRED
- angellllkr-eng/reseller-pro — ACTIVE PERSONAL IMPLEMENTATION / RECONCILIATION REQUIRED
- angellllkr-eng/reseller-pro-enterprise — ACTIVE PERSONAL IMPLEMENTATION / RECONCILIATION REQUIRED

These must not evolve independently. Reconcile useful work into Mind-Reply/resellerpro and then archive/remove the redundant personal repositories through GitHub administration.

### Control-plane naming

Confirmed overlapping names:

- angellllkr-eng/mindreply-control — ACTIVE
- Mind-Reply/mind-reply-control — ARCHIVED
- Mind-Reply/mindreply-portfolio-control — ARCHIVED

Only one control-plane implementation should remain active. Control-plane capability belongs with the canonical platform unless it is proven to be an independent deployable product.

## What is NOT a duplicate

Repositories for genuinely separate products, third-party source mirrors, experiments, templates, or independent domains may remain separate. They must have a distinct product identity and an explicit owner.

Examples include NovaGaming and PatchTalk, which are separate product surfaces and therefore can retain their own canonical repositories.

## Required cleanup order

1. Protect the canonical repository.
2. Inventory active personal/org variants.
3. Compare trees, commits, deployments, and external references.
4. Absorb unique useful work into the canonical repository.
5. Verify the canonical build and release path.
6. Mark redundant repositories as legacy.
7. Archive/delete redundant repositories through GitHub administration.
8. Remove stale deployment integrations and references.
9. Re-check GitHub search so duplicate active names no longer create ambiguity.

## Current decision

The existence of duplicate names is real and is caused by historical copies, migrations, personal/org splits, and renamed experiments—not by separate versions that should all remain active.

The source of truth is the canonical repository listed above. No repository is considered production-authoritative merely because its name looks newer.

## Safety rule

Do not delete or overwrite repository data solely from a name match. Consolidation requires content/tree comparison and preservation of unique useful work before archival or deletion.
