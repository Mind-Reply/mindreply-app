# Modern frontend baseline

The production frontend baseline is intentionally conservative and current rather than chasing preview releases:

- Next.js 16.2.11 (security-patched Active LTS)
- React 19.2.7
- Tailwind CSS 4.3.x
- shadcn/ui New York style with the existing local component source
- Lucide icons
- Playwright E2E smoke coverage
- Node.js 20+ and pnpm 10.32.1

Why this baseline: Next.js 16.2.11 is the current Active LTS security patch identified by the official Next.js security release; Next.js 16.3 remains a newer feature/preview track and is not required for the production baseline. shadcn/ui's current workflow supports modern component generation and Base UI, while this repository retains its existing component implementation until a deliberate component migration is tested.

## E2E contract

Every frontend change touching the application shell, components, routing, or runtime dependencies should pass the Playwright smoke test before merge. The workflow installs a real Chromium browser and publishes the Playwright report as a CI artifact.
