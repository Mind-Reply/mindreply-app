import "server-only";
import Stripe from "stripe";

export type MindReplyPlan = "personal" | "business" | "creator";

const SANDBOX_PRICE_IDS: Record<MindReplyPlan, string> = {
  personal: "price_1TbgZcLTiMfuPTv6NKx8VffL",
  business: "price_1TbgaDLTiMfuPTv61nX8nCXl",
  creator: "price_1TbgayLTiMfuPTv64DqfFqKs",
};

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is required at runtime");
  return new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
}

/**
 * Resolve only known MindReply plans. Sandbox IDs are the safe defaults for
 * test keys; live mode must supply explicit live price IDs per plan.
 */
export function stripePriceId(plan: MindReplyPlan = "personal") {
  const key = process.env.STRIPE_SECRET_KEY;
  const envName = {
    personal: "STRIPE_PRICE_ID_PERSONAL",
    business: "STRIPE_PRICE_ID_BUSINESS",
    creator: "STRIPE_PRICE_ID_CREATOR",
  }[plan];
  const configured = process.env[envName];

  if (configured) return configured;
  if (key?.startsWith("sk_test_") || key?.startsWith("rk_test_")) return SANDBOX_PRICE_IDS[plan];

  throw new Error(`${envName} is required for live Stripe billing`);
}

export function stripeTrialDays() {
  const value = Number(process.env.STRIPE_TRIAL_DAYS ?? "14");
  return Number.isInteger(value) && value > 0 && value <= 90 ? value : 14;
}
