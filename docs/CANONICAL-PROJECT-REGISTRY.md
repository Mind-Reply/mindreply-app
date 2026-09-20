# CANONICAL PROJECT REGISTRY
**Owner:** Angel K / A11-K / MindReply  
**Updated:** 2026-09-05  
**Purpose:** Kill name-collision chaos. Agents MUST resolve work only via this table. Fuzzy name matching is forbidden.

---

## Agent hard rules (non-negotiable)

1. **Never pick a repo by similar name.** `mindreply`, `mind-reply`, `mind-reply-core`, `mindreply-org-site`, `MindReply` are **different**.
2. **Canonical = one GH repo + one primary Vercel project.** Everything else is ALIAS, ARCHIVE, or NOISE.
3. **If the task name is ambiguous, stop and use this registry.** Do not "guess the most recent."
4. **Do not push, deploy, or open PRs on ALIAS / NOISE / ARCHIVE** unless owner explicitly names that exact full path.
5. **Before any GH/Vercel write:** confirm `owner/repo` matches the CANONICAL column below.

---

## Tier 0 — CANONICAL (work here only)

| Intent | Canonical GitHub | Primary Vercel project | Domain / notes |
|--------|------------------|------------------------|----------------|
| Unified platform monorepo | `angellllkr-eng/mind-reply-core` | `a11-k-core` (`prj_tF8MATzE2bOP0hPfiKZcuGX992dh`) | mindreply.com + a11-k.space |
| Public org / marketing site | `angellllkr-eng/mindreply-org-site` | `mindreply-org-site` (`prj_U0IAVGgzJKZhEl1FLts2vJft23Ym`) | Standalone public site |
| Agent mesh / control plane | `angellllkr-eng/agent-control-plane` | **`agent-control-plane-vezr` (PRODUCTION FROZEN)** — `optimus-the-ai-platform-to-bu` = ARCHIVE | See COMPETITIVE-CONTROL-PLANE-2026.md |
| Live cloud execution | `angellllkr-eng/a11-live-cloud-execution` | `a11-live-cloud-execution` | Revenue-first routes |
| Multiverse / voice | `angellllkr-eng/a11-k-multiverse-5d` | `a11-k-multiverse` | Not GH name without -5d |
| Control platform (guide) | `angellllkr-eng/mindreply-control` | `public-site` | Not public-site-kmcc |
| Enterprise radar | `angellllkr-eng/enterprise-engine-radar` | `enterprise-engine-radar` | |
| Reseller platform | `angellllkr-eng/resellerpro-platform` | `resellerpro-platform` | Not *-8psz etc. |
| Reseller enterprise pack | `angellllkr-eng/reseller-pro-enterprise` | `reseller-pro-enterprise` | Not *-1juj |
| RAG platform | `angellllkr-eng/a11-rag-platform` | `a11-rag-platform` | |
| SaaS starter | `angellllkr-eng/saas-starter` | `saas-starter` | Not saas-starter1 |
| Opportunity radar | `angellllkr-eng/opportunity-radar` | — | |
| Real-estate radar | `angellllkr-eng/real-estate-value-radar` | — | |
| Agentic commerce CP | `angellllkr-eng/agentic-commerce-control-plane` | — | |
| PatchTalk | `angellllkr-eng/patchtalk` | `patchtalk` | |
| Nexus command plane | `angellllkr-eng/nexus-core` | `nexus-core` | |
| Private opportunity core | `angellllkr-eng/private-opportunity-core` | `private-opportunity-core` | |

### Competitive + brand (load on maintenance)
- `docs/BRAND_SYSTEM.md`
- `docs/COMPETITIVE-MINDREPLY-2026.md`
- `agent-control-plane` → `docs/COMPETITIVE-CONTROL-PLANE-2026.md`

### Scrape
Firecrawl `proxy: "auto"` — enhanced = **1 credit**, no surcharge.

---

## Tier 1 — DISTINCT products
Do not merge into monorepo without owner order. Archived brand shells stay frozen unless ordered: empirepulse, cloudtrim, dealforge, leadrevive, marginpilot, leadatlas, chatbot*.

---

## Tier 2 — Vercel ALIAS (never primary deploy)
mindreplyupdate, moreofit, runnow, *-zrvr, *-8psz, optimus-the-ai-platform-to-bu (ARCHIVE), public-site-kmcc, saas-starter1, brushworks-*, etc.

---

## Agent start protocol
1. Read this registry  
2. Map → Tier 0 full `owner/repo`  
3. If ambiguous → ask owner  
4. Then clone / PR / deploy / scrape  
