import Link from "next/link";
import { regions, services } from "../services/catalog";

export const metadata = {
  title: "Enterprise Delivery | MindReply",
  description: "Innovation, data, infrastructure, applications, security, managed services, digital workplace and training through one accountable delivery model.",
};

export default function EnterprisePage() {
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation">
      <Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link>
      <div className="mc-nav-center"><Link href="/platform">Platform</Link><Link href="/operations">Operations</Link><Link href="/services">Services</Link><Link href="/regions">Regions</Link><Link href="/evidence">Evidence</Link></div>
      <div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>ENTERPRISE DELIVERY</span></div>
    </nav>
    <section className="mc-hero">
      <div>
        <p className="mc-kicker"><i/>INNOVATION & INTELLIGENCE / ENTERPRISE</p>
        <h1>From technology ambition to <em>working infrastructure.</em></h1>
        <p className="lead">A connected delivery model spanning intelligence, data, infrastructure, applications, security, managed operations, digital workplace and training — with evidence carried through every stage.</p>
        <div className="mc-actions"><Link className="mc-primary" href="/audit">Establish the baseline ↗</Link><Link className="mc-secondary" href="/contact">Discuss a requirement</Link></div>
      </div>
      <aside className="mc-console">
        <div className="mc-console-top"><span>DELIVERY PATH</span><b>CONTROLLED</b></div>
        <div className="mc-console-main"><div className="mc-verdict"><strong>Assess → Design → Build → Operate → Prove.</strong><span>EVIDENCE LED</span></div><p>Each stage has a defined output and an evidence boundary. Planned capability is not represented as live capability until runtime or deployment evidence exists.</p></div>
      </aside>
    </section>
    <section className="mc-section">
      <div className="mc-section-head"><span>EIGHT CAPABILITIES</span><h2>One accountable path across the technology estate.</h2></div>
      <div className="mc-link-grid">{services.map(s => <Link className="mc-link-card" key={s.slug} href={`/services/${s.slug}`}><span>{s.number} · CAPABILITY</span><b>{s.title} ↗</b><p>{s.promise}</p></Link>)}</div>
    </section>
    <section className="mc-section">
      <div className="mc-section-head"><span>REGIONAL SCALE</span><h2>Shared standards. Local execution.</h2></div>
      <div className="mc-rail">{regions.map((r, i) => <Link className="mc-module" key={r.slug} href={`/regions/${r.slug}`}><span className="num">0{i + 1}</span><h3>{r.name}</h3><p>{r.mode}</p><span className="mc-secondary">Open delivery view ↗</span></Link>)}</div>
    </section>
    <section className="mc-section">
      <div className="mc-section-head"><span>OPERATING MODEL</span><h2>Build once. Verify. Reuse the delivery pattern.</h2></div>
      <div className="mc-link-grid">
        <article className="mc-link-card"><span>01 · ASSESS</span><b>Find the highest-value gap.</b></article>
        <article className="mc-link-card"><span>02 · DESIGN</span><b>Define architecture, controls and ownership.</b></article>
        <article className="mc-link-card"><span>03 · BUILD</span><b>Implement with release and rollback discipline.</b></article>
        <article className="mc-link-card"><span>04 · OPERATE</span><b>Monitor, maintain and improve.</b></article>
      </div>
    </section>
    <section className="mc-closing"><p className="mc-kicker"><i/>PROOF BEFORE SCALE</p><h2>Turn the first working pattern into a repeatable delivery system.</h2><p>Enterprise and regional expansion should reuse verified architecture, controls and evidence rather than create disconnected implementations.</p><Link className="mc-primary" href="/audit">Start with evidence ↗</Link></section>
    <footer className="mc-footer"><span>MindReply</span><span>INTELLIGENCE · TECHNOLOGY · OPERATIONS</span><div className="mc-footer-links"><Link href="/status">System status ↗</Link><Link href="/contact">Contact ↗</Link></div></footer>
  </main>;
}
