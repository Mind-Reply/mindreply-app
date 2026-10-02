import { NextResponse } from "next/server";
import { getStripe, stripePriceId } from "@/lib/stripe";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as { priceId?: unknown };
    const configuredPriceId = stripePriceId();
    const requestedPriceId = typeof body.priceId === "string" && body.priceId.trim()
      ? body.priceId.trim()
      : configuredPriceId;

    if (configuredPriceId === "price_REPLACE_ME") {
      return NextResponse.json(
        { error: "Stripe price is not configured." },
        { status: 503 },
      );
    }

    if (requestedPriceId !== configuredPriceId) {
      return NextResponse.json(
        { error: "Requested Stripe price is not allowlisted." },
        { status: 400 },
      );
    }

    const user = await syncCurrentUser();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured." },
        { status: 503 },
      );
    }

    const subscription = user.organizationId
      ? await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } })
      : null;

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: configuredPriceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      customer: subscription?.stripeCustomerId ?? undefined,
      customer_creation: subscription?.stripeCustomerId ? undefined : "always",
      metadata: { clerkId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Unable to create Stripe Checkout session." },
      { status: 500 },
    );
  }
}
