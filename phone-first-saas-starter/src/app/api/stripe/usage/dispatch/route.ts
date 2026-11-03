import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const actor = await prisma.user.findUnique({ where: { clerkId } });
    if (!actor || actor.role !== "ADMIN") {
      return NextResponse.json({ error: "Billing administrator permission is required." }, { status: 403 });
    }

    if (process.env.STRIPE_METER_BILLING_ENABLED !== "true") {
      return NextResponse.json({ error: "Meter forwarding is disabled until meter definitions and metered Prices are approved." }, { status: 503 });
    }
    if (!/^rk_test_|^sk_test_/.test(process.env.STRIPE_SECRET_KEY ?? "")) {
      return NextResponse.json({ error: "This dispatcher accepts test-mode Stripe credentials only." }, { status: 503 });
    }

    const body = (await request.json().catch(() => ({}))) as { limit?: unknown };
    const limit = body.limit === undefined ? 10 : body.limit;
    if (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 25) {
      return NextResponse.json({ error: "Limit must be an integer between 1 and 25." }, { status: 400 });
    }

    // Recover abandoned dispatch claims as uncertain outcomes. A worker may
    // have reached Stripe before losing its DB connection, so these rows are
    // never blindly submitted again.
    const staleSubmissionBefore = new Date(Date.now() - 5 * 60 * 1000);
    await prisma.usageMeterEvent.updateMany({
      where: {
        status: "SUBMITTING",
        updatedAt: { lt: staleSubmissionBefore },
      },
      data: {
        status: "SUBMISSION_UNKNOWN",
        lastError: "StaleDispatchClaimRequiresReconciliation",
      },
    });

    const pending = await prisma.usageMeterEvent.findMany({
      where: {
        status: "RECORDED_PENDING_METER",
        stripeMeterName: { not: null },
        stripeCustomerId: { not: null },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    const stripe = getStripe();
    const results: Array<{ usageId: string; status: string }> = [];
    for (const usage of pending) {
      const claim = await prisma.usageMeterEvent.updateMany({
        where: { id: usage.id, status: "RECORDED_PENDING_METER" },
        data: { status: "SUBMITTING", lastError: null },
      });
      if (claim.count !== 1) continue;

      try {
        const meterName = usage.stripeMeterName;
        const customerId = usage.stripeCustomerId;
        if (!meterName || !customerId) throw new Error("METER_CONFIGURATION_MISSING");

        await stripe.billing.meterEvents.create({
          event_name: meterName,
          payload: {
            stripe_customer_id: customerId,
            value: usage.quantity.toString(),
          },
          identifier: usage.id,
          timestamp: Math.floor(usage.occurredAt.getTime() / 1000),
        });

        await prisma.usageMeterEvent.update({
          where: { id: usage.id },
          data: {
            status: "SUBMITTED_TO_STRIPE",
            stripeMeterEventIdentifier: usage.id,
            submittedAt: new Date(),
            lastError: null,
          },
        });
        results.push({ usageId: usage.id, status: "SUBMITTED_TO_STRIPE" });
      } catch (error) {
        // A network timeout can occur after Stripe has accepted an event.
        // Do not blindly resubmit: retain the stable identifier and require
        // reconciliation before any manual retry.
        await prisma.usageMeterEvent.update({
          where: { id: usage.id },
          data: {
            status: "SUBMISSION_UNKNOWN",
            lastError: error instanceof Error ? error.name.slice(0, 120) : "UnknownError",
          },
        });
        results.push({ usageId: usage.id, status: "SUBMISSION_UNKNOWN" });
      }
    }

    return NextResponse.json({
      processed: results.length,
      results,
      note: "SUBMISSION_UNKNOWN rows require reconciliation before retry.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    console.error("Stripe usage dispatch failed.", error);
    return NextResponse.json({ error: "Unable to dispatch usage events." }, { status: 502 });
  }
}
