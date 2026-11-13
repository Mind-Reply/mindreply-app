import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    return NextResponse.json({ error: "Missing Stripe signature header." }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.info("Stripe checkout completed", {
        sessionId: session.id,
        customer: session.customer,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
