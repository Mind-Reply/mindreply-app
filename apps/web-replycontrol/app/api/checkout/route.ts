import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getPaymentMode() {
  const paymentMode = (process.env.PAYMENT_MODE ?? "test").trim().toLowerCase();

  if (paymentMode !== "test" && paymentMode !== "live") {
    throw new Error("PAYMENT_MODE must be set to either 'test' or 'live'.");
  }

  return paymentMode;
}

export async function POST(request: Request) {
  let paymentMode: string;
  try {
    paymentMode = getPaymentMode();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment mode misconfigured.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID_WEBSITE_COMPLETION || process.env.STRIPE_PRICE_ID || "";

  if (!stripeSecretKey || !priceId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID_WEBSITE_COMPLETION.",
      },
      { status: 500 }
    );
  }

  if (paymentMode === "test" && !stripeSecretKey.startsWith("sk_test_")) {
    return NextResponse.json(
      {
        ok: false,
        error: "PAYMENT_MODE=test requires a test Stripe secret key (sk_test_...).",
      },
      { status: 500 }
    );
  }

  if (paymentMode === "live" && !stripeSecretKey.startsWith("sk_live_")) {
    return NextResponse.json(
      {
        ok: false,
        error: "PAYMENT_MODE=live requires a live Stripe secret key (sk_live_...).",
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  let body: { customerEmail?: string } = {};
  try {
    body = (await request.json()) as { customerEmail?: string };
  } catch {
    body = {};
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof request.url === "string" ? new URL(request.url).origin : "http://localhost:3000");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: body.customerEmail || undefined,
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel?status=cancelled`,
      metadata: {
        product: "website_completion_package",
        source: "mindreply",
        customer_email: body.customerEmail || "",
      },
      allow_promotion_codes: false,
    });

    return NextResponse.json({ ok: true, url: session.url, sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
