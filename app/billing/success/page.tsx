"use client";

import { useState } from "react";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: "customer@example.com",
        }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Checkout was not created.");
      }

      window.location.href = payload.url;
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to start checkout.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>Website Completion Package</h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        A focused website completion engagement for agreed scope, review, and delivery.
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 24,
          background: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: 1.2, opacity: 0.7, margin: 0 }}>
              One-time payment
            </p>
            <h2 style={{ margin: "8px 0 0" }}>£600</h2>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            style={{
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Preparing checkout..." : "Pay now"}
          </button>
        </div>

        <ul style={{ marginTop: 24, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Scope review before implementation</li>
          <li>Acceptance criteria agreed before work begins</li>
          <li>Implementation and delivery review before handoff</li>
        </ul>

        {error ? (
          <p style={{ color: "#b91c1c", marginTop: 20, marginBottom: 0 }}>{error}</p>
        ) : null}

        <p style={{ marginTop: 24, opacity: 0.8 }}>
          This checkout scaffold is for Stripe test mode and remains pending live configuration and provider-side verification.
        </p>
      </div>
    </main>
  );
}
