"use client";

import { useMemo, useState } from "react";
import "./profit-engineering.css";

type Application = {
  name: string;
  role: string;
  status: "VERIFIED" | "CANDIDATE";
  entry: string;
  delivery: string;
};

const applications: Application[] = [
  {
    name: "€3,000 Profit Audit",
    role: "Revenue entry / diagnostic",
    status: "VERIFIED",
    entry: "Existing verified Stripe checkout path in the canonical repo",
    delivery: "GitHub + Python audit with proof-bearing findings",
  },
  {
    name: "Workflow Clinic",
    role: "Leakage repair / implementation",
    status: "CANDIDATE",
    entry: "Scope and price require owner definition",
    delivery: "Workflow diagnosis → repair → verification",
  },
  {
    name: "Site Rescue Desk",
    role: "Conversion / release repair",
    status: "CANDIDATE",
    entry: "Scope and price require owner definition",
    delivery: "Site evidence → repair → release proof",
  },
];

export default function ProfitEngineeringPage() {
  const [target, setTarget] = useState("10000");
  const [price, setPrice] = useState("3000");
  const [closeRate, setCloseRate] = useState("20");
  const [qualifiedRate, setQualifiedRate] = useState("50");

  const math = useMemo(() => {
    const t = Math.max(0, Number(target) || 0);
    const p = Math.max(1, Number(price) || 1);
    const c = Math.min(100, Math.max(0.1, Number(closeRate) || 0.1)) / 100;
    const q = Math.min(100, Math.max(0.1, Number(qualifiedRate) || 0.1)) / 100;
    const deals = Math.ceil(t / p);
    const qualified = Math.ceil(deals / c);
    const leads = Math.ceil(qualified / q);
    return { deals, qualified, leads };
  }, [target, price, closeRate, qualifiedRate]);

  return (
    <main className="profit-engine">
      <header>
        <p className="eyebrow">A11CEO / PROFIT ENGINEERING</p>
        <h1>Reverse the economics. Then engineer the application.</h1>
        <p className="dek">
          Start with a revenue target, trace it backwards to qualified demand,
          conversion, offer, delivery capacity and proof. No forecast is treated
          as fact; every assumption stays visible.
        </p>
      </header>

      <section className="equation" aria-label="Reverse profit path">
        <span>REVENUE TARGET</span><b>←</b><span>DEALS</span><b>←</b>
        <span>QUALIFIED DEMAND</span><b>←</b><span>LEADS</span><b>←</b>
        <span>OFFER + PROOF</span>
      </section>

      <section className="calculator">
        <div className="inputs">
          <h2>Reverse calculator</h2>
          <label>Revenue target (€)<input value={target} onChange={e => setTarget(e.target.value)} inputMode="decimal" /></label>
          <label>Offer price (€)<input value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal" /></label>
          <label>Close rate (%)<input value={closeRate} onChange={e => setCloseRate(e.target.value)} inputMode="decimal" /></label>
          <label>Lead → qualified (%)<input value={qualifiedRate} onChange={e => setQualifiedRate(e.target.value)} inputMode="decimal" /></label>
        </div>
        <div className="result">
          <p className="eyebrow">MODELLED REQUIREMENT</p>
          <strong>{math.leads.toLocaleString()}</strong>
          <span>leads required</span>
          <div><b>{math.qualified.toLocaleString()}</b> qualified opportunities</div>
          <div><b>{math.deals.toLocaleString()}</b> closed deals</div>
          <small>Mathematical scenario only. Not a sales forecast or live metric.</small>
        </div>
      </section>

      <section className="applications">
        <div className="section-head">
          <p className="eyebrow">APPLICATIONS</p>
          <h2>Build from the money backwards.</h2>
        </div>
        {applications.map(a => (
          <article key={a.name} className="application">
            <div><span className={"status " + a.status.toLowerCase()}>{a.status}</span><h3>{a.name}</h3><p>{a.role}</p></div>
            <div><strong>Entry</strong><p>{a.entry}</p></div>
            <div><strong>Delivery</strong><p>{a.delivery}</p></div>
          </article>
        ))}
      </section>

      <section className="operating-rule">
        <p className="eyebrow">OWNER RULE</p>
        <h2>Do not scale a leak.</h2>
        <p>
          Each application must identify the economic outcome, proof required,
          acquisition path, conversion boundary, delivery capacity, rollback
          path and owner approval before irreversible spend or outreach.
        </p>
      </section>

      <footer>© 2026 MindReply · scenario math is explicit · verified claims stay separate from assumptions</footer>
    </main>
  );
}
