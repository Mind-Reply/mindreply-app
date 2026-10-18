# Syndication automation: safe preflight

## Current behavior

The scheduled GitHub Actions workflow validates that the Cision and PR.co manifest files exist, parse as JSON objects, and explicitly keep external dispatch/publication disabled. It runs weekdays at 06:23 UTC and can also be started manually. It does **not** make external network calls, read API secrets, publish newsroom content, dispatch a wire release, or incur distribution fees.

## Why live dispatch is not enabled

The endpoint URLs and authentication headers in the proposed shell script have not been verified against the user's vendor accounts. PR.co's public API documentation describes read-only newsroom data access; a write endpoint such as `/v1/newsroom/publish` must not be assumed to exist or be supported. Cision account-specific API access, request schema, fees, and sandbox behavior also need confirmation.

## Enablement checklist

1. Obtain account-specific API documentation and written confirmation of supported endpoints from Cision and PR.co.
2. Confirm request payload schemas and test/sandbox credentials.
3. Build vendor-specific integration tests using only test accounts and non-public draft content.
4. Store credentials as GitHub Actions secrets or a dedicated secret manager; never commit secrets or print authorization headers.
5. Add idempotency, duplicate-dispatch protection, audit logging, redacted error handling, and bounded retries appropriate to each vendor.
6. Require an explicit production approval gate before enabling paid wire dispatch or public publication.
7. Verify a successful test delivery and confirm billing/fulfilment behavior before enabling any production route.

The manifest files currently included in the repository are intentionally marked as drafts with dispatch/publication disabled. Their endpoint values are unverified placeholders and are not evidence that an integration is operational.
