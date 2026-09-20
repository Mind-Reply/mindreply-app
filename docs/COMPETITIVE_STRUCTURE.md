# Competitive Structure — MindReply × A11 (2026 leaders)

**Updated:** 2026-09-05  
**Use with:** `CANONICAL-PROJECT-REGISTRY.md` · `BRAND_SYSTEM.md`

Research baseline: Intercom/Fin, Zendesk AI, Front, Sierra, Decagon (CX); LangGraph, CrewAI, OpenAI Agents SDK (orchestration).

---

## 1. Market position (what we win on)

| Leader pattern | Their strength | Our counter |
|----------------|----------------|-------------|
| Intercom Fin | High AI resolution, omnichannel, Salesforce gravity | **Verified action + relationship memory** without per-resolution tax; owner-sovereign stack |
| Zendesk AI | Ticketing depth, installed base | **Communication continuity** not ticket theater; evidence-first “live” claims |
| Front | Human-in-control shared inbox | Same + **agent mesh (A11)** that is auditable |
| LangGraph | Stateful graph, checkpoints, HITL | **agent-control-plane** = Crownline ops; durable policy + fail-closed |
| CrewAI | Fast role crews | Use for prototypes only; production = explicit graph + registry |

**Do not compete** on “most autonomous black box.” Compete on **continuity, evidence, and owner control**.

---

## 2. Feature matrix — ship / maintain

### MindReply (public product)

| Feature | Competitive bar | Our implementation target |
|---------|-----------------|---------------------------|
| Shared continuity | Multi-turn context | Relationship memory + response continuity |
| Channels | Chat, email, WhatsApp, SMS | Prioritize verified channels; label others planned |
| Knowledge | KB + training sources | RAG on `a11-rag-platform` + owner docs |
| AI resolution | Outcome metrics | Prefer **flat / predictable** cost story; publish only verified rates |
| Security | SOC-style claims | Reality rule: no cert claims without evidence record |
| Pricing clarity | Leaders opaque | Transparent packaging on org-site |

### A11 / agent-control-plane (ops)

| Feature | Competitive bar | Our implementation target |
|---------|-----------------|---------------------------|
| Orchestration | LangGraph state machine | Graph + checkpoints + human gates |
| Observability | LangSmith-class traces | Session logs, policy decisions, append-only evidence |
| HITL | Explicit approval nodes | Halo / fail-closed policy (existing scaffolds) |
| Identity | Repo name chaos | **CANONICAL-PROJECT-REGISTRY only** |
| Multi-agent | Role crews | Named agents bound to Tier-0 repos |

---

## 3. Advanced maintenance (executed in-repo)

1. **Grouped Dependabot** — monthly npm + actions; fewer noisy PRs  
2. **Estate health automation** — daily Grok pass on Tier-0 identity + open PRs  
3. **Brand + competitive docs** — BRAND_SYSTEM + this file  
4. **Reality rule** — public copy never claims live without runtime evidence  
5. **Firecrawl** — `proxy: auto` (enhanced = same credit) on scrape paths  

---

## 4. Rename / freeze (executed policy)

| Surface | Canonical | Aliases |
|---------|-----------|---------|
| Monorepo | `angellllkr-eng/mind-reply-core` | Never fuzzy-match Mind-Reply/* clones |
| Public site | `angellllkr-eng/mindreply-org-site` | Vercel `*-zrvr`, `*1` = ARCHIVE |
| Agent mesh | `angellllkr-eng/agent-control-plane` | **Freeze production Vercel as `agent-control-plane-vezr`**; treat `optimus-*` as alias |
| Multiverse | `a11-k-multiverse-5d` | Non-5d name superseded |

---

## 5. Automation schedule

| Automation | Cadence | Action |
|------------|---------|--------|
| Estate identity health | Daily | Load registry; flag wrong-repo PRs / name collisions |
| Dependabot | Monthly grouped | Security bypasses cooldown |
| Competitive refresh | Monthly | Re-scan leader feature tables; patch this doc |

---

## 6. Next build priorities (ordered)

1. Wire brand tokens + logos into `mindreply-org-site` hero  
2. agent-control-plane: one production Vercel name locked in registry  
3. Public site: five-question homepage structure (problem → who → after → live → CTA)  
4. Shared scrape client with Firecrawl `auto`  
5. HITL approval path documented on every agent task  
