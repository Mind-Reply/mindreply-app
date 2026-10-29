"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  FileWarning,
  GitBranch,
  Gauge,
  Hexagon,
  Layers3,
  LockKeyhole,
  Network,
  Radio,
  Search,
  ShieldAlert,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const priorities = [
  {
    rank: 1,
    title: "Rotate the exposed credential-like value",
    short: "Contain the robotics ingestion document",
    why: "A hardcoded credential-like value is documented in the ingestion material. Even if it is a placeholder, it normalizes unsafe handling and can be copied into a real runtime.",
    status: "DOCUMENTED",
    statusTone: "coral",
    exit: "Security owner confirms invalidation or rotation, the document is scrubbed, secrets move to an approved store, and a non-sensitive remediation receipt is recorded.",
    icon: LockKeyhole,
  },
  {
    rank: 2,
    title: "Establish the Kafka + Neo4j environment contract",
    short: "Replace localhost assumptions",
    why: "The ingestion code uses local endpoints and fixed topic/group values, but the review found no broker, TLS/SASL, database URI, schema version, or deployment receipt.",
    status: "UNVERIFIED",
    statusTone: "amber",
    exit: "A versioned, non-secret manifest identifies endpoints, auth mode, topic, consumer group, graph database, schema version, and health-check receipts.",
    icon: Network,
  },
  {
    rank: 3,
    title: "Fix consumer correctness and lag measurement",
    short: "Prove offset and restart behavior",
    why: "The implementation commits after graph writes, but the lag monitor only prints partition end offsets. It does not retrieve committed offsets or calculate high-water minus committed.",
    status: "DOCUMENTED",
    statusTone: "coral",
    exit: "Tests cover malformed messages, retries, write failures, restart recovery, accurate per-partition lag, and throughput metrics.",
    icon: Gauge,
  },
  {
    rank: 4,
    title: "Define graph identity constraints and indexes",
    short: "Make MERGE safe under concurrency",
    why: "MERGE is used for Robot.id and Hub.id, but no constraints or indexes are shown. MERGE alone is not a durable uniqueness contract under concurrent loads.",
    status: "DOCUMENTED",
    statusTone: "coral",
    exit: "A migration creates and verifies uniqueness/key constraints, indexes are present, and duplicate/concurrency tests pass.",
    icon: Hexagon,
  },
  {
    rank: 5,
    title: "Separate GraphRAG from ingestion readiness",
    short: "Index and evaluate deliberately",
    why: "The documents mix GraphRAG goals, Neo4j querying, Kafka streaming, and live financial webhooks without a completed-index receipt or query evaluation set.",
    status: "UNVERIFIED",
    statusTone: "amber",
    exit: "A small corpus is indexed, query modes are selected deliberately, a gold-set evaluation runs, and freshness is measured.",
    icon: Layers3,
  },
  {
    rank: 6,
    title: "Reconcile GitHub delivery and deployment claims",
    short: "Separate push from proof",
    why: "Referenced GitHub task evidence reports recent main deployment events ending in startup_failure. That conflicts with any interpretation that the work is live.",
    status: "UNVERIFIED",
    statusTone: "amber",
    exit: "A successful workflow run, build artifact, deployment object, domain mapping, and public HTTP response are recorded together.",
    icon: GitBranch,
  },
  {
    rank: 7,
    title: "Gate live financial-event ingestion",
    short: "Keep Stripe / Monzo in preparation",
    why: "The plan mentions financial webhooks, but there is no independent receipt proving configured endpoints, signature verification, idempotency, rate-limit handling, or reconciliation output.",
    status: "BLOCKED",
    statusTone: "blue",
    exit: "Test-mode events prove signature validation, replay protection, persisted event IDs, receipts, ledger reconciliation, and exception handling.",
    icon: ShieldAlert,
  },
  {
    rank: 8,
    title: "Keep deployment as an owner action packet",
    short: "Do not claim a public URL yet",
    why: "The referenced deployment task reports no configured ResellerPro connector. Architecture files do not independently prove an account deployment or domain mapping.",
    status: "BLOCKED",
    statusTone: "blue",
    exit: "An approved access path or alternative is supplied, then deployment object → domain mapping → public response is reconciled.",
    icon: Workflow,
  },
] as const;

const contradictions = [
  {
    number: "01",
    title: "Preparation language vs. runtime evidence",
    body: "The comparison document says to start streaming live, real-world data. The implementation still assumes local Kafka and Neo4j endpoints and has no deployment or health-check receipt.",
    verdict: "UNVERIFIED",
  },
  {
    number: "02",
    title: "Lag-monitor description vs. implementation",
    body: "The code describes total consumer lag, but only prints partition end offsets. It does not fetch the consumer group’s committed offset or compute the difference.",
    verdict: "DOCUMENTED DEFECT",
  },
  {
    number: "03",
    title: "GraphRAG vs. Neo4j conflation",
    body: "GraphRAG documentation describes extraction, community hierarchy, summaries, and completed-index query modes. No completed GraphRAG index or evaluation receipt was found here.",
    verdict: "UNVERIFIED",
  },
  {
    number: "04",
    title: "GitHub push vs. deployment",
    body: "A push to main and a successful public deployment are different claims. The referenced history reports workflow startup_failure, so deployment remains unproven.",
    verdict: "UNVERIFIED",
  },
];

const phases = [
  {
    label: "NOW",
    title: "Contain",
    color: "coral",
    items: [
      "Treat the robotics ingestion code as non-production.",
      "Rotate or invalidate the credential-like value and scrub copies.",
      "Freeze any claim that GraphRAG/Kafka is live or verified.",
    ],
  },
  {
    label: "NEXT",
    title: "Verify",
    color: "lime",
    items: [
      "Create a non-secret environment manifest for Kafka and Neo4j.",
      "Add identity constraints, correct lag measurement, and restart tests.",
      "Run a synthetic telemetry corpus and record a durable receipt.",
    ],
  },
  {
    label: "1–2 WEEKS",
    title: "Prove",
    color: "cyan",
    items: [
      "Choose GraphRAG cadence and query modes; measure quality and freshness.",
      "Connect only test-mode financial webhooks after authorization.",
      "Repair CI, resolve deployment access, and reconcile public evidence.",
    ],
  },
];

const sources = [
  ["GraphRAG Welcome", "https://microsoft.github.io/graphrag/"],
  ["GraphRAG Query Overview", "https://microsoft.github.io/graphrag/query/overview/"],
  ["Apache Kafka Documentation", "https://kafka.apache.org/documentation/"],
  ["KafkaConsumer API", "https://kafka.apache.org/23/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html"],
  ["Neo4j MERGE", "https://neo4j.com/docs/cypher-manual/current/clauses/merge/"],
  ["Neo4j Constraints", "https://neo4j.com/docs/cypher-manual/current/schema/constraints/"],
  ["Neo4j Python Driver", "https://neo4j.com/docs/python-manual/current/connect/"],
];

const statusFilters = ["ALL", "DOCUMENTED", "UNVERIFIED", "BLOCKED"] as const;
type StatusFilter = (typeof statusFilters)[number];

type Tone = "coral" | "amber" | "blue" | "lime" | "cyan";

function StatusPill({ label, tone = "amber" }: { label: string; tone?: Tone }) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

function SectionLabel({ index, eyebrow, children }: { index: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <div>
        <small>{eyebrow}</small>
        <strong>{children}</strong>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("ALL");
  const [expandedRank, setExpandedRank] = useState<number | null>(1);
  const [showAllContradictions, setShowAllContradictions] = useState(false);

  const visiblePriorities = useMemo(
    () => priorities.filter((item) => activeFilter === "ALL" || item.status === activeFilter),
    [activeFilter],
  );

  return (
    <div className="gk-brief"><div className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="GraphRAG Kafka readiness brief home">
          <span className="brand-mark"><Radio size={17} strokeWidth={2.4} /></span>
          <span>READINESS / <b>01</b></span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#assessment">Assessment</a>
          <a href="#priorities">Priorities</a>
          <a href="#execution">Execution</a>
        </nav>
        <a className="evidence-link" href="#sources"><span className="live-dot" /> Evidence index <ArrowUpRight size={15} /></a>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="kicker"><Sparkles size={14} /> GOOGLE DRIVE / 14-DAY REVIEW</div>
              <h1>GraphRAG <em>needs</em><br />proof before scale.</h1>
              <p className="hero-dek">A decision brief for the Kafka, Neo4j, GraphRAG, financial-ingestion, and deployment workstreams.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#priorities">Read priority register <ArrowDownRight size={16} /></a>
                <a className="button button-ghost" href="#assessment">Jump to assessment</a>
              </div>
            </div>
            <div className="hero-rail">
              <div className="rail-top"><span>OPERATING POSTURE</span><span className="mono">2026.09.26</span></div>
              <div className="signal-ring">
                <div className="ring ring-one" />
                <div className="ring ring-two" />
                <div className="ring-core"><Terminal size={21} /><span>UNVERIFIED</span></div>
              </div>
              <div className="rail-bottom"><span>NO CLAIM WITHOUT A RECEIPT</span><span className="mono">/ REVIEW 014</span></div>
            </div>
          </div>
          <div className="hero-meta">
            <div><span className="meta-label">REVIEW WINDOW</span><strong>12 SEP — 26 SEP 2026</strong></div>
            <div><span className="meta-label">CORPUS</span><strong>2,000 files / 52 shortlisted</strong></div>
            <div><span className="meta-label">ANCHOR</span><strong>539 MB archive / not executed</strong></div>
            <div><span className="meta-label">SOURCE STATE</span><strong className="accent-text">READ-ONLY / SAFE</strong></div>
          </div>
        </section>

        <section id="assessment" className="paper-section">
          <div className="section-wrap">
            <SectionLabel index="01" eyebrow="Executive assessment">The design is coherent. The evidence is not there yet.</SectionLabel>
            <div className="assessment-grid">
              <div className="assessment-lead">
                <p>The Drive corpus supports a <strong>documented preparation plan</strong> for a GraphRAG/Kafka telemetry pipeline — not a proven production system.</p>
                <p>The intended shape is sensible: Kafka for event streaming, manual offset control, batched graph writes, and GraphRAG-style retrieval over structured knowledge. The implementation evidence, however, still assumes <mark>localhost</mark> services, includes a secret-like database value, and mislabels a lag function.</p>
              </div>
              <div className="callout-card">
                <div className="callout-icon"><ShieldAlert size={20} /></div>
                <span className="meta-label">CENTRAL FINDING</span>
                <h3>Target design, local prototype, and verified deployment are being blurred.</h3>
                <p>That boundary must be restored before the work can carry a production-ready label.</p>
              </div>
            </div>
            <div className="status-strip">
              <div><span className="strip-dot coral" /><b>DOCUMENTED</b><span>internal statement or observed condition</span></div>
              <div><span className="strip-dot amber" /><b>UNVERIFIED</b><span>conflicts or cannot be established</span></div>
              <div><span className="strip-dot blue" /><b>BLOCKED</b><span>required access or evidence is missing</span></div>
              <div><span className="strip-dot lime" /><b>PROVEN</b><span>independently checked durable evidence</span></div>
            </div>
          </div>
        </section>

        <section id="priorities" className="dark-section section-wrap">
          <SectionLabel index="02" eyebrow="Priority register">Eight moves that change the risk profile.</SectionLabel>
          <div className="priority-toolbar">
            <div className="toolbar-note"><Search size={16} /><span>FILTER BY EVIDENCE STATUS</span></div>
            <div className="filters" role="group" aria-label="Filter priorities by evidence status">
              {statusFilters.map((filter) => (
                <button key={filter} className={activeFilter === filter ? "filter active" : "filter"} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
          </div>
          <div className="priority-list">
            <AnimatePresence mode="popLayout">
              {visiblePriorities.map((item) => {
                const Icon = item.icon;
                const expanded = expandedRank === item.rank;
                return (
                  <motion.article layout key={item.rank} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`priority-row ${expanded ? "expanded" : ""}`}>
                    <button className="priority-trigger" onClick={() => setExpandedRank(expanded ? null : item.rank)} aria-expanded={expanded}>
                      <span className="rank">0{item.rank}</span>
                      <span className="priority-icon"><Icon size={18} /></span>
                      <span className="priority-title"><strong>{item.title}</strong><small>{item.short}</small></span>
                      <StatusPill label={item.status} tone={item.statusTone} />
                      <ChevronDown size={18} className={`chevron ${expanded ? "rotated" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="priority-detail-wrap">
                          <div className="priority-detail">
                            <div><span className="detail-label">WHY IT MATTERS NOW</span><p>{item.why}</p></div>
                            <div className="exit-box"><span className="detail-label">EXIT CRITERION</span><p>{item.exit}</p></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="register-foot"><span>{visiblePriorities.length} of {priorities.length} priorities visible</span><span>CLICK A ROW TO INSPECT THE GATE <ChevronDown size={14} /></span></div>
        </section>

        <section className="paper-section contradiction-section">
          <div className="section-wrap">
            <SectionLabel index="03" eyebrow="Contradiction desk">Where the paper trail disagrees with itself.</SectionLabel>
            <div className="contradiction-intro"><p>Contradictions are not failures of ambition. They are signals that the next action must be evidence-gathering, not another claim.</p><div className="contradiction-count"><span>04</span><small>HIGH-SIGNAL<br />CONFLICTS</small></div></div>
            <div className="contradiction-grid">
              {(showAllContradictions ? contradictions : contradictions.slice(0, 3)).map((item) => (
                <article key={item.number} className="contradiction-card">
                  <div className="card-top"><span>{item.number}</span><CircleAlert size={17} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="verdict"><span>VERDICT</span><b>{item.verdict}</b></div>
                </article>
              ))}
            </div>
            <button className="text-button" onClick={() => setShowAllContradictions(!showAllContradictions)}>{showAllContradictions ? "Show fewer contradictions" : "Show all contradictions"} {showAllContradictions ? <X size={15} /> : <ArrowDownRight size={15} />}</button>
          </div>
        </section>

        <section id="execution" className="execution-section">
          <div className="section-wrap">
            <SectionLabel index="04" eyebrow="Recommended execution sequence">Contain. Verify. Prove.</SectionLabel>
            <div className="phase-grid">
              {phases.map((phase, index) => (
                <motion.article key={phase.label} className={`phase-card ${phase.color}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.08 }}>
                  <div className="phase-head"><span className="phase-index">0{index + 1}</span><span className="phase-label">{phase.label}</span></div>
                  <h3>{phase.title}</h3>
                  <ul>{phase.items.map((item) => <li key={item}><CircleCheck size={15} />{item}</li>)}</ul>
                </motion.article>
              ))}
            </div>
            <div className="release-rule"><FileWarning size={18} /><span>Release rule</span><strong>CHANGE → VALIDATE → RECORD EVIDENCE → OWNER APPROVAL → PROVIDER RELEASE → VERIFY → COMPLETE</strong></div>
          </div>
        </section>

        <section className="paper-section mapping-section">
          <div className="section-wrap">
            <SectionLabel index="05" eyebrow="Workstream mapping">Three threads. One evidence standard.</SectionLabel>
            <div className="mapping-grid">
              <article><span className="mapping-number">01</span><GitBranch size={19} /><h3>GitHub delivery</h3><p>A repository push is not a deployment. The next gate is a reproducible CI job, safe service checks, ingestion tests, and a build receipt.</p><StatusPill label="STARTUP FAILURE REPORTED" tone="coral" /></article>
              <article><span className="mapping-number">02</span><Radio size={19} /><h3>Financial data</h3><p>Keep Stripe / Monzo ingestion in preparation until the full chain is shown: received → verified → stored → normalized → reconciled → exception recorded.</p><StatusPill label="PREPARATION" tone="amber" /></article>
              <article><span className="mapping-number">03</span><Network size={19} /><h3>ResellerPro export</h3><p>Produce an owner action packet rather than claiming deployment. Required proof is deployment object, domain mapping, and public response.</p><StatusPill label="BLOCKED" tone="blue" /></article>
            </div>
          </div>
        </section>

        <section id="sources" className="source-section">
          <div className="section-wrap">
            <SectionLabel index="06" eyebrow="Verification notes">Primary sources, not borrowed certainty.</SectionLabel>
            <div className="source-layout">
              <div className="source-copy"><h2>Read the references<br /><em>behind the brief.</em></h2><p>External references support the semantics used here — GraphRAG indexing, Kafka committed offsets, Neo4j constraints, and secure driver connections. They do not prove this project is live.</p></div>
              <div className="source-list">{sources.map(([label, href], index) => <a key={href} href={href} target="_blank" rel="noreferrer"><span>0{index + 1}</span><b>{label}</b><ExternalLink size={15} /></a>)}</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer section-wrap"><div><span className="brand-mark small"><Radio size={14} /></span><span>GRAPH RAG / KAFKA READINESS BRIEF</span></div><p>Read-only review · sensitive values intentionally omitted · no Drive files edited</p><span className="footer-code">BRIEF / 014</span></footer>
    </div></div>
  );
}
