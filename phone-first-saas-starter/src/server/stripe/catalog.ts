import "server-only";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export type IINOfferKey =
  | "operator_subscription"
  | "sovereign_subscription"
  | "enterprise_subscription"
  | "website_completion"
  | "engineering_service"
  | "research_service"
  | "robotics_service"
  | "creative_service"
  | "enterprise_service";

type OfferDefinition = {
  priceEnv: string;
  mode: "payment" | "subscription";
  department: string;
};

const OFFERS: Record<IINOfferKey, OfferDefinition> = {
  operator_subscription: { priceEnv: "STRIPE_PRICE_ID_OPERATOR", mode: "subscription", department: "platform" },
  sovereign_subscription: { priceEnv: "STRIPE_PRICE_ID_SOVEREIGN", mode: "subscription", department: "platform" },
  enterprise_subscription: { priceEnv: "STRIPE_PRICE_ID_ENTERPRISE", mode: "subscription", department: "enterprise_operations" },
  website_completion: { priceEnv: "STRIPE_PRICE_ID_WEBSITE_COMPLETION", mode: "payment", department: "specialist_engineering" },
  engineering_service: { priceEnv: "STRIPE_PRICE_ID_ENGINEERING_SERVICE", mode: "payment", department: "engineering" },
  research_service: { priceEnv: "STRIPE_PRICE_ID_RESEARCH_SERVICE", mode: "payment", department: "research_discovery" },
  robotics_service: { priceEnv: "STRIPE_PRICE_ID_ROBOTICS_SERVICE", mode: "payment", department: "robotics" },
  creative_service: { priceEnv: "STRIPE_PRICE_ID_CREATIVE_SERVICE", mode: "payment", department: "creative_design" },
  enterprise_service: { priceEnv: "STRIPE_PRICE_ID_ENTERPRISE_SERVICE", mode: "payment", department: "enterprise_operations" },
};

export type ResolvedIINOffer = {
  key: IINOfferKey;
  department: string;
  mode: "payment" | "subscription";
  price: Stripe.Price;
  product: Stripe.Product;
};

export function isIINOfferKey(value: unknown): value is IINOfferKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(OFFERS, value);
}

export async function resolveIINOffer(key: IINOfferKey): Promise<ResolvedIINOffer> {
  const definition = OFFERS[key];
  const priceId = process.env[definition.priceEnv];
  if (!priceId) throw new Error(`BILLING_NOT_CONFIGURED:${definition.priceEnv}`);

  const stripe = getStripe();
  const price = await stripe.prices.retrieve(priceId);
  if (!price.active || price.livemode !== false) throw new Error("PRICE_NOT_ACTIVE_IN_SANDBOX");

  const expectedType = definition.mode === "subscription" ? "recurring" : "one_time";
  if (price.type !== expectedType) throw new Error("PRICE_MODE_MISMATCH");

  const productId = typeof price.product === "string" ? price.product : price.product.id;
  const product = await stripe.products.retrieve(productId);
  if (!product.active) throw new Error("PRODUCT_NOT_ACTIVE");

  return { key, department: definition.department, mode: definition.mode, price, product };
}
