# MindReply / A11-K — Flow Premium Design System

Status: proposed in PR #107

## Intent

Translate the reconstructed estate architecture into a consistent product experience: premium, cinematic, restrained and operationally legible.

## Brand hierarchy

- **MindReply** — decision layer and evidence-led operating system.
- **A11-K** — human-facing execution and command surface.
- Product names remain explicit; decorative styling never replaces product identity.

## Visual language

- Obsidian foundation with cool blue signal accents and restrained warm highlights.
- Editorial Manrope/DM Sans hierarchy with monospace operational metadata.
- Layered radial light, fine grid, soft borders and controlled depth.
- Large type for product statements; compact monospace labels for system state.
- No decorative motion that competes with operational meaning.

## Motion language

- Cinematic entrance: opacity + short upward translation.
- Signal/orbit motion: slow, continuous and low-amplitude.
- Interaction motion: 200–500ms with a decelerating cubic-bezier curve.
- Hover states lift surfaces subtly and expose depth rather than changing layout.
- Every animated surface has a `prefers-reduced-motion` path.

## UX rules

1. State before decoration.
2. Product name before feature language.
3. Evidence before claims.
4. One primary action per viewport.
5. Progressive disclosure for complex operations.
6. Public surfaces stay simple; control surfaces expose operational detail.
7. Never use synthetic telemetry as if it were live production state.

## Architecture mapping

`Understand → Protect → Execute → Verify → Record → Continue`

Maps to:

`Intent → Guardrails → Action → Proof → Audit → Next state`

## Implementation

The first implementation is additive in `apps/web-replycontrol/app/flow-premium.css`, imported by the existing web-replycontrol root layout. It does not replace the existing base, mission-control or frontend-polish layers.
