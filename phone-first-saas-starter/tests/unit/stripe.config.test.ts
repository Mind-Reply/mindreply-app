import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { StripeMock } = vi.hoisted(() => ({
  StripeMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("stripe", () => ({ default: StripeMock }));

import { getStripe } from "@/lib/stripe";

describe("sandbox-only Stripe client", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects missing Stripe credentials", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect(() => getStripe()).toThrow("STRIPE_SECRET_KEY is required at runtime");
    expect(StripeMock).not.toHaveBeenCalled();
  });

  it("accepts a standard Stripe test secret key", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_placeholder");
    getStripe();
    expect(StripeMock).toHaveBeenCalledWith("sk_test_placeholder");
  });

  it("accepts a restricted Stripe test secret key", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "rk_test_placeholder");
    getStripe();
    expect(StripeMock).toHaveBeenCalledWith("rk_test_placeholder");
  });

  it.each(["sk_live_placeholder", "rk_live_placeholder", "pk_test_placeholder", "not-a-stripe-key"])(
    "rejects non-test credential %s",
    (key) => {
      vi.stubEnv("STRIPE_SECRET_KEY", key);
      expect(() => getStripe()).toThrow("STRIPE_TEST_KEY_REQUIRED");
      expect(StripeMock).not.toHaveBeenCalled();
    },
  );
});
