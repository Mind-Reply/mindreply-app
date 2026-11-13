import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const processedEvents = new Set<string>();

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      {
        received: false,
        error: "Stripe webhook is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ received: false, error: "Missing Stripe signature header." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true, ignored: true, eventType: event.type }, { status: 200 });
      }

      if (processedEvents.has(event.id)) {
        return NextResponse.json({ received: true, duplicate: true, eventType: event.type }, { status: 200 });
      }

      processedEvents.add(event.id);

      console.info("Stripe checkout completed", {
        eventId: event.id,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customer: session.customer,
        metadata: session.metadata,
      });

      // In production, this is the point where the order or access grant is created,
      // only after a verified webhook confirms the payment was successful.
    }

    return NextResponse.json({ received: true, eventType: event.type }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe signature.";
    return NextResponse.json({ received: false, error: message }, { status: 400 });
  }
}
