/**
 * Veridex delivery pack — attach .epack receipt to customer-facing audit packs.
 * Pure data structure; no network. Caller embeds into ZIP/PDF/email pipeline.
 *
 * Human lines follow docs/HUMAN_SIGNAL_LEXICON.md
 */

import type { VeridexEnvelope, LumenforgeEvaluation } from "@mind-reply/elysium-core";

export interface DeliveryPackInput {
  requestId: string;
  clientLabel?: string;
  surface?: string;
  draftSummary?: string;
  evaluation?: LumenforgeEvaluation | null;
  envelope?: VeridexEnvelope | null;
  action?: string;
  generatedAt?: string;
}

export interface DeliveryPack {
  kind: "mind-reply.epack.v1";
  requestId: string;
  clientLabel?: string;
  surface: string;
  generatedAt: string;
  gate: {
    action: string;
    passed: boolean;
    contractId?: string;
    score?: number;
    violations?: string[];
  };
  receipt: {
    envelopeId?: string;
    payloadHash?: string;
    signature?: string;
    signedAt?: string;
    promptVersion?: string;
  } | null;
  /** One-line human statement for the pack cover */
  humanLine: string;
  /** Embed this object as `receipt.epack.json` in delivery artifacts */
  artifactHint: string;
}

export function buildDeliveryPack(input: DeliveryPackInput): DeliveryPack {
  const evaluation = input.evaluation;
  const envelope = input.envelope;
  const passed = evaluation?.passed ?? false;
  const action = input.action ?? (passed ? "allow" : "block");

  const humanLine = passed
    ? "This deliverable cleared the quality wall and carries a Veridex receipt. People still own the last word."
    : "This draft did not clear the quality wall; do not treat it as final delivery.";

  return {
    kind: "mind-reply.epack.v1",
    requestId: input.requestId,
    clientLabel: input.clientLabel,
    surface: input.surface ?? "profit-audit",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    gate: {
      action,
      passed,
      contractId: evaluation?.contractId,
      score: evaluation?.score,
      violations: evaluation?.violations,
    },
    receipt: envelope
      ? {
          envelopeId: envelope.envelopeId,
          payloadHash: envelope.payloadHash,
          signature: envelope.signature,
          signedAt: envelope.signedAt,
          promptVersion: envelope.promptVersion,
        }
      : null,
    humanLine,
    artifactHint: "receipt.epack.json",
  };
}

/** Serialize for file write / attachment */
export function serializeDeliveryPack(pack: DeliveryPack): string {
  return JSON.stringify(pack, null, 2);
}
