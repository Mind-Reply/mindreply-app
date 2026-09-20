import { LocaleSwitcher } from "./LocaleSwitcher";
import { copy, type SupportedLocale } from "../lib/locales";

const AUDIT_CHECKOUT = "https://book.stripe.com/8x2aER4owd8c1TG4Ku63K00";

const modules = [
  ["01", "Operations", "Run governed workflows, monitor execution, and keep consequential actions visible.", "/operations"],
  ["02", "Agents", "Coordinate task-specific workers with explicit boundaries, handoffs, and approval points.", "/agents"],
  ["03", "Knowledge", "Ground decisions in maintained knowledge, retrieval, context and evidence.", "/knowledge"],
  ["04", "Automations", "Connect repeatable workflows across your delivery and communication stack.", "/automations"],
  ["05", "Evidence", "Preserve the path from intent to release with reviewable records and status signals.", "/evidence"],
  ["06", "Control", "Keep release, configuration and rollback decisions under clear ownership.", "/control"],
];

const secondary = [
  ["Platform", "/platform"], ["Integrations", "/integrations"], ["Pricing", "/pricing"], ["Resources", "/resources"], ["Contact", "/contact"],
];

export function PublicHome({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation">
      <a className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></a>
      <div className="mc-nav-center">
        <a href="/platform">Platform</a><a href="/operations">Operations</a><a href="/agents">Agents</a><a href="/knowledge">Knowledge</a><a href="/evidence">Evidence</a>
      </div>
      <div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>SYSTEM LIVE</span><LocaleSwitcher locale={locale} /></div>
    </nav>

    <section className="mc-hero" id="top" aria-labelledby="hero-title">
      <div>
        <p className="mc-kicker"><i/>OWNER-GOVERNED OPERATIONS</p>
        <h1 id="hero-title">Turn complex work into <em>controlled execution.</em></h1>
        <p className="lead">{t.lead}</p>
        <div className="mc-actions"><a className="mc-primary" href="/platform">Explore the platform <span aria-hidden="true">↗</span></a><a className="mc-secondary" href={AUDIT_CHECKOUT} target="_blank" rel="noreferrer">Start a review</a></div>
      </div>
      <aside className="mc-console" aria-label="MindReply operating state">
        <div className="mc-console-top"><span>PROOFLINE / CURRENT STATE</span><b>VERIFIED PATH</b></div>
        <div className="mc-console-main"><span className="mc-console-label">Decision posture</span><div className="mc-verdict"><strong>Human authority retained.</strong><span>READY</span></div><div className="mc-lanes">
          {[['Intent','96%','COMPILED'],['Evidence','91%','TRACEABLE'],['Release','88%','GATED'],['Rollback','100%','AVAILABLE']].map(([label,width,state]) => <div className="mc-lane" key={label}><span>{label}</span><div className="mc-lane-bar"><i style={{width}}/></div><b>{state}</b></div>)}
        </div></div>
      </aside>
    </section>

    <section className="mc-section" id="platform" aria-labelledby="platform-title">
      <div className="mc-section-head"><span>THE MINDREPLY PLATFORM</span><h2 id="platform-title">One operating layer for the work between intent and outcome.</h2></div>
      <div className="mc-rail">{modules.map(([code, title, body, href]) => <article className="mc-module" key={code}><span className="num">{code}</span><h3>{title}</h3><p>{body}</p><a href={href}>{title} ↗</a></article>)}</div>
    </section>

    <section className="mc-section" aria-labelledby="capabilities-title">
      <div className="mc-section-head"><span>EXPLORE THE SYSTEM</span><h2 id="capabilities-title">A product surface built to explain itself.</h2></div>
      <div className="mc-link-grid">{secondary.map(([title, href]) => <a className="mc-link-card" href={href} key={href}><span>{title}</span><b>↗</b></a>)}</div>
    </section>

    <section className="mc-section" id="principles" aria-labelledby="principles-title">
      <div className="mc-principles"><div className="mc-section-head"><span>OPERATING PRINCIPLES</span><h2 id="principles-title">Automation should make responsibility clearer, not disappear.</h2></div><div className="mc-principle-list">
        {["Intent is explicit before execution starts.","The right capability is selected for the job.","Consequential actions remain reviewable.","Evidence follows the work.","Release paths stay reversible."].map((title,index)=><article className="mc-principle" key={title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>MindReply treats this as a product behavior, not a marketing statement.</p></div></article>)}
      </div></div>
    </section>

    <section className="mc-closing"><p className="mc-kicker"><i/>REALITY DELTA</p><h2>{t.closing.title}</h2><p>{t.closing.body}</p><a className="mc-primary" href="/platform">Enter MindReply ↗</a></section>
    <footer className="mc-footer"><span>MindReply</span><span>OPERATE · EVIDENCE · RELEASE</span><div className="mc-footer-links"><a href="/status">System status ↗</a><a href="/contact">Contact ↗</a></div></footer>
  </main>;
}
