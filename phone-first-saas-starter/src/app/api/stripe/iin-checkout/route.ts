import { NextResponse } from "next/server";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isIINOfferKey, resolveIINOffer } from "@/server/stripe/catalog";

export const runtime = "nodejs";

const REQUEST_KEY = /^[A-Za-z0-9_-]{16,80}$/;

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const key = request.headers.get("idempotency-key") ?? "";
    if (!REQUEST_KEY.test(key)) {
      return NextResponse.json({ error: "A valid Idempotency-Key header is required." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as { offerKey?: unknown; quantity?: unknown };
    if (!isIINOfferKey(body.offerKey)) {
      return NextResponse.json({ error: "Unknown billing offer." }, { status: 400 });
    }

    const quantity = body.quantity === undefined ? 1 : body.quantity;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return NextResponse.json({ error: "Quantity must be an integer between 1 and 100." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });

    const user = await syncCurrentUser();
    if (!user.organizationId) return NextResponse.json({ error: "An organization is required for billing." }, { status: 409 });

    const [offer, subscription] = await Promise.all([
      resolveIINOffer(body.offerKey),
      prisma.subscription.findUnique({ where: { organizationId: user.organizationId } }),
    ]);

    const stripe = getStripe();
    const metadata = {
      billing_environment: "test",
      clerk_id: clerkId,
      organization_id: user.organizationId,
      offer_key: offer.key,
      department: offer.department,
      product_id: offer.product.id,
      price_id: offer.price.id,
    };

    const params: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: offer.mode,
      line_items: [{ price: offer.price.id, quantity }],
      success_url: `${baseUrl}/dashboard?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?billing=cancelled`,
      client_reference_id: `${user.organizationId}:${offer.key}`,
      metadata,
    };

    if (subscription?.stripeCustomerId) {
      params.customer = subscription.stripeCustomerId;
    } else if (offer.mode === "payment") {
      params.customer_creation = "always";
      if (user.email) params.customer_email = user.email;
    }

    if (offer.mode === "subscription") {
      const trialDays = Number(process.env.STRIPE_TRIAL_DAYS ?? "0");
      params.subscription_data = {
        metadata,
        ...(Number.isInteger(trialDays) && trialDays > 0 && trialDays <= 90 ? { trial_period_days: trialDays } : {}),
      };
    } else {
      params.payment_intent_data = { metadata };
    }

    const session = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `iin-checkout-${clerkId}-${key}`,
    });

    if (!session.url) return NextResponse.json({ error: "Stripe did not return a Checkout URL." }, { status: 502 });
    return NextResponse.json({ url: session.url, sessionId: session.id }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith("BILLING_NOT_CONFIGURED:")) {
      return NextResponse.json({ error: "This offer is not yet configured in the A11-K sandbox catalogue." }, { status: 503 });
    }
    if (error instanceof Error && ["PRICE_NOT_ACTIVE_IN_SANDBOX", "PRICE_MODE_MISMATCH", "PRODUCT_NOT_ACTIVE"].includes(error.message)) {
      console.error("IIN Stripe offer validation failed.", error.message);
      return NextResponse.json({ error: "This offer is temporarily unavailable." }, { status: 503 });
    }
    console.error("IIN Stripe checkout failed.", error);
    return NextResponse.json({ error: "Unable to create Stripe Checkout session." }, { status: 502 });
  }
}
