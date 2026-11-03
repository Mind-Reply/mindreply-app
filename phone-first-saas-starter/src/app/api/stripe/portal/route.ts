import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  try {
    const clerkId = await requireAuth();
    const user = await prisma.user.findUnique({ where: { clerkId } });
    const subscription = user?.organizationId
      ? await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } })
      : null;
    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer is linked to this organization." }, { status: 409 });
    }

    const returnUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!returnUrl) return NextResponse.json({ error: "Billing portal is not configured." }, { status: 503 });

    const session = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${returnUrl}/settings`,
    });
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    console.error("Stripe customer portal session failed.", error);
    return NextResponse.json({ error: "Unable to open billing portal." }, { status: 502 });
  }
}
