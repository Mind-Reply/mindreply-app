# MindReply Canonical Application Source

## Current source of truth

The actively maintained production implementation is currently:

- `angellllkr-eng/mind-reply-core`
- default branch: `main`

This organization repository is the public organizational application identity and should not be treated as a production source until it contains the complete validated application.

## Vercel alignment requirement

The production Vercel project serving `mind-reply.com` should ultimately be linked to the validated canonical production repository, not an archived repository or recovery snapshot.

## Migration gate

Before moving production source into this repository:

1. Preserve all working routes and APIs.
2. Copy/migrate application code and tests.
3. Verify environment configuration without exposing secrets.
4. Compare production behavior route-by-route.
5. Run build, test and security checks.
6. Verify `mind-reply.com` against the new deployment.
7. Keep the previous deployment as a rollback candidate.

No repository rename or production source switch should occur until these gates pass.
