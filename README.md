# MindReply Proofline

**Owner-governed automation, GitHub release engineering, and evidence-led Python systems.**

MindReply Proofline is the canonical product repository for building reliable operational software: verified checkout paths, protected releases, observable services, and human-approved automation.

## What lives here

| Area | Function | Location |
|---|---|---|
| **ReplyControl** | Revenue page and customer-facing web experience | `apps/web-replycontrol/` |
| **A11-K Dialogue Console** | Owner-facing conversation and operations interface | `apps/a11k/` |
| **Asset Bridge** | Python service for evidence, asset and transaction workflows | `services/rwa-bridge/` |
| **Crownline integration boundary** | Product-side integration point to the private control root | `infrastructure/nexus/` |
| **Patternwright** | Visual-system and component experimentation | `apps/experimental/brushworks/` |
| **Venture Foundry** | Concept-to-deployment workflow experiments | `apps/experimental/forge/` |

The owner-control implementation boundary is `Mind-Reply/control-plane`. This product repository is the canonical MindReply product root and must not become a second owner-control plane.

## Operating docs

- [`docs/OPERATING_MODEL.md`](docs/OPERATING_MODEL.md) — product vs operations boundary and state vocabulary
- [`docs/AUTOMATION_MESH.md`](docs/AUTOMATION_MESH.md) — workflow automation and bounded operator roles
- [`docs/DOMAIN_AND_SEO_POLICY.md`](docs/DOMAIN_AND_SEO_POLICY.md) — domain selection and indexable surface rules
- [`docs/AGENT_FLEET_TEMPLATE.md`](docs/AGENT_FLEET_TEMPLATE.md) — template for bounded sub-agents

## Commercial focus

### GitHub + Python Profit Audit

A seven-day technical-commercial audit for teams that need clearer release controls, stronger automation, and measurable operational margin.

The audit covers:

- GitHub repository architecture and CI/CD risk;
- Python automation reliability and maintainability;
- payment-to-delivery workflow integrity;
- secret handling, deployment evidence, and rollback readiness;
- practical revenue and cost-reduction opportunities.

[Book the €3,000 audit](https://book.stripe.com/8x2aER4owd8c1TG4Ku63K00)

## Working vocabulary

We use branded terms only when they improve recall. Every branded term keeps a plain-English definition.

- **Proofline** — the evidence path from change to verified release.
- **Crownline** — owner approval, policy, and command controls.
- **ProofGate** — blocking validation before merge or deployment.
- **Continuity Ledger** — durable operational context and decision history.
- **ReplyRail** — approved messaging, voice, and delivery workflows.
- **Operator Guild** — constrained specialist automations with named permissions.
- **Reality Delta** — the gap between a claim and verified system state.

## Development

```bash
pnpm install
pnpm --filter web-replycontrol typecheck
pnpm --filter web-replycontrol build
```

Use `.env.example` as the variable-name reference. Never commit credentials.

## Release policy

- Pull requests validate; they do not deploy.
- Production promotion requires explicit owner approval.
- Releases must identify the exact commit or immutable artifact.
- Health checks report only facts the running service can prove.
- Failed validation is blocking, not advisory.

See [`docs/PROTECTED_RELEASE_RUNBOOK.md`](docs/PROTECTED_RELEASE_RUNBOOK.md).

## Repository truth

This repository is the **active product root**. `agent-control-plane` is the **private operational root**. `a11-live-cloud-execution` is the **A11 execution service**. Satellite repositories are experiments, historical sources, or migration pointers unless explicitly promoted in the canonical estate registry.

## License

MIT where declared in repository metadata. Individual imported components may carry their own notices; review them before redistribution.
