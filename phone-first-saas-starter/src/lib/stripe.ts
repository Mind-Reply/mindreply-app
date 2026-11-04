import "server-only";
import Stripe from "stripe";

export type MindReplyPlan = "operator" | "sovereign" | "enterprise";

const PLAN_PRICE_ENV: Record<MindReplyPlan, string> = {
  operator: "STRIPE_PRICE_ID_OPERATOR",
  sovereign: "STRIPE_PRICE_ID_SOVEREIGN",
  enterprise: "STRIPE_PRICE_ID_ENTERPRISE",
};

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is required at runtime");
  if (!key.startsWith("sk_test_") && !key.startsWith("rk_test_")) {
    throw new Error("STRIPE_TEST_KEY_REQUIRED: this billing package is sandbox-only.");
  }
  return new Stripe(key);
}

/**
 * Price IDs are account- and environment-specific. Never fall back to
 * hard-coded IDs: a stale ID can silently target the wrong Stripe account.
 */
export function stripePriceId(plan: MindReplyPlan = "operator") {
  const envName = PLAN_PRICE_ENV[plan];
  const configured = process.env[envName];
  if (!configured) throw new Error(`${envName} is required for Stripe billing`);
  return configured;
}

/** No free trial unless the merchant has explicitly configured one. */
export function stripeTrialDays() {
  const value = Number(process.env.STRIPE_TRIAL_DAYS ?? "0");
  return Number.isInteger(value) && value > 0 && value <= 90 ? value : 0;
}
