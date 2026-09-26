# MindReply Proofline — Migration Source

This repository is retained as a source/provenance mirror after the MindReply estate consolidation.

## Canonical production source
- **Product:** `Mind-Reply/mindreply`
- **Branch:** `main`
- **Frontend:** `apps/web-replycontrol`
- **Primary domain:** `mind-reply.com`
- **Operations/control plane:** `angellllkr-eng/agent-control-plane`

## Migrated runtime capabilities
The unique Elysium runtime from this repository has been migrated into the canonical repository:
- Aurelia deterministic intent compiler
- Elysium Core contracts/orchestration
- Lumenforge quality gate
- Veridex provenance and delivery pack
- Elysium API endpoints

The source commit used for the migration is `ba76f5438ef1030990efedceb6a8c28a745c50be`.

## Repository role
Do not treat this repository as a parallel production root. It remains available for provenance, rollback comparison, and any future file-level reconciliation that has not yet been explicitly marked complete in `Mind-Reply/mindreply/ESTATE_MIGRATION_STATUS.md`.

The private operational control root remains separate; product code must not become a second owner-control plane.

## Security
Never commit credentials, `.env` files, customer data, or payment data.
