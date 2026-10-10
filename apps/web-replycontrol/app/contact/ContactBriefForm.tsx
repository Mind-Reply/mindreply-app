"use client";

import { useState, type FormEvent } from "react";
import { services, regions } from "../services/catalog";

export default function ContactBriefForm() {
  const [serviceSlug, setServiceSlug] = useState(services[0].slug);
  const [regionSlug, setRegionSlug] = useState("global");
  const [goal, setGoal] = useState("");
  const [brief, setBrief] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const service = services.find((item) => item.slug === serviceSlug);
    const region = regions.find((item) => item.slug === regionSlug);
    if (!service || !region || goal.trim().length < 12) return;
    setBrief(JSON.stringify({
      generatedAt: new Date().toISOString(),
      status: "DRAFT — NOT A DEPLOYMENT RECEIPT",
      capability: service.title,
      region: region.name,
      regionalModel: region.mode,
      desiredOutcome: goal.trim(),
      delivery: ["Assess", "Design", "Build", "Operate", "Verify", "Record evidence"],
      systems: service.systems,
      acceptanceEvidence: service.evidence,
      launchGate: "Confirm owner, applicability, tests, runtime and deployment evidence before launch."
    }, null, 2));
  }

  return <section className="mc-section">
    <div className="mc-section-head"><span>BUILD A BRIEF</span><h2>Define the capability, region and outcome.</h2></div>
    <p>This form runs in your browser. It does not submit or store the brief. Do not include personal or confidential details.</p>
    <form className="mc-link-grid" onSubmit={submit}>
      <label className="mc-link-card">Capability<select value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)}>{services.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      <label className="mc-link-card">Region<select value={regionSlug} onChange={(e) => setRegionSlug(e.target.value)}>{regions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
      <label className="mc-link-card">Desired outcome<textarea value={goal} onChange={(e) => setGoal(e.target.value)} minLength={12} maxLength={4000} required rows={5} placeholder="Describe the outcome, current constraint and success measure." /></label>
      <button className="mc-primary" type="submit">Build delivery brief ↗</button>
    </form>
    {brief && <div className="mc-section"><div className="mc-section-head"><span>COMPILED OUTPUT</span><h2>Review before committing.</h2></div><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{brief}</pre></div>}
  </section>;
}
