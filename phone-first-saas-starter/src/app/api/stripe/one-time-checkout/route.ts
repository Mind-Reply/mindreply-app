import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const PACKAGE_KEY = "website_completion_gbp_600";
const AMOUNT_PENCE = 60_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const priceId = process.env.STRIPE_PRICE_ID_WEBSITE_COMPLETION;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!priceId || !baseUrl) {
      return NextResponse.json({ error: "One-time checkout is not configured." }, { status: 503 });
    }

    const stripe = getStripe();
    const price = await stripe.prices.retrieve(priceId);
    if (
      !price.active ||
      price.type !== "one_time" ||
      price.currency !== "gbp" ||
      price.unit_amount !== AMOUNT_PENCE
    ) {
      console.error("Website Completion price configuration failed validation.");
      return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: email,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      client_reference_id: PACKAGE_KEY,
      metadata: { package_key: PACKAGE_KEY, offer_version: "1" },
      payment_intent_data: {
        metadata: { package_key: PACKAGE_KEY, offer_version: "1" },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("One-time Stripe checkout could not be created.", error);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
