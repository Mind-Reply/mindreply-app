const CHECKOUT = "https://book.stripe.com/8x2aER4owd8c1TG4Ku63K00";

const checks = [
  ["01", "Release engineering", "Branches, CI/CD, environments, deployment controls and rollback readiness."],
  ["02", "Automation reliability", "Python and workflow automation reviewed for failure handling, maintainability and operational risk."],
  ["03", "Security & secrets", "Secret exposure paths, permissions, dependency risk and practical control gaps."],
  ["04", "Revenue-to-delivery", "Payment, intake, fulfillment and customer handoff paths checked for avoidable leakage."],
  ["05", "Operational evidence", "Health signals, logs, ownership and release evidence checked against what the system can actually prove."],
  ["06", "Margin opportunities", "Concrete reliability, cost and delivery improvements prioritized by business impact."],
];

const outputs = [
  ["01", "Findings", "Material gaps tied to evidence, not generic best-practice commentary."],
  ["02", "Priorities", "Risk and commercial impact ranked so the team knows what matters first."],
  ["03", "Remediation", "A sequenced route from current state to stronger release and operating controls."],
  ["04", "Decision baseline", "A factual reference point for deciding what to fix, automate, retire or scale."],
];

export default function AuditPage() {
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation">
      <a className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></a>
      <div className="mc-nav-center"><a href="/platform">Platform</a><a href="/services">Services</a><a href="/operations">Operations</a><a href="/evidence">Evidence</a></div>
      <div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>AUDIT READY</span><a href="/contact">Contact</a></div>
    </nav>

    <section className="mc-hero" aria-labelledby="audit-title">
      <div>
        <p className="mc-kicker"><i/>GITHUB + PYTHON PROFIT AUDIT</p>
        <h1 id="audit-title">Find the gap between <em>what your system does</em> and what it should prove.</h1>
        <p className="lead">A focused seven-day technical-commercial review of your repositories, automation, security, release path and revenue-to-delivery workflow. We turn evidence into a short, prioritized route to controlled execution.</p>
        <div className="mc-actions"><a className="mc-primary" href={CHECKOUT} target="_blank" rel="noreferrer">Start the €3,000 audit ↗</a><a className="mc-secondary" href="/contact">Ask a question</a></div>
      </div>
      <aside className="mc-console" aria-label="Audit outcome">
        <div className="mc-console-top"><span>PROOFLINE / AUDIT OUTPUT</span><b>7 DAYS</b></div>
        <div className="mc-console-main"><span className="mc-console-label">Review posture</span><div className="mc-verdict"><strong>Evidence before conclusions.</strong><span>BOUNDED</span></div><div className="mc-lanes">{[["Risk","RANKED"],["Reliability","REVIEWED"],["Margin","MAPPED"],["Actions","SEQUENCED"]].map(([a,b])=><div className="mc-lane" key={a}><span>{a}</span><div className="mc-lane-bar"><i style={{width:"100%"}}/></div><b>{b}</b></div>)}</div></div>
      </aside>
    </section>

    <section className="mc-section" aria-labelledby="checks-title">
      <div className="mc-section-head"><span>WHAT WE CHECK</span><h2 id="checks-title">The review follows the path from code to commercial outcome.</h2></div>
      <div className="mc-rail">{checks.map(([n,title,body])=><article className="mc-module" key={n}><span className="num">{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="outputs-title">
      <div className="mc-section-head"><span>WHAT YOU RECEIVE</span><h2 id="outputs-title">A decision-ready audit, not another generic consultancy deck.</h2></div>
      <div className="mc-link-grid">{outputs.map(([n,title,body])=><article className="mc-link-card" key={n}><span>{n} · {title}</span><b>{body}</b></article>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="boundary-title">
      <div className="mc-section-head"><span>BOUNDARY</span><h2 id="boundary-title">Missing evidence is a finding, not a green signal.</h2></div>
      <div className="mc-principle-list"><article className="mc-principle"><span>01</span><div><h3>Facts first</h3><p>Repository and production evidence is distinguished from assumptions, claims and planned work.</p></div></article><article className="mc-principle"><span>02</span><div><h3>Owner-controlled</h3><p>The audit recommends and prioritizes; consequential production changes remain under explicit owner control.</p></div></article></div>
    </section>

    <section className="mc-closing"><p className="mc-kicker"><i/>REALITY DELTA</p><h2>Know what the system actually does before you scale it.</h2><p>The audit establishes a factual baseline, exposes the highest-value gaps, and gives your team a practical route from current state to controlled execution.</p><a className="mc-primary" href={CHECKOUT} target="_blank" rel="noreferrer">Start the audit ↗</a></section>
    <footer className="mc-footer"><span>MindReply</span><span>OPERATE · EVIDENCE · RELEASE</span><div className="mc-footer-links"><a href="/status">System status ↗</a><a href="/contact">Contact ↗</a></div></footer>
  </main>;
}
