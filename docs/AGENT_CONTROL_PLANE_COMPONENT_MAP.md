# Agent Control Plane → A11 Fleet Migration Map

## Purpose

This document defines the controlled migration path from `agent-control-plane` into `mind-reply-core`.

## Source Preservation

The original repository remains the historical source of truth until validation is complete.

## Target Mapping

| Source Capability | A11 Fleet Destination |
|---|---|
| Agent runtime | packages/a11-fleet/agents |
| Workflow engine | packages/a11-fleet/orchestration |
| Task definitions | packages/a11-fleet/tasks |
| Monitoring services | packages/a11-fleet/monitoring |
| Events/messages | packages/a11-fleet/communication |
| Legacy modules | packages/a11-fleet/archive |
| Shared configuration | packages/a11-fleet/config |

## T-Series Migration

Target structure:

```
packages/a11-fleet/tasks/
├── T001/
├── T002/
├── ...
└── T042/
```

Each task should expose:

- metadata
- owner agent
- execution contract
- health status
- logs
- rollback information

## Validation Gates

Before merge:

- source inventory completed
- dependencies reviewed
- secrets removed
- tests passing
- runtime checks completed
- rollback path documented
