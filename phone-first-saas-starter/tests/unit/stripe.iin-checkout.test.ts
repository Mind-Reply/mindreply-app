import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  syncCurrentUser: vi.fn(),
  subscriptionFindUnique: vi.fn(),
  getStripe: vi.fn(),
  checkoutCreate: vi.fn(),
  resolveIINOffer: vi.fn(),
}));

vi.mock("@/lib/clerk", () => ({
  requireAuth: mocks.requireAuth,
  syncCurrentUser: mocks.syncCurrentUser,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { subscription: { findUnique: mocks.subscriptionFindUnique } },
}));

vi.mock("@/lib/stripe", () => ({ getStripe: mocks.getStripe }));

vi.mock("@/server/stripe/catalog", () => ({
  isIINOfferKey: (value: unknown) => value === "research_service",
  resolveIINOffer: mocks.resolveIINOffer,
}));

import { POST } from "@/app/api/stripe/iin-checkout/route";

function makeRequest(body: unknown, key = "req_1234567890123456") {
  return new Request("https://example.test/api/stripe/iin-checkout", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/iin-checkout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.test");
    vi.stubEnv("STRIPE_TRIAL_DAYS", "0");
    mocks.requireAuth.mockResolvedValue("user_123");
    mocks.syncCurrentUser.mockResolvedValue({
      id: "user_db_123",
      clerkId: "user_123",
      email: "owner@example.test",
      organizationId: "org_123",
    });
    mocks.subscriptionFindUnique.mockResolvedValue(null);
    mocks.resolveIINOffer.mockResolvedValue({
      key: "research_service",
      department: "research_discovery",
      mode: "payment",
      price: { id: "price_test_research" },
      product: { id: "prod_test_research" },
    });
    mocks.getStripe.mockReturnValue({
      checkout: { sessions: { create: mocks.checkoutCreate } },
    });
    mocks.checkoutCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.test/cs_test_123",
    });
  });

  it("rejects missing or malformed idempotency keys", async () => {
    const response = await POST(makeRequest({ offerKey: "research_service" }, "bad"));
    expect(response.status).toBe(400);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("rejects offers outside the allowlist", async () => {
    const response = await POST(makeRequest({ offerKey: "arbitrary_price_id" }));
    expect(response.status).toBe(400);
    expect(mocks.resolveIINOffer).not.toHaveBeenCalled();
  });

  it("creates a hosted sandbox Checkout session using only the server allowlisted Price", async () => {
    const response = await POST(makeRequest({ offerKey: "research_service", quantity: 2 }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      url: "https://checkout.stripe.test/cs_test_123",
      sessionId: "cs_test_123",
    });
    expect(mocks.checkoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_test_research", quantity: 2 }],
        metadata: expect.objectContaining({
          offer_key: "research_service",
          department: "research_discovery",
          billing_environment: "test",
        }),
        payment_intent_data: {
          metadata: expect.objectContaining({ offer_key: "research_service" }),
        },
      }),
      { idempotencyKey: "iin-checkout-user_123-req_1234567890123456" },
    );
  });

  it("rejects invalid quantities before calling Stripe", async () => {
    const response = await POST(makeRequest({ offerKey: "research_service", quantity: 101 }));
    expect(response.status).toBe(400);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });

  it("does not fall back to an unconfigured offer price", async () => {
    mocks.resolveIINOffer.mockRejectedValue(new Error("BILLING_NOT_CONFIGURED:STRIPE_PRICE_ID_RESEARCH_SERVICE"));
    const response = await POST(makeRequest({ offerKey: "research_service" }));
    expect(response.status).toBe(503);
    expect(mocks.checkoutCreate).not.toHaveBeenCalled();
  });
});
