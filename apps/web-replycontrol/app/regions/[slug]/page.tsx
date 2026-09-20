import Link from "next/link";
import { regions, services } from "../../services/catalog";

export function generateStaticParams() { return regions.map(({ slug }) => ({ slug })); }

const focus: Record<string, string[]> = {
  global: ["Cross-border delivery", "Cloud and application modernisation", "Security and operational assurance"],
  europe: ["Digital transformation", "Cyber resilience", "Cloud, data and advanced technology adoption"],
  bulgaria: ["SME digitalisation", "Advanced technology adoption", "Cybersecurity and digital skills"],
};

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = regions.find(r => r.slug === slug);
  if (!region) return <main className="mc-page"><section className="mc-closing"><h1>Region not found.</h1><Link className="mc-primary" href="/regions">Return to regions ↗</Link></section></main>;
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation"><Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link><div className="mc-nav-center"><Link href="/platform">Platform</Link><Link href="/operations">Operations</Link><Link href="/services">Services</Link><Link href="/regions">Regions</Link></div><div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>REGIONAL READY</span></div></nav>
    <section className="mc-hero"><div><p className="mc-kicker"><i/>REGION / {region.name.toUpperCase()}</p><h1>{region.name}<br/><em>delivery programme.</em></h1><p className="lead">{region.mode}. The same accountable engineering model is adapted to local commercial, regulatory and capability conditions.</p><div className="mc-actions"><Link className="mc-primary" href="/audit">Start an assessment ↗</Link><Link className="mc-secondary" href="/contact">Discuss this market</Link></div></div><aside className="mc-console"><div className="mc-console-top"><span>REGIONAL FOCUS</span><b>ADAPTABLE</b></div><div className="mc-console-main"><div className="mc-verdict"><strong>Common core. Local context.</strong><span>CONTROLLED</span></div><div className="mc-lanes">{(focus[slug] ?? focus.global).map((item) => <div className="mc-lane" key={item}><span>{item}</span><div className="mc-lane-bar"><i style={{width:"100%"}}/></div><b>READY</b></div>)}</div></div></aside></section>
    <section className="mc-section"><div className="mc-section-head"><span>CAPABILITY MAP</span><h2>Deploy the capabilities that match the local gap.</h2></div><div className="mc-link-grid">{services.map(s => <Link className="mc-link-card" key={s.slug} href={`/services/${s.slug}`}><span>{s.number} · CAPABILITY</span><b>{s.title} ↗</b></Link>)}</div></section>
    <section className="mc-closing"><p className="mc-kicker"><i/>PROOF BEFORE SCALE</p><h2>Validate the first delivery pattern before multiplying it.</h2><p>Each regional rollout should produce measurable delivery evidence that can feed the next market rather than create another isolated site.</p><Link className="mc-primary" href="/audit">Establish the baseline ↗</Link></section>
  </main>;
}
