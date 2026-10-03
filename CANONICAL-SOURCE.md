# MindReply Production Source Contract

## Canonical implementation

- Repository: `Mind-Reply/mindreply-app`
- Branch: `main`
- Role: active implementation source for the MindReply production platform

## Organizational repository

- `Mind-Reply/mindreply-app` is the organizational application repository.
- It is the canonical implementation source; live status is established by deployment and runtime evidence, not by a separate migration gate.

## Vercel requirement

The production Vercel project serving `mind-reply.com` is currently associated with an archived `Mind-Reply/mindreply-app` repository. That association must be changed to the validated active production source before the new microservices can be claimed as live on the custom domain.

## Continuous release verification

For each release, record:

- GitHub source and commit.
- Build result.
- Runtime checks.
- Required environment configuration state.
- Deployment result.
- `mind-reply.com` resolution.
- `/api/health`, `/api/ready`, `/api/version`, `/api/services`, `/api/dependencies`, `/api/metrics`, and `/status` observations.
- Rollback availability.

These are evidence records for the actual deployment state. Missing or failed evidence is a remediation item rather than a repository-level production promotion lock.
