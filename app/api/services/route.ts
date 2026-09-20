import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const services = [
  { id: "web", name: "Web experience", path: "/", kind: "application" },
  { id: "health", name: "Health service", path: "/api/health", kind: "microservice" },
  { id: "readiness", name: "Readiness service", path: "/api/ready", kind: "microservice" },
  { id: "version", name: "Release metadata", path: "/api/version", kind: "microservice" },
  { id: "dependencies", name: "Dependency checks", path: "/api/dependencies", kind: "microservice" },
  { id: "metrics", name: "Runtime metrics", path: "/api/metrics", kind: "microservice" },
  { id: "status", name: "Operations status", path: "/status", kind: "surface" },
  { id: "control", name: "Control plane", path: "/", kind: "integration" },
];

export async function GET() {
  return NextResponse.json({
    service: "mindreply",
    status: "catalogued",
    generatedAt: new Date().toISOString(),
    services,
  }, { headers: { "Cache-Control": "no-store" } });
}
