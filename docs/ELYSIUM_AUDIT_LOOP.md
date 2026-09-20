# Elysium Audit Loop — Profit Audit Integration

**Issue:** #42  
**Parent epic:** #38  
**Status:** Wired (feature-flagged scaffold)

## Purpose

Make the live €3,000 GitHub + Python Profit Audit the first consumer of the Elysium closed-loop:

1. **Intent Capture** — audit request / draft findings enter the system
2. **Contract Verification** — Lumenforge evaluates against `helix/v1/profit-audit`
3. **Cryptographic Stamping** — Veridex writes an immutable envelope
4. **Execution & Delivery** — approved content proceeds to the delivery pack

## Feature flag

```bash
ELYSIUM_AUDIT_LOOP=1   # enable
# unset or 0            # disabled (default) — no-op pass
```

When disabled, `gateProfitAuditDraft` returns a safe pass result with `error: "elysium_audit_loop_disabled"`. Public CTA and Stripe checkout paths are untouched.

## Usage (internal)

```ts
import { gateProfitAuditDraft } from "@mind-reply/elysium-core";

const result = await gateProfitAuditDraft({
  requestId: "audit_2026-08-08_clientX",
  draft: executiveSummaryText,
  promptVersion: "1.0.0",
});

if (result.blocked) {
  // rewrite or escalate per fallback_strategy
}
// result.envelope holds Veridex receipt when enabled + stamped
```

## Contract

- YAML: `packages/elysium-core/contracts/helix.example.yaml`
- JSON: `packages/elysium-core/contracts/profit-audit.helix.json`
- In-code: `PROFIT_AUDIT_CONTRACT`

Banned vocabulary includes guarantee language unsuitable for professional audit deliverables.

## Safety

- Additive only
- No change to `apps/web-replycontrol` CTA
- No secrets
- Owner can enable the flag in a controlled environment before production traffic

## Next

- Real tokenizer + tone/hallucination probes (#40)
- Supabase append-only writer (#41)
- Aurelia compile path for policy updates (#39)
