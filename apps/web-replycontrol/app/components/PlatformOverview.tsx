import Link from "next/link";

const layers = [
  ["01","SIGNAL","Capture the request, constraints, evidence and desired outcome.","/knowledge","INPUT"],
  ["02","VECTOR","Normalize ambiguity into an explicit outcome contract.","/operations","SHAPE"],
  ["03","FORGE","Compose plans, decisions and artifacts while exposing uncertainty.","/agents","CREATE"],
  ["04","RAIL","Route approved work through bounded tools and release paths.","/automations","EXECUTE"],
  ["05","PROOFLINE","Bind results to artifacts, logs and authoritative evidence.","/evidence","VERIFY"],
  ["06","CROWNLINE","Keep ownership, permission, approval and rollback visible.","/control","AUTHORIZE"],
];

const principles = [
  ["01","OUTCOME","The result that must exist is defined before the machinery moves."],
  ["02","BOUNDARY","Tools are capabilities; authority remains explicit."],
  ["03","PROOF","A completed claim carries evidence or a visible uncertainty state."],
  ["04","REVERSAL","Consequential release paths expose approval and rollback."],
];

export function PlatformOverview(){
  return <main className="mc-page a11pro-page platform-atlas">
    <nav className="mc-nav" aria-label="Primary navigation">
      <Link className="mc-brand a11pro-brand" href="/">A11pro<small>OUTCOME OPERATING LAYER</small></Link>
      <div className="mc-nav-center"><Link href="/platform">Platform</Link><Link href="/agents">Agents</Link><Link href="/realtime">Realtime</Link><Link href="/evidence">Proof</Link><Link href="/control">Control</Link></div>
      <Link className="mc-secondary" href="/status">System status ↗</Link>
    </nav>

    <section className="atlas-hero">
      <div className="atlas-copy">
        <p className="mc-kicker"><i/>A11PRO / PLATFORM ATLAS</p>
        <h1>Not another dashboard.<br/><em>A system you can see think.</em></h1>
        <p className="lead">Six distinct surfaces turn a messy request into a bounded, reviewable path from signal to proof.</p>
        <div className="a11pro-path"><span>SIGNAL</span><b>→</b><span>VECTOR</span><b>→</b><span>FORGE</span><b>→</b><span>RAIL</span><b>→</b><span>PROOF</span></div>
        <div className="mc-actions"><Link className="mc-primary" href="/agents">Enter the forge ↗</Link><Link className="mc-secondary" href="/realtime">Talk to the outcome</Link></div>
      </div>

      <div className="atlas-orbit" aria-label="A11pro six-layer operating graph">
        <div className="orbit-ring orbit-ring-one"/>
        <div className="orbit-ring orbit-ring-two"/>
        <div className="orbit-core"><span>A11</span><b>PRO</b><small>OWNER<br/>CONTROL</small></div>
        {layers.map(([code,title,,href,label],index)=><Link key={code} href={href} className={"orbit-node orbit-node-"+(index+1)}><span>{code}</span><b>{title}</b><small>{label}</small></Link>)}
      </div>
    </section>

    <section className="atlas-section">
      <div className="atlas-section-head"><p className="mc-kicker"><i/>THE SIX SURFACES</p><h2>Each layer looks different because each layer does different work.</h2></div>
      <div className="atlas-grid">
        {layers.map(([code,title,body,href,label],index)=><article className={"atlas-card atlas-card-"+(index+1)} key={code}>
          <div className="atlas-card-top"><span>{code}</span><small>{label}</small></div>
          <div className="atlas-glyph" aria-hidden="true"><i/><i/><i/></div>
          <h3>{title}</h3><p>{body}</p>
          <Link href={href}>Open surface <span>↗</span></Link>
        </article>)}
      </div>
    </section>

    <section className="atlas-section atlas-split">
      <div><p className="mc-kicker"><i/>OPERATING CONTRACT</p><h2>Strange on the surface. Precise underneath.</h2><p className="lead">The visual language is deliberately unlike generic enterprise software: mineral depth, signal lines, oversized type, hard edges and proof states. The interaction model stays disciplined.</p></div>
      <div className="atlas-principles">{principles.map(([n,title,body])=><article key={n}><span>{n}</span><div><b>{title}</b><p>{body}</p></div></article>)}</div>
    </section>

    <section className="atlas-release">
      <div><p className="mc-kicker"><i/>THE RELEASE LINE</p><h2>Work can move fast without becoming invisible.</h2><p>Understand → Protect → Execute → Verify → Record → Handoff → Continue.</p></div>
      <Link className="mc-primary" href="/control">Open owner control ↗</Link>
    </section>

    <footer className="mc-footer"><span>A11pro / MindReply</span><span>OUTCOME · BOUNDARY · PROOF</span><Link href="/status">System status ↗</Link></footer>
  </main>
}
