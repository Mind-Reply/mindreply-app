import Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { claimIdempotency, saveIdempotencyResult } from "@/db/idempotency";

const WEBSITE_COMPLETION_PACKAGE = "website_completion_gbp_600";

export async function handleStripeEvent(event: Stripe.Event) {
  const claim = await claimIdempotency(event.id);
  if (!claim.claimed) return { duplicate: true };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.metadata?.package_key === WEBSITE_COMPLETION_PACKAGE) {
          // A completed redirect is not sufficient: only persist paid orders.
          if (s.payment_status === "paid" && s.mode === "payment" && s.currency === "gbp" && s.amount_total === 60_000) {
            await prisma.oneTimeOrder.upsert({
              where: { stripeCheckoutSessionId: s.id },
              update: {
                stripePaymentIntentId: typeof s.payment_intent === "string" ? s.payment_intent : null,
                customerEmail: s.customer_details?.email ?? s.customer_email ?? null,
                amountTotal: s.amount_total,
                currency: s.currency,
                paymentStatus: "paid",
                livemode: event.livemode,
                paidAt: new Date(event.created * 1000),
              },
              create: {
                packageKey: WEBSITE_COMPLETION_PACKAGE,
                offerVersion: s.metadata.offer_version ?? "1",
                stripeCheckoutSessionId: s.id,
                stripePaymentIntentId: typeof s.payment_intent === "string" ? s.payment_intent : null,
                customerEmail: s.customer_details?.email ?? s.customer_email ?? null,
                amountTotal: s.amount_total,
                currency: s.currency,
                paymentStatus: "paid",
                livemode: event.livemode,
                paidAt: new Date(event.created * 1000),
              },
            });
          }
          break;
        }

        const clerkId = s.metadata?.clerkId;
        if (clerkId && s.customer) {
          const user = await prisma.user.findUnique({ where: { clerkId } });
          if (user?.organizationId) {
            await prisma.subscription.upsert({
              where: { organizationId: user.organizationId },
              update: { stripeCustomerId: String(s.customer) },
              create: {
                organizationId: user.organizationId,
                stripeCustomerId: String(s.customer),
                status: "TRIALING",
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = String(sub.customer);
        const existing = await prisma.subscription.findFirst({ where: { stripeCustomerId: customer } });
        if (existing) {
          const item = sub.items.data[0];
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              stripeSubscriptionId: sub.id,
              status: sub.status.toUpperCase() as SubscriptionStatus,
              priceId: item?.price.id,
              currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        // Invoice events are intentionally idempotent and retained by the event ledger.
        // Subscription status remains authoritative for access control.
        break;
      }

      case "payment_intent.succeeded": {
        const p = event.data.object as Stripe.PaymentIntent;
        const customer = typeof p.customer === "string" ? p.customer : null;
        const sub = customer ? await prisma.subscription.findFirst({ where: { stripeCustomerId: customer } }) : null;
        if (sub) {
          await prisma.payment.upsert({
            where: { stripePaymentIntentId: p.id },
            update: { status: p.status, amount: p.amount, currency: p.currency },
            create: {
              stripePaymentIntentId: p.id,
              organizationId: sub.organizationId,
              status: p.status,
              amount: p.amount,
              currency: p.currency,
            },
          });
        }
        break;
      }
    }

    const result = { processed: true, type: event.type };
    await saveIdempotencyResult(event.id, result);
    return result;
  } catch (error) {
    await prisma.idempotencyRecord.delete({ where: { key: event.id } }).catch(() => {});
    throw error;
  }
}
