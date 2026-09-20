# MindReply Proofline

MindReply Proofline is an evidence-led product platform for owner-governed automation, protected releases, and human-approved operational workflows.

## Repository status

**Built - reconciliation in progress. Not yet approved for production cutover.**

The complete current product source was reconstructed here from `angellllkr-eng/mind-reply-core` on 10 September 2026. See [`CANONICAL-SOURCE.md`](CANONICAL-SOURCE.md) and [`docs/MIGRATION_PROVENANCE.md`](docs/MIGRATION_PROVENANCE.md) for the exact source commit, scan results, retained rollback source, and release gate.

## Product boundary

| Area | Purpose |
| --- | --- |
| `apps/web-replycontrol` | Customer-facing MindReply experience |
| `app` | Platform routes, status surfaces, and protected dashboard UI |
| `services` and `workers` | Product-side service boundaries |
| `packages` | Shared product packages |
| `tests` | Repeatable verification |

The owner-only control plane remains separate from this product repository. No deployment, payment, DNS, message send, or credential rotation is performed by a source import.

## Local verification

Use the package scripts documented in `package.json`. Copy `.env.example` only to a local untracked environment file and supply values through a secret store; never commit real credentials.

## Release rule

Pull requests prove a change. Production promotion requires an explicit owner approval, a verified preview, an immutable release identifier, health evidence, and a documented rollback.

© 2026 MindReply. All rights reserved.
