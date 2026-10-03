# Estate Runtime Contract

Purpose: make every product in the estate prove what it does before it claims it does it.

## Product behavior
- **Human outcome first:** every screen names the user's next useful outcome, not the model or technology.
- **Reality before rhetoric:** availability, integrations, revenue, security and deployment claims require current evidence.
- **Recoverability:** every consequential action has a visible failure state and a recovery path.
- **Phone-first:** critical actions work one-handed at narrow widths before desktop polish.
- **Accessible by default:** keyboard, reduced motion, contrast, focus, labels and screen-reader semantics are release criteria.

## Vocabulary
Each surface owns a distinct vocabulary. Shared infrastructure terms remain technical; product copy must not clone names across products.

- Core product: **Proofline / Reality Delta / Continuity Ledger**
- Owner operations: **Crownline / Owner Gate / Recovery Rail**
- A11K: **Command Atelier / Signal Desk / Recall Thread**
- SaaS starter: **Warm Start / Workbench / Commit Preview**
- Private owner layer: **Northstar / Quiet Room / Claim Ledger**

A branded term must always have an adjacent plain-language explanation. No invented terminology may hide a limitation.

## Integration posture
n8n, Zapier, webhooks, queues, vector retrieval and model providers are adapters, not product identities. Each adapter must declare:
1. input and output contract;
2. credentials required;
3. retry behavior;
4. idempotency key;
5. audit event;
6. human approval requirement;
7. health signal.

## Continuous verification

A deployment has an observable state based on current build, smoke, route, dependency, secret, accessibility and external-integration evidence.

Use these states:

- `UNVERIFIED` — evidence is missing or stale.
- `VERIFIED` — named checks were observed.
- `LIVE` — deployment is reachable and the critical path has been checked.
- `DEGRADED` — reachable with a known failing capability.
- `REMEDIATION_REQUIRED` — a discrepancy has been recorded for follow-up.

A failed or missing check is recorded and routed to remediation. It does not create a repository-level production promotion lock.

## Owner boundary
Private, personal and self-development data stays separated from public product data. No agent may merge, deploy, spend money, contact a third party, alter billing, or expose private data without the configured owner gate.
