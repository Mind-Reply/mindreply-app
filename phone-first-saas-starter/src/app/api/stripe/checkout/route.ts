import { NextResponse } from "next/server";
import { getStripe, stripePriceId, stripeTrialDays } from "@/lib/stripe";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const body = (await request.json().catch(() => ({}))) as { plan?: unknown; quantity?: unknown };
    const plan = body.plan === "sovereign" || body.plan === "enterprise" ? body.plan : "operator";
    const configuredPriceId = stripePriceId(plan);
    const quantity = typeof body.quantity === "number" && Number.isInteger(body.quantity) ? body.quantity : 1;
    if (quantity < 1 || quantity > 1000) return NextResponse.json({ error: "Invalid seat quantity." }, { status: 400 });

    const stripe = getStripe();
    const price = await stripe.prices.retrieve(configuredPriceId);
    if (!price.active || price.livemode || price.type !== "recurring") {
      return NextResponse.json({ error: "Configured subscription Price is unavailable in the sandbox." }, { status: 503 });
    }

    const user = await syncCurrentUser();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured." }, { status: 503 });
    const subscription = user.organizationId ? await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } }) : null;
    const metadata = { clerkId, organizationId: user.organizationId ?? "", plan, billing_environment: "test" };
    const trialDays = stripeTrialDays();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: configuredPriceId, quantity }],
      payment_method_collection: "always",
      subscription_data: {
        metadata,
        ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      },
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      customer: subscription?.stripeCustomerId ?? undefined,
      metadata,
    });

    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    if (error instanceof Error && error.message.startsWith("STRIPE_PRICE_ID_")) return NextResponse.json({ error: "Stripe subscription pricing is not configured." }, { status: 503 });
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Unable to create Stripe Checkout session." }, { status: 502 });
  }
}
