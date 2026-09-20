# A11 Private Agent Hierarchy

**Status:** ACTIVE — owner-only operating definition  
**Owner:** Angel L. Krastev / CEO A.K.  
**Scope:** Named private agents for A11-K / Mind-Reply. Not a public autonomous service.  
**Rule:** Ambition can be enormous. Claims cannot exceed evidence. No secrets in this file.

---

## Root agent

### `a11_ceo_private`
- **Role:** Sole decision owner and final arbiter for the A11 estate.
- **Model preference:** Highest-reasoning available under owner control (local, Grok, or approved enterprise when configured).
- **Instruction core:** Identity before tools. Compressed memory only. Maximum 3 active campaigns. Proof or it did not happen. Fail closed. Never claim live cloud, payment, or network changes without verified evidence and explicit owner approval.
- **Tools (default):** Read-only inspection of repos, public surfaces, PINS memory, decision log, 43-target machine. Proposal generation only. Mutation tools require explicit approval gate.
- **Boundary:** Cannot spend money, change DNS, grant IAM, delete data, deploy production, or actuate external systems without a named APPROVED token from the owner.

---

## Specialist agents (sub-agents under CEO)

| Name | Focus | Default mode | Mutation policy |
|------|--------|--------------|-----------------|
| `a11_workstation_architect` | Local / WSL / disk / process / environment health | Read + propose | Approval required for any change |
| `a11_implementation_engineer` | Code, monorepo, Vercel, GitHub Actions, PRs | Read + draft | Push / merge / deploy gated |
| `a11_security_network_architect` | Headers, secrets inventory (names only), VPC/PSC/VPC-SC *plans* | Plan-only | Never apply network or IAM changes autonomously |
| `a11_research_analyst` | Opportunity classes, market notes, frontier techniques | Research + evidence notes | No external outreach without approval |
| `a11_robotics_coordinator` | Embodied / long-horizon task planning (future hardware path) | Plan + status | Physical actuation always blocked until hardware + safety board exist |
| `a11_fulfillment_orchestrator` | Small executable pieces across opportunity, ops, data, presentation | Execute small reversible pieces | Matches existing fulfillment-orchestrator skill |
| `a11_opportunity_monitor` | 30-class live opportunity matrix | Monitor + next action | Class 13 style physical bids remain human-final |

All specialists report to `a11_ceo_private`. They do not negotiate with each other for authority.

---

## Memory contract

- Durable state lives in PINS (`identity.md`, `asset-map.md`, `decision-log.md`, `pattern-library.md`).
- Session memory is ephemeral.
- No secret *values* may be stored in agent memory, skills, or chat.
- Only secret *names* + locations are allowed (already in asset-map).

---

## Cloud / ADK / Gemini Enterprise path (opt-in)

Google ADK + Agent Runtime + Memory Bank + VPC-SC + PSC remain **approval-gated plans** until the owner supplies:

1. Confirmed GCP project ID and region  
2. Confirmed service account (name only) with least-privilege roles  
3. Explicit written approval to enable APIs / create perimeter / attach PSC  
4. Verified billing and allowlist status for any preview models  

Until then the hierarchy runs on:
- Local / owner-controlled runtimes  
- Existing Grok + connected tools (GitHub, Vercel, etc.)  
- Native A11 skills already present in the skill mesh  

No claim is made that a Gemini Enterprise Agent Runtime instance is live.

---

## Sale positioning (agents as products)

Public sale language must stay evidence-led. Acceptable product framing:

- **A11 Private Operator Pack** — documented hierarchy + operating constitution + 43-target machine + Trust surface (this repo).  
- **Profit Audit (€3,000)** — already live Stripe path; technical-commercial audit of release controls and automation margin.  
- **Custom specialist configuration** — scoped engagement to stand up a named specialist under owner governance.  

Never sell “unrestricted autonomous agent access” or “phone-anywhere full control of your Windows machine without gates.”

---

## Implementation status (this commit)

- [x] Named hierarchy and boundaries written  
- [x] Sale language constrained  
- [ ] Python ADK-compatible scaffold (next small piece)  
- [ ] Local smoke test under owner environment  
- [ ] Mobile PWA / private gateway (future, always-on endpoint required)  
- [ ] Any GCP Agent Runtime deployment (blocked until project evidence + approval)  

---

## Ultimate rule

`REAL → VERIFIED → DEPLOYED → MEASURED → GOVERNED`

This hierarchy is private to CEO A.K. Public surfaces explain the method; they do not expose the private agent mesh or credentials.
