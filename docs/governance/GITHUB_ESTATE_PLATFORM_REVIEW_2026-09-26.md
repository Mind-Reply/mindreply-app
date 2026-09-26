# GitHub Estate Platform & Profile Review — 2026-09-26

**Authority:** A11ceo  
**Execution:** A11pro  
**Scope:** Mind-Reply organization repositories and GitHub organization profile  
**Rule:** One public/product concept = one canonical production source. Experiments, migrations and third-party/vendor mirrors do not become competing production roots.

## Verified organization inventory

The organization currently has **33 active repositories**. This review separates the active estate into canonical products, internal platform/control surfaces, migration sources, experiments/dependencies, and candidates requiring explicit disposition.

### Canonical product/platform boundaries

| Repository | Current role | Decision |
|---|---|---|
| `Mind-Reply/mindreply-app` | Canonical MindReply product root | KEEP / CANONICAL |
| `Mind-Reply/A11-K` | Canonical A11-K intelligence/owner-operations product | KEEP / CANONICAL |
| `Mind-Reply/Aurel` | Premium experience product | KEEP / CANONICAL |
| `Mind-Reply/resellerpro` | Organization destination for ResellerPro | KEEP / CANONICAL DESTINATION; migration in progress |
| `Mind-Reply/whatsapp-ai-router` | Canonical PatchTalk / WhatsApp edge runtime | KEEP / CANONICAL RUNTIME |
| `Mind-Reply/control-plane` | Owner/control implementation and governance module | KEEP / INTERNAL PLATFORM; do not become second public product root |
| `Mind-Reply/mrproduction` | Production-oriented private implementation surface | REVIEW / DEFINE OR CONSOLIDATE |
| `Mind-Reply/.github` | Organization profile, brand and governance layer | KEEP / GOVERNANCE |

### Consolidated / migration repositories

| Repository | Decision |
|---|---|
| `Mind-Reply/mindreply-platform` | MOVED; no new platform code |
| `Mind-Reply/mindreply-docs` | MOVED; documentation belongs in canonical root |
| `Mind-Reply/mind-reply-core` | MIGRATION SOURCE; reconcile useful implementation, then retire |
| `angellllkr-eng/resellerpro-platform` | SOURCE-FREEZE migration source; reconcile into `Mind-Reply/resellerpro` |

### Active but concept-specific repositories

These are not automatically duplicates of MindReply and should be evaluated against a product/platform boundary before promotion:

- `A11-K` — owner/intelligence product.
- `Aurel` — premium experience.
- `MR-mcp-with-next` — MCP/Next technical component; keep only if it remains a reusable capability rather than a second application root.
- `cli` — large CLI codebase; appears to be a separate technical product/dependency and requires provenance/ownership review before coupling to MindReply.
- `compose-for-agent` and `compose-for-agents` — overlapping names; review as a pair and retain one authoritative implementation if they represent the same concept.
- `amazon-q-vscode` — external/vendor-derived code; do not treat as proprietary MindReply product source.
- `genai-stack`, `Understand-Anything`, `next-devtools-mcp`, `claude-plugins-official` — technical/reference/tooling surfaces; keep separate from product roots unless a documented dependency boundary exists.
- `astryx` — large active repository; requires explicit provenance and product-purpose review before inclusion in the MindReply platform estate.
- `unapolagetic-cosmetics` — distinct commercial concept; keep separate unless intentionally absorbed as a brand/business unit.
- `am-service-ads-engine`, `10-business-units`, `masterpiece-system`, `kratos-s`, `aether-x`, `own-core`, `tapcraft`, `routeforge`, `FixCode`, `todo-csharp-sql` — active concept/experimental repositories; no promotion to production root without explicit product identity, owner, runtime and evidence contract.
- `angellllkr-eng.github.io` — personal/public profile surface mirrored into the organization; keep only if it has a deliberate public role.

## Profile alignment

The organization profile correctly establishes:
- MindReply as the commercial product/delivery brand.
- A11-K as intelligence/command/owner-operating brand.
- ResellerPro as deployment/domain/hosting/reseller product.
- Aurel as premium experience product.
- PatchTalk as communications product.
- service brands LeadLeak Fix, Workflow Clinic, Site Rescue Desk and Fintech Signal Desk.
- internal names such as Crownline, Proofline, Nowline and Control Plane as non-public system names.

The profile's ResellerPro canonical source now matches the organization destination `Mind-Reply/resellerpro`; the personal implementation is explicitly a migration source.

## Platform concept fit

The estate should converge on these boundaries:

```
A11ceo
  └── A11pro
       ├── MindReply        → commercial product / customer delivery
       ├── A11-K            → intelligence / owner command
       ├── Aurel            → premium experience
       ├── ResellerPro      → deployment / hosting / domain / reseller control
       └── PatchTalk        → communications / realtime edge

Shared internal capabilities:
  control-plane / evidence / security / orchestration / finance contracts
```

The boundaries are intentionally capability-oriented. A product repository must not silently become another product's control plane, and shared capabilities should be integrated through explicit contracts rather than copied application trees.

## Required next reconciliations

1. **ResellerPro:** absorb the frozen personal implementation into `Mind-Reply/resellerpro`, verify, then retire the migration source when administration permits.
2. **MindReply Core:** reconcile substantial useful code into `mindreply-app`; keep provider/runtime boundaries explicit.
3. **Compose pair:** compare `compose-for-agent` vs `compose-for-agents` and select one authoritative concept if they overlap.
4. **Control Plane:** identify unique capabilities that belong in shared packages versus capabilities that should live inside the canonical product roots.
5. **MRproduction:** determine whether it is a real separate runtime/product or historical scaffolding.
6. **Large/reference repos:** provenance-check `cli`, `astryx`, `amazon-q-vscode` and other non-core active repositories before any integration.
7. **Profile:** maintain one public name → one definition → one canonical production source.

## Truth state

**VERIFIED:** organization inventory, core repository roles, current canonical/migration README contracts and organization profile contents were inspected through GitHub.

**UNVERIFIED:** runtime health of active repositories unless separately verified at their deployment providers.

**BLOCKED/NOT CLAIMED:** repository rename/archive/delete administration where the connected GitHub action surface does not expose the required operation.

## Operating rule

`CONCEPT → OWNER → CANONICAL REPO → RUNTIME BOUNDARY → EVIDENCE → RELEASE`

No repository is promoted merely because it exists or builds.
