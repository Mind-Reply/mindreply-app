import { LocaleSwitcher } from "./LocaleSwitcher";
import { copy, type SupportedLocale } from "../lib/locales";
import { services } from "../services/catalog";
import { MindReplyCommercialLayer } from "./MindReplyCommercialLayer";

const modules = [
  ["01", "Operations", "Run governed workflows, monitor execution, and keep consequential actions visible.", "/operations"],
  ["02", "Agents", "Coordinate task-specific workers with explicit boundaries, handoffs, and approval points.", "/agents"],
  ["03", "Knowledge", "Ground decisions in maintained knowledge, retrieval, context and evidence.", "/knowledge"],
  ["04", "Automations", "Connect repeatable workflows across your delivery and communication stack.", "/automations"],
  ["05", "Evidence", "Preserve the path from intent to release with reviewable records and status signals.", "/evidence"],
  ["06", "Control", "Keep release, configuration and rollback decisions under clear ownership.", "/control"],
];

const secondary = [
  ["Platform", "/platform"], ["Services", "/services"], ["Regions", "/regions"], ["Pricing", "/pricing"], ["Resources", "/resources"], ["Contact", "/contact"],
];

const proofline = [
  ["01", "OWNER CONTROL", "Human authority stays explicit."],
  ["02", "EVIDENCE", "Important work leaves a reviewable trail."],
  ["03", "REVERSIBLE", "Release paths stay bounded and recoverable."],
];

export function PublicHome({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation">
      <a className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></a>
      <div className="mc-nav-center">
        <a href="/platform">Platform</a><a href="/services">Services</a><a href="/regions">Regions</a><a href="/operations">Operations</a><a href="/evidence">Evidence</a>
      </div>
      <div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>OWNER CONTROL</span><LocaleSwitcher locale={locale} /></div>
    </nav>

    <section className="mc-hero" id="top" aria-labelledby="hero-title">
      <div>
        <p className="mc-kicker"><i/>INTELLIGENCE · TECHNOLOGY · OPERATIONS</p>
        <h1 id="hero-title">{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <div className="mc-actions"><a className="mc-primary" href="/platform">{t.primaryAction} <span aria-hidden="true">↗</span></a><a className="mc-secondary" href="/services">{t.secondaryAction}</a></div>
      </div>
      <aside className="mc-console" aria-label="MindReply delivery evidence">
        <div className="mc-console-top"><span>DELIVERY MODEL / OPERATING POSTURE</span><b>CONTINUOUS VERIFICATION</b></div>
        <div className="mc-console-main"><span className="mc-console-label">{t.signal.title}</span><div className="mc-verdict"><strong>{t.signal.rule}</strong><span>OWNER-LED</span></div><div className="mc-lanes">
          {[["Proof",t.signal.proof],["Authority",t.signal.authority],["Release",t.signal.release]].map(([label,state]) => <div className="mc-lane" key={label}><span>{label}</span><div className="mc-lane-bar"><i style={{width: "100%"}}/></div><b>{state}</b></div>)}
        </div></div>
      </aside>
    </section>

    <section className="mc-proofline" aria-label="MindReply operating proofline">
      {proofline.map(([code, title, body]) => <article key={code}><span>{code}</span><div><b>{title}</b><p>{body}</p></div></article>)}
    </section>

    <MindReplyCommercialLayer locale={locale} />

    <section className="mc-section" id="services" aria-labelledby="services-title">
      <div className="mc-section-head"><span>INNOVATION & INTELLIGENCE · CORE TECHNOLOGY · OPERATIONS</span><h2 id="services-title">Eight capabilities connected to one accountable delivery path.</h2></div>
      <div className="mc-rail">{services.map((service) => <a className="mc-module" key={service.slug} href={`/services/${service.slug}`}><span className="num">{service.number}</span><h3>{service.title}</h3><p>{service.promise}</p><ul>{service.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><span className="mc-module-link">Explore capability ↗</span></a>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="delivery-title">
      <div className="mc-section-head"><span>DELIVERY MODEL</span><h2 id="delivery-title">Assess → Build → Operate → Expand.</h2></div>
      <div className="mc-link-grid"><a className="mc-link-card" href="/audit"><span>01 · ASSESS</span><b>Find the highest-value gaps ↗</b></a><a className="mc-link-card" href="/platform"><span>02 · BUILD</span><b>Implement the required capability ↗</b></a><a className="mc-link-card" href="/operations"><span>03 · OPERATE</span><b>Monitor, improve and assure ↗</b></a><a className="mc-link-card" href="/regions"><span>04 · EXPAND</span><b>Deploy regionally from one core ↗</b></a></div>
    </section>

    <section className="mc-section" aria-labelledby="capabilities-title">
      <div className="mc-section-head"><span>THE MINDREPLY PLATFORM</span><h2 id="capabilities-title">One operating layer for the work between intent and outcome.</h2></div>
      <div className="mc-rail">{modules.map(([code, title, body, href]) => <article className="mc-module" key={code}><span className="num">{code}</span><h3>{title}</h3><p>{body}</p><a href={href}>{title} ↗</a></article>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="explore-title">
      <div className="mc-section-head"><span>EXPLORE THE SYSTEM</span><h2 id="explore-title">A connected public surface with a private operating core.</h2></div>
      <div className="mc-link-grid">{secondary.map(([title, href]) => <a className="mc-link-card" href={href} key={href}><span>{title}</span><b>↗</b></a>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="regional-title">
      <div className="mc-section-head"><span>REGIONAL + GLOBAL DELIVERY</span><h2 id="regional-title">One core platform. Regional commercial and delivery layers.</h2></div>
      <div className="mc-rail">
        <a className="mc-module" href="/regions"><span className="num">01</span><h3>Europe</h3><p>Cross-border delivery with regional operating requirements, resilience and data considerations.</p><span className="mc-module-link">View region model ↗</span></a>
        <a className="mc-module" href="/regions"><span className="num">02</span><h3>Bulgaria</h3><p>Local delivery for digitalisation, modernisation and capability uplift, connected to the same core.</p><span className="mc-module-link">View region model ↗</span></a>
        <a className="mc-module" href="/regions"><span className="num">03</span><h3>UK / Global</h3><p>Enterprise modernisation and managed operations delivered from the same controlled service catalogue.</p><span className="mc-module-link">View region model ↗</span></a>
      </div>
    </section>

    <section className="mc-section" id="principles" aria-labelledby="principles-title">
      <div className="mc-principles"><div className="mc-section-head"><span>OPERATING PRINCIPLES</span><h2 id="principles-title">Automation should make responsibility clearer, not disappear.</h2></div><div className="mc-principle-list">
        {["Intent is explicit before execution starts.","The right capability is selected for the job.","Consequential actions remain reviewable.","Evidence follows the work.","Release paths stay reversible."].map((title,index)=><article className="mc-principle" key={title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>MindReply treats this as a product behavior, not a marketing statement.</p></div></article>)}
      </div></div>
    </section>

    <section className="mc-closing"><p className="mc-kicker"><i/>NEXT STEP</p><h2>Start with the highest-value gap. Build only what can be verified.</h2><p>Choose a capability, request an assessment, and move into implementation with a clear delivery path and reviewable evidence.</p><a className="mc-primary" href="/audit">Start with an assessment ↗</a></section>
    <footer className="mc-footer"><span>MindReply</span><span>INTELLIGENCE · TECHNOLOGY · OPERATIONS</span><div className="mc-footer-links"><a href="/status">System status ↗</a><a href="/contact">Contact ↗</a></div></footer>
  </main>;
}
