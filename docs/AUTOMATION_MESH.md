# Automation Mesh

This document describes how the product root should handle automation without pretending every integration is the same.

## Tool choices

| Tool | Best use | Why it belongs here |
|---|---|---|
| **n8n** | durable multi-step workflows | best for long-running, branching, inspectable automations |
| **Zapier** | quick external triggers | best for lightweight event capture and fast integration glue |
| **Vector search** | semantic memory and retrieval | best for recall, grounding, and similarity lookup |
| **Sub-agents** | bounded specialist tasks | best for isolating responsibilities and limiting blast radius |

## Pattern

1. Capture the event.
2. Validate the payload.
3. Route to a bounded workflow.
4. Store evidence.
5. Return a human-readable result.
6. Stop on ambiguity.

## Naming rules

Use different names for different layers so the system stays readable:

- **Mesh** for the overall automation fabric.
- **Rail** for a single reliable workflow.
- **Pulse** for repeated monitoring.
- **Ledger** for durable history.
- **Bloom** for lightweight fan-out.

## Minimum viable stack

- n8n for owner-visible workflow orchestration
- vector search for semantic retrieval and memory
- GitHub for source of truth
- Supabase for relational evidence and state
- Slack or email for notifications
- a small registry of sub-agents for bounded work

## Guardrails

- No secret values in workflow steps or screenshots.
- No hidden retries that mask failure.
- No duplicate event processing without idempotency.
- No workflow may auto-escalate itself into an unsafe action.
