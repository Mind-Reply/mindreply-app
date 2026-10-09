"use server";

import { requireAuth, syncCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getStripe, stripePriceId, stripeTrialDays, type MindReplyPlan } from "@/lib/stripe";
import { checkoutSchema } from "../middleware/validation";

export async function createCheckout(input?: unknown) {
  const clerkId = await requireAuth();
  const parsed = checkoutSchema.safeParse(input ?? { plan: "personal" });
  if (!parsed.success) return { ok: false, error: parsed.error.flatten() };

  const synced = await syncCurrentUser();
  const existing = synced.organizationId
    ? await prisma.subscription.findUnique({ where: { organizationId: synced.organizationId } })
    : null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) return { ok: false, error: "NEXT_PUBLIC_APP_URL is not configured." };

  let priceId: string;
  try {
    priceId = stripePriceId(parsed.data.plan as MindReplyPlan);
  } catch {
    return { ok: false, error: "Stripe price configuration is incomplete." };
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_collection: "always",
    subscription_data: {
      trial_period_days: stripeTrialDays(),
      metadata: { clerkId, plan: parsed.data.plan },
    },
    integration_identifier: "MindReplyCheckoutXkqTzAbC",
    success_url: baseUrl + "/dashboard?checkout=success",
    cancel_url: baseUrl + "/pricing?checkout=cancelled",
    customer: existing?.stripeCustomerId ?? undefined,
    customer_creation: existing?.stripeCustomerId ? undefined : "always",
    metadata: { clerkId, plan: parsed.data.plan },
  });
  if (!session.url) return { ok: false, error: "Stripe did not return a Checkout URL." };
  return { ok: true, url: session.url };
}

export async function createPortal() {
  const clerkId = await requireAuth();
  const user = await prisma.user.findUnique({ where: { clerkId } });
  const sub = user?.organizationId
    ? await prisma.subscription.findUnique({ where: { organizationId: user.organizationId } })
    : null;
  if (!sub?.stripeCustomerId) return { ok: false, error: "No Stripe customer yet" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) return { ok: false, error: "NEXT_PUBLIC_APP_URL is not configured." };

  const session = await getStripe().billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: baseUrl + "/settings",
  });
  return { ok: true, url: session.url };
}
