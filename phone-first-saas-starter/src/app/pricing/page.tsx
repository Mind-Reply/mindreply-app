"use client";

import { createCheckout } from "@/server/actions/subscription";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

const plans = [
  { id: "personal", name: "Personal", price: "€29", description: "For individual use." },
  { id: "business", name: "Business", price: "€99", description: "For teams and growing workspaces." },
  { id: "creator", name: "Creator", price: "€149", description: "For high-volume professional workflows." },
] as const;

export default function Pricing() {
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function buy(plan: (typeof plans)[number]["id"]) {
    setBusyPlan(plan);
    setError(null);
    try {
      const result = await createCheckout({ plan });
      if (result.ok && result.url) {
        window.location.assign(result.url);
        return;
      }
      setError("Sign in and verify Stripe sandbox configuration before checkout.");
    } catch {
      setError("Unable to start checkout. Please try again.");
    } finally {
      setBusyPlan(null);
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm text-slate-500">MindReply subscriptions · sandbox</p>
        <h1 className="text-3xl font-bold">Choose your plan</h1>
        <p className="text-slate-600">Prices are shown in EUR. Checkout uses Stripe test mode until live billing is separately configured and reviewed.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-3 text-4xl font-black">{plan.price}<span className="text-base font-normal text-slate-500"> / month</span></p>
            <p className="mt-3 min-h-12 text-slate-600">{plan.description}</p>
            <Button
              className="mt-6 w-full"
              onClick={() => buy(plan.id)}
              disabled={busyPlan !== null}
            >
              {busyPlan === plan.id ? "Opening…" : `Choose ${plan.name}`}
            </Button>
          </article>
        ))}
      </div>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
