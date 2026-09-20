# Execution Design Contract

This contract turns the people-first direction into implementation rules for every product branch.

## Product loop

Every feature should move through:

`notice → understand → choose → act → verify → recover`

If a feature skips verification or recovery, document why.

## Screen contract

Each important screen should define:

- **Job:** the user's actual task.
- **Signal:** the most important state or information.
- **Primary action:** one dominant next step.
- **Secondary path:** safe alternative or deferral.
- **Proof:** evidence that the action worked.
- **Recovery:** undo, retry, rollback, or clear next step.

## Responsive contract

Desktop is an expansion of the phone experience, not the source of truth.

Required states:

- 320px narrow viewport;
- 390px standard phone viewport;
- 768px tablet-ish viewport;
- desktop width;
- reduced-motion preference;
- keyboard navigation.

## Modern interaction primitives

Build reusable primitives around intent rather than appearance:

- `ActionBar`
- `StatusPulse`
- `ProofPeek`
- `CommitPreview`
- `QuietUndo`
- `OpenLoopCard`
- `Checkpoint`
- `Trail`
- `RevealPanel`

These names describe behavior. Visual styling can evolve without changing the interaction contract.

## Visual rhythm

Use three levels of information density:

1. **Decision** — large, sparse, immediate.
2. **Context** — compact explanation.
3. **Evidence** — dense details available on demand.

Do not present all three at maximum density simultaneously.

## Anti-patterns

Do not ship:

- dashboard wallpaper with no clear task;
- five equally prominent primary buttons;
- modal chains for routine actions;
- hidden critical status behind hover;
- decorative gradients that reduce contrast;
- empty-state paragraphs longer than the task itself;
- success states that do not prove what changed;
- loading spinners where a useful skeleton or progress state is possible;
- product copy that describes technology instead of a human outcome.

## Engineering contract

- Keep business logic independent from visual components.
- Keep vendor-specific adapters behind small interfaces.
- Make important state transitions observable and testable.
- Prefer deterministic behavior for billing, permissions, publishing, and destructive actions.
- Keep optimistic UI reversible.
- Never treat client-side state as proof of a server-side action.

## Release gate

Before a feature is considered ready:

- [ ] phone-first interaction tested;
- [ ] keyboard and focus behavior checked;
- [ ] reduced-motion behavior checked;
- [ ] empty/error/loading/success states implemented;
- [ ] primary action is obvious;
- [ ] consequential actions have checkpoint or undo;
- [ ] server-side authorization verified;
- [ ] evidence/proof state exists;
- [ ] logs do not expose secrets or private payloads;
- [ ] copy passes the uncommon-dictionary filter.
