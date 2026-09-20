# Uncommon Dictionary

A controlled vocabulary for MindReply surfaces. The purpose is memorability without sacrificing clarity.

| Term | Plain meaning | Use when | Do not use when |
|---|---|---|---|
| **Proofline** | Evidence from change to verified result | Release and operational confidence | A normal status label is enough |
| **Crownline** | Owner approval and policy boundary | High-impact controls | Routine user actions |
| **ProofGate** | A blocking validation checkpoint | Merge, deploy, publish | Minor UI validation |
| **Reality Delta** | Difference between expected and actual state | Diagnostics and audits | Customer-facing error copy |
| **Continuity Ledger** | Durable history of decisions and state | Long-running workflows | Simple activity feeds |
| **ReplyRail** | Approved communication path | Messaging and follow-up | Generic navigation |
| **Operator Guild** | Constrained specialist automation | Internal orchestration | Marketing copy |
| **Pulse** | A small confirmation of change | Live UI feedback | Full notifications |
| **Trail** | Recent path through a task | Recovery and context | Standard breadcrumbs |
| **Checkpoint** | Confirmation before consequential action | Publish, delete, pay, deploy | Safe reversible actions |
| **Proof Peek** | Small evidence view supporting a claim | Status and verification | Decorative analytics |
| **Quiet Undo** | Short reversible window after an action | Delete, archive, dismiss | Irreversible external events |
| **Reveal** | Contextual secondary detail | Dense mobile interfaces | Information users always need |
| **Commit Preview** | Preview of a consequential result | Publish and deployment | Ordinary navigation |
| **Human Signal** | A meaningful user decision or preference | Personalization and workflows | Generic telemetry |
| **Open Loop** | A task that still needs a person | Dashboards and inboxes | Completed work |
| **Closeout** | Explicit completion of a task | Operations and delivery | Generic success messages |
| **Warm Start** | Useful first state with little setup | Onboarding and empty states | Technical bootstrapping |
| **Edge Note** | Small context that prevents a mistake | Forms and risky actions | General help text |

## Dictionary rules

1. Every coined term must have a plain-English companion somewhere nearby.
2. Never create a branded term just to rename a common UI element.
3. A term must compress a recurring concept, not decorate a single sentence.
4. Product language should remain understandable when all coined terms are removed.
5. Do not use “AI” as a substitute for describing a real capability.
6. Avoid fake precision. If a state cannot be verified, say that it cannot be verified.
7. New terms should be tested against three questions: Can a stranger infer the meaning? Does it improve recall? Does it change how the product behaves?

## Anti-cliche filter

Reject copy containing generic startup filler unless there is a concrete reason to retain it:

`seamless`, `revolutionary`, `cutting-edge`, `next-generation`, `unlock`, `supercharge`, `game-changing`, `AI-powered`, `intelligent solution`, `effortless`, `transform your`, `at scale`.

Replace the abstraction with a user-visible outcome.

Example:

> “Seamlessly automate your workflow.”

becomes:

> “Turn the next request into a ready-to-send reply.”

## Naming pattern

When a new concept is genuinely distinctive, prefer a short concrete compound:

`[physical metaphor] + [human action/state]`

Examples: `ReplyRail`, `Proof Peek`, `Quiet Undo`, `Warm Start`.

Do not stack branded terms. One memorable term per sentence is usually enough.
