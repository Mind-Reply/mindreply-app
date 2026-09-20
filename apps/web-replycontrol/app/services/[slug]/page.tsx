import Link from "next/link";
import { getService, services } from "../catalog";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return <main className="mc-page"><section className="mc-closing"><h1>Capability not found.</h1><Link className="mc-primary" href="/services">Return to services ↗</Link></section></main>;
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation"><Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link><div className="mc-nav-center"><Link href="/platform">Platform</Link><Link href="/operations">Operations</Link><Link href="/services">Services</Link><Link href="/evidence">Evidence</Link></div><div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>DELIVERY READY</span></div></nav>
    <section className="mc-hero"><div><p className="mc-kicker"><i/>CAPABILITY / {service.number}</p><h1>{service.title}<br/><em>from assessment to operation.</em></h1><p className="lead">{service.promise}</p><div className="mc-actions"><Link className="mc-primary" href="/audit">Start with an assessment ↗</Link><Link className="mc-secondary" href="/contact">Discuss delivery</Link></div></div><aside className="mc-console"><div className="mc-console-top"><span>DELIVERY CONTRACT</span><b>END TO END</b></div><div className="mc-console-main"><span className="mc-console-label">Accountable path</span><div className="mc-verdict"><strong>Assess → Build → Operate.</strong><span>READY</span></div><p>Every stage produces an explicit handoff and evidence that can be reviewed before the next stage.</p></div></aside></section>
    <section className="mc-section"><div className="mc-section-head"><span>OUTCOMES</span><h2>What this capability is designed to change.</h2></div><div className="mc-rail">{service.outcomes.map((item, i) => <article className="mc-module" key={item}><span className="num">0{i + 1}</span><h3>{item}</h3><p>Defined as a measurable delivery outcome rather than a generic service label.</p></article>)}</div></section>
    <section className="mc-section"><div className="mc-section-head"><span>IMPLEMENTATION</span><h2>A real delivery path, not a brochure.</h2></div><div className="mc-link-grid">{service.delivery.map((item, i) => <article className="mc-link-card" key={item}><span>{String(i + 1).padStart(2, "0")} · DELIVERY</span><b>{item}</b></article>)}</div></section>
    <section className="mc-section"><div className="mc-section-head"><span>PROOF</span><h2>Evidence is part of the service.</h2></div><div className="mc-principle-list">{service.evidence.map((item, i) => <article className="mc-principle" key={item}><span>{String(i + 1).padStart(2, "0")}</span><div><h3>{item}</h3><p>Captured as an operational artefact so delivery status can be verified rather than assumed.</p></div></article>)}</div></section>
    <section className="mc-closing"><p className="mc-kicker"><i/>NEXT STEP</p><h2>Start with the highest-value gap.</h2><p>Use the existing audit path to establish the baseline, then turn the selected capability into an implementation and operating workstream.</p><Link className="mc-primary" href="/audit">Request an assessment ↗</Link></section>
  </main>;
}
