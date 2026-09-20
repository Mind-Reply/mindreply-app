"use client";

import { useEffect, useMemo, useState } from "react";
import { localeNames, normalizeLocale, supportedLocales, type SupportedLocale } from "../lib/locales";

type OperatorStage = "frame" | "compile" | "gate" | "pack";
const steps = [
  { id: "frame", label: "Frame", caption: "Input boundary" },
  { id: "compile", label: "Compile", caption: "Policy draft" },
  { id: "gate", label: "Gate & pack", caption: "Human review" },
] as const;

export default function OperatorPage() {
  const [requestId, setRequestId] = useState(() => `audit_${new Date().toISOString().slice(0, 10)}_demo`);
  const [draft, setDraft] = useState("Executive findings: repository shows clear delivery drag in CI paths and three high-value automation opportunities. Recommendations are bounded and reversible.");
  const [intent, setIntent] = useState("Professional tone. Ban guarantee. Max 2000 tokens. Rewrite once on fail.");
  const [clientLabel, setClientLabel] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Loading status…");
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<OperatorStage[]>([]);
  const [locale, setLocale] = useState<SupportedLocale>("en");

  useEffect(() => {
    setLocale(normalizeLocale(navigator.language));
    fetch("/api/elysium/status").then((response) => response.json()).then((json) => {
      const e = json.elysium ?? {};
      setStatus(`loop=${e.auditLoopEnabled ? "on" : "off"} · ledger=${e.ledger ?? "?"} · edge=${e.edge ?? "?"}`);
    }).catch(() => setStatus("status unreachable"));
  }, []);

  const readiness = useMemo(() => [intent, requestId, draft].filter((value) => value.trim()).length, [intent, requestId, draft]);
  const readinessPercent = Math.round((readiness / 3) * 100);
  const activeStage = steps[step].id;

  async function run(path: "/api/elysium/compile" | "/api/elysium/gate" | "/api/elysium/pack") {
    setBusy(true); setResult("");
    try {
      const body = path === "/api/elysium/compile" ? { intent, target: "profit-audit" } : { requestId, draft, clientLabel: clientLabel || undefined };
      const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const json = await response.json();
      setResult(JSON.stringify(json, null, 2));
      const stage: OperatorStage = path.endsWith("compile") ? "compile" : path.endsWith("gate") ? "gate" : "pack";
      setCompleted((current) => current.includes(stage) ? current : [...current, stage]);
      if (stage === "compile") setStep(2);
    } catch (error) { setResult(String(error)); } finally { setBusy(false); }
  }

  function continueToCompile() {
    if (readiness < 3) { setResult("Complete the intent, request ID, and draft before moving to the compiler. Nothing has been sent."); return; }
    setCompleted((current) => current.includes("frame") ? current : [...current, "frame"]);
    setStep(1);
  }

  return <main className="operator-shell">
    <nav className="nav operator-nav"><a className="brand" href="/">MindReply<span>®</span></a><div className="navLinks"><a href="/">Public</a><a href="/api/elysium/status">Status JSON</a></div><label className="operator-locale"><span>Language</span><select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>{supportedLocales.map((value) => <option key={value} value={value}>{localeNames[value]}</option>)}</select></label></nav>
    <section className="operator-hero" aria-labelledby="operator-title"><div><p className="eyebrow">Operator Match · reviewable pathway</p><h1 id="operator-title">Match the work to a bounded operating path.</h1><p className="lead">A premium working surface for framing an input, compiling an expert policy, and preparing a gated delivery pack. Assistance is deterministic and same-origin; consequential decisions remain human-approved.</p><p className="op-status" aria-live="polite">{status}</p></div><aside className="match-readiness" aria-label="Input readiness"><span>INPUT READINESS</span><strong>{readiness}<small>/3</small></strong><div className="readiness-track"><i style={{ width: `${readinessPercent}%` }} /></div><p>Based only on the three required fields on this device.</p></aside></section>
    <section className="operator-workspace" aria-label="Operator Match workflow"><ol className="operator-stepper" aria-label="Operator Match progress">{steps.map((item, index) => <li key={item.id} className={index === step ? "is-active" : completed.includes(item.id) ? "is-complete" : ""}><button type="button" onClick={() => setStep(index)} aria-current={index === step ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b><small>{item.caption}</small></button></li>)}</ol>
      <div className="match-grid"><div className="match-panel" key={activeStage}>
        {step === 0 && <div className="match-stage"><div className="stage-copy"><span>01 · FRAME THE WORK</span><h2>Define the evidence boundary before the system moves.</h2><p>These fields form the input record. The readiness meter is a local completeness signal, not a quality score.</p></div><div className="match-form"><label>EXPERT INTENT<textarea value={intent} onChange={(event) => setIntent(event.target.value)} rows={3} /></label><label>REQUEST ID<input value={requestId} onChange={(event) => setRequestId(event.target.value)} /></label><label>CLIENT LABEL <em>(optional)</em><input value={clientLabel} onChange={(event) => setClientLabel(event.target.value)} placeholder="Client or engagement name" /></label><label>DRAFT<textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={8} /></label><div className="stage-actions"><button className="button" type="button" onClick={continueToCompile}>Continue to compile <span aria-hidden="true">→</span></button><span>Nothing is transmitted until you choose the next stage.</span></div></div></div>}
        {step === 1 && <div className="match-stage"><div className="stage-copy"><span>02 · COMPILE EXPERT POLICY</span><h2>Turn stated intent into a readable policy draft.</h2><p>The Aurelia compiler uses the existing same-origin endpoint. It compiles intent against the current contract; it does not make a release decision or contact an external party.</p></div><div className="compile-preview"><div><span>INPUT</span><b>{intent || "Intent required"}</b></div><div><span>TARGET</span><b>profit-audit</b></div><div><span>OUTPUT</span><b>Versioned policy draft</b></div></div><div className="stage-actions"><button className="button" type="button" disabled={busy || !intent.trim()} onClick={() => run("/api/elysium/compile")}>{busy ? "Compiling…" : "Compile intent"}</button><button className="textButton" type="button" onClick={() => setStep(0)}>Return to frame</button></div></div>}
        {step === 2 && <div className="match-stage"><div className="stage-copy"><span>03 · GATE AND PREPARE</span><h2>Evaluate the draft, then prepare a reviewable pack.</h2><p>The gate may return an allow, rewrite, fallback, or block outcome. A delivery pack records the current review path; it is not an automatic approval or action.</p></div><div className="gate-map"><div className={completed.includes("compile") ? "has-state" : ""}><span>01</span><b>Policy</b><small>{completed.includes("compile") ? "Compiled" : "Pending compile"}</small></div><div><span>02</span><b>Gate</b><small>Evidence & boundary</small></div><div><span>03</span><b>Pack</b><small>Review receipt</small></div></div><div className="stage-actions"><button className="button op-alt" type="button" disabled={busy || !requestId.trim() || !draft.trim()} onClick={() => run("/api/elysium/gate")}>{busy ? "Running gate…" : "Run gate"}</button><button className="button" type="button" disabled={busy || !requestId.trim() || !draft.trim()} onClick={() => run("/api/elysium/pack")}>{busy ? "Preparing…" : "Build delivery pack"}</button></div></div>}
      </div><aside className="operator-result" aria-live="polite"><div className="result-head"><span>REVIEW SURFACE</span><b>{completed.length ? `${completed.length} stage${completed.length === 1 ? "" : "s"} complete` : "Awaiting input"}</b></div><pre>{result || "Select a step, add reviewable input, and the current response will appear here."}</pre><p><i />No browser-embedded keys. No autonomous client action. Review conditions remain visible.</p></aside></div>
    </section><footer><span>Operator Match · not a public CTA</span><span>People decide · Evidence leads</span></footer>
  </main>;
}
