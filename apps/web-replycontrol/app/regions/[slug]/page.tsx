import Link from "next/link";
import { regions, services } from "../../services/catalog";

export function generateStaticParams() { return regions.map(({ slug }) => ({ slug })); }

const focus: Record<string, string[]> = {
  global: ["Shared capability and release standards", "Region-aware data and provider adapters", "Deployment, support and evidence gates"],
  europe: ["Data protection and sector applicability review", "Digital resilience and secure delivery", "Local contracts and support boundaries"],
  bulgaria: ["Bulgarian-language SME enablement", "Regional integrations and delivery partners", "Local entity, invoicing and tax verification"],
  "uk-global": ["UK-specific privacy and contract review", "Enterprise modernisation and managed operations", "Support coverage and transfer assessment"],
  "nordics-switzerland": ["Country-specific procurement and data needs", "Secure workplace and cloud modernisation", "Language and support requirements"],
  "north-america": ["Application modernisation and engineering", "Security and managed operations", "Local contract, tax and support review"]
};

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = regions.find((item) => item.slug === slug);
  if (!region) return <main className="mc-page"><section className="mc-closing"><h1>Region not found.</h1><Link className="mc-primary" href="/regions">Return to regions ↗</Link></section></main>;
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation"><Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link><div className="mc-nav-center"><Link href="/platform">Platform</Link><Link href="/operations">Operations</Link><Link href="/services">Services</Link><Link href="/regions">Regions</Link><Link href="/evidence">Evidence</Link></div><div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>OWNER CONTROL</span></div></nav>
    <section className="mc-hero"><div><p className="mc-kicker"><i/>REGION / {region.name.toUpperCase()}</p><h1>{region.name}<br/><em>delivery programme.</em></h1><p className="lead">{region.mode} Regional pages describe the delivery model; they do not prove a live deployment or legal compliance.</p><div className="mc-actions"><Link className="mc-primary" href="/contact">Build a delivery brief ↗</Link><Link className="mc-secondary" href="/audit">Review the audit offer</Link></div></div><aside className="mc-console"><div className="mc-console-top"><span>REGIONAL FOCUS</span><b>MODEL</b></div><div className="mc-console-main"><div className="mc-verdict"><strong>Common core. Local context.</strong><span>VERIFY BEFORE LAUNCH</span></div><div className="mc-lanes">{focus[slug].map((item) => <div className="mc-lane" key={item}><span>{item}</span><div className="mc-lane-bar"><i style={{width:"100%"}}/></div><b>MODEL</b></div>)}</div></div></aside></section>
    <section className="mc-section"><div className="mc-section-head"><span>CAPABILITY MAP</span><h2>Deploy the capabilities that match the local gap.</h2></div><div className="mc-link-grid">{services.map((service) => <Link className="mc-link-card" key={service.slug} href={"/services/" + service.slug}><span>{service.number} · CAPABILITY</span><b>{service.title} ↗</b></Link>)}</div></section>
    <section className="mc-closing"><p className="mc-kicker"><i/>PROOF BEFORE SCALE</p><h2>Validate the first delivery pattern before multiplying it.</h2><p>Each regional rollout should produce measurable delivery evidence rather than create another isolated site.</p><Link className="mc-primary" href="/contact">Build a delivery brief ↗</Link></section>
  </main>;
}
