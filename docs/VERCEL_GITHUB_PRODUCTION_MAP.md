# Vercel ↔ GitHub Production Map

## Source of truth

GitHub `Mind-Reply/mindreply-app` is the canonical MindReply application source. Vercel is the deployment layer. The canonical website must deploy from this repository's `main` branch.

Vercel projects should represent deliberate deployable applications with an explicit Root Directory and deployment configuration.

## Canonical MindReply website

| Product | Vercel project | GitHub source | Current evidence |
|---|---|---|---|
| MindReply main site | `mindreply` | `Mind-Reply/mindreply-app` | Project/domain association requires live verification |
| A11-K Foundation | `a11k-live-foundation` | verify current canonical source before claiming live | Deployment requires current verification |
| PatchTalk | `patchtalk` | `angellllkr-eng/patchtalk` | Independent product; verify current deployment |
| ResellerPro | `resellerpro-platform` | canonical ResellerPro repository | Separate product surface |

## Main-site verification contract

A source change is **changed** when committed to `Mind-Reply/mindreply-app/main`.

A site is **live** only when the production domain serves that source and runtime verification confirms the expected surface. A stale domain, failed deployment, or mismatched Git source is evidence for remediation; it is not a repository-level production promotion gate.

For MindReply, verify at minimum:

- GitHub source: `Mind-Reply/mindreply-app`
- branch: `main`
- Vercel project: `mindreply`
- production domain: `mind-reply.com`
- expected public routes: `/`, `/services`, `/regions`
- runtime/content verification against the current Git commit

## Monorepo/application note

Other applications in the repository are not automatically separate production products. Create or retain a separate Vercel project only when an application needs an independent deployment, domain, environment, or lifecycle.

## Safety and continuity controls

These are operational safety controls, not generic release-promotion gates:

1. Do not delete a Vercel project while it owns a production custom domain.
2. Do not move a production domain until a replacement deployment is verified.
3. Never copy production secrets into GitHub.
4. Never force-push `main` during consolidation.
5. Preserve a rollback-capable deployment until replacement runtime verification succeeds.
6. Keep Vercel deployment configuration separate from application architecture in GitHub.
7. Use Root Directory and selective/filtered builds for monorepo projects rather than duplicating repositories.

## Current evidence state

The GitHub source has been updated. The public domain is reachable, but the current conversation does not contain evidence that `mind-reply.com` is serving the newest `Mind-Reply/mindreply-app/main` commit. Do not describe the main site as updated/live until that runtime check succeeds.

The Vercel account currently requires re-authentication for the `mind-reply-s-projects` scope, so project/deployment inspection cannot be treated as verified through the connected Vercel account until access is restored.

## Next

Re-authenticate the Vercel `mind-reply-s-projects` scope, then inspect `mindreply`, its latest production deployment, domain association, and Git source. Deploy the current `main` when the project is correctly connected, then verify `https://mind-reply.com` and the public routes before marking the site live.
