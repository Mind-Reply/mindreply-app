# WT-002 — MindReply Release Findings

**Review mode:** static, read-only source review  
**Reviewed branch base:** `main` commit `508e0adf13ef7b9f09200447d57ef665b68f4cd6`  
**Evidence:** [README](https://github.com/Mind-Reply/mindreply-app/blob/ops/wt-002-mindreply-release-audit/README.md), [package.json](https://github.com/Mind-Reply/mindreply-app/blob/ops/wt-002-mindreply-release-audit/package.json), [Next config](https://github.com/Mind-Reply/mindreply-app/blob/ops/wt-002-mindreply-release-audit/next.config.ts), [department operations](https://github.com/Mind-Reply/mindreply-app/blob/ops/wt-002-mindreply-release-audit/docs/CREATOR_RECRUITMENT_PR_EVENTS_OPERATIONS.md)

## Findings

| Finding | Evidence | Risk | Owner | Next action | Status |
|---|---|---|---|---|---|
| Repository README identifies this as canonical MindReply product root and names Cloudflare/ResellerPro as intended infrastructure. | README canonical boundaries and deployment direction. | Low | Product owner | Preserve single-source governance. | VERIFIED |
| Package manifest includes Vercel-specific runtime/analytics/blob/function/OTel dependencies while README says Vercel is legacy and Cloudflare/ResellerPro is intended. | `package.json` dependencies. | Medium: dependencies may be unused, legacy, or still operationally required. | MindReply engineering owner | Trace each package import and deployment use before any removal/migration. | CONTINUE |
| Next config uses a localhost fallback for `NEXT_PUBLIC_API_URL` in an API rewrite. | `next.config.ts`, `afterFiles` rewrite. | Medium: production behavior may route incorrectly if variable is absent. | MindReply engineering owner | Confirm production variable is required by validation and test the built route mapping. | CONTINUE |
| Package scripts expose build, typecheck-like task, Playwright tests, and Drizzle migration commands; `build:with-migrations` and `db:push` are consequential if run against a live DB. | `package.json`. | High if migration commands run without environment isolation. | Database owner | Keep all DB verification synthetic/local until a separately approved migration plan exists. | VERIFIED |
| Expected CI file `.github/workflows/ci.yml` was not found at that exact path. | GitHub file lookup returned 404 for that path. | Unknown; workflow may use another filename or path. | Repo maintainer | Enumerate `.github/workflows` and identify the authoritative validation workflow. | CONTINUE |
| README requires payment and revenue evidence, but this source review does not contain current transaction or settlement evidence. | README release truth and commercial discipline. | High if offers or forecasts are described as collected revenue. | Finance owner | Reconcile Stripe events/invoices/payouts read-only before any revenue claim. | CONTRIBUTION |

## Review limit

No package installation, build, tests, database migration, Stripe query, deployment or customer contact was performed. Static findings only.
