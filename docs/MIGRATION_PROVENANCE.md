# MindReply Organisation Migration Provenance

**Recorded:** 2026-09-10  
**Status:** built locally; validation and production cutover pending

## Target

- Repository: `Mind-Reply/mindreply-app`
- Base commit: `9ed42f6a4f89fc45fe639d2dfa9b0f5c488e7bc2`
- Reconciliation branch: `chore/mindreply-app-reconstruction-2026-09-10`

## Source retained for rollback

- Repository: `angellllkr-eng/mind-reply-core`
- Source commit: `8781d29c738b8c9752d9dfb1ec64cec396e7fd64`
- Local audit worktree: `C:\Users\Mindr\MindReply-personal-current`

## Reconciliation evidence

- Latest source inventory: 432 files, excluding Git metadata and generated directories (`node_modules`, `.next`, `dist`, `build`, and `coverage`).
- The older `mind-reply-core-inspect` copy contained no files absent from the latest source; its five divergent files were superseded by the latest source.
- A first-pass scan found no tracked environment files, generated output, private key files, or high-confidence live credential literals.
- Example environment files contained a source-specific Supabase project identifier and publishable key. Both examples were replaced with neutral placeholders before this migration branch can be proposed.

## Explicit exclusions

The source import excluded `.git`, `node_modules`, `.next`, `dist`, `build`, `coverage`, `.turbo`, and local `.env` files. No secrets, deployment settings, payments, DNS, external messages, or production state were changed.

## Required next verification

1. Install dependencies with the required Node and pnpm versions.
2. Run type checks, tests, and builds; resolve all failures.
3. Run a second independent secret scan before commit and before push.
4. Review route, auth, data, payment, and webhook behavior in preview.
5. Create a pull request into `Mind-Reply/mindreply-app` with the exact verification record.
6. Keep the personal source and previous deployment as rollback candidates until owner-approved production cutover succeeds.
