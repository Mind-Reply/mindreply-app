import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mindreply",
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  }, { headers: { "Cache-Control": "no-store" } });
}
