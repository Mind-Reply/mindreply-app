# Agent Control Plane Migration Map

## Source

Repository:
- angellllkr-eng/agent-control-plane

Purpose:
Preserve the existing control plane as the historical source while migrating reusable capabilities into mind-reply-core.

## Target

```
mind-reply-core/
└── packages/
    └── a11-fleet/
        ├── control-plane/
        ├── agents/
        ├── orchestration/
        ├── monitoring/
        ├── tasks/
        ├── communication/
        └── archive/
```

## Migration Phases

### Phase 1 - Inventory

- Map existing services
- Identify agents
- Identify workflows
- Identify T-series tasks
- Document dependencies

### Phase 2 - Extraction

Move reusable components into:

- Agent registry
- Task engine
- Scheduler
- Monitoring
- Communication layer

### Phase 3 - Validation

Checks:

- Task parity
- Runtime compatibility
- Security review
- Deployment validation

### Phase 4 - Archive

Keep original repository unchanged until migration is verified.

## T-Series Tracking

Expected migration source:

- T001-T042

Status:

- Discovery: pending
- Extraction: pending
- Validation: pending
- Complete: pending
