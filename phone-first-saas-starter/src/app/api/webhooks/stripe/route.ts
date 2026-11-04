import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { handleStripeEvent } from "@/server/webhooks/stripeHandler";

export const runtime = "nodejs";

function eventObjectId(event: Stripe.Event): string | null {
  const object = event.data.object as unknown as { id?: unknown };
  return typeof object.id === "string" ? object.id : null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  // Stripe signatures must be verified against the exact raw request body.
  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  // This route is deliberately sandbox-only. Live events must not enter the
  // A11-K sandbox ledger, even if a live signing secret is accidentally set.
  if (event.livemode) {
    return NextResponse.json({ error: "Live Stripe events are not accepted by this sandbox endpoint." }, { status: 400 });
  }

  try {
    await prisma.stripeEvent.upsert({
      where: { id: event.id },
      create: {
        id: event.id,
        type: event.type,
        objectId: eventObjectId(event),
        livemode: event.livemode,
        apiVersion: event.api_version ?? null,
        status: "RECEIVED",
      },
      update: {},
    });

    const existing = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
    if (existing?.status === "PROCESSED") {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Claim new/failed events, or recover a processing lease older than two
    // minutes. A concurrent in-flight delivery returns 5xx so Stripe retries.
    const staleLease = new Date(Date.now() - 2 * 60 * 1000);
    const claim = await prisma.stripeEvent.updateMany({
      where: {
        id: event.id,
        OR: [
          { status: "RECEIVED" },
          { status: "FAILED" },
          { status: "PROCESSING", updatedAt: { lt: staleLease } },
        ],
      },
      data: {
        status: "PROCESSING",
        attempts: { increment: 1 },
        lastError: null,
      },
    });

    if (claim.count !== 1) {
      const current = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
      if (current?.status === "PROCESSED") return NextResponse.json({ received: true, duplicate: true });
      return NextResponse.json({ error: "Event processing is already in progress; retry required." }, { status: 500 });
    }

    await handleStripeEvent(event);
    await prisma.stripeEvent.update({
      where: { id: event.id },
      data: { status: "PROCESSED", processedAt: new Date(), lastError: null },
    });

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    await prisma.stripeEvent.updateMany({
      where: { id: event.id },
      data: {
        status: "FAILED",
        lastError: error instanceof Error ? error.name.slice(0, 120) : "UnknownError",
      },
    }).catch(() => {});
    console.error("Stripe event processing failed.", { eventId: event.id, eventType: event.type });
    // 5xx tells Stripe to retry. The receipt remains durable for reconciliation.
    return NextResponse.json({ error: "Stripe event processing failed; retry required." }, { status: 500 });
  }
}
