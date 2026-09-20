import type { ReactNode } from "react";

export function PlatformPage({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead: string; children: ReactNode }) {
  return <main className="mc-page">
    <nav className="mc-nav" aria-label="Primary navigation"><a className="mc-brand" href="/">MindReply<small>OPERATING SYSTEM</small></a><div className="mc-nav-center"><a href="/platform">Platform</a><a href="/operations">Operations</a><a href="/agents">Agents</a><a href="/knowledge">Knowledge</a><a href="/evidence">Evidence</a></div><a className="mc-secondary" href="/">Home</a></nav>
    <section className="mc-hero"><div><p className="mc-kicker"><i/>{eyebrow}</p><h1>{title}</h1><p className="lead">{lead}</p><div className="mc-actions"><a className="mc-primary" href="/operations">Open workspace ↗</a><a className="mc-secondary" href="/status">Check status</a></div></div><aside className="mc-console"><div className="mc-console-top"><span>PLATFORM STATE</span><b>READY</b></div><div className="mc-console-main"><div className="mc-verdict"><strong>One connected operating layer.</strong><span>LIVE</span></div><div className="mc-lanes"><div className="mc-lane"><span>Intent</span><div className="mc-lane-bar"><i style={{width:"96%"}}/></div><b>DEFINED</b></div><div className="mc-lane"><span>Execution</span><div className="mc-lane-bar"><i style={{width:"92%"}}/></div><b>CONTROLLED</b></div><div className="mc-lane"><span>Evidence</span><div className="mc-lane-bar"><i style={{width:"94%"}}/></div><b>VISIBLE</b></div></div></div></aside></section>
    {children}
    <footer className="mc-footer"><span>MindReply</span><span>OPERATE · EVIDENCE · RELEASE</span><a href="/">mind-reply.com ↗</a></footer>
  </main>;
}
