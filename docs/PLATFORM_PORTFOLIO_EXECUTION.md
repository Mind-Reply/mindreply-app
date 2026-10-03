# Platform Portfolio Execution

Status: ACTIVE
Owner: A.K.
Source of truth: `Mind-Reply/mindreply-app`

## Objective

Replace the thin-site factory with a small portfolio of substantive digital platforms. Existing repositories and Vercel projects are treated as source material and deployment surfaces, not as reasons to create additional sites.

## Canonical platforms

1. MindReply — business automation and customer-communication platform.
2. ResellerPro — reseller sourcing/deal intelligence platform.
3. A11-K — advanced AI/agent platform and technical flagship.
4. PatchTalk — conversational/voice product.
5. Aurel — independent product/brand surface.
6. Revenue/Sales — consolidated commercial-product family from DealForge, LeadRevive, RevenuePulse, MarginPilot, LeadAtlas and related validated work.
7. Automation/Tools — consolidated utility/product family from validated tools such as UptimePilot, IntentRank, AuditForge, DocParse and CloudTrim.

## Page strategy

Each platform earns pages through user value, not page count. Initial target: 10–30 substantive pages per platform, expanding only when a page has a distinct product, use case, tool, documentation, research, comparison, case-study or conversion purpose.

Every public page should have:
- one clear search/user intent;
- original or first-hand useful information;
- a meaningful action or next step;
- internal links to related high-value pages;
- accurate metadata and canonical URL;
- accessible mobile-first UX;
- structured data only where semantically appropriate;
- measurable conversion/engagement event where relevant.

## Shared architecture

`apps/` contains deployable applications. Shared UI, auth, data, AI, billing and platform utilities belong in `packages/`. Platform-specific content and routes stay with their owning app.

Existing A11-K application surfaces are retained as capabilities and consolidated behind the A11-K platform rather than exposed as unrelated sites: `a11k`, `a11k-chat`, `a11k-forge`, `a11k-nexus`, `a11k-sites`, `a11k-studio`, `own-registrar`, and `web-replycontrol`.

## Vercel deployment policy

- One canonical Vercel project per independently operated production application.
- Multiple Vercel projects may share this monorepo when they need separate domains, environments, releases or access boundaries.
- Set each Vercel project's Root Directory to its owning app.
- Do not create a Vercel project for a page.
- Do not create a second project when a route can belong to an existing platform.
- Preserve production domains until a verified replacement is live.
- Keep preview deployments enabled for safe validation.

## GitHub policy

- `main` is the production source of truth.
- Product changes should be committed in small, reviewable units.
- Legacy repositories remain read-only/source material until migration is verified.
- No source repository is deleted as part of consolidation without a migration record and rollback path.
- Shared packages must remain dependency-clean and version-consistent.

## Consolidation decisions

### KEEP / CANONICAL
- MindReply
- ResellerPro canonical project/repository
- A11-K core/surface architecture
- PatchTalk
- Aurel
- Internal owner/control-plane capabilities

### ABSORB
- Duplicate ResellerPro implementations
- Duplicate MindReply public-site implementations
- Duplicate public-site implementations
- Revenue/sales micro-products that share the same buyer/problem
- Automation/tool micro-products that share the same buyer/problem

### PAUSE
- Brushworks until ownership/trademark positioning is resolved
- Unvalidated SEO-only surfaces
- Temporary proxy/validation deployments

### ARCHIVE AFTER VERIFICATION
- Empty/obsolete Vercel projects
- Superseded site experiments
- Duplicate deployment shells

## Continuous verification

When consolidating a legacy project, record the canonical source, domain/DNS mapping, environment inventory, deployment identifier, critical-route smoke results, recovery path, active automation dependencies, and migration record.

These are evidence fields, not a production promotion gate. Missing evidence is recorded as `UNVERIFIED` or `REMEDIATION_REQUIRED`.

## Build and release verification

During and after deployment, record:
- install is deterministic with the repository lockfile;
- typecheck/lint/build pass;
- database migrations are not an accidental side effect of the application build;
- secrets are never committed;
- preview deployment is tested;
- production smoke tests pass;
- monitoring/error visibility is confirmed.

## Success metric

The portfolio is successful when a user can reach a complete, fast, trustworthy solution from one canonical platform without encountering thin duplicate sites, dead projects, inconsistent branding or competing URLs for the same capability.
