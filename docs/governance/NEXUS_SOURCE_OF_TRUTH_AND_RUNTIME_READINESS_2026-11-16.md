# Nexus Source-of-Truth and Runtime Readiness Audit

**Audit date:** 2026-11-16  
**Canonical product repository:** `Mind-Reply/mindreply-app`  
**Scope:** Nexus code provenance, repository authority, submodule integrity, and NEXUS-SPINE runtime claims  
**Disposition:** CONTINUE — provenance is partially established; executable implementation and live runtime are not verified.

## Executive finding

Nexus must not be treated as a standalone production root or as a verified live telemetry/orchestration service on the evidence inspected.

The current canonical MindReply product README names `Mind-Reply/mindreply-app` as the active product root and identifies `Mind-Reply/control-plane` as legacy/source-freeze. The archived `Mind-Reply/mind-reply-core` README also says it is historical provenance/recovery only and points to `mindreply-app` as the canonical product. This supersedes the older consolidation report's claim that `mind-reply-core` is the current canonical production repository.

## Evidence reviewed

| Evidence | Direct observation | Meaning |
|---|---|---|
| `Mind-Reply/mindreply-app/README.md` | Names `mindreply-app` canonical; owner-control root is `angellllkr-eng/agent-control-plane`; deployment direction Cloudflare / ResellerPro | Current repository authority |
| `Mind-Reply/mind-reply-core/README.md` | Marks itself LEGACY / SOURCE-FREEZE; says canonical product is `mindreply-app` | Archived core is provenance, not production root |
| `Mind-Reply/mindreply-app/CONSOLIDATION_REPORT.md` | Claims 2026-08-05 consolidation completed into `mind-reply-core` and says `nexus-core` was merged into `infrastructure/nexus/` | Historical claim conflicts with current README and repo status |
| `Mind-Reply/mindreply-app/.gitmodules` | Still declares `infrastructure/nexus` as a submodule pointing to `https://github.com/angellllkr-eng/nexus-core.git` | Submodule declaration conflicts with the report's claim that Git metadata was removed and Nexus fully embedded |
| `angellllkr-eng/nexus-core/README.md` | Describes Nexus Core as PRIVATE SATELLITE / SOURCE-FREEZE and names `Mind-Reply/mind-reply-core/infrastructure/nexus/` as canonical implementation location | Source-freeze record; its target path is in an archived repository |
| `Mind-Reply/mindreply-app/docs/ELYSIUM_STACK.md` | Nexus surfaces are mapped to Aurelia; Aurelia/Lumenforge/Veridex implementation checklist remains incomplete | Architecture and scaffolding, not proof of end-to-end runtime |
| `docs/governance/TRI_AGENT_CORE_VERIFIED_OPERATING_CONTRACT_2026-09-26.md` search result | NEXUS-SPINE retained as a proposed architectural role for governed event/state fabric | Proposal, not verified runtime |
| `docs/governance/TRI_AGENT_OPERATIONAL_AUDIT_2026-09-26.md` search result | NEXUS-SPINE live telemetry bus explicitly UNVERIFIED; no recurring process activated | No evidence of active telemetry bus/background worker |

## Reconciliation of conflicting repository claims

1. Treat `Mind-Reply/mindreply-app` as the canonical MindReply product source.
2. Treat `Mind-Reply/mind-reply-core` and `Mind-Reply/control-plane` as legacy/source-freeze sources, not production roots.
3. Treat `angellllkr-eng/nexus-core` as a migration/provenance satellite until its unique code is compared with the canonical product repository.
4. Do not accept the 2026-08-05 consolidation report's “merged” claim as sufficient proof while `.gitmodules` still declares the Nexus submodule and the target tree has not been inspected.
5. Do not create a second Nexus implementation. The next implementation step must be a file-level inventory and content comparison of the old satellite, the archived core path, and the canonical product repository.

## Runtime verification requirements

NEXUS-SPINE can only move from proposed/READY to VERIFIED after all of the following are evidenced:

- A concrete canonical source path and commit SHA for the event/state fabric.
- An executable entrypoint and dependency manifest, not only architecture documentation.
- Defined event envelope, schema/version policy, producer/consumer registry, and idempotency semantics.
- Authenticated transport and explicit authorization boundaries.
- Durable event persistence and replay/recovery behavior.
- Runtime deployment identifier and environment binding.
- Fresh health/telemetry evidence from the deployed runtime.
- Tests proving duplicate delivery, ordering/replay, invalid signature, unauthorized producer, and failure recovery behavior.
- Operational owner, alerting path, and rollback procedure.

No live telemetry, autonomous orchestration, recurring schedule, or background process is claimed by this audit.

## Next actions

1. Read the Nexus satellite's full file tree and identify all unique source files, workflows, package manifests, and tests.
2. Inspect the archived core's `infrastructure/nexus/` path and compare file hashes/content against the satellite.
3. Inspect the canonical product repository's `infrastructure/nexus/` path and submodule gitlink state.
4. Produce a file-level migration matrix: identical, modified, unique-to-satellite, unique-to-core, missing-from-canonical, or obsolete.
5. Stage only required, non-secret source into the canonical repository after compatibility review. Preserve provenance and licensing notices.
6. Add contract tests and a local/synthetic runtime harness before any deployment proposal.

## Safety boundary

This audit is documentation-only. It does not modify the submodule, archive/delete repositories, change production configuration, add credentials, deploy services, or activate any background worker.

**Current status:** canonical product root VERIFIED from repository README; Nexus source provenance PARTIALLY VERIFIED; complete migration, executable NEXUS-SPINE runtime, and live telemetry remain UNVERIFIED.
