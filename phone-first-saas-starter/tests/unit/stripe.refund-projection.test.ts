import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const mocks = vi.hoisted(() => ({
  claimIdempotency: vi.fn(),
  saveIdempotencyResult: vi.fn(),
  stripeAdjustmentUpsert: vi.fn(),
  iinOrderFindFirst: vi.fn(),
  iinOrderUpdate: vi.fn(),
  oneTimeOrderFindFirst: vi.fn(),
  oneTimeOrderUpdate: vi.fn(),
  paymentUpdateMany: vi.fn(),
}));

vi.mock("@/db/idempotency", () => ({
  claimIdempotency: mocks.claimIdempotency,
  saveIdempotencyResult: mocks.saveIdempotencyResult,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeAdjustment: { upsert: mocks.stripeAdjustmentUpsert },
    iINOrder: { findFirst: mocks.iinOrderFindFirst, update: mocks.iinOrderUpdate },
    oneTimeOrder: { findFirst: mocks.oneTimeOrderFindFirst, update: mocks.oneTimeOrderUpdate },
    payment: { updateMany: mocks.paymentUpdateMany },
  },
}));

import { handleStripeEvent } from "@/server/webhooks/stripeHandler";

function event(type: string, object: Record<string, unknown>) {
  return {
    id: `evt_${type.replaceAll(".", "_")}`,
    type,
    livemode: false,
    created: 1_783_100_000,
    data: { object },
  } as unknown as Stripe.Event;
}

describe("Stripe refund projection", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.claimIdempotency.mockResolvedValue({ claimed: true });
    mocks.saveIdempotencyResult.mockResolvedValue({});
    mocks.stripeAdjustmentUpsert.mockResolvedValue({});
    mocks.iinOrderFindFirst.mockResolvedValue({ id: "iin-order-1" });
    mocks.iinOrderUpdate.mockResolvedValue({});
    mocks.oneTimeOrderFindFirst.mockResolvedValue({ id: "one-time-order-1" });
    mocks.oneTimeOrderUpdate.mockResolvedValue({});
    mocks.paymentUpdateMany.mockResolvedValue({ count: 1 });
  });

  it("records a pending Refund object without changing an order or payment", async () => {
    await handleStripeEvent(event("refund.created", {
      id: "re_pending",
      payment_intent: "pi_1",
      charge: "ch_1",
      amount: 400,
      currency: "usd",
      status: "pending",
    }));

    expect(mocks.stripeAdjustmentUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ kind: "refund", status: "pending", amount: 400 }),
    }));
    expect(mocks.iinOrderFindFirst).not.toHaveBeenCalled();
    expect(mocks.oneTimeOrderFindFirst).not.toHaveBeenCalled();
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
  });

  it("records a failed Refund object without marking the order refunded", async () => {
    await handleStripeEvent(event("refund.failed", {
      id: "re_failed",
      payment_intent: "pi_1",
      charge: "ch_1",
      amount: 400,
      currency: "usd",
      status: "failed",
    }));

    expect(mocks.stripeAdjustmentUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ kind: "refund", status: "failed", amount: 400 }),
    }));
    expect(mocks.iinOrderUpdate).not.toHaveBeenCalled();
    expect(mocks.oneTimeOrderUpdate).not.toHaveBeenCalled();
    expect(mocks.paymentUpdateMany).not.toHaveBeenCalled();
  });

  it("waits for charge-level aggregate evidence before updating partial-refund state", async () => {
    await handleStripeEvent(event("charge.refunded", {
      id: "ch_partial",
      payment_intent: "pi_partial",
      amount: 1_000,
      amount_refunded: 400,
      refunded: false,
      currency: "usd",
    }));

    expect(mocks.stripeAdjustmentUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ kind: "refund", status: "partially_refunded", amount: 400 }),
    }));
    expect(mocks.iinOrderUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "iin-order-1" },
      data: { paymentStatus: "partially_refunded" },
    }));
    expect(mocks.oneTimeOrderUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: "one-time-order-1" },
      data: { paymentStatus: "partially_refunded" },
    }));
    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { stripePaymentIntentId: "pi_partial" },
      data: { status: "partially_refunded" },
    }));
  });

  it("marks a full refund only when aggregate refunded amount reaches the charge amount", async () => {
    await handleStripeEvent(event("charge.refunded", {
      id: "ch_full",
      payment_intent: "pi_full",
      amount: 1_000,
      amount_refunded: 1_000,
      refunded: true,
      currency: "usd",
    }));

    expect(mocks.iinOrderUpdate).toHaveBeenCalledWith(expect.objectContaining({
      data: { paymentStatus: "refunded" },
    }));
    expect(mocks.oneTimeOrderUpdate).toHaveBeenCalledWith(expect.objectContaining({
      data: { paymentStatus: "refunded" },
    }));
    expect(mocks.paymentUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      data: { status: "refunded" },
    }));
  });
});
