# OWN Studio — Ready to use

**Location:** `apps/a11k-studio/public/index.html`  
**Deploy root:** `apps/a11k-studio` (static via `vercel.json`)  
**Status:** Production-ready local-first surface (2026-08-09)

## Why this outperforms typical cloud UI generators for this job

| Factor | Cloud v0 / Manus-style | OWN Studio |
|--------|------------------------|------------|
| Time to first shell | Network + queue + model | **Instant** (client-side) |
| Cost per iteration | Tokens / seats | **Zero** for shell + narrative |
| Lock-in | Vendor session | **None** — download HTML |
| Offline | No | **Yes** after first load |
| Authority | Easy over-claim | **Hard boundary** + owner gate |
| Estate fit | Generic | Pre-filled **€3k Profit Audit** template + Stripe CTA |

## Ready-to-use actions

1. **Open** the deployed Studio URL (or open `public/index.html` locally).
2. Click **€3k Profit Audit** template → shell generates immediately.
3. **Download .html** or **Copy HTML** into your deploy path / PR.
4. Use **Narrative** for proof-boundary-action copy.
5. **History** keeps last 12 items in the browser only.

Keyboard: `⌘/Ctrl+Enter` generates in the active room.

## Deploy

Point a Vercel (or any static host) project at `apps/a11k-studio`.  
`vercel.json` already sets `outputDirectory: public`, clean URLs, and security headers.

Suggested domain: `studio.a11-k.space` (already referenced in estate nav).

## What “better” means here

- **Performance:** no model wait for structure shells; preview via iframe in-process.
- **Honesty:** never marks live; footer states owner approval required.
- **Revenue alignment:** audit template ships with live Stripe link.
- **Continuity:** local history without a backend.

## Optional upgrades (after first cash)

1. Add optional BYOK model endpoint for richer section copy (still export-owned).
2. Persist approved shells under `evidence/studio/` via control-plane.
3. Crownline approval gate before any production publish.

## Boundary (unchanged)

Does not deploy, does not store secrets, does not replace Angel approval, does not require Vercel v0 or Manus.
