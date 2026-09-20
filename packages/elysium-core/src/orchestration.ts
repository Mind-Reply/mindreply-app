/**
 * Elysium Orchestration Loop
 * Intent Capture → Contract Verification → Cryptographic Stamping → Execution & Delivery
 *
 * @see docs/ELYSIUM_STACK.md
 * @see epic #38 / issue #42
 */

import type {
  ElysiumPayload,
  HelixContract,
  LumenforgeEvaluation,
  OrchestrationEvent,
  OrchestrationStage,
  VeridexEnvelope,
} from "./index";

export interface OrchestrationDeps {
  /** Compile or load the active Helix contract (Aurelia responsibility) */
  resolveContract: (payload: ElysiumPayload) => Promise<HelixContract> | HelixContract;
  /** Evaluate draft against contract (Lumenforge) */
  evaluate: (
    payload: ElysiumPayload,
    contract: HelixContract
  ) => Promise<LumenforgeEvaluation> | LumenforgeEvaluation;
  /** Stamp approved state into immutable ledger (Veridex) */
  stamp: (args: {
    payload: ElysiumPayload;
    evaluation: LumenforgeEvaluation;
    promptVersion?: string;
  }) => Promise<VeridexEnvelope>;
  /** Optional side-effect hooks for observability */
  onEvent?: (event: OrchestrationEvent) => void;
}

export interface OrchestrationResult {
  requestId: string;
  stage: OrchestrationStage;
  passed: boolean;
  evaluation?: LumenforgeEvaluation;
  envelope?: VeridexEnvelope;
  error?: string;
  /** True when the loop was short-circuited by feature flag or contract failure */
  blocked: boolean;
}

function emit(
  deps: OrchestrationDeps,
  event: OrchestrationEvent
): void {
  try {
    deps.onEvent?.(event);
  } catch {
    // never let observability break the loop
  }
}

/**
 * Run the closed-loop orchestration for a single request.
 * Fail-closed on evaluation failure when the contract requires it.
 */
export async function runOrchestrationLoop(
  payload: ElysiumPayload,
  deps: OrchestrationDeps
): Promise<OrchestrationResult> {
  const requestId = payload.requestId;

  // 1. Intent Capture (Aurelia already resolved context into payload)
  emit(deps, { stage: "intent_capture", requestId, payload });

  let contract: HelixContract;
  try {
    contract = await deps.resolveContract(payload);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    emit(deps, { stage: "intent_capture", requestId, error });
    return { requestId, stage: "intent_capture", passed: false, blocked: true, error };
  }

  // 2. Contract Verification (Lumenforge)
  emit(deps, { stage: "contract_verification", requestId, payload });
  let evaluation: LumenforgeEvaluation;
  try {
    evaluation = await deps.evaluate(payload, contract);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    emit(deps, { stage: "contract_verification", requestId, error });
    return {
      requestId,
      stage: "contract_verification",
      passed: false,
      blocked: true,
      error,
    };
  }

  if (!evaluation.passed) {
    emit(deps, {
      stage: "contract_verification",
      requestId,
      evaluation,
      error: evaluation.violations?.join("; ") ?? "contract_failed",
    });
    return {
      requestId,
      stage: "contract_verification",
      passed: false,
      evaluation,
      blocked: true,
      error: evaluation.violations?.join("; ") ?? "contract_failed",
    };
  }

  // 3. Cryptographic Stamping (Veridex)
  emit(deps, { stage: "cryptographic_stamping", requestId, evaluation });
  let envelope: VeridexEnvelope;
  try {
    envelope = await deps.stamp({
      payload,
      evaluation,
      promptVersion: payload.promptVersion,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    emit(deps, { stage: "cryptographic_stamping", requestId, error });
    // Stamping failure does not necessarily block delivery in scaffold mode;
    // production can choose fail-closed via env.
    return {
      requestId,
      stage: "cryptographic_stamping",
      passed: true,
      evaluation,
      blocked: false,
      error,
    };
  }

  // 4. Execution & Delivery (caller performs the actual side-effect)
  emit(deps, {
    stage: "execution_delivery",
    requestId,
    evaluation,
    envelope,
  });

  return {
    requestId,
    stage: "execution_delivery",
    passed: true,
    evaluation,
    envelope,
    blocked: false,
  };
}
