import { NextResponse } from "next/server";
import {
  readPressureReceipt,
  synthesizePressure,
} from "@/lib/pressure-agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const receiptId = new URL(request.url).searchParams.get("receipt_id");

  if (!receiptId) {
    return NextResponse.json(
      { ok: false, error: "receipt_id is required." },
      { status: 400 }
    );
  }

  const receipt = readPressureReceipt(receiptId);

  if (!receipt) {
    return NextResponse.json(
      { ok: false, error: "Receipt is invalid or expired." },
      { status: 404 }
    );
  }

  const agent = synthesizePressure(receipt.pressure_text, {
    id: receiptId,
    issued_at: receipt.issued_at,
    expires_at: receipt.expires_at,
  });

  return NextResponse.json(
    {
      ok: true,
      ...agent,
      execution: {
        mode: "single_action",
        execute_only: "one_action",
        executable: agent.risk_gate.status === "clear",
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
