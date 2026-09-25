# Reverse Profit Engineering

Canonical commercial processing for the known applications in `Mind-Reply/mindreply-app`.

The model starts at the money event and works backwards:

**transaction → offer → buyer action → proof → delivery → expansion → retention**

This is an engineering map, not a revenue claim. No revenue, conversion, customer, or production status is inferred from source code.

## Processed surfaces

| Surface | Commercial role | Money path |
|---|---|---|
| A11-K | Demand | qualified demand → paid audit/service |
| Chat | Qualification | accountable brief → diagnostic/implementation |
| Nexus | Qualification | decision route → audit/architecture/implementation |
| Forge | Delivery | release-risk problem → engineering/release engagement |
| Studio | Expansion | verified proof → commercial content/site work |
| OWN Registrar | Transaction | registration → paid workspace/service → reseller expansion |
| ReplyControl | Transaction | offer → checkout → delivery → expansion |
| MindReply Local iOS | Retention | repeat local use → future product/service expansion |

## Current repository evidence

The canonical README already defines a €3,000 GitHub + Python Profit Audit and a Stripe booking path. The repository also contains an Elysium profit-audit contract with a seven-day delivery model. Those are source-level commercial definitions, not evidence of completed sales.

The implementation deliberately separates:
- demand generation from transaction;
- qualification from dispatch;
- delivery from deployment;
- proof from marketing claims;
- revenue opportunity from realized revenue.

## Processing rule

Every surface is processed through the same deterministic contract in
`packages/elysium-core/src/reverse-profit-engine.ts`.

A surface is only **READY_FOR_VERIFICATION** when its required proof is supplied and no active blocking condition is present. Otherwise it remains **EVIDENCE_REQUIRED**.

No automatic billing, outreach, deployment, or irreversible action is performed by this registry.

## Next verification targets

1. Verify the actual checkout/offer path in ReplyControl.
2. Verify whether OWN Registrar has a real payment boundary or remains local-first.
3. Verify each public A11-K surface against its deployed domain before calling it live.
4. Measure real funnel events only after instrumentation exists.
5. Connect accepted commercial evidence to the owner-controlled ledger.
