"use client";

import { useMemo, useState } from "react";
import styles from "./command-gate.module.css";

type RequestState = "Needs your approval" | "Auto-approved" | "Hard stop" | "Deferred" | "Blocked";
type Request = {
  id: string; source: string; title: string; category: string;
  risk: number; value: number; urgency: number; privacy: number;
  state: RequestState; reason: string; decision: string;
};

const initialRequests: Request[] = [
  { id: "REQ-280-001", source: "Executive Ops Lead", title: "Client follow-up pack before revenue call", category: "High-impact business", risk: 74, value: 91, urgency: 86, privacy: 68, state: "Needs your approval", reason: "External client message, revenue implications, and private context.", decision: "Approve only after human review" },
  { id: "REQ-280-002", source: "PA Daily Lead", title: "Simplify today into 3 moves", category: "Personal operations", risk: 18, value: 82, urgency: 79, privacy: 42, state: "Auto-approved", reason: "Read-only synthesis; no external action requested.", decision: "Read-only synthesis; no execution performed here" },
  { id: "REQ-280-003", source: "Security Maintainer", title: "Rotate exposed staging token candidate", category: "Security maintenance", risk: 96, value: 98, urgency: 94, privacy: 91, state: "Hard stop", reason: "Secret-handling action requires explicit owner confirmation and verified target.", decision: "Blocked pending verification" },
];

const teams = [
  ["PA Team", "Time, inbox, briefings, reminders", 42, "protective"],
  ["Business Team", "Revenue, clients, offers, pipeline", 64, "outcome-led"],
  ["Maintenance Team", "Health checks, cleanup, updates", 58, "quiet"],
  ["Security Team", "Permissions, secrets, privacy gates", 36, "strict"],
  ["Quality Team", "Review, source checks, quality control", 48, "skeptical"],
  ["Goal Team", "Targets, scoreboard, next action", 32, "focused"],
] as const;

function tone(state: RequestState) {
  if (state === "Hard stop" || state === "Blocked") return styles.danger;
  if (state === "Needs your approval") return styles.warning;
  if (state === "Auto-approved") return styles.success;
  return styles.muted;
}

export default function CommandGatePage() {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedId, setSelectedId] = useState(initialRequests[0].id);
  const [mode, setMode] = useState("Commander");
  const [quiet, setQuiet] = useState(true);
  const [notice, setNotice] = useState("Demo data only. Decisions are not connected to external execution.");
  const [filter, setFilter] = useState("All");

  const selected = useMemo(() => requests.find((r) => r.id === selectedId) ?? requests[0], [requests, selectedId]);
  const workerCount = teams.reduce((sum, team) => sum + team[2], 0);
  const queueCount = requests.filter((r) => r.state === "Needs your approval").length;
  const hardStops = requests.filter((r) => r.state === "Hard stop" || r.state === "Blocked").length;
  const visible = requests.filter((r) => filter === "All" || r.state === filter);

  function decide(next: "Deferred" | "Blocked" | "Needs your approval") {
    if (selected.state === "Hard stop" && next !== "Blocked") {
      setNotice("Hard stop preserved. Verify the target and obtain explicit owner confirmation before changing this state.");
      return;
    }
    setRequests((current) => current.map((r) => r.id === selected.id ? {
      ...r,
      state: next,
      decision: next === "Deferred" ? "Deferred for owner review" : next === "Blocked" ? "Blocked by owner in this demo" : "Returned to approval queue",
    } : r));
    setNotice(`${selected.id}: demo state changed to “${next}”. No external action was executed.`);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>A11 INTERFACE / OWNER COMMAND LAYER</p>
          <h1>Your command layer.<br />Clear approvals. Controlled execution.</h1>
          <p className={styles.intro}>A PC-first owner console designed for desktop and iOS PWA. Sensitive actions stay gated; this route currently uses local demo records only.</p>
        </div>
        <div className={styles.platforms}><span>▣ PC</span><span>↗ URL</span><span>▯ iOS PWA</span></div>
      </header>

      <section className={styles.metrics} aria-label="System summary">
        {[["Workers configured", workerCount], ["Approval queue", queueCount], ["Hard stops", hardStops], ["Daily focus", "Revenue"]].map(([label, value]) => (
          <article className={styles.metric} key={String(label)}><span>{label}</span><strong>{value}</strong></article>
        ))}
      </section>

      <div className={styles.layout}>
        <section className={styles.primary}>
          <article className={styles.panel}>
            <div className={styles.panelHead}>
              <div><p className={styles.eyebrow}>OWNER DECISION POINT</p><h2>Owner Decision Queue</h2><p>Review the request, its risk signals and the recorded decision.</p></div>
              <label className={styles.filterLabel}>Filter
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  {["All", "Needs your approval", "Auto-approved", "Hard stop", "Deferred", "Blocked"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </label>
            </div>
            <div className={styles.requestLayout}>
              <div className={styles.requestList}>
                {visible.map((r) => <button key={r.id} onClick={() => setSelectedId(r.id)} className={`${styles.request} ${selectedId === r.id ? styles.active : ""}`} aria-pressed={selectedId === r.id}>
                  <span className={styles.requestTitle}>{r.title}</span><span className={`${styles.pill} ${tone(r.state)}`}>{r.state}</span><small>{r.id} · {r.source}</small>
                </button>)}
                {!visible.length && <p className={styles.empty}>No requests match this filter.</p>}
              </div>
              <div className={styles.detail} key={selected.id}>
                <p className={styles.eyebrow}>SELECTED REQUEST</p><h3>{selected.title}</h3><p className={styles.reason}>{selected.reason}</p>
                <div className={styles.scoreGrid}>{[["Risk", selected.risk], ["Value", selected.value], ["Urgency", selected.urgency], ["Privacy", selected.privacy]].map(([label, score]) => <div className={styles.score} key={String(label)}><span>{label}</span><strong className={Number(score) >= 80 ? styles.high : Number(score) >= 55 ? styles.mid : ""}>{score}</strong></div>)}</div>
                <div className={styles.decision}><span>GATE DECISION</span><strong>{selected.decision}</strong><small>{selected.category}</small></div>
                <div className={styles.actions}>
                  <button onClick={() => decide("Needs your approval")} disabled={selected.state === "Hard stop"}>Return to queue</button>
                  <button onClick={() => decide("Deferred")}>Defer</button>
                  <button className={styles.blockButton} onClick={() => decide("Blocked")}>Block</button>
                </div>
                <p className={styles.note}>“Approve” is intentionally not wired to execution. Production approval must be authenticated, audited, and connected to a verified action handler.</p>
              </div>
            </div>
          </article>
          <article className={styles.panel}>
            <p className={styles.eyebrow}>CONTROL PRINCIPLES</p><h2>Learning without losing control</h2>
            <div className={styles.principles}><p>Learn communication style from owner-approved outputs only.</p><p>Team leads report outcomes and exceptions, not noise.</p><p>Retries stay inside explicit, auditable safety limits.</p></div>
          </article>
        </section>

        <aside className={styles.side}>
          <article className={styles.panel}>
            <p className={styles.eyebrow}>PERSONAL CONTROL</p><h2>You-mode</h2>
            <label className={styles.setting}>Communication mode<select value={mode} onChange={(e) => setMode(e.target.value)}><option>Commander</option><option>Private PA</option><option>Boardroom concise</option><option>Emergency only</option></select></label>
            <label className={styles.checkbox}><input type="checkbox" checked={quiet} onChange={(e) => setQuiet(e.target.checked)} /> Quiet updates unless risk is important</label>
            <p className={styles.settingHint}>Current preference: {mode}{quiet ? " · quiet updates" : " · standard updates"}</p>
          </article>
          <article className={styles.panel}>
            <p className={styles.eyebrow}>TEAM LEADS</p><h2>Configured groups</h2>
            <div className={styles.teams}>{teams.map(([name, desc, count, persona]) => <div className={styles.team} key={name}><div><strong>{name}</strong><span>{count} configured</span></div><p>{desc}</p><small>Operating style: {persona}</small></div>)}</div>
          </article>
        </aside>
      </div>
      <footer className={styles.footer} role="status">{notice}<button onClick={() => { setRequests(initialRequests); setSelectedId(initialRequests[0].id); setFilter("All"); setNotice("Demo records reset. No external action was executed."); }}>Reset demo</button></footer>
    </main>
  );
}
