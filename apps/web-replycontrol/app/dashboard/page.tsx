"use client";

import { useMemo, useState } from "react";
import styles from "./dashboard.module.css";

type Status = "VERIFIED" | "IN-PROGRESS" | "OPEN" | "BLOCKED" | "DEFERRED";

type Target = {
  id: string;
  name: string;
  area: string;
  owner: string;
  status: Status;
  priority: "P0" | "P1" | "P2";
  evidence: string;
  next: string;
  updated: string;
};

const targets: Target[] = [
  { id: "21", name: "Operator Dashboard", area: "Operator", owner: "A.K.", status: "IN-PROGRESS", priority: "P0", evidence: "GitHub source", next: "Finish owner cockpit UI", updated: "Today" },
  { id: "22", name: "43 targets visible and filterable", area: "Operator", owner: "A.K.", status: "OPEN", priority: "P0", evidence: "docs/43_TARGETS.md", next: "Connect target register", updated: "Today" },
  { id: "05", name: "Zero broken internal links", area: "Links", owner: "A.K.", status: "OPEN", priority: "P1", evidence: "Crawl required", next: "Run canonical crawl", updated: "Today" },
  { id: "13", name: "No committed secrets", area: "Security", owner: "A.K.", status: "OPEN", priority: "P0", evidence: "Scan required", next: "Run repository scan", updated: "Today" },
  { id: "18", name: "Real offer + payment path", area: "Commercial", owner: "A.K.", status: "OPEN", priority: "P1", evidence: "Live page required", next: "Verify offer surface", updated: "Today" },
  { id: "31", name: "Rollback path for production surfaces", area: "Recovery", owner: "A.K.", status: "OPEN", priority: "P1", evidence: "Docs required", next: "Map rollback evidence", updated: "Yesterday" },
  { id: "33", name: "Desktop + 390px visual inspection", area: "Visual", owner: "A.K.", status: "OPEN", priority: "P1", evidence: "Screenshots required", next: "Inspect primary roots", updated: "Yesterday" },
  { id: "40", name: "Factual release identity health endpoint", area: "Monitoring", owner: "A.K.", status: "OPEN", priority: "P1", evidence: "Live endpoint", next: "Verify runtime identity", updated: "Yesterday" },
];

const nav = [
  ["Overview", "⌂"],
  ["43 Targets", "43"],
  ["Real Estate", "RE"],
  ["Evidence", "✓"],
  ["Decisions", "◆"],
  ["Operations", "OP"],
  ["Knowledge", "KN"],
  ["Public", "↗"],
  ["Intelligence", "IN"],
  ["Experiments", "EX"],
] as const;

function StatusPill({ status }: { status: Status }) {
  return <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

export default function DashboardPage() {
  const [section, setSection] = useState("Overview");
  const [filter, setFilter] = useState<"ALL" | Status>("ALL");
  const [query, setQuery] = useState("");
  const [showOnlyP0, setShowOnlyP0] = useState(false);

  const visible = useMemo(() => targets.filter((target) => {
    const statusOk = filter === "ALL" || target.status === filter;
    const priorityOk = !showOnlyP0 || target.priority === "P0";
    const queryOk = !query.trim() || [target.id, target.name, target.area, target.owner, target.next].join(" ").toLowerCase().includes(query.toLowerCase());
    return statusOk && priorityOk && queryOk;
  }), [filter, query, showOnlyP0]);

  const counts = useMemo(() => ({
    total: targets.length,
    p0: targets.filter((t) => t.priority === "P0").length,
    blocked: targets.filter((t) => t.status === "BLOCKED").length,
    open: targets.filter((t) => t.status === "OPEN").length,
    verified: targets.filter((t) => t.status === "VERIFIED").length,
  }), []);

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}><span className={styles.brandMark}>MR</span><div><strong>MindReply</strong><small>OWNER CONTROL</small></div></div>
        <div className={styles.sideLabel}>COMMAND</div>
        <nav className={styles.nav} aria-label="Owner navigation">
          {nav.map(([label, icon]) => <button key={label} className={section === label ? styles.navActive : ""} onClick={() => setSection(label)}><span>{icon}</span>{label}</button>)}
        </nav>
        <div className={styles.sideBottom}>
          <div className={styles.runtime}><i /> Source connected <b>main</b></div>
          <a href="/api/health">Health endpoint →</a>
          <a href="/operator">Operator Match →</a>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <div><span className={styles.kicker}>OWNER COCKPIT / {section.toUpperCase()}</span><h1>{section === "Overview" ? "What matters now." : section}</h1></div>
          <div className={styles.topActions}><label className={styles.search}><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search target, owner, evidence…" /></label><button className={styles.iconButton} aria-label="Notifications">◌</button><div className={styles.owner}>AK</div></div>
        </header>

        {section === "Overview" ? (
          <>
            <div className={styles.heroGrid}>
              <article className={styles.heroCard}>
                <div className={styles.cardTop}><span>OPERATING STATE</span><StatusPill status="IN-PROGRESS" /></div>
                <h2>Evidence first.<br />Execution next.</h2>
                <p>The cockpit is the control surface for targets, evidence, decisions and operational handoffs. It does not declare runtime health without proof.</p>
                <div className={styles.heroMeta}><div><small>LAST CHECK</small><b>Today</b></div><div><small>SOURCE</small><b>GitHub main</b></div><div><small>OWNER</small><b>A.K.</b></div></div>
              </article>
              <article className={styles.decisionCard}>
                <div className={styles.cardTop}><span>NEXT DECISION</span><b>P0</b></div>
                <h3>Complete the owner cockpit</h3>
                <p>Finish the 43-target surface, then connect evidence and live verification records.</p>
                <button onClick={() => { setSection("43 Targets"); setShowOnlyP0(true); }}>Open P0 targets →</button>
              </article>
            </div>

            <section className={styles.metricGrid}>
              {[
                ["Active targets", String(counts.total), "43-target register"],
                ["P0", String(counts.p0), "owner attention"],
                ["Blocked", String(counts.blocked), "needs resolution"],
                ["Open", String(counts.open), "next actions"],
                ["Verified", String(counts.verified), "evidence-backed"],
              ].map(([label, value, note]) => <button key={label} className={styles.metric} onClick={() => { setSection("43 Targets"); setFilter(label === "Open" ? "OPEN" : label === "Blocked" ? "BLOCKED" : label === "Verified" ? "VERIFIED" : "ALL"); }}><span>{label}</span><strong>{value}</strong><small>{note}</small></button>)}
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHead}><div><span className={styles.kicker}>ATTENTION QUEUE</span><h2>High-value work</h2></div><button className={styles.linkButton} onClick={() => setSection("43 Targets")}>View all targets →</button></div>
              <div className={styles.targetList}>{targets.slice(0, 6).map((target) => <TargetRow key={target.id} target={target} onOpen={() => setSection("43 Targets")} />)}</div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHead}><div><span className={styles.kicker}>CONTROL SURFACES</span><h2>One operating spine.</h2></div></div>
              <div className={styles.surfaceGrid}>
                {[
                  ["REAL ESTATE", "Property → lead → transaction", "Real Estate"],
                  ["EVIDENCE", "Intent → action → result → receipt", "Evidence"],
                  ["OPERATIONS", "Workflows → approvals → recovery", "Operations"],
                  ["KNOWLEDGE", "Source → retrieve → ground → record", "Knowledge"],
                ].map(([eyebrow, title, target]) => <button key={target} className={styles.surface} onClick={() => setSection(target)}><span>{eyebrow}</span><b>{title}</b><i>→</i></button>)}
              </div>
            </section>
          </>
        ) : (
          <section className={styles.sectionFirst}>
            <div className={styles.sectionHead}><div><span className={styles.kicker}>OPERATING SURFACE</span><h2>{section}.</h2></div><p>{section === "43 Targets" ? "Every active target carries an owner, status, evidence state and next action. Filter before you execute." : "This surface is wired into the owner cockpit navigation. Runtime data will replace fixture records only when the corresponding source is verified."}</p></div>
            <div className={styles.toolbar}><label className={styles.search}><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter this surface…" /></label><div className={styles.filters}>{(["ALL", "VERIFIED", "IN-PROGRESS", "OPEN", "BLOCKED", "DEFERRED"] as const).map((value) => <button key={value} className={filter === value ? styles.filterActive : ""} onClick={() => setFilter(value)}>{value}</button>)}</div><button className={showOnlyP0 ? styles.filterActive : ""} onClick={() => setShowOnlyP0((v) => !v)}>P0 only</button></div>
            <div className={styles.targetList}>{visible.map((target) => <TargetRow key={target.id} target={target} onOpen={() => {}} />)}{visible.length === 0 && <div className={styles.empty}>No records match the current filter. No state has been inferred.</div>}</div>
          </section>
        )}

        <footer className={styles.footer}><span>MindReply · Owner Control</span><span>Evidence before claims · Human approval for consequential actions</span></footer>
      </section>
    </main>
  );
}

function TargetRow({ target, onOpen }: { target: Target; onOpen: () => void }) {
  return <button className={styles.target} onClick={onOpen}>
    <div className={styles.targetId}>#{target.id}</div>
    <div className={styles.targetMain}><div className={styles.targetTitle}><strong>{target.name}</strong><span>{target.area}</span></div><p>{target.next}</p></div>
    <div className={styles.targetEvidence}><small>EVIDENCE</small><b>{target.evidence}</b></div>
    <div className={styles.targetStatus}><small>{target.priority} · {target.updated}</small><StatusPill status={target.status} /></div>
    <div className={styles.arrow}>→</div>
  </button>;
}
