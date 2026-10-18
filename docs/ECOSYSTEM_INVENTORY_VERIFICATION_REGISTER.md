# Ecosystem Inventory & Verification Register

**Status:** Inventory drafted; external claims are not independently verified by this document.
**Review date:** 2026-10-18
**Purpose:** Evidence-led register of named properties, infrastructure, and external dependencies. This file is documentation only; it does not activate integrations, move funds, publish media, change DNS, or deploy any property.

## Evidence rules
- VERIFIED means an authoritative live system response was inspected during this review.
- REPORTED — UNVERIFIED means the supplied inventory states this, but supporting evidence was not inspected.
- NOT CHECKED means no live check was performed.
- Do not publish financial balances, account rates, property ownership, shipment/security compliance, media-dispatch, or production-availability claims without current source evidence.
- Never commit passwords, service-role keys, access tokens, private keys, bank credentials, or credential-bearing access cards. Store secrets in provider secret managers and rotate any exposed secret.

## 1. Web properties and products

| Property | Supplied purpose | Review status / next evidence |
|---|---|---|
| MindReply — https://mind-reply.com | SaaS/product and campaign channel | REPORTED — UNVERIFIED here. Verify DNS/HTTP, release commit, conversion paths, and deployment provider independently. |
| AKV Transport — https://akv-transport.co.uk | UK logistics and commercial transport | NOT CHECKED. Verify domain control, site response, business authorization, and revenue/asset claims before use. |
| Sofia Tech Register Portal (SofiaTechRegisterWebsite.jsx) | Registry interface and telemetry | REPORTED — UNVERIFIED. Locate source and deployment record; test telemetry end-to-end. |
| APEX Web Vanguard (apex-web-vanguard-live-telemetry-v1.json) | Web/infrastructure probes | REPORTED — UNVERIFIED. Inspect manifest, endpoint allowlist, probe history, alert destinations, and latest successful run. |

## 2. Supabase and database infrastructure

- Project reference supplied: aziwdgndohdgnwztpwdi.
- VERIFIED: Supabase management API reports project MindR in eu-west-1, status ACTIVE_HEALTHY, PostgreSQL 17.6.
- VERIFIED: Migration history exists through 20261018102858_harden_ledger_mutation_function_search_path_and_execute_grants at review time.
- VERIFIED: The management API lists active Edge Functions including stripe-webhook, sovereign-sweep-worker, treasury-hmac-verify, and sovereign-treasury-summary. This proves management-plane status, not successful end-to-end operation.
- VERIFIED: A read-only PostgreSQL catalog query returned no objects in schemas named treasury_ledger or distressed_pipeline. The supplied schema names do not currently match the inspected database catalog.
- VERIFIED: pg_net 0.20.3 and pg_cron 1.6.4 are installed. NOT VERIFIED: the claimed sweep triggers/jobs; inspect cron/job records, trigger definitions, and recent execution logs before asserting they run.
- Supplied database host: db.aziwdgndohdgnwztpwdi.supabase.co:5432. Never commit connection strings containing credentials.
- Auth JWKS path supplied: /auth/v1/.well-known/jwks.json. Verify the project API URL and endpoint response; endpoint existence alone does not prove correct authorization.

### Supabase security findings observed 2026-10-18

- WARN: Leaked-password protection is disabled. Review Auth password-security settings and enable if compatible with the sign-in policy.
- INFO: RLS is enabled without policies on seven reported tables: private.halo_power_manifest_items, private.halo_power_manifests, public.inquiries, public.journal_entries, public.journal_lines, public.ledger_accounts, and public.stripe_issuing_transactions.
- Do not blindly add permissive policies. Determine whether each table should be owner-scoped, service-role-only, or intentionally inaccessible to client roles. Validate grants and policies, then re-run security advisors.
- PERFORMANCE INFO: Advisors reported unindexed foreign keys, including references in control_plane.assistant_mode_runs, public.Shipment, public.a11_agent_messages, public.a11_research_runs, public.a11_worker_heartbeats, and ledger tables. Review query patterns and add targeted indexes in a reviewed migration; do not drop indexes solely because usage is currently low.
- Review the full advisor output in Supabase; this is a summary, not an exhaustive report.

## 3. Media, wire distribution, and PR

| System / manifest | Status / required evidence |
|---|---|
| PR.co (prco-newsroom-config-v1.json) | REPORTED — UNVERIFIED. Confirm workspace, API configuration, draft/publish permissions, and a successful test draft. No publishing was performed. |
| Cision (cision-global-wire-dispatch-v1.json) | REPORTED — UNVERIFIED. Confirm account/subscription, destination, approval and spend controls, and dispatch receipts. No wire was dispatched. |
| Multi-wire (expanded-wire-distribution-v2.json) | REPORTED — UNVERIFIED. Review regions, recipients, duplicate suppression, consent, approvals, and provider receipts. |
| Sentiment/SOV (media-sentiment-sov-tracking-config.json) | REPORTED — UNVERIFIED. Confirm source coverage, collection permissions, attribution, and freshness before publishing metrics. |

## 4. Banking, treasury, and clearing

- Monzo/SEPA ping manifest (monzo-sepa-clearing-ping-verification-v2.json): REPORTED — UNVERIFIED. A successful ping would not establish clearing capability, settlement, account ownership, or available funds.
- Savings rates (Tipton 4.25%, Kent Reliance 4.15%, Happen 4.00%): REPORTED — UNVERIFIED and time-sensitive. Re-check official product terms, eligibility, access limits, and rate dates.
- Claimed €818,000 liquidity backing (sovereign-liquidity-proofs-executive-summary.pdf): NOT VERIFIED. Do not represent this balance as verified without current statements/custodian evidence and reconciliation. Keep sensitive financial evidence private.
- No bank connection, transfer, payout, allocation, or clearing action was performed by this review.

## 5. Physical logistics and real-estate evidence

- Druzhba 2 logistics hub, ISO 17712 seal process, and hardware receipts: REPORTED — UNVERIFIED. Inspect the checklist and receipts, identify issuer/date, and verify chain-of-custody evidence before claiming compliance or receipt.
- Sofia land conveyancing binder/statutory declarations: REPORTED — UNVERIFIED. Confirm documents with authorized legal/cadastre sources and qualified counsel. Do not publish personal or title-sensitive records.
- The PDFs and JSON manifests were referenced by name but were not attached for this review; their contents have not been inspected.

## 6. Safe implementation sequence

1. Locate named manifests and documents in authorized private storage; do not copy sensitive documents into this repository.
2. Produce a source-of-truth map for each property: owner, canonical repository, deployment provider, domain/DNS, production URL, environment-secret owner, last verified commit, and rollback path.
3. Run read-only endpoint and configuration checks first; retain timestamped outputs with secrets redacted.
4. Remediate Supabase table access intentionally, review auth settings, add only justified indexes, and re-run security/performance advisors.
5. Test telemetry with synthetic events and test destinations. Require owner approval before external PR publication, wire dispatch, financial action, or public claims.
6. Record each release with commit SHA, deployment ID, smoke-test result, and rollback reference.

## Scope statement

This register does not assert that all listed properties, accounts, documents, integrations, balances, or workflows are active. It records supplied claims and the limited live Supabase management-plane checks described above. No production deployment or external dispatch is implied.
