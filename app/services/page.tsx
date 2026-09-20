import Link from "next/link";

const services = [
  ["01", "Health", "Liveness and basic runtime availability."],
  ["02", "Readiness", "Configuration and dependency readiness for safe release."],
  ["03", "Version", "Release identity, commit and runtime metadata."],
  ["04", "Service catalog", "Machine-readable inventory of operational capabilities."],
  ["05", "Status", "Human-readable operating state and verification surface."],
  ["06", "Control plane", "The next layer for governed execution, approvals and recovery."],
] as const;

export default function ServicesPage() {
  return (
    <main className="mc-page">
      <nav className="mc-nav" aria-label="Primary navigation">
        <Link className="mc-brand" href="/">MindReply<small>OPERATIONS</small></Link>
        <div className="mc-nav-center">
          <Link href="/">Home</Link><Link href="/status">Status</Link><Link href="/services">Services</Link>
        </div>
        <Link className="mc-secondary" href="/">Back to MindReply</Link>
      </nav>
      <section className="mc-section" style={{paddingTop:"7rem"}}>
        <div className="mc-section-head"><span>MICROSERVICE SURFACE</span><h1>Small services.<br/><em>Clear boundaries.</em></h1></div>
        <p className="lead" style={{maxWidth:"48rem"}}>MindReply exposes operational primitives as independently verifiable routes so the public experience, monitoring and automation can share the same source of truth.</p>
        <div className="mc-rail">
          {services.map(([n, title, body]) => <article className="mc-module" key={n}><span className="num">{n}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>
      <section className="mc-closing"><p className="mc-kicker"><i/>OPERATING CONTRACT</p><h2>Inspect first.<br/>Promote second.</h2><p>Production automation can consume the same health, readiness, version and service metadata before acting on a release or recovery path.</p><Link className="mc-primary" href="/status">Open live status ↗</Link></section>
      <footer className="mc-footer"><span>MindReply · Operations</span><span>Health · Ready · Version · Services · Status</span></footer>
    </main>
  );
}
