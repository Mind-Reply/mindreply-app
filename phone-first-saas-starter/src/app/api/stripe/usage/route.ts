import { NextResponse } from "next/server";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const workloads = new Set([
  "research_run",
  "agent_execution",
  "api_request",
  "compute_unit",
  "robotics_runtime",
  "document_operation",
]);
const departments = new Set([
  "research_discovery",
  "engineering",
  "robotics",
  "creative_design",
  "platform_operations",
  "infrastructure_compute",
  "enterprise_operations",
]);

function meterNameFor(workload: string): string | null {
  const names: Record<string, string> = {
    research_run: "STRIPE_METER_EVENT_NAME_RESEARCH_RUN",
    agent_execution: "STRIPE_METER_EVENT_NAME_AGENT_EXECUTION",
    api_request: "STRIPE_METER_EVENT_NAME_API_REQUEST",
    compute_unit: "STRIPE_METER_EVENT_NAME_COMPUTE_UNIT",
    robotics_runtime: "STRIPE_METER_EVENT_NAME_ROBOTICS_RUNTIME",
    document_operation: "STRIPE_METER_EVENT_NAME_DOCUMENT_OPERATION",
  };
  const key = names[workload];
  return key ? process.env[key] ?? null : null;
}

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const key = request.headers.get("idempotency-key") ?? "";
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(key)) {
      return NextResponse.json({ error: "A valid Idempotency-Key header is required." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      department?: unknown;
      workloadType?: unknown;
      quantity?: unknown;
      unit?: unknown;
      occurredAt?: unknown;
      metadata?: unknown;
    };

    if (typeof body.department !== "string" || !departments.has(body.department)) {
      return NextResponse.json({ error: "Unknown department." }, { status: 400 });
    }
    if (typeof body.workloadType !== "string" || !workloads.has(body.workloadType)) {
      return NextResponse.json({ error: "Unknown billable workload type." }, { status: 400 });
    }
    if (typeof body.quantity !== "number" || !Number.isFinite(body.quantity) || body.quantity <= 0 || body.quantity > 1_000_000_000) {
      return NextResponse.json({ error: "Quantity must be a positive finite number within the supported range." }, { status: 400 });
    }
    if (typeof body.unit !== "string" || !/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(body.unit)) {
      return NextResponse.json({ error: "Invalid usage unit." }, { status: 400 });
    }

    const occurredAt = typeof body.occurredAt === "string" ? new Date(body.occurredAt) : new Date();
    const now = Date.now();
    if (Number.isNaN(occurredAt.getTime()) || occurredAt.getTime() < now - 7 * 24 * 60 * 60 * 1000 || occurredAt.getTime() > now + 5 * 60 * 1000) {
      return NextResponse.json({ error: "Usage timestamp must be within the past 7 days and no more than 5 minutes in the future." }, { status: 400 });
    }

    const user = await syncCurrentUser();
    if (!user.organizationId) return NextResponse.json({ error: "An organization is required." }, { status: 409 });
    const subscription = await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } });
    if (!subscription?.stripeCustomerId || !["ACTIVE", "TRIALING"].includes(subscription.status)) {
      return NextResponse.json({ error: "An active sandbox subscription is required before metered workload can be recorded." }, { status: 402 });
    }

    const idempotencyKey = `${user.organizationId}:${key}`;
    const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? body.metadata as Prisma.InputJsonValue
      : undefined;
    if (metadata && JSON.stringify(metadata).length > 2048) {
      return NextResponse.json({ error: "Usage metadata exceeds the 2 KB limit." }, { status: 400 });
    }

    try {
      const saved = await prisma.usageMeterEvent.create({
        data: {
          idempotencyKey,
          organizationId: user.organizationId,
          clerkId,
          department: body.department,
          workloadType: body.workloadType,
          quantity: body.quantity,
          unit: body.unit,
          stripeCustomerId: subscription.stripeCustomerId,
          stripeMeterName: meterNameFor(body.workloadType),
          status: "RECORDED_PENDING_METER",
          occurredAt,
          metadata,
        },
        select: { id: true, status: true, occurredAt: true },
      });
      return NextResponse.json({ usage: saved, billingStatus: "recorded_not_submitted_to_stripe" }, { status: 201 });
    } catch (error) {
      if ((error as { code?: string }).code !== "P2002") throw error;
      const existing = await prisma.usageMeterEvent.findUnique({ where: { idempotencyKey } });
      if (!existing || existing.workloadType !== body.workloadType || existing.department !== body.department || Number(existing.quantity) !== body.quantity || existing.unit !== body.unit) {
        return NextResponse.json({ error: "Idempotency key was already used for a different usage event." }, { status: 409 });
      }
      return NextResponse.json({ usage: { id: existing.id, status: existing.status, occurredAt: existing.occurredAt }, duplicate: true, billingStatus: "recorded_not_submitted_to_stripe" });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    console.error("IIN usage record failed.", error);
    return NextResponse.json({ error: "Unable to record usage." }, { status: 500 });
  }
}
