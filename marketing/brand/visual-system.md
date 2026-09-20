# A11-K Visual System

## Core palette

| Token | Value | Use |
|---|---|---|
| Obsidian | `#0A0A0A` | Primary background and high-contrast surfaces |
| Surface | `#171717` | Cards, panels, and elevated sections |
| Text | `#FAFAFA` | Primary text on dark surfaces |
| Muted text | `#A3A3A3` | Secondary copy and metadata |
| Accent blue | `#3B82F6` | Links, focus, active states, and selected CTAs |
| Accent blue dark | `#1D4ED8` | Hover and pressed states |
| Border | `#2A2A2A` | Dividers and quiet containment |

## Typography

* Primary: Geist Sans when available; otherwise a modern system sans stack.
* Technical and utility text: Geist Mono when available; otherwise a system monospace stack.
* Headlines: large, tight, calm, and short.
* Body copy: readable line length, generous line height, and no dense walls of text.
* Avoid using all caps for more than small labels.

## Composition

* Use generous negative space around the first message.
* Prefer one strong focal point per screen.
* Use rounded cards sparingly; containment should clarify hierarchy, not decorate it.
* Keep the accent blue purposeful. It should signal action or state, not fill every surface.
* Use soft gradients only as atmosphere behind content; never sacrifice contrast for visual effect.

## Graphic direction

The mark is a compact geometric A11-K signal: dark foundation, blue point of attention, and enough empty space to feel composed. Supporting graphics should use simple geometry, subtle noise or glow, and a restrained editorial rhythm.

Avoid:

* Generic robot heads
* Overly glossy 3D AI imagery
* Neon cyberpunk clichés
* Stock-photo “future” scenes
* Fear-based automation imagery
* Visual claims that imply surveillance or omniscience

## Interaction states

* Focus rings must be clearly visible and use the accent blue.
* Hover states should increase contrast, not add visual noise.
* Disabled states must remain legible.
* Motion should be short, interruptible, and respectful of `prefers-reduced-motion`.
* Every icon-only control needs an accessible name.

## Asset naming

Use lowercase kebab-case and keep source intent in the name:

* `a11k-mark.svg`
* `campaign-natural-interface-social-01.svg`
* `launch-hero-desktop.webp`
* `launch-hero-mobile.webp`

## Accessibility baseline

* WCAG AA contrast target for normal text.
* Keyboard-accessible controls and visible focus.
* Alt text for meaningful imagery; empty alt for decorative imagery.
* No colour-only communication.
* Respect reduced motion and text zoom.
