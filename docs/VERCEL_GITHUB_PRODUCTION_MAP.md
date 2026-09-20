# Vercel ↔ GitHub Production Map

## Source of truth

GitHub `angellllkr-eng/mind-reply-core` is the canonical source for the MindReply/A11-K monorepo. Vercel is the deployment layer. Production projects must remain Git-connected and deploy from `main`.

Vercel supports multiple projects from one monorepo; each project should represent a deliberate deployable application with an explicit Root Directory and selective builds where appropriate.

## Canonical projects

| Product | Canonical Vercel project | GitHub source | Status | Rule |
|---|---|---|---|---|
| MindReply | `mindreply` | `angellllkr-eng/mind-reply-core` | READY | Preserve production domains |
| A11-K Foundation | `a11k-live-foundation` | `angellllkr-eng/mind-reply-core` | Repair/redeploy | Canonical A11-K deployment target |
| PatchTalk | `patchtalk` | `angellllkr-eng/patchtalk` | READY | Preserve as independent product |
| Private Opportunity Core | `private-opportunity-core` | Git-connected | Repair | Internal/private only |
| ResellerPro | `resellerpro-platform` | Canonical ResellerPro repository | Consolidate | All duplicate projects are migration candidates |

## Monorepo applications

The repository currently contains deployable application areas including:

- `apps/a11k`
- `apps/a11k-chat`
- `apps/a11k-forge`
- `apps/a11k-nexus`
- `apps/a11k-sites`
- `apps/a11k-studio`
- `apps/experimental`
- `apps/mindreply-ios`
- `apps/own-registrar`
- `apps/web-replycontrol`

These are not automatically separate production products. A Vercel project is created only when an application needs an independent deployment, domain, environment, or release lifecycle.

## Consolidation policy

### Keep

- `mindreply`
- `patchtalk`
- `a11k-live-foundation`
- `resellerpro-platform`
- validated revenue products with a real production domain or explicit launch plan

### Repair

- `a11k-live-foundation`
- `private-opportunity-core`
- any canonical project whose latest Git deployment fails

### Archive candidates

- duplicate `resellerpro-platform-*` projects
- duplicate `mindreply-org-site*` projects
- duplicate `public-site*` projects
- temporary validation/surface projects after domain and environment verification

## Safety gates

1. Never delete a Vercel project while it owns a production custom domain.
2. Never move a domain until the replacement deployment is READY.
3. Never copy production secrets into GitHub.
4. Never force-push `main` during consolidation.
5. Preserve rollback-capable READY deployments until the replacement is verified.
6. Keep Vercel project settings as deployment configuration; keep application architecture in GitHub.
7. For monorepo projects, use Root Directory and selective/filtered builds rather than duplicating repositories.

## Target architecture

```text
GitHub
└── mind-reply-core
    ├── apps/
    │   ├── a11k
    │   ├── a11k-chat
    │   ├── a11k-forge
    │   ├── a11k-nexus
    │   ├── a11k-sites
    │   ├── a11k-studio
    │   ├── web-replycontrol
    │   └── own-registrar
    └── packages/

                 ↓ Git-connected deployments

Vercel
├── mindreply
├── a11k-live-foundation
├── resellerpro-platform
└── internal/validated product projects
```

## Current verified production anchors

- `mindreply`: latest production deployment READY; domains include `mind-reply.com`.
- `patchtalk`: latest production deployment READY.
- `a11k-live-foundation`: latest deployment currently failing after Git-connected configuration commits; earlier READY deployments remain rollback candidates.

## Next operational step

Repair canonical builds first, then verify domains and environment bindings, then archive duplicate Vercel projects through the Vercel dashboard/API where project-management permissions are available.
