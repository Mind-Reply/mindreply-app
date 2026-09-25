"use client";

import { useEffect, useMemo, useState } from "react";
import "./command-atelier.css";

type Territory = "mindreply" | "atlas" | "briefing" | "nexus" | "forge" | "studio";

const territories: { id: Territory; label: string; kicker: string; purpose: string }[] = [
  { id: "mindreply", label: "MindReply", kicker: "01 / Institution", purpose: "Thesis, evidence, estate, commercial entry" },
  { id: "atlas", label: "A11-K Atlas", kicker: "02 / Spatial command", purpose: "Chat · Nexus · Forge · Studio topology" },
  { id: "briefing", label: "Briefing Chamber", kicker: "03 / Local-first", purpose: "Objective → context → proof → authority" },
  { id: "nexus", label: "Decision Observatory", kicker: "04 / Routing", purpose: "Owner gate → captains → specialists → release" },
  { id: "forge", label: "Release Foundry", kicker: "05 / Release", purpose: "Six deterministic gates before owner review" },
  { id: "studio", label: "Signal Press", kicker: "06 / Editorial", purpose: "Proof-bearing release composition; no publishing" },
];

const nodes = [
  ["Owner gate", "owner", "approved"],
  ["Orchestrator", "orchestrator", "in progress"],
  ["Platform captain", "captain", "claimed"],
  ["Specialist frontier", "specialist", "queued"],
  ["Evidence / red-team", "gate", "needs review"],
  ["Release lead", "release", "blocked"],
] as const;

const initialBrief = {
  objective: "",
  context: "",
  proof: "",
  authority: "",
};

const initialForge = {
  product: "",
  repository: "",
  outcome: "",
  constraints: "",
  releaseType: "preview",
  owner: "",
  acceptanceTests: "",
  stopRules: "",
  rollbackPath: "",
  observabilitySignals: "",
};

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function CommandAtelierPage() {
  const [active, setActive] = useState<Territory>("mindreply");
  const [linear, setLinear] = useState(false);
  const [brief, setBrief] = useState(() => loadLocal("command-atelier-brief", initialBrief));
  const [briefNotice, setBriefNotice] = useState("Local only");
  const [forge, setForge] = useState(() => loadLocal("command-atelier-forge", initialForge));
  const [forgeSaved, setForgeSaved] = useState(false);
  const [studioBlocks, setStudioBlocks] = useState(["positioning", "proof", "boundary"]);
  const [studioClaim, setStudioClaim] = useState("");
  const [studioNotice, setStudioNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("command-atelier-brief", JSON.stringify(brief));
      setBriefNotice("Saved locally");
    } catch {
      setBriefNotice("Storage quota reached — draft remains in memory");
    }
  }, [brief]);

  useEffect(() => {
    try {
      localStorage.setItem("command-atelier-forge", JSON.stringify(forge));
    } catch {
      setForgeSaved(false);
    }
  }, [forge]);

  const gateState = useMemo(() => ({
    evidence: Boolean(forge.acceptanceTests.trim()),
    security: Boolean(forge.constraints.trim()),
    ownership: Boolean(forge.owner.trim()),
    observability: Boolean(forge.observabilitySignals.trim()),
    rollback: Boolean(forge.rollbackPath.trim()),
    approval: false,
  }), [forge]);

  const allGates = Object.values(gateState).every(Boolean);

  function exportText(text: string, filename: string, type = "text/plain") {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function briefingMarkdown() {
    return [
      "# Command Atelier Brief",
      "", "## Objective", brief.objective || "—",
      "", "## Verified context", brief.context || "—",
      "", "## Proof standard", brief.proof || "—",
      "", "## Authority line", brief.authority || "—",
      "", "_Local-first draft. No model call._",
    ].join("\n");
  }

  function manifest() {
    return {
      schema: "command-atelier.release.v1",
      product: forge.product,
      repository: forge.repository,
      outcome: forge.outcome,
      constraints: forge.constraints.split("\n").map(s => s.trim()).filter(Boolean),
      releaseType: forge.releaseType,
      owner: forge.owner,
      acceptanceTests: forge.acceptanceTests.split("\n").map(s => s.trim()).filter(Boolean),
      stopRules: forge.stopRules.split("\n").map(s => s.trim()).filter(Boolean),
      rollbackPath: forge.rollbackPath,
      observabilitySignals: forge.observabilitySignals.split("\n").map(s => s.trim()).filter(Boolean),
      gates: gateState,
      status: allGates ? "READY_FOR_OWNER_REVIEW" : "INCOMPLETE",
    };
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    e.preventDefault();
    const i = territories.findIndex(t => t.id === active);
    const next = e.key === "ArrowRight" ? (i + 1) % territories.length : (i - 1 + territories.length) % territories.length;
    setActive(territories[next].id);
  }

  return (
    <main className="atelier" onKeyDown={onKeyDown} tabIndex={-1}>
      <header className="atelier-header">
        <div>
          <p className="eyebrow">COMMAND ATELIER / v0</p>
          <h1>Intelligence must answer to the work.</h1>
          <p className="dek">Six operational surfaces. Local-first controls. Evidence before release. Nothing here pretends to be deployed.</p>
        </div>
        <div className="header-state" aria-label="runtime state">
          <span className="state-dot" /> LOCAL CONTROL PLANE
          <small>No live runner claims · owner approval required</small>
        </div>
      </header>

      <nav className="territory-rail" aria-label="Command Atelier territories">
        {territories.map(t => (
          <button key={t.id} className={active === t.id ? "territory active" : "territory"} onClick={() => setActive(t.id)} aria-current={active === t.id ? "page" : undefined}>
            <span>{t.kicker}</span><strong>{t.label}</strong><em>{t.purpose}</em>
          </button>
        ))}
      </nav>

      <div className="mode-row">
        <button onClick={() => setLinear(v => !v)} aria-pressed={linear}>{linear ? "Spatial view" : "Linear accessibility view"}</button>
        <span>Arrow keys navigate territories · visible focus · reduced motion supported</span>
      </div>

      {linear ? (
        <section className="linear-tree" aria-label="Accessible linear estate tree">
          <h2>Estate tree</h2>
          <ul>{territories.map(t => <li key={t.id}><button onClick={() => setActive(t.id)}>{t.label}</button> — {t.purpose}</li>)}</ul>
          <p>State vocabulary: public surface · connection required · preview required · owner-approved.</p>
        </section>
      ) : (
        <section className="workspace" aria-live="polite">
          {active === "mindreply" && <Institution />}
          {active === "atlas" && <Atlas setActive={setActive} />}
          {active === "briefing" && <Briefing brief={brief} setBrief={setBrief} notice={briefNotice} exportText={exportText} briefingMarkdown={briefingMarkdown()} />}
          {active === "nexus" && <Nexus />}
          {active === "forge" && <Forge forge={forge} setForge={setForge} gateState={gateState} allGates={allGates} exportText={exportText} manifest={manifest()} saved={forgeSaved} setSaved={setForgeSaved} />}
          {active === "studio" && <Studio blocks={studioBlocks} setBlocks={setStudioBlocks} claim={studioClaim} setClaim={setStudioClaim} notice={studioNotice} setNotice={setStudioNotice} />}
        </section>
      )}

      <footer>© 2026 MindReply · Evidence is visible · release is reversible · authority is named</footer>
    </main>
  );
}

function Institution() {
  return <div className="panel-grid">
    <article className="hero-panel">
      <p className="eyebrow">THE INSTITUTION</p>
      <h2>Work first. Intelligence second.</h2>
      <p>MindReply is presented as an operating institution: a disciplined passage from repository clarity to proof-bearing execution.</p>
      <button className="primary" onClick={() => document.getElementById("evidence")?.scrollIntoView({ behavior: "smooth" })}>Open evidence ledger</button>
    </article>
    <article className="ledger" id="evidence">
      <div className="panel-head"><span>Evidence Ledger</span><span className="tag">HONEST STATE</span></div>
      {[
        ["Authority named", "Owner approval is explicit before irreversible release."],
        ["Proof visible", "Claims require a durable evidence reference."],
        ["Release reversible", "Rollback path is a required Forge gate."],
      ].map(([a,b]) => <div className="ledger-row" key={a}><strong>{a}</strong><span>{b}</span></div>)}
    </article>
    <article className="estate-card"><span className="eyebrow">ESTATE INDEX</span><h3>Crownwork / A11-K / Repository Clarity</h3><p>One estate, named surfaces, no invented telemetry.</p></article>
    <article className="estate-card"><span className="eyebrow">METHOD</span><h3>Knot → Circuit → Proof trail → Widening</h3><p>Expand only after the previous evidence boundary is satisfied.</p></article>
  </div>;
}

function Atlas({ setActive }: { setActive: (t: Territory) => void }) {
  const zones: { id: Territory; name: string; state: string }[] = [
    ["briefing", "Chat", "connection required"], ["nexus", "Nexus", "owner-approved"], ["forge", "Forge", "preview required"], ["studio", "Studio", "public surface"],
  ];
  return <div className="atlas">
    <div><p className="eyebrow">A11-K / ATLAS</p><h2>Four territories, one route.</h2><p>Select a territory to redraw the operational topology.</p></div>
    <div className="topology">{zones.map((z,i) => <button key={z[0]} className={i===1 ? "zone selected" : "zone"} onClick={() => setActive(z[0])}><b>{z[1]}</b><span>{z[2]}</span><i>{i+1}</i></button>)}</div>
    <div className="route"><span>OWNER</span><b>→</b><span>COMMAND</span><b>→</b><span>PROOF</span><b>→</b><span>RELEASE</span></div>
  </div>;
}

function Briefing({ brief, setBrief, notice, exportText, briefingMarkdown }: any) {
  const fields = [
    ["objective","Objective","What must become true?"],
    ["context","Verified context","Facts already proven; separate unknowns."],
    ["proof","Proof standard","What evidence makes the result acceptable?"],
    ["authority","Authority line","Who can approve the irreversible action?"],
  ];
  return <div className="briefing">
    <div className="section-intro"><p className="eyebrow">BRIEFING CHAMBER / LOCAL-FIRST</p><h2>Draft at the evidence margin.</h2><span className="local-pill">{notice}</span></div>
    <div className="brief-grid">{fields.map(([key,label,help]) => <label key={key}><span>{label}</span><small>{help}</small><textarea value={brief[key]} onChange={e => setBrief({...brief,[key]:e.target.value})} /></label>)}</div>
    <div className="actions"><button onClick={() => exportText(briefingMarkdown,"command-atelier-brief.md")}>Export Markdown</button><button onClick={() => navigator.clipboard?.writeText(briefingMarkdown)}>Copy</button><button className="danger" onClick={() => setBrief({objective:"",context:"",proof:"",authority:""})}>Delete local data</button></div>
    <p className="boundary">Boundary: no model call, no network write, no simulated response. Draft persists locally only.</p>
  </div>;
}

function Nexus() {
  return <div className="nexus">
    <p className="eyebrow">DECISION OBSERVATORY</p><h2>Route decisions through accountable gates.</h2>
    <div className="command-tree">{nodes.map(([name,kind,state],i) => <div className="tree-row" key={kind}><span className={"node "+kind}>{i+1}</span><strong>{name}</strong><span className={"status "+state.replaceAll(" ","-")}>{state}</span><p>{i===3 ? "Queued definition — not a running agent." : i===4 ? "Evidence and red-team checks must clear." : "Explicit state; no hidden execution."}</p></div>)}</div>
    <div className="fleet-note"><strong>150 fleet slots</strong> are queued definitions unless a real runner claims them. This surface never turns queue size into a live-agent claim.</div>
  </div>;
}

function Forge({ forge, setForge, gateState, allGates, exportText, manifest, saved, setSaved }: any) {
  const set=(k:string,v:string)=>setForge({...forge,[k]:v});
  const fields=[["product","Product / release"],["repository","Repository"],["outcome","Outcome"],["constraints","Constraints / security notes"],["owner","Owner"],["acceptanceTests","Acceptance tests (one per line)"],["stopRules","Stop rules (one per line)"],["rollbackPath","Rollback path"],["observabilitySignals","Observability signals (one per line)"]];
  return <div className="forge">
    <div className="section-intro"><p className="eyebrow">RELEASE FOUNDRY</p><h2>Evidence → Security → Ownership → Observability → Rollback → Human approval.</h2><span className={allGates ? "ready-pill" : "local-pill"}>{allGates ? "READY FOR OWNER REVIEW" : "INCOMPLETE"}</span></div>
    <div className="forge-layout"><div className="form-grid">{fields.map(([k,l]) => <label key={k}><span>{l}</span><textarea value={forge[k]} onChange={e=>set(k,e.target.value)} /></label>)}<label><span>Release type</span><select value={forge.releaseType} onChange={e=>set("releaseType",e.target.value)}><option>preview</option><option>production</option><option>rollback</option></select></label></div>
      <aside className="gates"><h3>Gate matrix</h3>{Object.entries(gateState).map(([k,v])=><div className="gate" key={k}><span>{k}</span><b>{v ? "CLEAR" : "MISSING"}</b></div>)}<p>Human approval remains intentionally false. The manifest cannot claim deployment.</p>
      <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),1200)}}>{saved ? "Saved locally" : "Save draft"}</button>{allGates && <><button className="primary" onClick={()=>exportText(JSON.stringify(manifest,null,2),"release-manifest.json","application/json")}>Export JSON</button><button onClick={()=>exportText("# Release Manifest\n\n"+Object.entries(manifest).map(([k,v])=>"**"+k+"**: "+(typeof v==="string"?v:JSON.stringify(v))).join("\n\n"),"release-manifest.md")}>Export Markdown</button></>}</aside>
    </div>
    <p className="boundary">Final state is always “Ready for owner review,” never “Deployed.”</p>
  </div>;
}

function Studio({ blocks, setBlocks, claim, setClaim, notice, setNotice }: any) {
  const supported = claim.trim().length > 0 && /proof|verified|evidence/i.test(claim);
  function add(kind:string){ if(!blocks.includes(kind)) setBlocks([...blocks,kind]); }
  return <div className="studio">
    <p className="eyebrow">SIGNAL PRESS</p><h2>Compose proof-bearing editorial release material.</h2>
    <div className="studio-grid"><div className="canvas"><div className="ruler">01 — 02 — 03 — 04 — 05</div>{blocks.map((b:string,i:number)=><article className="canvas-block" key={b}><span>BLOCK {String(i+1).padStart(2,"0")}</span><h3>{b}</h3><p>{b==="proof" ? "Verified proof library item" : b==="boundary" ? "Explicit boundary / non-claim" : "Positioning statement"}</p></article>)}</div>
      <aside className="press-tools"><h3>Composition tools</h3><button onClick={()=>add("positioning")}>+ Positioning</button><button onClick={()=>add("proof")}>+ Proof</button><button onClick={()=>add("boundary")}>+ Boundary</button><label><span>Claim check</span><textarea value={claim} onChange={e=>setClaim(e.target.value)} placeholder="Paste a claim. Example: Evidence verified on 2026-09-25." /></label><button className="primary" onClick={()=>setNotice(supported ? "Claim has proof-language; still requires a real evidence reference." : "CLAIM NEEDS PROOF — do not publish.")}>Check claim</button><p className={notice.includes("NEEDS") ? "warning" : "boundary"}>{notice || "No publishing action exists here."}</p></aside>
    </div>
  </div>;
}
