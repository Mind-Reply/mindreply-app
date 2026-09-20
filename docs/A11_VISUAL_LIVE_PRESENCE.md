# A11 Visual & Live Presence Contract

**Status:** ACTIVE — long-term ranking and owner-only excellence  
**Owner:** CEO A.K.  
**Purpose:** Make every public surface and asset thoughtful, distinctive, performant, and Google-durable while remaining exclusively powerful for the owner.

---

## 1. Distinctive visual system (already live in foundation.css)

| Token | Value | Role |
|-------|--------|------|
| Paper | `#f4f0e7` | Background — archival parchment |
| Ink | `#143740` | Primary text / structure |
| Muted | `#5b7073` | Secondary text |
| Brass | `#a87a2f` | Accent labels, micro type |
| Coral | `#c9593c` | Emphasis, CTAs, signal |
| Serif | DM Serif Display | Headlines — editorial weight |
| Sans | Manrope | Body |
| Mono | IBM Plex Mono | Labels, nav, micro |

This system is **not generic SaaS**. It is civic / archival / evidence-led. Do not replace it with trend gradients or stock illustration libraries.

**Owner-only rule:** Any new brand surface (AuditForge, CloudTrim, etc.) must either inherit this system or declare a deliberate, documented variant that still feels A11-family. Random redesigns are forbidden.

---

## 2. Real-live-only media policy

- **Images:** Only real screenshots of live surfaces, real diagrams of the actual architecture, or owner-commissioned originals. No stock “AI robot” imagery. No synthetic faces claiming to be staff.
- **Video:** Only real screen recordings of working products, real voice sessions (with consent), or real process footage. No stock B-roll. Prefer short, silent or lightly captioned clips that prove a claim.
- **Live presence:** A surface is “live” only when it returns HTTP 200 and matches the claim on the page. Fixture content must be labelled fixture.
- **Performance first:** Every image must be compressed, correctly sized, and served with modern formats (WebP/AVIF where supported). Lazy-load below the fold. No autoplay video with sound.

---

## 3. Core Web Vitals & real-time performance (Google long-term)

Targets for every public root (a11-k.space, mind-reply.com, and retained brand surfaces):

| Metric | Target |
|--------|--------|
| LCP | ≤ 2.5 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.1 |
| TTFB | ≤ 800 ms |

Rules:
- Critical CSS inlined or cached; no render-blocking CSS beyond the design system.
- Fonts: `display=swap`, preconnect to fonts.googleapis.com / gstatic.
- No third-party scripts on the critical path except approved analytics with consent.
- Prefer static or edge-rendered HTML for primary public claims so Googlebot sees content without heavy JS dependency.
- The current foundation uses progressive enhancement; keep the noscript path truthful.

---

## 4. Open Graph / social / search image contract

Every public root must eventually carry:

```html
<meta property="og:image" content="https://…/og-a11k.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="https://…/og-a11k.png">
```

Image rules:
- 1200×630, parchment + ink + one coral or brass signal.
- Text only: “A11-K · Evidence-led operating foundation” or the exact product name.
- No logos of other companies, no fake metrics, no faces.
- File lives in the same project that serves the domain (so it is real-live).

Until the og image is produced and deployed, do not claim social preview quality.

---

## 5. Video presence (when used)

- Host on the same origin or a verified owner-controlled CDN.
- Provide a poster frame that itself follows the visual system.
- Caption or transcript for accessibility and Google understanding.
- Prefer < 30 s proof clips (e.g. “opening the Trust section”, “running the 43-target view”).
- Never autoplay with audio.

---

## 6. Continuous improvement loop (owner-only)

1. Every new public page or brand surface starts from this contract.  
2. After any visual change, record a screenshot or Lighthouse note in the decision log or cycle log.  
3. Once per week (or on demand), re-check LCP/INP/CLS on the two primary roots.  
4. Unique concepts (Reality Index, Human Dividend, Civic Signal Archive) stay visible in both language and visual hierarchy — they are the long-term ranking differentiator.  
5. Diamond-seal / scent-marker: high-value internal boards and private agent UIs remain non-public and non-indexed.

---

## 7. Implementation status

- [x] Distinctive token system defined and present in foundation.css  
- [x] Trust + SEO technical base committed in monorepo  
- [ ] OG image 1200×630 produced and live on a11-k.space  
- [ ] a11-k serving project redeployed so new head tags + Trust section are live  
- [ ] mind-reply.com OG / performance pass aligned to this contract  
- [ ] Short real proof video (optional, only when a real clip exists)  
- [ ] Brand-surface visual audit (KEEP / VARIANT / RETIRE)  

---

## Ultimate visual rule

Make it look like it was built by one mind that values evidence, silence, and precision — not like every other AI product page. Google rewards the combination of technical excellence + distinctive, consistent identity over time. That combination is the long-term moat.
