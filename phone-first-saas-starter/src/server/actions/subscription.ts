"use server";

import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe, stripePriceId, stripeTrialDays, type MindReplyPlan } from "@/lib/stripe";
import { checkoutSchema } from "../middleware/validation";

export async function createCheckout(input?: unknown) {
  const clerkId = await requireAuth();
  const parsed = checkoutSchema.safeParse(input ?? { plan: "operator" });
  if (!parsed.success) return { ok: false, error: parsed.error.flatten() };
  const synced = await syncCurrentUser();
  const existing = synced.organizationId ? await prisma.subscription.findUnique({ where: { organizationId: synced.organizationId } }) : null;
  const priorOrder = synced.organizationId
    ? await prisma.iINOrder.findFirst({
        where: { organizationId: synced.organizationId, stripeCustomerId: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { stripeCustomerId: true },
      })
    : null;
  const stripeCustomerId = existing?.stripeCustomerId ?? priorOrder?.stripeCustomerId;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) return { ok: false, error: "NEXT_PUBLIC_APP_URL is not configured." };

  try {
    const stripe = getStripe();
    const plan = parsed.data.plan as MindReplyPlan;
    const priceId = stripePriceId(plan);
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.livemode || price.type !== "recurring") {
      return { ok: false, error: "Configured subscription Price is unavailable in the sandbox." };
    }

    const trialDays = stripeTrialDays();
    const metadata = { clerkId, organizationId: synced.organizationId ?? "", plan, billing_environment: "test" };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      payment_method_collection: "always",
      subscription_data: {
        metadata,
        ...(trialDays > 0 ? { trial_period_days: trialDays } : {}),
      },
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      customer: stripeCustomerId ?? undefined,
      metadata,
    });
    return session.url ? { ok: true, url: session.url } : { ok: false, error: "Stripe did not return a Checkout URL." };
  } catch (error) {
    console.error("Subscription Checkout could not be created.", error);
    return { ok: false, error: "Stripe subscription pricing or sandbox configuration is incomplete." };
  }
}

export async function createPortal() {
  const clerkId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { clerkId } });
  const sub = user?.organizationId ? await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } }) : null;
  const priorOrder = user?.organizationId
    ? await prisma.iINOrder.findFirst({
        where: { organizationId: user.organizationId, stripeCustomerId: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { stripeCustomerId: true },
      })
    : null;
  const stripeCustomerId = sub?.stripeCustomerId ?? priorOrder?.stripeCustomerId;
  if (!stripeCustomerId) return { ok: false, error: "No Stripe customer yet" };
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) return { ok: false, error: "NEXT_PUBLIC_APP_URL is not configured." };
  const session = await getStripe().billingPortal.sessions.create({ customer: stripeCustomerId, return_url: `${baseUrl}/settings` });
  return { ok: true, url: session.url };
}
