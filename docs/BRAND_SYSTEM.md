# Brand System — MindReply × A11

**Updated:** 2026-09-05  
**Status:** Active — use on all Tier-0 surfaces  
**Source of names:** `docs/CANONICAL-PROJECT-REGISTRY.md`

---

## Positioning

MindReply is **human-communication infrastructure**, not a generic AI wrapper.

Preferred public vocabulary:
- communication systems · follow-through · response continuity
- human context · verified action · relationship memory · operational clarity

Avoid: unsupported superlatives, fake metrics, fake certifications, claims of autonomous authority.

**Dual brand:**
| Brand | Role |
|-------|------|
| **MindReply** | Public product · relationships · reply continuity |
| **A11-K** | Owner command · agents · control plane · evidence |

Same visual system. Different voice weight (MindReply = calm commercial; A11-K = sovereign operational).

---

## Color tokens (dark-first)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0A0A0B` | Page background |
| `--surface` | `#121214` | Cards, panels |
| `--surface-2` | `#1A1A1D` | Elevated |
| `--text` | `#F4F4F5` | Primary copy |
| `--muted` | `#A1A1AA` | Secondary |
| `--border` | `#27272A` | Hairlines |
| `--platinum` | `#C8CCD4` | Logo / premium accent |
| `--signal` | `#5B8DEF` | Interactive (sparingly) |
| `--success` | `#3D9A6A` | Live / verified |
| `--danger` | `#C45C5C` | Error / blocked |

Light mode only when a buyer surface requires it; default is dark.

---

## Typography

- **Display / logo:** geometric sans, tight tracking, no playful weight
- **UI body:** clean system or Inter / similar; 15–16px base
- **Evidence / IDs:** monospace
- Hierarchy: one hero line → short support → actions. No paragraph walls on heroes.

---

## Logo rules

1. Wordmark + optional minimal mark
2. Dark-first; platinum or near-white on black
3. Works at 16px favicon
4. Clear space = mark height on all sides
5. Never stretch, never add drop shadows as identity
6. Do not invent new logo variants per agent run — use the Canva masters below

### Masters (Canva — editable)

| Asset | Edit |
|-------|------|
| MindReply logo | https://www.canva.com/d/xfNxS4IZlZiIi0A |
| A11-K logo | https://www.canva.com/d/sULa7XgV4l32HH4 |
| MindReply brand board | (export from Canva job brand-board candidate) |

Candidate previews (pick / refine in Canva):
- MindReply set: job `858c81cd-fb26-4d83-acf0-abf882d9aec5`
- A11-K set: job `b843c9b2-0da3-43ae-be08-8910b76692ce`

---

## Content standard (every public surface)

Answer in order:
1. What problem disappears?
2. Who is it for?
3. What happens after activation?
4. What is **verifiably live** today?
5. What can the buyer do next?

**Reality rule:** A feature is “live” only after a runtime check + owner-visible evidence. Otherwise: planned / beta / private / unavailable.

---

## Application map

| Surface | Brand weight |
|---------|----------------|
| `mind-reply-core` / Vercel `a11-k-core` | Both; product shells MindReply, ops A11 |
| `mindreply-org-site` | MindReply public |
| `agent-control-plane` | A11-K |
| `a11-live-cloud-execution` | A11-K |
| `a11-k-multiverse-5d` | A11-K |
| Product suite (UptimePilot, etc.) | Sub-brands under A11 visual system |

---

## CSS starter

```css
:root {
  --bg: #0A0A0B;
  --surface: #121214;
  --text: #F4F4F5;
  --muted: #A1A1AA;
  --border: #27272A;
  --platinum: #C8CCD4;
  --signal: #5B8DEF;
  --success: #3D9A6A;
  --danger: #C45C5C;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
```
