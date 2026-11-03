import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStripe: vi.fn(),
  constructEvent: vi.fn(),
  eventUpsert: vi.fn(),
  eventFindUnique: vi.fn(),
  eventUpdateMany: vi.fn(),
  eventUpdate: vi.fn(),
  handleStripeEvent: vi.fn(),
  order: [] as string[],
}));

vi.mock("@/lib/stripe", () => ({ getStripe: mocks.getStripe }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    stripeEvent: {
      upsert: mocks.eventUpsert,
      findUnique: mocks.eventFindUnique,
      updateMany: mocks.eventUpdateMany,
      update: mocks.eventUpdate,
    },
  },
}));
vi.mock("@/server/webhooks/stripeHandler", () => ({ handleStripeEvent: mocks.handleStripeEvent }));

import { POST } from "@/app/api/webhooks/stripe/route";

const testEvent = {
  id: "evt_test_123",
  type: "invoice.paid",
  livemode: false,
  api_version: "2026-09-30.endive",
  data: { object: { id: "in_test_123" } },
};

function request(body = '{"id":"evt_test_123"}') {
  return new Request("https://example.test/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "t=123,v1=test", "content-type": "application/json" },
    body,
  });
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.order.length = 0;
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test_secret");
    mocks.getStripe.mockReturnValue({ webhooks: { constructEvent: mocks.constructEvent } });
    mocks.constructEvent.mockReturnValue(testEvent);
    mocks.eventUpsert.mockImplementation(async () => { mocks.order.push("persist"); return {}; });
    mocks.eventFindUnique.mockResolvedValue({ id: testEvent.id, status: "RECEIVED" });
    mocks.eventUpdateMany.mockResolvedValue({ count: 1 });
    mocks.eventUpdate.mockResolvedValue({});
    mocks.handleStripeEvent.mockImplementation(async () => { mocks.order.push("process"); return { processed: true }; });
  });

  it("verifies the raw request body and persists the receipt before processing", async () => {
    const raw = '{"exact":"raw-body"}';
    const response = await POST(request(raw));

    expect(response.status).toBe(200);
    expect(mocks.constructEvent).toHaveBeenCalledWith(raw, "t=123,v1=test", "whsec_test_secret");
    expect(mocks.order).toEqual(["persist", "process"]);
    expect(mocks.eventUpdate).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: testEvent.id },
      data: expect.objectContaining({ status: "PROCESSED" }),
    }));
  });

  it("rejects invalid signatures before writing an event receipt", async () => {
    mocks.constructEvent.mockImplementation(() => { throw new Error("bad signature"); });
    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(mocks.eventUpsert).not.toHaveBeenCalled();
    expect(mocks.handleStripeEvent).not.toHaveBeenCalled();
  });

  it("rejects live-mode events on the sandbox endpoint", async () => {
    mocks.constructEvent.mockReturnValue({ ...testEvent, livemode: true });
    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(mocks.eventUpsert).not.toHaveBeenCalled();
  });

  it("acknowledges already processed events without processing twice", async () => {
    mocks.eventFindUnique.mockResolvedValue({ id: testEvent.id, status: "PROCESSED" });
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(mocks.handleStripeEvent).not.toHaveBeenCalled();
  });

  it("returns a retryable 5xx when event processing fails and retains the receipt", async () => {
    mocks.handleStripeEvent.mockRejectedValue(new Error("database unavailable"));
    const response = await POST(request());

    expect(response.status).toBe(500);
    expect(mocks.eventUpdateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: testEvent.id },
      data: expect.objectContaining({ status: "FAILED" }),
    }));
  });
});
