import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checks = [
  { id: "database", env: "DATABASE_URL", label: "Primary database configuration" },
  { id: "publicBaseUrl", env: "NEXT_PUBLIC_APP_URL", label: "Public application URL" },
];

export async function GET() {
  const results = checks.map(({ id, env, label }) => ({
    id,
    label,
    configured: Boolean(process.env[env]),
  }));
  const configured = results.every((item) => item.configured);

  return NextResponse.json({
    service: "mindreply-dependencies",
    ok: configured,
    status: configured ? "configured" : "configuration-incomplete",
    checks: results,
    timestamp: new Date().toISOString(),
  }, {
    status: configured ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
