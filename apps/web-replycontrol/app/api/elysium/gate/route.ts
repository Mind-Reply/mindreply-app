import { NextResponse } from "next/server";
import {
  gateProfitAuditDraft,
  isAuditLoopEnabled,
  PROFIT_AUDIT_CONTRACT,
} from "@mind-reply/elysium-core";
import { evaluatePayload, decideGateAction } from "@mind-reply/lumenforge";
import {
  stampEnvelope,
  createSupabaseAppendWriter,
  isSupabaseWriterConfigured,
} from "@mind-reply/veridex";

/**
 * POST /api/elysium/gate
 * Body: { requestId: string, draft: string, promptVersion?: string }
 *
 * Feature-flagged Elysium loop. When VERIDEX_SUPABASE_* is set, envelopes
 * append fail-soft to the immutable ledger after stamp.
 */
export async function POST(request: Request) {
  let body: { requestId?: string; draft?: string; promptVersion?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const requestId = body.requestId?.trim();
  const draft = body.draft;
  if (!requestId || typeof draft !== "string") {
    return NextResponse.json(
      { error: "requestId_and_draft_required" },
      { status: 400 }
    );
  }

  if (draft.length > 200_000) {
    return NextResponse.json({ error: "draft_too_large" }, { status: 413 });
  }

  const enabled = isAuditLoopEnabled();
  const ledgerConfigured = isSupabaseWriterConfigured();

  const result = await gateProfitAuditDraft(
    {
      requestId,
      draft,
      promptVersion: body.promptVersion,
    },
    {
      evaluate: (payload, contract) =>
        evaluatePayload(payload, { contract }),
      stamp: (args) =>
        stampEnvelope({
          ...args,
          appendWriter: ledgerConfigured
            ? createSupabaseAppendWriter(requestId)
            : undefined,
        }),
    }
  );

  const action = result.evaluation
    ? decideGateAction(result.evaluation, PROFIT_AUDIT_CONTRACT)
    : result.blocked
      ? "block"
      : "allow";

  const ledgerWrite =
    result.envelope &&
    (result.envelope as { metadata?: { ledgerWrite?: string } }).metadata
      ?.ledgerWrite;

  return NextResponse.json(
    {
      enabled,
      ledger: ledgerConfigured ? "supabase" : "local_only",
      ledgerWrite: ledgerWrite ?? null,
      requestId: result.requestId,
      stage: result.stage,
      passed: result.passed,
      blocked: result.blocked,
      action,
      evaluation: result.evaluation ?? null,
      envelope: result.envelope
        ? {
            envelopeId: result.envelope.envelopeId,
            payloadHash: result.envelope.payloadHash,
            signature: result.envelope.signature,
            signedAt: result.envelope.signedAt,
          }
        : null,
      error: result.error ?? null,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "x-lumenforge-action": action,
        "x-veridex-ledger": ledgerConfigured ? "supabase" : "local_only",
      },
    }
  );
}
