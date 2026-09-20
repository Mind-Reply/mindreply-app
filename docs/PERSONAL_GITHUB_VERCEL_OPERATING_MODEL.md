# Personal GitHub ↔ Vercel Operating Model

## Objective

Reduce the current project sprawl into a small number of high-quality production platforms while preserving useful source code, domains, environments, rollback paths and experiments.

## Canonical production platforms

1. MindReply — business automation / digital operations
2. ResellerPro — reseller sourcing and intelligence
3. A11-K — AI/developer platform
4. PatchTalk — conversational and voice AI
5. Aurel — independent product/brand
6. Revenue/Sales Platform — consolidated validated revenue products
7. Automation/Tools Platform — consolidated validated utilities

Brushworks remains paused pending explicit brand/IP verification.

## Source-of-truth rules

- GitHub is the source of truth for application source, configuration and version history.
- Vercel is the deployment/runtime layer.
- Supabase is the data layer only after the canonical production database is identified and verified.
- Zapier/n8n are automation layers and must not become hidden sources of application logic.
- No production-only code should exist solely inside a manually configured Vercel project.

## Vercel policy

Create or retain a Vercel project only when at least one is true:
- independent production domain/lifecycle;
- materially different security boundary;
- independently scalable application;
- independent deployment cadence;
- required platform isolation.

Do not create a Vercel project merely for a page, campaign, experiment, or SEO route.

## Repository policy

Keep the personal GitHub repositories as source archives until migration is verified. Do not delete repositories as part of consolidation.

For each legacy repository, classify:
- CANONICAL — production source
- ABSORB — useful code/content migrated into a canonical platform
- INTERNAL — operational/private source
- EXPERIMENT — retained but not production
- ARCHIVE — preserved but no longer maintained
- PAUSE — requires legal/IP/product decision

## Page architecture

Each canonical platform should contain roughly 10–30 substantive pages only where justified by distinct user/search intent. Pages must provide real value: product capability, tool, solution, use case, industry workflow, comparison, guide, documentation, research, case study, pricing or conversion.

No doorway pages, keyword-only variants, empty templates or duplicate city/topic pages.

## Required production gates

Before retiring or merging a Vercel project:
1. inventory custom domains;
2. inventory environment variables/secrets without exposing values;
3. identify current production deployment;
4. verify GitHub repository and branch;
5. verify DNS/canonical URLs;
6. verify redirects;
7. verify forms/auth/payments/integrations;
8. preserve rollback deployment;
9. deploy canonical replacement;
10. smoke test;
11. only then archive the legacy project.

## Build standard

Every canonical application must have:
- deterministic package manager and lockfile;
- reproducible production build;
- no database migrations as an implicit build side effect;
- environment validation;
- lint/typecheck/build checks;
- health/smoke checks;
- preview and production separation;
- documented rollback.

## SEO/search standard

Optimize for qualified users and demonstrated usefulness rather than URL count. Use original information, first-hand product evidence, clear authorship/company information, strong internal linking, crawlable content, accurate metadata/canonicals and structured data only when eligible.

## Execution sequence

### Phase 1 — Inventory
Map every personal GitHub repository to every Vercel project, deployment, domain and intended platform.

### Phase 2 — Canonicalization
Select one source and one Vercel project per production platform.

### Phase 3 — Absorption
Move reusable application code/components/content into canonical platform applications without deleting source repositories.

### Phase 4 — Production hardening
Repair builds, lockfiles, migrations, environment validation, CI and deployment workflows.

### Phase 5 — Domain migration
Move/redirect domains only after production replacement is verified.

### Phase 6 — Retirement
Archive duplicate/empty Vercel projects and repositories only after all safety gates pass.

## Success criteria

- 5–7 canonical production platforms
- 10–30 substantive pages per platform where justified
- no duplicate production projects
- every production deployment traceable to GitHub
- domains mapped to canonical projects
- deterministic builds
- reproducible rollback
- shared packages for common UI/auth/analytics/SEO/observability/billing
- measurable product usage and conversion
