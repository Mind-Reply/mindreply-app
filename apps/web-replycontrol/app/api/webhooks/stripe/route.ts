import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_CACHE_FILE = path.join(process.cwd(), ".data", "stripe-event-cache.json");

function getPaymentMode() {
  const paymentMode = (process.env.PAYMENT_MODE ?? "test").trim().toLowerCase();

  if (paymentMode !== "test" && paymentMode !== "live") {
    throw new Error("PAYMENT_MODE must be set to either 'test' or 'live'.");
  }

  return paymentMode;
}

async function readProcessedEvents(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(EVENT_CACHE_FILE, "utf8");
    const parsed = JSON.parse(content) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

async function markProcessedEvent(eventId: string): Promise<boolean> {
  const processed = await readProcessedEvents();

  if (processed.has(eventId)) {
    return false;
  }

  processed.add(eventId);

  await fs.mkdir(path.dirname(EVENT_CACHE_FILE), { recursive: true });
  await fs.writeFile(EVENT_CACHE_FILE, JSON.stringify([...processed], null, 2), "utf8");

  return true;
}

export async function POST(request: Request) {
  let paymentMode: string;
  try {
    paymentMode = getPaymentMode();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment mode misconfigured.";
    return NextResponse.json({ received: false, error: message }, { status: 500 });
  }

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

  if (paymentMode === "test" && !stripeSecretKey.startsWith("sk_test_")) {
    return NextResponse.json(
      {
        received: false,
        error: "PAYMENT_MODE=test requires a test Stripe secret key (sk_test_...).",
      },
      { status: 500 }
    );
  }

  if (paymentMode === "live" && !stripeSecretKey.startsWith("sk_live_")) {
    return NextResponse.json(
      {
        received: false,
        error: "PAYMENT_MODE=live requires a live Stripe secret key (sk_live_...).",
      },
      { status: 500 }
    );
  }

  if (paymentMode === "test" && !webhookSecret.startsWith("whsec_")) {
    return NextResponse.json(
      {
        received: false,
        error: "PAYMENT_MODE=test requires a test Stripe webhook secret (whsec_...).",
      },
      { status: 500 }
    );
  }

  if (paymentMode === "live" && !webhookSecret.startsWith("whsec_")) {
    return NextResponse.json(
      {
        received: false,
        error: "PAYMENT_MODE=live requires a live Stripe webhook secret (whsec_...).",
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

      const accepted = await markProcessedEvent(event.id);
      if (!accepted) {
        return NextResponse.json({ received: true, duplicate: true, eventType: event.type }, { status: 200 });
      }

      console.info("Stripe checkout completed", {
        eventId: event.id,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        customer: session.customer,
        metadata: session.metadata,
      });

      // In production, this is where you persist the order and grant the access state.
    }

    return NextResponse.json({ received: true, eventType: event.type }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe signature.";
    return NextResponse.json({ received: false, error: message }, { status: 400 });
  }
}
