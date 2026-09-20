# MindReply Core Monorepo Consolidation

## Objective
Consolidate the MindReply ecosystem into a unified production repository.

## Migration Scope
- 17 repositories inventory and migration
- 42 T-series tasks restored from agent-control-plane archive
- A11 Fleet runtime module
- SMS integration
- Next.js applications
- Python RWA bridge
- Monitoring and watchdog services

## Target Structure

```
apps/
packages/
  a11-fleet/
bridges/
infrastructure/
scripts/
docs/
.github/workflows/
```

## Execution Order

1. Inventory repositories
2. Preserve history during imports
3. Move frontend applications
4. Move Python bridges
5. Restore fleet tasks
6. Enable watchdog monitoring
7. Validate builds and deployments

## Safety Rules

- No secrets committed
- Production changes require review
- Keep rollback path available
- Verify every migration step
