import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getStripe: vi.fn(),
  priceRetrieve: vi.fn(),
  productRetrieve: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/stripe", () => ({ getStripe: mocks.getStripe }));

import { isIINOfferKey, resolveIINOffer } from "@/server/stripe/catalog";

describe("IIN sandbox offer catalogue", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    for (const key of [
      "STRIPE_PRICE_ID_OPERATOR",
      "STRIPE_PRICE_ID_SOVEREIGN",
      "STRIPE_PRICE_ID_ENTERPRISE",
      "STRIPE_PRICE_ID_WEBSITE_COMPLETION",
      "STRIPE_PRICE_ID_ENGINEERING_SERVICE",
      "STRIPE_PRICE_ID_RESEARCH_SERVICE",
      "STRIPE_PRICE_ID_ROBOTICS_SERVICE",
      "STRIPE_PRICE_ID_CREATIVE_SERVICE",
      "STRIPE_PRICE_ID_ENTERPRISE_SERVICE",
    ]) {
      vi.stubEnv(key, `price_test_${key.toLowerCase()}`);
    }
    mocks.priceRetrieve.mockResolvedValue({
      id: "price_test_offer",
      active: true,
      livemode: false,
      type: "one_time",
      currency: "eur",
      product: "prod_test_offer",
    });
    mocks.productRetrieve.mockResolvedValue({ id: "prod_test_offer", active: true });
    mocks.getStripe.mockReturnValue({
      prices: { retrieve: mocks.priceRetrieve },
      products: { retrieve: mocks.productRetrieve },
    });
  });

  it("accepts only named allowlisted IIN offers", () => {
    expect(isIINOfferKey("research_service")).toBe(true);
    expect(isIINOfferKey("operator_subscription")).toBe(true);
    expect(isIINOfferKey("price_test_arbitrary")).toBe(false);
    expect(isIINOfferKey(null)).toBe(false);
  });

  it("maps subscription and service offers to usage-ledger departments", async () => {
    mocks.priceRetrieve.mockResolvedValue({
      id: "price_test_operator",
      active: true,
      livemode: false,
      type: "recurring",
      currency: "eur",
      product: "prod_test_offer",
    });
    const operator = await resolveIINOffer("operator_subscription");
    expect(operator.department).toBe("platform_operations");
    expect(operator.mode).toBe("subscription");

    mocks.priceRetrieve.mockResolvedValue({
      id: "price_test_website",
      active: true,
      livemode: false,
      type: "one_time",
      currency: "gbp",
      product: "prod_test_offer",
    });
    const website = await resolveIINOffer("website_completion");
    expect(website.department).toBe("engineering");
    expect(website.mode).toBe("payment");
  });

  it("rejects prices from live mode or inactive products", async () => {
    mocks.priceRetrieve.mockResolvedValue({
      id: "price_live",
      active: true,
      livemode: true,
      type: "one_time",
      currency: "eur",
      product: "prod_test_offer",
    });
    await expect(resolveIINOffer("research_service")).rejects.toThrow("PRICE_NOT_ACTIVE_IN_SANDBOX");

    mocks.priceRetrieve.mockResolvedValue({
      id: "price_test_offer",
      active: true,
      livemode: false,
      type: "one_time",
      currency: "eur",
      product: "prod_test_offer",
    });
    mocks.productRetrieve.mockResolvedValue({ id: "prod_test_offer", active: false });
    await expect(resolveIINOffer("research_service")).rejects.toThrow("PRODUCT_NOT_ACTIVE");
  });
});
