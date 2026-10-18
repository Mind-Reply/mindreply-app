import Link from "next/link";

const regions = [
  { code: "UK", label: "United Kingdom", href: "/uk", detail: "UK language and delivery context" },
  { code: "DE", label: "Deutschland", href: "/de", detail: "German-language entry point" },
  { code: "BG", label: "България", href: "/bg", detail: "Bulgarian-language entry point" },
];

const auditAreas = [
  {
    number: "01",
    title: "Enquiry response",
    body: "Find where incoming requests wait, lose ownership, or fail to receive a clear next step.",
  },
  {
    number: "02",
    title: "Handoffs and rework",
    body: "Map repeated manual work, disconnected tools, and avoidable steps between request and delivery.",
  },
  {
    number: "03",
    title: "Release and reliability",
    body: "Review deployment evidence, failure handling, and whether the service can prove what it claims.",
  },
  {
    number: "04",
    title: "Revenue-to-fulfilment",
    body: "Trace the route from an approved offer through verified payment, fulfilment, and customer handoff.",
  },
];

export default function HighStrikeCampaignPage() {
  return (
    <main className="mc-page">
      <nav className="mc-nav" aria-label="Primary navigation">
        <Link className="mc-brand" href="/">
          MindReply<small>OPERATING SYSTEM</small>
        </Link>
        <div className="mc-nav-center">
          <Link href="/platform">Platform</Link>
          <Link href="/operations">Operations</Link>
          <Link href="/services">Services</Link>
          <Link href="/regions">Regions</Link>
          <Link href="/evidence">Evidence</Link>
        </div>
        <div className="mc-nav-right">
          <span className="mc-state"><i className="mc-dot" />EVIDENCE FIRST</span>
        </div>
      </nav>

      <section className="mc-hero">
        <div>
          <p className="mc-kicker"><i />HIGHTSTRIKE · OPERATIONAL DIAGNOSTICS</p>
          <h1>Find where work<br /><em>loses momentum.</em></h1>
          <p className="lead">
            Identify missed enquiries, fragile handoffs, repeated manual work, and gaps between
            payment and delivery. Start with observable evidence, rank the risks, and leave with
            a practical next-step plan—not an unsupported promise.
          </p>
          <div className="mc-actions">
            <Link className="mc-primary" href="/audit">Review the audit offer ↗</Link>
            <Link className="mc-secondary" href="/contact">Build a delivery brief ↗</Link>
          </div>
          <p className="mc-note">
            The brief builder currently runs in the browser and does not submit or store your
            answers. Do not enter personal, customer, or confidential information there.
          </p>
        </div>
        <aside className="mc-console">
          <div className="mc-console-top"><span>DIAGNOSTIC METHOD</span><b>PROOF → PRIORITY</b></div>
          <div className="mc-console-main">
            <div className="mc-verdict">
              <strong>Evidence before claims.</strong>
              <span>REVIEWABLE</span>
            </div>
            <p>Each finding separates observed facts, source-backed evidence, estimates, and open questions.</p>
            <p>No fabricated competitor outages, customer outcomes, savings, or performance benchmarks.</p>
          </div>
        </aside>
      </section>

      <section className="mc-section">
        <div className="mc-section-head">
          <span>DIAGNOSTIC AREAS</span>
          <h2>Four places where operational friction becomes visible.</h2>
        </div>
        <div className="mc-rail">
          {auditAreas.map((area) => (
            <article className="mc-module" key={area.number}>
              <span className="num">{area.number}</span>
              <h3>{area.title}</h3>
              <p>{area.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mc-section">
        <div className="mc-section-head">
          <span>REGIONAL ENTRY</span>
          <h2>Start in the language and market that fits your operation.</h2>
        </div>
        <div className="mc-link-grid">
          {regions.map((region) => (
            <Link className="mc-link-card" href={region.href} key={region.code}>
              <span>{region.code} · REGIONAL ENTRY</span>
              <b>{region.label} ↗</b>
              <p>{region.detail}. Confirm local scope, consent, and commercial requirements before launch.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mc-section">
        <div className="mc-section-head">
          <span>WHAT YOU RECEIVE</span>
          <h2>A decision baseline you can act on.</h2>
        </div>
        <div className="mc-link-grid">
          <article className="mc-link-card"><span>01 · FINDINGS</span><b>Evidence-linked gaps</b><p>Observations tied to sources, timestamps, confidence, and limitations.</p></article>
          <article className="mc-link-card"><span>02 · PRIORITIES</span><b>Ranked next steps</b><p>Risk and likely business impact separated from assumptions.</p></article>
          <article className="mc-link-card"><span>03 · REMEDIATION</span><b>Practical sequence</b><p>Small, reversible changes with owners, acceptance checks, and stop conditions.</p></article>
        </div>
      </section>

      <section className="mc-closing">
        <p className="mc-kicker"><i />CONTROLLED NEXT STEP</p>
        <h2>Prove the first gap. Fix the highest-value one.</h2>
        <p>
          Start with the existing audit offer or prepare a brief. No campaign tracking, automated
          outreach, or live conversion telemetry is claimed by this page.
        </p>
        <div className="mc-actions">
          <Link className="mc-primary" href="/audit">Review the audit offer ↗</Link>
          <Link className="mc-secondary" href="/contact">Build a delivery brief ↗</Link>
        </div>
      </section>
    </main>
  );
}
