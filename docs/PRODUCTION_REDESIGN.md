# Production Redesign

## Objective

Consolidate the portfolio around a small number of deliberate production boundaries while keeping the GitHub monorepo as the engineering source of truth.

## Canonical boundaries

- `mindreply` — primary MindReply production surface.
- `a11k-live-foundation` — canonical A11-K production surface.
- `patchtalk` — independent product and repository.
- `resellerpro-platform` — canonical ResellerPro production surface.
- Internal control-plane projects remain private and are never used as public product hosts.

## Monorepo rule

One repository may contain many applications and shared packages. A separate Vercel project is justified only when an application requires an independent domain, environment, release lifecycle, scaling boundary, or security boundary.

Do not duplicate a repository merely to obtain another deployment.

## Deployment flow

`GitHub main -> validation -> Vercel preview -> production promotion`

Production domains must only point to a READY deployment. Keep at least one previous READY deployment available as rollback protection until the new deployment has passed smoke tests.

## Build reliability

Database migrations must never be a mandatory side effect of `next build`. Builds should compile and validate application code; migrations are an explicit operational step executed against the intended environment.

Required separation:

- `build` — deterministic application build.
- `db:generate` — generate migration artifacts.
- `db:migrate` — explicitly apply migrations.
- `check` — static validation.
- `test` — application tests.

## Environment model

Secrets remain in Vercel/GitHub environment configuration. Never commit production values to Git. Public configuration may be represented in source; credentials may not.

Use separate Development, Preview and Production values where the service supports environment scoping.

## Vercel project policy

Keep:

- `mindreply`
- `a11k-live-foundation`
- `patchtalk`
- `resellerpro-platform`
- validated revenue products with a real launch requirement

Archive candidates only after domain and environment verification:

- duplicate `resellerpro-platform-*`
- duplicate `mindreply-org-site*`
- duplicate `public-site*`
- temporary validation projects

## Design principle

The architecture should become simpler as the portfolio grows:

`shared code -> deliberate application boundary -> one canonical Vercel project -> one production domain set`

not:

`copy repository -> copy project -> copy domains -> copy deployment configuration`.

## Current blockers

- A11-K has a valid rollback-capable READY deployment but newer Git-connected deployments have failed; diagnose the build before promotion.
- The monorepo currently has no detected `pnpm-lock.yaml`, so `--frozen-lockfile` should not be used until a lockfile is committed.
- The repository contains many GitHub Actions workflows; these should be rationalized into a small set of authoritative validation/deployment workflows rather than multiple overlapping production deployers.
