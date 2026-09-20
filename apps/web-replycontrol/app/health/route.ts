import { NextResponse } from "next/server";

const RELEASE_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.RELEASE_SHA ??
  "unknown";

/**
 * Public liveness endpoint for the web application.
 * This reports only process-level health; dependency readiness remains under
 * /api/health and the other explicit readiness endpoints.
 */
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "web-replycontrol",
      release: RELEASE_SHA,
      checkedAt: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
