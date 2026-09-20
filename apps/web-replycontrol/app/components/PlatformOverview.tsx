import Link from "next/link";

const surfaces = [
  ["01", "Operations", "Observe work, releases and consequential actions from one operational surface.", "/operations"],
  ["02", "Agents", "Give task-specific workers clear boundaries, handoffs and approval points.", "/agents"],
  ["03", "Knowledge", "Ground execution in maintained context, retrieval and evidence.", "/knowledge"],
  ["04", "Automations", "Connect repeatable workflows without hiding what they can change.", "/automations"],
  ["05", "Evidence", "Keep a reviewable trail from intent through execution and release.", "/evidence"],
  ["06", "Control", "Keep configuration, deployment and rollback decisions under explicit ownership.", "/control"],
];

export function PlatformOverview() {
  return (
    <main className="mc-page">
      <nav className="mc-nav" aria-label="Primary navigation">
        <Link className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></Link>
        <div className="mc-nav-center">
          <Link href="/platform">Platform</Link><Link href="/operations">Operations</Link><Link href="/agents">Agents</Link><Link href="/knowledge">Knowledge</Link><Link href="/evidence">Evidence</Link>
        </div>
        <Link className="mc-secondary" href="/status">System status ↗</Link>
      </nav>
      <section className="mc-hero" aria-labelledby="platform-title">
        <div>
          <p className="mc-kicker"><i/>THE OPERATING LAYER</p>
          <h1 id="platform-title">From intent to <em>verified outcome.</em></h1>
          <p className="lead">MindReply connects people, agents, knowledge, automation and release controls into one accountable operating layer.</p>
          <div className="mc-actions"><Link className="mc-primary" href="/agents">Explore agents ↗</Link><Link className="mc-secondary" href="/control">Open control</Link></div>
        </div>
        <aside className="mc-console" aria-label="Execution lifecycle">
          <div className="mc-console-top"><span>EXECUTION GRAPH</span><b>CONTROLLED</b></div>
          <div className="mc-console-main">
            <span className="mc-console-label">Lifecycle</span>
            <div className="mc-verdict"><strong>Intent → evidence → action → release</strong><span>READY</span></div>
            <div className="mc-lanes">
              {["Intent","Context","Execution","Evidence"].map((label, index) => <div className="mc-lane" key={label}><span>{label}</span><div className="mc-lane-bar"><i style={{ width: `${94 - index * 4}%` }} /></div><b>{["DEFINED","GROUNDED","GATED","RECORDED"][index]}</b></div>)}
            </div>
          </div>
        </aside>
      </section>
      <section className="mc-section" aria-labelledby="surfaces-title">
        <div className="mc-section-head"><span>ONE SYSTEM / SIX SURFACES</span><h2 id="surfaces-title">Use only the capabilities the work actually needs.</h2></div>
        <div className="mc-rail">{surfaces.map(([code,title,body,href]) => <article className="mc-module" key={code}><span className="num">{code}</span><h3>{title}</h3><p>{body}</p><Link href={href}>{title} ↗</Link></article>)}</div>
      </section>
      <section className="mc-section" aria-labelledby="principles-title">
        <div className="mc-section-head"><span>BUILT FOR ACCOUNTABILITY</span><h2 id="principles-title">Automation is useful when its boundaries are visible.</h2></div>
        <div className="mc-principle-list">
          {["Every consequential action has an owner.","Capabilities are selected by policy and context.","Evidence stays attached to the work.","Release paths remain observable and reversible."].map((text,index)=><article className="mc-principle" key={text}><span>{String(index+1).padStart(2,"0")}</span><div><h3>{text}</h3><p>Designed as an operating behavior rather than a promise.</p></div></article>)}
        </div>
      </section>
      <footer className="mc-footer"><span>MindReply</span><span>OPERATE · EVIDENCE · RELEASE</span><Link href="/status">System status ↗</Link></footer>
    </main>
  );
}
