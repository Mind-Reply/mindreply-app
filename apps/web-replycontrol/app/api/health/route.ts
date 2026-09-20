import { NextResponse } from "next/server";

const RELEASE_SHA =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.RELEASE_SHA ??
  "unknown";

/**
 * Unauthenticated readiness endpoint.
 *
 * This endpoint deliberately reports only facts this process can prove. It does
 * not claim database, Redis, Stripe, or provider health without real checks.
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
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
