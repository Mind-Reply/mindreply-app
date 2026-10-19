import { beforeEach, describe, expect, it, vi } from "vitest";

const { getStripe, pricesRetrieve, sessionsCreate } = vi.hoisted(() => ({
  getStripe: vi.fn(),
  pricesRetrieve: vi.fn(),
  sessionsCreate: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({ getStripe }));

import { POST } from "@/app/api/stripe/one-time-checkout/route";

const validPrice = {
  id: "price_website_completion",
  active: true,
  type: "one_time",
  currency: "gbp",
  unit_amount: 60_000,
};

function request(body: unknown) {
  return new Request("https://example.test/api/stripe/one-time-checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/one-time-checkout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("STRIPE_PRICE_ID_WEBSITE_COMPLETION", "price_website_completion");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.test");
    getStripe.mockReturnValue({
      prices: { retrieve: pricesRetrieve },
      checkout: { sessions: { create: sessionsCreate } },
    });
    pricesRetrieve.mockResolvedValue(validPrice);
    sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.test/session" });
  });

  it("rejects an invalid email without contacting Stripe", async () => {
    const response = await POST(request({ email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "A valid email address is required." });
    expect(getStripe).not.toHaveBeenCalled();
  });

  it("returns 503 when checkout configuration is missing", async () => {
    vi.stubEnv("STRIPE_PRICE_ID_WEBSITE_COMPLETION", "");

    const response = await POST(request({ email: "buyer@example.com" }));

    expect(response.status).toBe(503);
    expect(pricesRetrieve).not.toHaveBeenCalled();
  });

  it("refuses an inactive or incorrectly priced Stripe Price", async () => {
    pricesRetrieve.mockResolvedValue({ ...validPrice, active: false });

    const response = await POST(request({ email: "buyer@example.com" }));

    expect(response.status).toBe(503);
    expect(sessionsCreate).not.toHaveBeenCalled();
  });

  it("creates a one-time GBP 600 Checkout Session using the server-configured Price", async () => {
    const response = await POST(request({ email: " Buyer@Example.com " }));

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ url: "https://checkout.stripe.test/session" });
    expect(pricesRetrieve).toHaveBeenCalledWith("price_website_completion");
    expect(sessionsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_website_completion", quantity: 1 }],
        customer_email: "buyer@example.com",
        client_reference_id: "website_completion_gbp_600",
        metadata: { package_key: "website_completion_gbp_600", offer_version: "1" },
      }),
    );
  });

  it("returns a gateway error when Stripe does not provide a Checkout URL", async () => {
    sessionsCreate.mockResolvedValue({ url: null });

    const response = await POST(request({ email: "buyer@example.com" }));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Stripe did not return a checkout URL." });
  });

  it("returns a generic error when Stripe throws", async () => {
    pricesRetrieve.mockRejectedValue(new Error("provider details must not reach the client"));

    const response = await POST(request({ email: "buyer@example.com" }));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Unable to create checkout session." });
  });
});
