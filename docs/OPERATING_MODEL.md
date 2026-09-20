# MindReply Operating Model

**Status:** proposed; human review required  
**Product root:** `angellllkr-eng/mind-reply-core`  
**Operations root:** `angellllkr-eng/agent-control-plane`

## Why this document exists

The estate works best with a clean split between product runtime and owner operations. Product code, customer surfaces, and prototype work belong here. Release governance, fleet policy, and owner-only command surfaces belong in the operational root.

## Source-of-truth split

### This repository owns
- product applications and public sites;
- reusable packages;
- product services and bridges;
- product-facing infrastructure definitions;
- product tests and deployment configuration;
- product documentation;
- Elysium Stack packages and architecture docs.

### `agent-control-plane` owns
- fleet definitions and task contracts;
- orchestration and scheduling policy;
- model/provider routing policy;
- ownership and approval policy;
- security and secret-handling policy;
- evidence, audit, and Reality Delta reporting;
- owner-only command surfaces.

## Product architecture

The product should be organized around four planes:

| Plane | Job |
|---|---|
| **Control** | owner-facing decisions, approvals, and release gates |
| **Data** | storage, retrieval, analytics, and evidence |
| **Agent** | bounded assistant workflows and sub-agents |
| **Edge** | phone-first UI, web delivery, and external touchpoints |

## Product vocabulary

Use the following names here:

- **Proofline** — verified path from change to release
- **Reality Delta** — difference between a claim and the current verified state
- **ReplyRail** — approved communications and delivery path
- **Continuity Ledger** — durable operational memory and decision history
- **Signal Watch** — runtime monitoring and anomaly review

## Execution rule

Any claim about health, delivery, or automation should be backed by evidence from at least two sources when possible: system response, database record, or artifact hash. That mirrors the tri-agent validation model, which requires independent evidence sources rather than a single trust path.

## Change path

The control plane may propose bounded pull requests into this repository. Every proposal should include scope, tests, evidence, risks, and rollback. Human review is required before merge. Production deployment, billing, DNS, credentials, and external communication remain owner-approved actions.

## State vocabulary

Use these terms precisely:
- **planned:** documented intent only;
- **built:** code or configuration exists at a commit;
- **tested:** repeatable checks passed for that commit;
- **deployed:** an identified environment reports the commit or version;
- **live:** the intended user path works and has fresh operational evidence.

Do not promote a claim without the evidence required by the next state.

## Acceptance criteria for operational consolidation

Operational consolidation is complete only when:
- both roots link to each other and agree on authority boundaries;
- cross-repository pull requests work with least privilege;
- required product checks run consistently;
- production surfaces are explicitly named and verified;
- stale or duplicate repositories have evidence-backed dispositions;
- Reality Delta reporting catches documentation/runtime contradictions;
- the owner retains final approval for high-risk actions.
