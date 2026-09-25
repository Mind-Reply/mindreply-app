import { LocaleSwitcher } from "./LocaleSwitcher";
import { copy, type SupportedLocale } from "../lib/locales";

const AUDIT_CHECKOUT = "https://book.stripe.com/8x2aER4owd8c1TG4Ku63K00";

const modules = [
  ["01", "Signal", "Bring the request, context, constraints and evidence into one legible starting point.", "/knowledge"],
  ["02", "Vector", "Turn an unclear request into an explicit outcome contract and success conditions.", "/operations"],
  ["03", "Forge", "Shape plans, decisions and artifacts without pretending uncertainty is certainty.", "/agents"],
  ["04", "Rail", "Route approved work through bounded tools, connected systems and release paths.", "/automations"],
  ["05", "Proofline", "Attach evidence to execution so the final answer can show what actually happened.", "/evidence"],
  ["06", "Crownline", "Keep ownership, approval, policy and rollback authority visible.", "/control"],
];

const secondary = [
  ["Platform", "/platform"], ["Agents", "/agents"], ["Realtime", "/realtime"], ["Evidence", "/evidence"], ["Control", "/control"], ["Contact", "/contact"],
];

export function PublicHome({ locale }: { locale: SupportedLocale }) {
  const t = copy[locale];
  return <main className="mc-page a11pro-page">
    <nav className="mc-nav" aria-label="Primary navigation">
      <a className="mc-brand a11pro-brand" href="/">A11pro<small>OUTCOME OPERATING LAYER</small></a>
      <div className="mc-nav-center"><a href="/platform">Platform</a><a href="/agents">Agents</a><a href="/realtime">Realtime</a><a href="/evidence">Proof</a><a href="/control">Control</a></div>
      <div className="mc-nav-right"><span className="mc-state"><i className="mc-dot"/>OWNER / REVIEWABLE</span><LocaleSwitcher locale={locale} /></div>
    </nav>
    <section className="mc-hero a11pro-hero" id="top" aria-labelledby="hero-title">
      <div>
        <p className="mc-kicker"><i/>A11PRO / ENTERPRISE AGENT</p>
        <h1 id="hero-title">Work enters as <em>signal.</em><br/>It leaves as proof.</h1>
        <p className="lead">A11pro turns unclear enterprise requests into explicit outcomes, bounded execution and review-ready evidence.</p>
        <div className="a11pro-path"><span>SIGNAL</span><b>→</b><span>VECTOR</span><b>→</b><span>FORGE</span><b>→</b><span>PROOF</span></div>
        <div className="mc-actions"><a className="mc-primary" href="/platform">Enter the system <span aria-hidden="true">↗</span></a><a className="mc-secondary" href={AUDIT_CHECKOUT} target="_blank" rel="noreferrer">Start a review</a></div>
      </div>
      <aside className="mc-console a11pro-console" aria-label="A11pro operating state">
        <div className="mc-console-top"><span>A11PRO / LIVE POSTURE</span><b>NO CLAIM WITHOUT PROOF</b></div>
        <div className="mc-console-main"><span className="mc-console-label">Current state</span><div className="mc-verdict"><strong>Human authority retained.</strong><span>CROWNLINE</span></div><div className="mc-lanes">{[['Intent','SHAPED'],['Context','GROUNDED'],['Action','BOUNDED'],['Result','PROVING']].map(([label,state]) => <div className="mc-lane" key={label}><span>{label}</span><div className="mc-lane-bar"><i/></div><b>{state}</b></div>)}</div></div>
        <div className="a11pro-console-foot"><span>REALITY DELTA</span><b>VISIBLE</b></div>
      </aside>
    </section>
    <section className="mc-section" id="platform"><div className="mc-section-head"><span>THE A11PRO GRAPH</span><h2>Six layers. One accountable path from request to result.</h2></div><div className="mc-rail">{modules.map(([code,title,body,href])=><article className="mc-module a11pro-module" key={code}><span className="num">{code}</span><h3>{title}</h3><p>{body}</p><a href={href}>Open layer ↗</a></article>)}</div></section>
    <section className="mc-section"><div className="mc-section-head"><span>THE SURFACES</span><h2>A strange-looking front end for a very disciplined back end.</h2></div><div className="mc-link-grid">{secondary.map(([title,href])=><a className="mc-link-card a11pro-link-card" href={href} key={href}><span>{title}</span><b>↗</b></a>)}</div></section>
    <section className="mc-section" id="principles"><div className="mc-principles"><div className="mc-section-head"><span>THE CONTRACT</span><h2>Outcome first. Evidence always. Authority stays human.</h2></div><div className="mc-principle-list">{["Start with the result that must exist.","Separate verified facts from supplied claims.","Select only the capabilities the outcome requires.","Gate consequential actions by permission and approval.","Report completed work, evidence, uncertainty and next action."].map((title,index)=><article className="mc-principle" key={title}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>A11pro treats the contract as product behavior, not marketing decoration.</p></div></article>)}</div></div></section>
    <section className="mc-closing a11pro-closing"><p className="mc-kicker"><i/>AFTERGLOW / FINAL RECORD</p><h2>{t.closing.title}</h2><p>{t.closing.body}</p><a className="mc-primary" href="/platform">See the operating layer ↗</a></section>
    <footer className="mc-footer"><span>A11pro / MindReply</span><span>SIGNAL · FORGE · PROOF</span><div className="mc-footer-links"><a href="/status">System status ↗</a><a href="/contact">Contact ↗</a></div></footer>
  </main>;
}