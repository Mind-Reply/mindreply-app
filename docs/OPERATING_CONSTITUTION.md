# MindReply Operating Constitution

## Purpose
MindReply exists to help a person notice what matters, understand the situation, choose deliberately, act safely, and know what actually happened.

The system must never manufacture confidence, activity, revenue, uptime, integrations, automation, certification, or outcomes that have not been verified.

## Product grammar
Each surface gets its own vocabulary. Shared concepts are principles, not UI labels.

| Surface | Native vocabulary | Job |
|---|---|---|
| MindReply Core | Proof, Route, Signal, Commit, Reality | trusted operating layer |
| A11-K | Thread, Pulse, Relay, Guardrail | private command/orchestration |
| AUREL | Trace, Frame, Finish, Evidence | presentation/trust |
| Phone-first SaaS | Moment, Next, Check, Return | low-friction customer action |
| Nexus | Bridge, Parcel, Contract, Watch | integrations/data movement |
| Agent Control Plane | Charter, Cell, Lease, Verdict | agent governance |

Do not copy a vocabulary term between surfaces unless the underlying behavior is genuinely identical.

## Human-first behavior
- Prefer one meaningful next action over a dashboard of possibilities.
- Explain consequential automation before it runs.
- Show proof after it runs.
- Make recovery visible and reversible where possible.
- Preserve user agency for irreversible actions.
- Never use fake live counters, fabricated activity, simulated customer evidence, or decorative system status.
- Empty states must help a person begin; they must not pretend work already exists.

## Reality contract
Every externally visible claim is one of: `VERIFIED`, `OBSERVED`, `INFERRED`, `PLANNED`, or `UNAVAILABLE`.
Only `VERIFIED` and explicitly qualified `OBSERVED` facts may be presented as current capabilities.

## Release gates
A release is not complete until:
1. critical routes return non-error responses;
2. authentication boundaries are tested;
3. external webhooks are signature verified;
4. secrets are absent from client bundles;
5. production claims match deployed behavior;
6. rollback is known;
7. the release record identifies what changed and what was not verified.

## Automation boundary
n8n, Zapier-compatible hooks, queues, cron jobs, vector retrieval, and external connectors are adapters. Core business truth remains provider-neutral and must have a deterministic local representation.

## Agent boundary
Agents may inspect, propose, test, classify, document, and prepare changes. They may not silently alter production, rotate secrets, publish legal claims, or represent an unverified result as completed.

## Accessibility
Keyboard access, reduced motion, semantic landmarks, readable contrast, visible focus, screen-reader labels, touch targets, and error recovery are release requirements rather than polish.
