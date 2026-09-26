# MindReply Production Source Contract

## Canonical implementation

- Repository: `Mind-Reply/mindreply-app`
- Branch: `main`
- Role: active implementation source for the MindReply production platform

## Organizational repository

- `Mind-Reply/mindreply-app` is the organizational application repository.
- It remains non-canonical for production until it contains the validated application and passes the migration gate.

## Vercel requirement

The production Vercel project serving `mind-reply.com` is currently associated with an archived `Mind-Reply/mindreply-app` repository. That association must be changed to a validated active production source before the new microservices can be claimed as live on the custom domain.

## Release rule

A release is considered complete only after:

- GitHub source is verified.
- Build succeeds.
- Runtime checks succeed.
- Required environment configuration is present.
- Production deployment succeeds.
- `mind-reply.com` resolves to that deployment.
- `/api/health`, `/api/ready`, `/api/version`, `/api/services`, `/api/dependencies`, `/api/metrics`, and `/status` are verified.
- Rollback remains available.
