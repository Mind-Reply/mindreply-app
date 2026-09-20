import { NextResponse } from "next/server";
import { PROFIT_AUDIT_CONTRACT } from "@mind-reply/elysium-core";
import { compileExpertIntent } from "@mind-reply/aurelia";

/**
 * POST /api/elysium/compile
 * Body: { intent: string, target?: string }
 *
 * Aurelia: natural-language expert intent → deterministic Helix contract.
 * Does not write ledger or call models. Safe to call anytime.
 */
export async function POST(request: Request) {
  let body: { intent?: string; target?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const intent = body.intent?.trim();
  if (!intent) {
    return NextResponse.json({ error: "intent_required" }, { status: 400 });
  }
  if (intent.length > 20_000) {
    return NextResponse.json({ error: "intent_too_large" }, { status: 413 });
  }

  const compiled = compileExpertIntent(
    { intent, target: body.target },
    PROFIT_AUDIT_CONTRACT
  );

  return NextResponse.json(
    {
      layer: "aurelia",
      baseContractId: PROFIT_AUDIT_CONTRACT.id,
      version: compiled.version,
      compiledAt: compiled.compiledAt,
      diffSummary: compiled.diffSummary,
      contract: compiled.contract,
      routing: compiled.routing ?? null,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "x-aurelia-compile": "1",
      },
    }
  );
}
