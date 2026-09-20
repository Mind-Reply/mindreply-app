# Four-engine isolation model

## Trust boundaries

| Engine | Allowed data | Dedicated identity | Default outbound access |
|---|---|---|---|
| Profit | bounded commercial inputs and verified payment state | `profit-runtime` | Stripe verification and approved business APIs only |
| Message Refiner | text explicitly submitted for refinement | `refiner-runtime` | none unless a user-authorized delivery action is invoked |
| Assistant | task-scoped context | `assistant-runtime` | allowlisted tools through policy gateway |
| Mail | selected mailbox messages and user-authorized actions | `mail-runtime` | mail provider only |

## Mandatory controls

1. Separate service accounts, secrets, databases and encryption keys.
2. Default-deny service-to-service policy; allow routes individually.
3. Short-lived credentials where supported; no shared `.env` bundle.
4. Structured audit event for every cross-engine request.
5. No raw mail body or personal data in logs, traces, analytics, prompt caches or
   model-training stores.
6. Shadow testing uses synthetic or irreversibly de-identified fixtures by
   default. Production mirroring requires explicit privacy and security approval.
7. Compromise test: revoke one engine's identity and verify the others continue
   without exposing data or secrets.

## Two-hour tuning sprint

- 0–20 min: inventory identities, secrets, stores and outbound domains.
- 20–50 min: draw actual routes and mark undocumented flows.
- 50–90 min: remove one shared secret and one unnecessary route.
- 90–110 min: run negative-access tests.
- 110–120 min: record evidence and the next smallest isolation change.

## Rollback

1. Revert policy changes to the last reviewed version.
2. Revoke newly issued credentials and restore prior scoped identities.
3. Disable the affected route while preserving audit records and unaffected
   engine availability.
