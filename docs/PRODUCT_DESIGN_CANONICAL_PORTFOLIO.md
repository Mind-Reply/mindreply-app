# Canonical Portfolio Product Design

Status: PROPOSED / READY FOR IMPLEMENTATION
Issue: #83

## Product principle

The portfolio should feel like one coherent product ecosystem, not a collection of generated sites. Users should understand **what they can accomplish** before they need to understand internal architecture.

## Direction A — Command Surface

A premium operating surface centered on one primary action and a live portfolio state. Navigation is organized around **Work, Products, Evidence, and Control**. Technical details appear progressively in contextual panels.

Best for: owner/operator workflows, trust, dense information.

## Direction B — Product Atlas

A visual portfolio where each canonical platform is treated as a destination with a clear job-to-be-done, proof, capabilities and conversion path. Shared navigation keeps the ecosystem coherent while allowing each brand to retain its identity.

Best for: discovery, commercial positioning, public-facing portfolio clarity.

## Direction C — Conversation First

The primary interaction is a guided conversational workspace. Users can state an outcome, then the interface routes them into the relevant product, workflow or evidence surface. Traditional navigation remains available but secondary.

Best for: advanced agent workflows and future extensibility.

## Recommended direction

**A + B hybrid: Command Surface for private/operational experiences, Product Atlas for public/product discovery.**

This avoids the common failure mode of exposing internal architecture as the public information architecture.

## Canonical information architecture

### Public
- Home
- Products
- Product detail
- Solutions / use cases
- Proof / results
- Resources
- About
- Contact / start

### Product workspace
- Overview
- Active work
- Projects / assets
- Activity
- Evidence
- Settings

### Owner/control
- Portfolio
- Production health
- Deployments
- Domains
- Integrations
- Revenue
- Approvals
- Audit trail

## Design system baseline

- Mobile-first responsive layout.
- Strong typographic hierarchy; avoid dashboard-card overload.
- Restrained surface system with clear elevation and grouping.
- One primary action per context.
- Status uses text + icon + state, never color alone.
- Progressive disclosure for technical details.
- Consistent focus, keyboard and screen-reader states.
- Shared primitives across canonical platforms; brand-specific styling only where it improves product identity.
- No page exists solely to increase page count or SEO surface area.

## UX acceptance criteria

A redesign is acceptable only when:

1. A new visitor can identify the primary value proposition immediately.
2. A returning user can reach a frequent task in two or fewer navigation decisions.
3. Product, proof and action are connected rather than isolated pages.
4. Internal architecture does not leak into public navigation unnecessarily.
5. Mobile and desktop preserve the same task hierarchy.
6. Empty, loading, error and success states are deliberately designed.
7. Accessibility is part of the component contract.
8. Analytics events map to meaningful product outcomes.

## Implementation sequence

1. Create shared design tokens and navigation primitives.
2. Implement the canonical public shell.
3. Implement Product Atlas cards/detail patterns.
4. Implement workspace shell and progressive status/evidence panels.
5. Migrate one representative platform end-to-end.
6. Run visual/accessibility QA.
7. Expand only after the representative implementation passes.

## Safety / release gate

This document changes no production routing or domains. Production migration requires separate verification of source preservation, environment inventory, successful deployment, route smoke tests, redirects/canonicals, rollback and webhook dependencies.
