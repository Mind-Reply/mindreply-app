/**
 * Profit Audit — first live consumer of the Elysium orchestration loop.
 * Feature-flagged. Does not alter public CTA or Stripe intake.
 *
 * @see issue #42
 * @see docs/ELYSIUM_STACK.md
 */

import type { ElysiumPayload, HelixContract } from "./index";
import { runOrchestrationLoop, type OrchestrationResult } from "./orchestration";

/** Feature flag — set ELYSIUM_AUDIT_LOOP=1 to enable in runtime environments */
export function isAuditLoopEnabled(): boolean {
  if (typeof process !== "undefined" && process.env) {
    return process.env.ELYSIUM_AUDIT_LOOP === "1" || process.env.ELYSIUM_AUDIT_LOOP === "true";
  }
  return false;
}

/** Machine-readable Helix contract for the €3k audit (mirrors helix.example.yaml) */
export const PROFIT_AUDIT_CONTRACT: HelixContract = {
  id: "helix/v1/profit-audit",
  version: "1.0.0",
  max_tokens: 4096,
  required_tone: "professional",
  banned_vocabulary: ["guarantee", "risk-free", "100%", "never fails"],
  max_latency_ms: 8000,
  hallucination_check: "strict",
  fallback_strategy: "rewrite_once",
};

export interface AuditDraftInput {
  requestId: string;
  /** Draft executive summary / findings text to gate */
  draft: string;
  /** Optional prompt / policy version for Veridex */
  promptVersion?: string;
  context?: Record<string, unknown>;
}

/**
 * Run the Elysium loop over an audit draft.
 * When the feature flag is off, returns a no-op pass result so callers remain safe.
 */
export async function gateProfitAuditDraft(
  input: AuditDraftInput,
  deps?: {
    evaluate?: (
      payload: ElysiumPayload,
      contract: HelixContract
    ) => Promise<import("./index").LumenforgeEvaluation> | import("./index").LumenforgeEvaluation;
    stamp?: (args: {
      payload: ElysiumPayload;
      evaluation: import("./index").LumenforgeEvaluation;
      promptVersion?: string;
    }) => Promise<import("./index").VeridexEnvelope>;
    onEvent?: (event: import("./index").OrchestrationEvent) => void;
  }
): Promise<OrchestrationResult> {
  const payload: ElysiumPayload = {
    requestId: input.requestId,
    timestamp: new Date().toISOString(),
    draft: input.draft,
    promptVersion: input.promptVersion ?? PROFIT_AUDIT_CONTRACT.version,
    context: {
      surface: "profit-audit",
      commercial: true,
      ...input.context,
    },
  };

  if (!isAuditLoopEnabled()) {
    return {
      requestId: payload.requestId,
      stage: "execution_delivery",
      passed: true,
      blocked: false,
      error: "elysium_audit_loop_disabled",
    };
  }

  // Default scaffold implementations when not injected
  const evaluate =
    deps?.evaluate ??
    (async (p, c) => {
      // Dynamic import keeps optional dependency light for tree-shaking
      const { evaluatePayload } = await import("@mind-reply/lumenforge");
      return evaluatePayload(p, { contract: c });
    });

  const stamp =
    deps?.stamp ??
    (async (args) => {
      const { stampEnvelope } = await import("@mind-reply/veridex");
      return stampEnvelope(args);
    });

  return runOrchestrationLoop(payload, {
    resolveContract: () => PROFIT_AUDIT_CONTRACT,
    evaluate,
    stamp,
    onEvent: deps?.onEvent,
  });
}
