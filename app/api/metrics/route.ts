import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const memory = process.memoryUsage();
  return NextResponse.json({
    service: "mindreply",
    status: "measured",
    timestamp: new Date().toISOString(),
    runtime: {
      node: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      memory: {
        rssBytes: memory.rss,
        heapUsedBytes: memory.heapUsed,
        heapTotalBytes: memory.heapTotal,
        externalBytes: memory.external,
      },
    },
  }, { headers: { "Cache-Control": "no-store" } });
}
