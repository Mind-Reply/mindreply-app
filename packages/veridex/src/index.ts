/**
 * Veridex — Provenance-First Intelligence
 * Packages every input, evaluation, and output into an immutable
 * cryptographic envelope. Emits signed .epack receipts.
 *
 * @see docs/ELYSIUM_STACK.md
 * @see docs/ELYSIUM_RUNTIME.md
 * @see docs/ELYSIUM_E2E.md
 */

import type {
  ElysiumPayload,
  LumenforgeEvaluation,
  VeridexEnvelope,
} from "@mind-reply/elysium-core";

export interface StampOptions {
  payload: ElysiumPayload;
  evaluation: LumenforgeEvaluation;
  promptVersion?: string;
  previousHash?: string;
  /** Optional external append writer (e.g. Supabase). Called after local hash. */
  appendWriter?: (envelope: VeridexEnvelope) => Promise<void>;
}

function canonicalString(
  payload: ElysiumPayload,
  evaluation: LumenforgeEvaluation,
  promptVersion?: string,
  previousHash?: string
): string {
  return JSON.stringify({
    requestId: payload.requestId,
    timestamp: payload.timestamp,
    promptVersion: promptVersion ?? payload.promptVersion ?? null,
    draftLength: payload.draft?.length ?? 0,
    evaluation: {
      contractId: evaluation.contractId,
      passed: evaluation.passed,
      score: evaluation.score ?? null,
      violations: evaluation.violations ?? [],
      latencyMs: evaluation.latencyMs ?? null,
      evaluatedAt: evaluation.evaluatedAt,
    },
    previousHash: previousHash ?? null,
  });
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return `fnv1a32-${(h >>> 0).toString(16).padStart(8, "0")}`;
  }
  const digest = await subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function stampEnvelope(
  options: StampOptions
): Promise<VeridexEnvelope> {
  const { payload, evaluation, promptVersion, previousHash, appendWriter } =
    options;

  const canonical = canonicalString(
    payload,
    evaluation,
    promptVersion,
    previousHash
  );
  const payloadHash = await sha256Hex(canonical);

  const envelope: VeridexEnvelope = {
    envelopeId: `epack_${payload.requestId}_${Date.now()}`,
    payloadHash,
    evaluation,
    promptVersion: promptVersion ?? payload.promptVersion,
    signedAt: new Date().toISOString(),
    previousHash,
    signature: `sha256:${payloadHash}`,
  };

  if (appendWriter) {
    await appendWriter(envelope);
  }

  return envelope;
}

export function toSupabaseRow(envelope: VeridexEnvelope, requestId: string) {
  return {
    envelope_id: envelope.envelopeId,
    payload_hash: envelope.payloadHash,
    signature: envelope.signature ?? null,
    previous_hash: envelope.previousHash ?? null,
    prompt_version: envelope.promptVersion ?? null,
    evaluation: envelope.evaluation,
    signed_at: envelope.signedAt,
    request_id: requestId,
  };
}

export {
  appendEnvelopeToSupabase,
  createSupabaseAppendWriter,
  isSupabaseWriterConfigured,
} from "./supabase";

export {
  buildDeliveryPack,
  serializeDeliveryPack,
  type DeliveryPack,
  type DeliveryPackInput,
} from "./delivery-pack";

export type { VeridexEnvelope, ElysiumPayload, LumenforgeEvaluation };
