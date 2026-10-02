"use client";

export async function createCheckoutSession(priceId?: string) {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId }),
  });

  const payload = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? "Unable to create Stripe Checkout session.");
  }

  window.location.assign(payload.url);
}
