/**
 * Lumenforge — Edge Middleware helpers
 * Mount on Vercel / Next.js edge to stamp responses with gate status
 * and optionally short-circuit draft delivery routes.
 *
 * @see docs/ELYSIUM_RUNTIME.md
 */

import {
  evaluatePayload,
  decideGateAction,
  type GateAction,
} from "./index";
import type {
  ElysiumPayload,
  HelixContract,
  LumenforgeEvaluation,
} from "@mind-reply/elysium-core";

export interface EdgeGateInput {
  requestId: string;
  draft: string;
  contract: HelixContract;
  promptVersion?: string;
}

export interface EdgeGateResult {
  evaluation: LumenforgeEvaluation;
  action: GateAction;
  headers: Record<string, string>;
}

/**
 * Evaluate a draft at the edge and return action + response headers.
 * Does not call models or write ledgers — pure contract enforcement.
 */
export function runEdgeGate(input: EdgeGateInput): EdgeGateResult {
  const startedAt = Date.now();
  const payload: ElysiumPayload = {
    requestId: input.requestId,
    timestamp: new Date().toISOString(),
    draft: input.draft,
    promptVersion: input.promptVersion,
  };

  const evaluation = evaluatePayload(payload, {
    contract: input.contract,
    startedAt,
  });
  const action = decideGateAction(evaluation, input.contract);

  const headers: Record<string, string> = {
    "x-lumenforge-passed": evaluation.passed ? "1" : "0",
    "x-lumenforge-action": action,
    "x-lumenforge-contract": input.contract.id,
    "x-lumenforge-score": String(evaluation.score ?? ""),
  };
  if (evaluation.violations?.length) {
    headers["x-lumenforge-violations"] = evaluation.violations
      .slice(0, 5)
      .join(",");
  }

  return { evaluation, action, headers };
}

/** Paths that should receive Lumenforge status headers (matcher helper). */
export const LUMENFORGE_MATCHER = [
  "/api/elysium/:path*",
  "/api/audit/:path*",
];
