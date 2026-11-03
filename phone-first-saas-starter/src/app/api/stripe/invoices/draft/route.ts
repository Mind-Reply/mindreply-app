import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { isIINOfferKey, resolveIINOffer } from "@/server/stripe/catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const clerkId = await requireAuth();
    const actor = await prisma.user.findUnique({ where: { clerkId } });
    if (!actor || actor.role !== "ADMIN") {
      return NextResponse.json({ error: "Billing administrator permission is required." }, { status: 403 });
    }

    const idempotencyKey = request.headers.get("idempotency-key") ?? "";
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(idempotencyKey)) {
      return NextResponse.json({ error: "A valid Idempotency-Key header is required." }, { status: 400 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      organizationId?: unknown;
      items?: unknown;
    };
    if (typeof body.organizationId !== "string" || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 10) {
      return NextResponse.json({ error: "A target organization and 1–10 invoice items are required." }, { status: 400 });
    }

    const subscription = await prisma.subscription.findUnique({ where: { organizationId: body.organizationId } });
    const priorOrder = await prisma.iINOrder.findFirst({
      where: { organizationId: body.organizationId, stripeCustomerId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });
    const stripeCustomerId = subscription?.stripeCustomerId ?? priorOrder?.stripeCustomerId;
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "The organization has no linked Stripe customer." }, { status: 409 });
    }

    const selected: Array<{ offerKey: string; quantity: number }> = [];
    for (const item of body.items) {
      if (!item || typeof item !== "object" || !("offerKey" in item) || !("quantity" in item)) {
        return NextResponse.json({ error: "Invalid invoice item." }, { status: 400 });
      }
      const offerKey = (item as { offerKey?: unknown }).offerKey;
      const quantity = (item as { quantity?: unknown }).quantity;
      if (!isIINOfferKey(offerKey) || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return NextResponse.json({ error: "Invoice items must use an allowlisted offer and quantity 1–100." }, { status: 400 });
      }
      selected.push({ offerKey, quantity });
    }

    const offers = await Promise.all(selected.map((item) => resolveIINOffer(item.offerKey)));
    if (offers.some((offer) => offer.mode !== "payment")) {
      return NextResponse.json({ error: "Draft invoices can only use one-time service offers." }, { status: 400 });
    }

    const stripe = getStripe();
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: "send_invoice",
      days_until_due: 30,
      auto_advance: false,
      metadata: {
        billing_environment: "test",
        organization_id: body.organizationId,
        created_by_clerk_id: clerkId,
        workflow: "owner_review_draft",
      },
    }, {
      idempotencyKey: `iin-invoice-draft-${clerkId}-${idempotencyKey}`,
    });

    try {
      for (let index = 0; index < offers.length; index += 1) {
        const offer = offers[index];
        const item = selected[index];
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          invoice: invoice.id,
          price: offer.price.id,
          quantity: item.quantity,
          metadata: {
            offer_key: offer.key,
            department: offer.department,
            organization_id: body.organizationId,
            billing_environment: "test",
          },
        }, {
          idempotencyKey: `iin-invoice-line-${clerkId}-${idempotencyKey}-${index}`,
        });
      }
    } catch (error) {
      console.error("Stripe draft invoice item creation failed.", { invoiceId: invoice.id });
      return NextResponse.json({
        error: "Draft invoice was created but one or more line items could not be attached. It was not finalized or sent.",
        invoiceId: invoice.id,
      }, { status: 502 });
    }

    return NextResponse.json({
      invoiceId: invoice.id,
      status: invoice.status ?? "draft",
      finalized: false,
      sent: false,
      paymentCollectionStarted: false,
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith("BILLING_NOT_CONFIGURED:")) {
      return NextResponse.json({ error: "One or more invoice offers are not configured in the sandbox catalogue." }, { status: 503 });
    }
    console.error("Stripe draft invoice creation failed.", error);
    return NextResponse.json({ error: "Unable to create a draft invoice." }, { status: 502 });
  }
}
