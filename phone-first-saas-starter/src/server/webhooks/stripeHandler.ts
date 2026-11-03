import Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { claimIdempotency, saveIdempotencyResult } from "@/db/idempotency";

const WEBSITE_COMPLETION_PACKAGE = "website_completion_gbp_600";

function objectId(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return null;
}

function unixDate(value: unknown): Date | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? new Date(value * 1000) : null;
}

function mapSubscriptionStatus(status: string): SubscriptionStatus | null {
  switch (status) {
    case "incomplete": return "INCOMPLETE";
    case "trialing": return "TRIALING";
    case "active": return "ACTIVE";
    case "past_due": return "PAST_DUE";
    case "canceled":
    case "incomplete_expired": return "CANCELED";
    case "unpaid": return "UNPAID";
    case "paused": return "PAUSED";
    default: return null;
  }
}

async function projectInvoice(event: Stripe.Event) {
  const raw = event.data.object as unknown as {
    id: string;
    customer?: unknown;
    subscription?: unknown;
    status?: string | null;
    amount_due?: number;
    amount_paid?: number;
    currency?: string;
    due_date?: number | null;
    status_transitions?: { paid_at?: number | null };
    hosted_invoice_url?: string | null;
    invoice_pdf?: string | null;
  };
  if (!raw.id) return;

  const fallbackStatus =
    event.type === "invoice.paid" || event.type === "invoice.payment_succeeded"
      ? "paid"
      : event.type === "invoice.voided"
        ? "void"
        : event.type === "invoice.marked_uncollectible"
          ? "uncollectible"
          : "open";

  await prisma.stripeInvoice.upsert({
    where: { stripeInvoiceId: raw.id },
    update: {
      stripeCustomerId: objectId(raw.customer),
      stripeSubscriptionId: objectId(raw.subscription),
      status: raw.status ?? fallbackStatus,
      amountDue: raw.amount_due ?? 0,
      amountPaid: raw.amount_paid ?? 0,
      currency: raw.currency ?? "usd",
      livemode: event.livemode,
      dueAt: unixDate(raw.due_date),
      paidAt: unixDate(raw.status_transitions?.paid_at),
      hostedInvoiceUrl: raw.hosted_invoice_url ?? null,
      invoicePdf: raw.invoice_pdf ?? null,
    },
    create: {
      stripeInvoiceId: raw.id,
      stripeCustomerId: objectId(raw.customer),
      stripeSubscriptionId: objectId(raw.subscription),
      status: raw.status ?? fallbackStatus,
      amountDue: raw.amount_due ?? 0,
      amountPaid: raw.amount_paid ?? 0,
      currency: raw.currency ?? "usd",
      livemode: event.livemode,
      dueAt: unixDate(raw.due_date),
      paidAt: unixDate(raw.status_transitions?.paid_at),
      hostedInvoiceUrl: raw.hosted_invoice_url ?? null,
      invoicePdf: raw.invoice_pdf ?? null,
    },
  });
}

async function projectRefund(event: Stripe.Event) {
  const raw = event.data.object as unknown as {
    id: string;
    payment_intent?: unknown;
    charge?: unknown;
    amount?: number;
    amount_refunded?: number;
    currency?: string;
    status?: string | null;
    refunded?: boolean;
  };
  if (!raw.id) return;
  const amount = raw.amount_refunded ?? raw.amount ?? 0;
  const paymentIntentId = objectId(raw.payment_intent);
  const chargeId = objectId(raw.charge);

  await prisma.stripeAdjustment.upsert({
    where: { stripeObjectId: event.id },
    update: { paymentIntentId, stripeChargeId: chargeId, amount, currency: raw.currency ?? null, status: raw.status ?? (raw.refunded ? "refunded" : "recorded"), livemode: event.livemode },
    create: {
      stripeObjectId: event.id,
      kind: "refund",
      paymentIntentId,
      stripeChargeId: chargeId,
      amount,
      currency: raw.currency ?? null,
      status: raw.status ?? (raw.refunded ? "refunded" : "recorded"),
      livemode: event.livemode,
    },
  });

  if (paymentIntentId) {
    const order = await prisma.oneTimeOrder.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
    if (order) {
      await prisma.oneTimeOrder.update({
        where: { id: order.id },
        data: { paymentStatus: raw.refunded ? "refunded" : "partially_refunded" },
      });
    }
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: raw.refunded ? "refunded" : "partially_refunded" },
    });
  }
}

async function projectDispute(event: Stripe.Event) {
  const raw = event.data.object as unknown as {
    id: string;
    charge?: unknown;
    payment_intent?: unknown;
    amount?: number;
    currency?: string;
    status?: string;
  };
  if (!raw.id) return;
  const paymentIntentId = objectId(raw.payment_intent);
  const chargeId = objectId(raw.charge);
  await prisma.stripeAdjustment.upsert({
    where: { stripeObjectId: event.id },
    update: { paymentIntentId, stripeChargeId: chargeId, amount: raw.amount ?? 0, currency: raw.currency ?? null, status: raw.status ?? event.type, livemode: event.livemode },
    create: {
      stripeObjectId: event.id,
      kind: "dispute",
      paymentIntentId,
      stripeChargeId: chargeId,
      amount: raw.amount ?? 0,
      currency: raw.currency ?? null,
      status: raw.status ?? event.type,
      livemode: event.livemode,
    },
  });

  if (paymentIntentId) {
    await prisma.payment.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: { status: "disputed" },
    });
    const order = await prisma.oneTimeOrder.findFirst({ where: { stripePaymentIntentId: paymentIntentId } });
    if (order) {
      await prisma.oneTimeOrder.update({
        where: { id: order.id },
        data: { paymentStatus: "disputed" },
      });
    }
  }
}

async function projectPayout(event: Stripe.Event) {
  const raw = event.data.object as unknown as {
    id: string;
    amount?: number;
    currency?: string;
    status?: string;
    arrival_date?: number;
  };
  if (!raw.id) return;
  await prisma.stripeAdjustment.upsert({
    where: { stripeObjectId: event.id },
    update: {
      kind: "payout",
      amount: raw.amount ?? 0,
      currency: raw.currency ?? null,
      status: raw.status ?? event.type,
      livemode: event.livemode,
    },
    create: {
      stripeObjectId: event.id,
      kind: "payout",
      paymentIntentId: null,
      stripeChargeId: null,
      amount: raw.amount ?? 0,
      currency: raw.currency ?? null,
      status: raw.status ?? event.type,
      livemode: event.livemode,
    },
  });
}

export async function handleStripeEvent(event: Stripe.Event) {
  const claim = await claimIdempotency(event.id);
  if (!claim.claimed) return { duplicate: true };

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.metadata?.package_key === WEBSITE_COMPLETION_PACKAGE) {
          if (s.payment_status === "paid" && s.mode === "payment" && s.currency === "gbp" && s.amount_total === 60_000 && !event.livemode) {
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

        const clerkId = s.metadata?.clerkId ?? s.metadata?.clerk_id;
        const organizationId = s.metadata?.organizationId ?? s.metadata?.organization_id;
        const customerId = objectId(s.customer);
        if (clerkId && customerId) {
          const user = await prisma.user.findUnique({ where: { clerkId } });
          const targetOrganizationId = organizationId ?? user?.organizationId;
          if (targetOrganizationId) {
            await prisma.subscription.upsert({
              where: { organizationId: targetOrganizationId },
              update: { stripeCustomerId: customerId },
              create: {
                organizationId: targetOrganizationId,
                stripeCustomerId: customerId,
                status: "INCOMPLETE",
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
        const customer = objectId(sub.customer);
        const existing = customer ? await prisma.subscription.findFirst({ where: { stripeCustomerId: customer } }) : null;
        if (existing) {
          const item = sub.items.data[0];
          const mappedStatus = mapSubscriptionStatus(sub.status);
          await prisma.subscription.update({
            where: { id: existing.id },
            data: {
              stripeSubscriptionId: sub.id,
              ...(mappedStatus ? { status: mappedStatus } : {}),
              priceId: item?.price.id,
              currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : null,
            },
          });
        }
        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
      case "invoice.finalized":
      case "invoice.voided":
      case "invoice.marked_uncollectible": {
        await projectInvoice(event);
        break;
      }

      case "payment_intent.succeeded":
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: { status: paymentIntent.status },
        });
        break;
      }

      case "charge.refunded":
      case "refund.created":
      case "refund.updated": {
        await projectRefund(event);
        break;
      }

      case "charge.dispute.created":
      case "charge.dispute.updated":
      case "charge.dispute.closed": {
        await projectDispute(event);
        break;
      }

      case "payout.created":
      case "payout.updated":
      case "payout.paid":
      case "payout.failed":
      case "payout.canceled": {
        await projectPayout(event);
        break;
      }

      default:
        // Unrecognized and non-financial event types are still durably receipted
        // by the webhook route, then safely acknowledged here.
        break;
    }

    const result = { processed: true, type: event.type };
    await saveIdempotencyResult(event.id, result);
    return result;
  } catch (error) {
    await prisma.idempotencyRecord.delete({ where: { key: event.id } }).catch(() => {});
    throw error;
  }
}
