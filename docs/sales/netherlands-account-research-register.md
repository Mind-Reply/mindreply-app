# Netherlands Territory & Account Research Register

**Programme:** A11-K ENERGY × COMPUTE GRID  
**Parent issue:** https://github.com/Mind-Reply/mindreply-app/issues/145  
**Branch:** a11k/sales-territory-operations-planning  
**Status:** CONTINUE — research register structure prepared; no prospect research has been completed or verified.

## 1. Executive status — positive and negative findings

| Work item | Status | Evidence / explanation | Next action |
|---|---|---|---|
| Register structure | READY | This file is committed to the planning branch | Review fields |
| Netherlands territory priority | VERIFIED as an owner-approved planning direction | Parent programme scope | Keep Netherlands first |
| Named prospect list | NO — NOT YET CREATED | No source-backed account entries have been researched in this task | Research public organisational sources |
| Prospect demand | NO — NOT VERIFIED | No buyer interviews, requests or validated demand evidence | Validate only through approved research/contact process |
| Customer relationships | NO — NOT ESTABLISHED | No customer relationship evidence supplied | Do not label organisations as customers |
| Meetings / minutes | NO — NONE RECORDED | No meeting evidence supplied | Create minutes only for real meetings |
| Pipeline value | NO — NOT ESTABLISHED | No qualified opportunities or substantiated values | Keep pipeline value blank until evidenced |
| Revenue / collections | NO — NOT VERIFIED | No invoice, payment, settlement or ledger evidence | Do not report revenue |
| Grid capacity / site availability | NO — NOT VERIFIED | Regional infrastructure indicators are not site-specific allocation evidence | Obtain operator-backed confirmation |
| Customer outreach | NO — NOT AUTHORISED | No separate outreach approval recorded | Require explicit owner approval |
| Binding proposals / contracts | NO — NOT AUTHORISED | No commercial authority recorded | Require separate approval |
| Stripe live activity | NO — NOT AUTHORISED | Sandbox design only; no live changes | Keep live account untouched |
| Supabase production writes | NO — NOT AUTHORISED | Schema and security planning only | No production DDL/DML |
| Merge / deployment | NO — NOT AUTHORISED | Planning branch only | Separate release approval required |

**Interpretation:** “NO” means the item is absent, unverified or not authorised as stated. It must not be silently converted into a positive status. Distinguish “not started,” “not evidenced,” “not authorised,” and “confirmed negative” in all future reports.

## 2. Research coverage

Initial sectors:
- Data-centre and colocation operators
- Energy suppliers, generators and flexibility providers
- Industrial and logistics operators
- Compute buyers and infrastructure users
- Infrastructure, connectivity and delivery partners

Initial geographic scope:
1. Netherlands — first research territory.
2. United Kingdom — second, not activated by this register.
3. Wider EU — later country-by-country expansion.

No company is pre-labelled as a prospect. An organisation enters the register only after a public, credible source supports its identity, geography and relevant business activity. Public information does not establish buying intent.

## 3. Account register schema

Use one row per organisation. Keep fields blank until sourced.

| Field | Required content |
|---|---|
| Account key | Stable internal identifier; no personal identifiers |
| Organisation | Verified legal or public-facing name |
| Website / source | Public source URL and retrieval date |
| Country / region | Evidence-backed location |
| Territory | Netherlands / UK / EU country |
| Segment | One primary segment; optional secondary segment |
| Relevance | Specific factual reason for inclusion |
| Potential use case | Hypothesis, clearly labelled |
| Buying intent | NOT VERIFIED unless directly evidenced |
| Grid / site relevance | Hypothesis until operator/site evidence exists |
| Account owner | Named internal owner after assignment |
| Research status | NOT STARTED / IN RESEARCH / READY FOR REVIEW / VERIFIED |
| Evidence quality | PRIMARY / CREDIBLE SECONDARY / INSUFFICIENT |
| Last reviewed | Date and reviewer |
| Next action | Specific action, owner and due date |
| Approval status | NOT REQUESTED / PENDING / APPROVED / DECLINED |

## 4. Qualification rules

An account may be marked **RESEARCHED** only when its identity, operating geography, segment and relevance have credible source links.

An opportunity may be marked **QUALIFIED** only when evidence supports:
- A defined use case or directly recorded customer need.
- A plausible service fit.
- A known or explicitly unknown buying process.
- Technical dependencies and open questions.
- An accountable internal owner and next action.

Do not infer buyer intent from company size, data-centre presence, energy consumption, job postings, press releases or geographic proximity.

## 5. Negative-result and exception register

Record unsuccessful research too. Examples:
- No credible source found.
- Organisation is outside the approved territory.
- No relevant service fit identified.
- Public source is stale or contradictory.
- Grid or site claim cannot be independently confirmed.
- Duplicate organisation record detected.
- No buyer intent evidence.
- Required approval declined or not requested.

Each negative result needs date, scope searched, source/method, impact, owner and whether it should be retried. “No result found” is not proof that no opportunity exists.

## 6. Human approval boundaries

The following remain **NO — NOT AUTHORISED** unless separately approved:
- Direct customer contact or outreach campaigns.
- Sending meeting invitations or sales materials.
- Binding proposals, pricing commitments, contracts or purchase orders.
- Spending, paid data subscriptions or external commitments.
- Live Stripe configuration, payments or refunds.
- Supabase production schema/data changes.
- Merging this branch or deploying to production.

Research using public sources and synthetic examples may proceed within the planning scope. Any use of personal data must be minimised and handled under applicable privacy requirements.

## 7. Completion criteria for this register

- [ ] Netherlands organisations researched with source URLs and dates.
- [ ] Each entry checked for duplicate identity.
- [ ] Segment and relevance rationale recorded.
- [ ] Buying intent explicitly marked VERIFIED or NOT VERIFIED.
- [ ] Negative findings retained, not discarded.
- [ ] Account ownership assigned by an authorised owner.
- [ ] Independent review completed.
- [ ] No customer-facing action taken without separate approval.

## 8. Current conclusion

**READY:** The register schema and negative-status reporting rules are documented.  
**CONTINUE:** Populate and validate the Netherlands account research using credible public sources.  
**NO:** No named prospects, customers, meetings, qualified opportunities, pipeline value, revenue, site allocation or grid capacity are verified by this artifact.  
**NO — NOT AUTHORISED:** Customer outreach, binding commercial activity, live payment changes, production database writes, merge and deployment.
