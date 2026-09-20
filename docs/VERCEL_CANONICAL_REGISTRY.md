# Vercel Canonical Project Registry

**Status:** active control document  
**Repository source of truth:** `angellllkr-eng/mind-reply-core`  
**Production branch:** `main`

## Architecture rule

GitHub is the source of truth for application code. Vercel is the deployment/runtime layer. The monorepo is intentionally allowed to have multiple Vercel Projects when each project maps to a distinct application directory; Vercel documents this as the standard monorepo model. Each Vercel Project must have one explicit GitHub repository + root-directory mapping. citeturn0search0turn0search3

Do **not** collapse distinct applications into one Vercel Project merely to reduce project count. Consolidate duplicate projects only when they represent the same application, root directory, domains, and deployment responsibility.

## Canonical production map

| Product | Canonical GitHub source | Canonical Vercel project | Root / role | State |
|---|---|---|---|---|
| MindReply | `angellllkr-eng/mind-reply-core` | `mindreply` | repository root / primary web surface | VERIFIED READY |
| A11-K | `angellllkr-eng/mind-reply-core` | `a11k-live-foundation` | A11-K production surface; migrate to explicit monorepo root when project settings permit | NEEDS CONFIG/BUILD FIX |
| PatchTalk | `angellllkr-eng/patchtalk` | `patchtalk` | PatchTalk application | VERIFIED READY |
| ResellerPro | canonical ResellerPro repository | `resellerpro-platform` | canonical ResellerPro application | KEEP; duplicates are migration candidates |
| Private Opportunity Core | matching GitHub repository | `private-opportunity-core` | private/internal application | BUILD ERROR; repair before production |

## Verified evidence

### MindReply

Vercel project `mindreply` has a READY production deployment and the following domains:

- `mind-reply.com`
- `pro.mind-reply.com`
- `brushworks.mind-reply.com`

Do not create another production MindReply project for these domains.

### PatchTalk

Vercel project `patchtalk` has a READY production deployment and is associated with the PatchTalk product source. Keep this as the canonical PatchTalk deployment surface.

### A11-K

`a11k-live-foundation` is connected to `angellllkr-eng/mind-reply-core` on `main`. Recent deployments show repeated configuration/build failures after configuration changes, while older deployments include READY candidates. Treat the latest source as canonical and repair forward; do not fork another A11-K foundation project.

## Consolidation candidates

### ResellerPro

Keep `resellerpro-platform` as canonical. Other projects with the `resellerpro-platform-*` naming pattern are duplicate/migration candidates. Before archival, verify every custom domain, environment variable, webhook, and production deployment against the canonical project.

### MindReply Control / public-site variants

Projects sharing the same repository and application responsibility must be reduced to one canonical deployment per distinct root directory. Preserve a rollback candidate until the canonical deployment and all domains are verified live.

### A11-K variants

Use the monorepo applications under `apps/` as the source hierarchy. Do not create additional A11-K repositories. Distinct A11-K applications may have separate Vercel Projects with explicit root directories.

## Required Vercel configuration pattern

For monorepo projects, configure the Vercel Root Directory to the exact application directory. Vercel supports separate projects connected to the same GitHub repository and recommends explicit root directories for each application. citeturn0search0turn0search7

Recommended targets from the current repository structure include:

- `apps/a11k`
- `apps/a11k-chat`
- `apps/a11k-forge`
- `apps/a11k-nexus`
- `apps/a11k-sites`
- `apps/a11k-studio`
- `apps/web-replycontrol`
- `apps/own-registrar`

Only promote an application to a production Vercel Project when its package/build/runtime contract is independently verified.

## Deployment policy

1. All production changes land on `main`.
2. GitHub push/merge triggers Vercel production deployment for connected projects. citeturn0search2
3. Unaffected monorepo projects should use Vercel's skip-unaffected-project behavior where supported. citeturn0search0
4. Every production project must have a documented owner, repository, root directory, domain set, and rollback candidate.
5. Never delete a duplicate project until domain and environment parity is verified.
6. Never use Vercel project duplication as a substitute for Git branching or application boundaries.

## Current cleanup disposition

**KEEP / PRODUCTION**

- `mindreply`
- `patchtalk`
- `resellerpro-platform`
- `a11k-live-foundation` (after repair)

**REPAIR**

- `a11k-live-foundation`
- `private-opportunity-core`

**CONSOLIDATE / ARCHIVE AFTER DOMAIN VERIFICATION**

- duplicate `resellerpro-platform-*` projects
- duplicate public-site variants
- obsolete MindReply/A11-K experimental deployment surfaces

**DO NOT DELETE YET**

Any project with an unknown domain, unknown environment variables, or an unresolved production dependency remains a migration candidate until evidence is collected.

## Source-of-truth hierarchy

```text
GitHub main
   ↓
Application directory / package
   ↓
Canonical Vercel Project
   ↓
Production deployment
   ↓
Verified custom domain
   ↓
Runtime evidence
```

This hierarchy replaces project-name-based assumptions with evidence-based ownership.