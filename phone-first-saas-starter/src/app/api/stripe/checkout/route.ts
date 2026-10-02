import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { requireAuth, syncCurrentUser } from "@/lib/clerk";

export const runtime = "nodejs";

export async function POST() {
  try {
    const clerkId = await requireAuth();
    const user = await syncCurrentUser();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_APP_URL is not configured." },
        { status: 503 },
      );
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 99700,
            product_data: {
              name: "MindReply Workspace Access",
              description: "Commercial workspace license and execution runtime",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        baseUrl + "/workspace?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: baseUrl + "/workspace?canceled=true",
      customer_email: user.email ?? undefined,
      client_reference_id: "MINDREPLY-WORKSPACE-EUR",
      metadata: {
        clerkId,
        organizationId: user.organizationId ?? "",
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
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
