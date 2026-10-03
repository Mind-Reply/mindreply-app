# MindReply Release Verification

Before and after deployment, record:

- `pnpm install` and lockfile result.
- typecheck result.
- lint result.
- unit-test result.
- production-build result.
- route/status checks.
- authentication and authorization checks.
- secret-scan result.
- integration connection state.
- Stripe/webhook test evidence where applicable.
- accessibility smoke checks.
- public-copy verification.
- rollback/disable path.

## Status vocabulary

`DRAFT` means implementation is incomplete.

`READY_FOR_CHECK` means implementation exists and verification is pending.

`VERIFIED` means the named checks were observed against a named commit/deployment.

`LIVE` means the deployment is reachable and the critical path has been checked after deployment.

`UNCONNECTED` means a declared integration cannot currently be verified.

These states are evidence states, not production approval gates. A failed or missing check is recorded and routed for follow-up rather than creating a separate promotion hold.
