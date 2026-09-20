import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const required = ["DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);
  const ready = missing.length === 0;

  return NextResponse.json({
    ok: ready,
    service: "mindreply",
    status: ready ? "ready" : "configuration-incomplete",
    checks: {
      environment: ready ? "pass" : "fail",
    },
    missing,
    timestamp: new Date().toISOString(),
  }, { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
