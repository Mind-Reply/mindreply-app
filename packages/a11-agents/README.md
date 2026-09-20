# packages/a11-agents

Owner-only A11 private agent hierarchy scaffold.

This package defines the **named agents** used by CEO A.K. It is intentionally minimal and secret-free.

## Hierarchy

```
a11_ceo_private
├── a11_workstation_architect
├── a11_implementation_engineer
├── a11_security_network_architect
├── a11_research_analyst
├── a11_robotics_coordinator
├── a11_fulfillment_orchestrator
└── a11_opportunity_monitor
```

Full roles, boundaries, and sale constraints: `docs/A11_PRIVATE_AGENT_HIERARCHY.md` and `docs/A11_AGENT_SALE_PAGES.md`.

## Local use (owner machine)

When you have a Python environment with `google-adk` (or a compatible runner):

```bash
pip install google-adk   # only on the owner machine if desired
python -c "from a11_agents import root_agent; print(root_agent.name)"
```

The definitions in `hierarchy.py` are written so they can be adapted to `llm_agent.Agent` once the owner confirms model and tool wiring.

## Hard rules

- No secret values in this package.
- No automatic cloud, payment, DNS, or production deploy tools.
- Mutation paths must surface `AWAITING_APPROVAL` until the owner issues an explicit approval token.
- Public sale language must follow `docs/A11_AGENT_SALE_PAGES.md`.

## Status

- [x] Named hierarchy documented
- [x] Sale contract documented
- [x] Minimal Python definitions
- [ ] Owner-environment smoke test
- [ ] ADK Runtime / Memory Bank / VPC-SC wiring (opt-in, requires verified GCP project + approval)
