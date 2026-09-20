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
  buildDeliveryPack,
  serializeDeliveryPack,
} from "@mind-reply/veridex";

/**
 * POST /api/elysium/pack
 * Gate a draft and return a customer-ready delivery pack (.epack JSON).
 * Body: { requestId, draft, promptVersion?, clientLabel? }
 */
export async function POST(request: Request) {
  let body: {
    requestId?: string;
    draft?: string;
    promptVersion?: string;
    clientLabel?: string;
  };
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

  const pack = buildDeliveryPack({
    requestId,
    clientLabel: body.clientLabel,
    surface: "profit-audit",
    evaluation: result.evaluation,
    envelope: result.envelope,
    action,
  });

  return NextResponse.json(
    {
      enabled,
      ledger: ledgerConfigured ? "supabase" : "local_only",
      action,
      passed: result.passed,
      blocked: result.blocked,
      pack,
      epackJson: serializeDeliveryPack(pack),
      error: result.error ?? null,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "x-lumenforge-action": action,
        "x-veridex-ledger": ledgerConfigured ? "supabase" : "local_only",
        "x-epack-kind": pack.kind,
      },
    }
  );
}
