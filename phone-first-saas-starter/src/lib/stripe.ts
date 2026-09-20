import "server-only";
import Stripe from "stripe";
export function getStripe(){const key=process.env.STRIPE_SECRET_KEY;if(!key)throw new Error("STRIPE_SECRET_KEY is required at runtime");return new Stripe(key,{apiVersion:"2024-08-01" as any});}
export const stripePriceId=()=>process.env.STRIPE_PRICE_ID??"price_REPLACE_ME";
