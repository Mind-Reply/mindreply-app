# Frontend E2E Hardening

## Purpose

The canonical frontend lives in `Mind-Reply/mindreply-app`. Frontend changes should be validated with a real browser smoke check before and after deployment.

## Baseline

- Next.js: 16.2.11
- React / React DOM: 19.2.7
- Tailwind CSS: 4.3.2
- Playwright: 1.61.x
- Package manager: pnpm 10.32.1
- Node runtime for CI: Node 24
- Component source: existing shadcn/ui New York system

## Template decision

Keep the existing shadcn/ui New York component source as the production baseline. Do not replace the primitive layer as part of routine dependency upgrades. A future Base UI migration must be isolated, visually tested, and reviewed as a separate change.

## E2E verification

For every frontend-changing PR:

1. Install dependencies with the repository's package-manager contract.
2. Install Chromium for Playwright.
3. Start the frontend through the existing Playwright `webServer` configuration.
4. Run the smoke suite.
5. Upload Playwright reports when failures occur.

## Production verification

E2E results are one evidence input alongside build, security, environment, database, and deployment-health checks. Failed or missing checks are recorded for remediation rather than creating a separate production promotion gate.

## Known repository hygiene rule

Do not introduce Git submodules for product surfaces unless the dependency boundary is deliberate and documented. The canonical monorepo should prefer normal workspace packages or source directories. Stale gitlink/submodule references must be removed through a reviewed PR rather than hidden by CI configuration.
