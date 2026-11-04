"use client";

export type SubscriptionPlan = "operator" | "sovereign" | "enterprise";

export async function createCheckoutSession(plan: SubscriptionPlan = "operator", quantity = 1) {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({ plan, quantity }),
  });

  const payload = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? "Unable to create Stripe Checkout session.");
  }

  window.location.assign(payload.url);
}
