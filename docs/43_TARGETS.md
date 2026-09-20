# A11 — 43-Target Machine

**Status:** ACTIVE — daily reversible evidence-backed targets
**Source:** Owner archive + A11_MASTER_RECORD.md
**Owner:** CEO A.K.
**Rule:** Every target must leave a commit, URL, or measurable state. Never claim done without evidence.

Format per target: ID | Category | Target | Evidence type | Status

Status vocabulary: OPEN · IN-PROGRESS · VERIFIED · BLOCKED · DEFERRED

---

## Daily operating targets (seed 2026-08-25)

| ID | Category | Target | Evidence type | Status |
|----|----------|--------|---------------|--------|
| 01 | SEO | Ensure every public root has unique title + meta description | live HEAD + source | VERIFIED |
| 02 | SEO | Canonical link present and self-consistent on a11-k.space / mind-reply.com | live HTML | VERIFIED |
| 03 | SEO | robots.txt allows public, disallows /console and protected routes | live file | VERIFIED |
| 04 | SEO | sitemap.xml lists only verified public routes | live file + crawl | VERIFIED |
| 05 | Links | Zero broken internal links on canonical public pages | crawl report | OPEN |
| 06 | Links | Footer and nav CTAs resolve to 200 or intentional 3xx | live check | OPEN |
| 07 | Demo | Screenshot-safe dummy demo (no real PII, no secrets) available | public path | OPEN |
| 08 | README | Root README truth matches live products and offers | commit vs live | OPEN |
| 09 | README | apps/a11k README states exact public purpose and boundaries | commit | OPEN |
| 10 | Deploy | apps/a11k production deployment READY on Vercel | Vercel status | OPEN |
| 11 | Deploy | mind-reply.com / www returns 200 with commercial CTA | live | OPEN |
| 12 | Deploy | No public Vercel project left in ERROR state that is still advertised | inventory | OPEN |
| 13 | Security | No secrets in any public or committed file (name-only inventory) | scan | OPEN |
| 14 | Security | Permissions-Policy and security headers present on A11 surface | live headers | VERIFIED |
| 15 | Docs | A11_MASTER_RECORD.md remains the single source of direction | commit | VERIFIED |
| 16 | Docs | This 43_TARGETS.md updated at least once per operating day | commit timestamp | VERIFIED |
| 17 | Docs | A11_LIVE_EXECUTION.md records latest verified outcome | commit | OPEN |
| 18 | Commercial | One real offer (price + CTA + Stripe or invoice path) visible | live page | OPEN |
| 19 | Commercial | Proof strip (repo, deployment, or customer-safe metric) on homepage | live | OPEN |
| 20 | Commercial | Founder / Trust page lists what is live / fixture / blocked / verified | public path | IN-PROGRESS |
| 21 | Operator | Operator Dashboard shows last evidence URL + status of top 10 targets | public or protected | OPEN |
| 22 | Operator | 43 targets visible, filterable by status | this file or UI | OPEN |
| 23 | Automation | Daily pulse automation leaves evidence note | log or commit | OPEN |
| 24 | Automation | Stuck workstreams swapped or marked BLOCKED within 24h | issue comment | OPEN |
| 25 | GitHub | Open P0 issues have clear next human or agent action | issue body | OPEN |
| 26 | GitHub | No issue older than 14 days without status update | triage | OPEN |
| 27 | Evidence | Every closed issue or PR carries a verification artifact | PR/issue | OPEN |
| 28 | Evidence | Reality Index applied to any new public claim | decision log | OPEN |
| 29 | Human | Time-cost of last cycle recorded (operator minutes) | note | OPEN |
| 30 | Human | At least one Human Dividend metric captured this week | note | OPEN |
| 31 | Recovery | Rollback path documented for every KEEP-PRODUCTION surface | docs | OPEN |
| 32 | Recovery | Checkpoint exists before any irreversible external action | evidence | OPEN |
| 33 | Visual | Desktop + 390px mobile inspection of primary public roots | screenshot or note | OPEN |
| 34 | Visual | Shared A11 design tokens (colour, type, spacing) documented | file | OPEN |
| 35 | Zero-404 | Custom not-found / branded 404 on retained public projects | live | OPEN |
| 36 | Consolidation | Vercel project inventory mapped to GitHub source | docs or issue | OPEN |
| 37 | Consolidation | Duplicate/ERROR projects classified KEEP / RETIRE / SANDBOX | issue update | OPEN |
| 38 | Trust | Founder identity and organisation stated once, consistently | live | IN-PROGRESS |
| 39 | Trust | Explicit statement of what is fixture vs live vs blocked | live | IN-PROGRESS |
| 40 | Monitoring | Health or status endpoint returns factual release identity | live | OPEN |
| 41 | Communications | One outbound or draft outreach evidence captured (no auto-send) | draft id | OPEN |
| 42 | Research | One frontier or opportunity note with evidence confidence | file or issue | OPEN |
| 43 | Compound | Next highest-value move named and assigned | this file or issue | OPEN |

---

## Update protocol

1. At start of cycle: load this file + A11_MASTER_RECORD.md + decision-log.
2. Execute the smallest useful open target.
3. Change status only with evidence (commit SHA, live URL, log).
4. Append a one-line outcome under ## Cycle log below.
5. Never invent completed status.

## Cycle log

- 2026-08-25 | Seed created and committed. Master record already VERIFIED (target 15). Next: advance targets 18–22 (commercial + Operator/Trust surfaces).
- 2026-08-25 | SEO 01–04 VERIFIED on a11-k.space. Added canonical, robots meta, Open Graph, Twitter cards, dual JSON-LD (Organization + WebSite), noscript fallback, sitemap.xml, robots.txt Sitemap directive. Commits: 71b110f, 2923ee9, 8f3a7aa. Target 14 (security headers) already present via vercel.json. Next: commercial surfaces 18–22 + force Vercel redeploy of a11k so live HTML reflects new head tags.
- 2026-08-25 | Founder/Trust section added to foundation.js (nav + #trust with Builder / Live / Fixture / Blocked / Verified matrix). Targets 20, 38, 39 → IN-PROGRESS. Commit a6e535c. Becomes VERIFIED once the project serving a11-k.space is redeployed and the section is visible live.
