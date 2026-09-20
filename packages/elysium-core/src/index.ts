/**
 * Elysium Core — shared control-plane types and Helix Protocol primitives.
 * @see docs/ELYSIUM_STACK.md
 * @see epic #38
 */

export type HelixContractId = string;

export interface HelixContract {
  id: HelixContractId;
  version: string;
  max_tokens?: number;
  required_tone?: string;
  banned_vocabulary?: string[];
  max_latency_ms?: number;
  hallucination_check?: "none" | "basic" | "strict";
  fallback_strategy?: "block" | "rewrite_once" | "localized_fallback";
  [key: string]: unknown;
}

export interface ElysiumPayload {
  requestId: string;
  timestamp: string;
  promptVersion?: string;
  context?: Record<string, unknown>;
  draft?: string;
  metadata?: Record<string, unknown>;
}

export interface LumenforgeEvaluation {
  contractId: HelixContractId;
  passed: boolean;
  score?: number;
  violations?: string[];
  latencyMs?: number;
  evaluatedAt: string;
}

export interface VeridexEnvelope {
  envelopeId: string;
  payloadHash: string; // SHA-256
  evaluation: LumenforgeEvaluation;
  promptVersion?: string;
  signedAt: string;
  signature?: string; // .epack receipt
  previousHash?: string; // chain integrity
}

export type OrchestrationStage =
  | "intent_capture"
  | "contract_verification"
  | "cryptographic_stamping"
  | "execution_delivery";

export interface OrchestrationEvent {
  stage: OrchestrationStage;
  requestId: string;
  payload?: ElysiumPayload;
  evaluation?: LumenforgeEvaluation;
  envelope?: VeridexEnvelope;
  error?: string;
}

export {
  runOrchestrationLoop,
  type OrchestrationDeps,
  type OrchestrationResult,
} from "./orchestration";

export {
  gateProfitAuditDraft,
  isAuditLoopEnabled,
  PROFIT_AUDIT_CONTRACT,
  type AuditDraftInput,
} from "./profit-audit";
