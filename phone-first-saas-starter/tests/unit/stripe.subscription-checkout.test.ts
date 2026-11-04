import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  syncCurrentUser: vi.fn(),
  subscriptionFindUnique: vi.fn(),
  iinOrderFindFirst: vi.fn(),
  stripePriceId: vi.fn(),
  stripeTrialDays: vi.fn(),
  getStripe: vi.fn(),
  priceRetrieve: vi.fn(),
  checkoutCreate: vi.fn(),
}));

vi.mock("@/lib/clerk", () => ({
  requireAuth: mocks.requireAuth,
  syncCurrentUser: mocks.syncCurrentUser,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: { findUnique: mocks.subscriptionFindUnique },
    iINOrder: { findFirst: mocks.iinOrderFindFirst },
  },
}));
vi.mock("@/lib/stripe", () => ({
  getStripe: mocks.getStripe,
  stripePriceId: mocks.stripePriceId,
  stripeTrialDays: mocks.stripeTrialDays,
}));

import { POST } from "@/app/api/stripe/checkout/route";

function makeRequest(body: unknown, key = "subscription_req_123456") {
  return new Request("https://example.test/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/checkout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.test");
    mocks.requireAuth.mockResolvedValue("clerk_user_1");
    mocks.syncCurrentUser.mockResolvedValue({
      id: "user_db_1",
      clerkId: "clerk_user_1",
      organizationId: "org_123",
      email: "owner@example.test",
    });
    mocks.subscriptionFindUnique.mockResolvedValue({ stripeCustomerId: "cus_existing_1" });
    mocks.iinOrderFindFirst.mockResolvedValue(null);
    mocks.stripePriceId.mockReturnValue("price_test_operator");
    mocks.stripeTrialDays.mockReturnValue(0);
    mocks.priceRetrieve.mockResolvedValue({
      id: "price_test_operator",
      active: true,
      livemode: false,
      type: "recurring",
    });
    mocks.checkoutCreate.mockResolvedValue({ url: "https://checkout.stripe.test/cs_test_1" });
    mocks.getStripe.mockReturnValue({
      prices: { retrieve: mocks.priceRetrieve },
      checkout: { sessions: { create: mocks.checkoutCreate } },
    });
  });

  it("requires a request idempotency key before creating a session", async () => {
    const response = await POST(makeRequest({ plan: "operator" }, "bad"));
    expect(response.status).toBe(400);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("validates the server-owned recurring sandbox Price and idempotency key", async () => {
    const response = await POST(makeRequest({ plan: "operator", quantity: 4 }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://checkout.stripe.test/cs_test_1" });
    expect(mocks.priceRetrieve).toHaveBeenCalledWith("price_test_operator");
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_test_operator", quantity: 4 }],
        customer: "cus_existing_1",
        metadata: expect.objectContaining({
          clerkId: "clerk_user_1",
          organizationId: "org_123",
          billing_environment: "test",
        }),
      }),
      { idempotencyKey: "subscription-checkout-api-clerk_user_1-subscription_req_123456" },
    );
  });

  it("rejects an inactive or live-mode Price before Checkout", async () => {
    mocks.priceRetrieve.mockResolvedValue({
      id: "price_live",
      active: true,
      livemode: true,
      type: "recurring",
    });
    const response = await POST(makeRequest({ plan: "operator" }));

    expect(response.status).toBe(503);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("rejects invalid quantities before Checkout", async () => {
    const response = await POST(makeRequest({ plan: "operator", quantity: 1001 }));
    expect(response.status).toBe(400);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });
});
