# Frontend E2E Hardening

## Purpose

The canonical frontend lives in `mind-reply-core`. Frontend changes must be validated with a real browser smoke gate before merge or production release.

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

## Required E2E gate

Every frontend-changing PR should:

1. Install dependencies with the repository's package-manager contract.
2. Install Chromium for Playwright.
3. Start the frontend through the existing Playwright `webServer` configuration.
4. Run the smoke suite.
5. Upload Playwright reports when failures occur.

## Production safety

E2E success is necessary but not sufficient for production deployment. Production deployment must additionally pass build, security, environment, database, and deployment-health checks.

## Known repository hygiene rule

Do not introduce Git submodules for product surfaces unless the dependency boundary is deliberate and documented. The canonical monorepo should prefer normal workspace packages or source directories. Stale gitlink/submodule references must be removed through a reviewed PR rather than hidden by CI configuration.
