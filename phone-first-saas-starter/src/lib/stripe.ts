import "server-only";
import Stripe from "stripe";

const LIVE_PRICE_ID = "price_1UMFMrAQ1te7GXAzgOnaZKXf";
const LIVE_LOOKUP_KEY = "3650_live_license_monthly_usd49";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is required at runtime");
  return new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
}

export function stripePriceId() {
  return process.env.STRIPE_PRICE_ID ?? LIVE_PRICE_ID;
}

export function stripeTrialDays() {
  const value = Number(process.env.STRIPE_TRIAL_DAYS ?? "14");
  return Number.isInteger(value) && value > 0 && value <= 90 ? value : 14;
}

export { LIVE_LOOKUP_KEY };
