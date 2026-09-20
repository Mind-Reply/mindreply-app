# People-First Frontier

A product and interaction contract for interfaces that feel authored for people rather than assembled from generic software patterns.

## 1. North star

Every screen should answer three questions within one glance:

1. What matters right now?
2. What can I do next?
3. What happens if I do it?

The interface should reduce uncertainty before it adds capability.

## 2. Human-first rules

- Lead with the user's situation, not the system's machinery.
- Prefer concrete verbs: `send`, `review`, `fix`, `keep`, `share`, `pause`, `try`.
- Never make the user learn internal architecture to complete a normal task.
- Give important actions a visible consequence preview.
- Preserve momentum: a primary task should usually require one obvious next action.
- Use empty states as invitations, not apologies.
- Use plain language beside branded language whenever a branded term could confuse a new person.
- Never use “AI-powered”, “seamless”, “revolutionary”, “unlock”, or “supercharge” as default filler.

## 3. Unpredictable, but not confusing

Distinctive does not mean random. Use controlled surprise:

- One unexpected visual or interaction motif per screen.
- Reveal secondary controls contextually instead of displaying every option at once.
- Allow users to reverse meaningful actions.
- Prefer live previews, scrubbable states, and progressive disclosure over modal-heavy workflows.
- Introduce motion only when it explains state, hierarchy, or consequence.
- Avoid decorative motion that delays a task.

## 4. Phone-first composition

Design from a 390px-wide mental model first.

- Primary action stays reachable with one thumb.
- Content blocks are short and scannable.
- Tap targets are at least 44px where practical.
- Bottom navigation is reserved for destinations users revisit frequently.
- Long forms become staged conversations or sections.
- Tables become cards, summaries, or drill-down views on narrow screens.
- Never hide critical status behind hover.

## 5. Visual language

Use a quiet base with sharp moments of emphasis:

- Large type for decisions.
- Dense type for evidence.
- Generous spacing around important actions.
- Subtle borders instead of excessive shadows.
- One accent family per product surface.
- Use asymmetry deliberately: a slightly offset card, unusual crop, or editorial headline can create identity without damaging usability.

## 6. Interaction vocabulary

Use these interaction patterns where appropriate:

- **Pulse** — a compact status change that confirms something just happened.
- **Reveal** — secondary detail appears only when context makes it useful.
- **Commit preview** — show the immediate consequence before a consequential action.
- **Quiet undo** — reversible actions expose an unobtrusive undo window.
- **Trail** — preserve the user's recent path so they can recover context.
- **Checkpoint** — pause before an irreversible or externally visible action.
- **Proof peek** — show evidence behind an important system claim without forcing a separate report.

## 7. Copy system

### Prefer

- “Ready to send”
- “Needs your decision”
- “Nothing is waiting”
- “Try it once”
- “Keep this version”
- “Show me why”
- “Not now”
- “Undo”

### Avoid

- “Leverage our platform”
- “Unlock powerful capabilities”
- “Seamless workflow”
- “Next-generation experience”
- “AI-powered productivity”
- “Revolutionary solution”

## 8. Trust pattern

For every consequential system action, expose:

`intent → scope → expected result → evidence → undo/rollback path`

The product should feel capable because it is legible, not because it hides complexity.

## 9. Accessibility is part of the aesthetic

Keyboard navigation, visible focus, reduced motion, contrast, semantic structure, labels, and readable type are design primitives—not cleanup tasks.

## 10. Definition of done

A new surface is ready when:

- a first-time user can identify the primary action without instruction;
- the screen remains useful at phone width;
- loading, empty, error, success, and offline-ish states are designed;
- destructive actions have a checkpoint or undo path;
- copy can be understood without product-specific vocabulary;
- the design has one memorable element that serves the task rather than competing with it;
- the implementation does not require proprietary infrastructure to remain usable.
