# A11 Design Audit — Evidence Console

## Decision

Replace the current generic card-grid monitor pattern with an **Evidence Console**: a dense, editorial operational surface where status, evidence, exceptions, and next actions are spatially related.

This is deliberately not a generic SaaS dashboard.

## Why

The existing visual contract already establishes a distinctive A11 language: archival parchment, ink, brass, coral, DM Serif Display, Manrope, and IBM Plex Mono. Preserve that identity rather than introducing gradients, stock imagery, or generic dashboard chrome.

The current Monitor page has useful truth boundaries but presents them as six independent cards plus instructions. That forces the operator to reconstruct priority mentally.

## Highest-priority UX problems

1. **Priority is flat.** Sites, money, progress, agents, style, and infrastructure receive similar visual weight.
2. **Evidence is separated from status.** A status statement does not immediately expose its evidence path.
3. **Next action is buried.** The operator has to read instructions after scanning the cards.
4. **The surface is explanatory before operational.** The "How to use this" block consumes prime space before the system state.
5. **No temporal model.** The page does not show what changed most recently or what is stale.
6. **No exception-first behavior.** A blocked or waiting item should rise above healthy background state.
7. **No command layer.** Frequent owner actions are described but not organized as a compact action surface.

## Redesign directions evaluated

### A — Evidence Console (selected)
A command-and-evidence interface. Current state dominates; every claim has a visible evidence affordance; exceptions rise automatically; action queue is compact and explicit.

### B — Editorial Ledger
A publication-like chronological interface where each product state is a dated record. Strong for trust and provenance, weaker for rapid operational scanning.

### C — Mission Graph
A spatial dependency graph connecting domains, deployments, products, evidence and actions. Powerful for systems thinking, but too visually expensive for the primary daily surface.

## Selected architecture

- **Rail:** identity, primary sections, environment marker.
- **Command strip:** current system posture + explicit owner actions.
- **Signal matrix:** compact rows rather than decorative cards.
- **Evidence column:** last verified source, timestamp/state, and direct link.
- **Exception queue:** only items requiring attention.
- **Activity stream:** recent changes with provenance.
- **Deep infrastructure:** collapsed by default; never competes with revenue or public-site health.

## Interaction principles

- Evidence before adjectives.
- Exceptions before healthy noise.
- One primary action per state.
- Progressive disclosure for infrastructure.
- No autonomous-spend implication.
- Mobile becomes a stacked command/evidence sequence, not a shrunken desktop grid.

## Acceptance criteria

- First viewport communicates overall posture in under five seconds.
- Every operational claim has a direct evidence path or is explicitly marked as a source-level state.
- The next owner action is visible without reading a long instruction block.
- Healthy items occupy less visual weight than exceptions.
- Existing A11 visual tokens remain intact.
- No stock imagery, synthetic staff imagery, trend gradients, or generic analytics decoration.
- No production deployment is claimed from this branch until the resulting live URL is HTTP-verified.
