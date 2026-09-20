/* Civic Signal Archive: evidence-led, human-reviewable public foundation. */
(() => {
  const services = [
    { id: "01", tier: "Foundational", title: "Evidence architecture", summary: "Turn fragmented source material and operating questions into a visible structure: what is known, what requires proof, and what can wait.", scope: "Source inventory, credibility rating, and gap identification across complex inputs.", artifacts: "Evidence ledger, unverified-claim register, and structured source map.", boundary: "Does not validate claims automatically; establishes what must be checked.", review: "Owner review of missing evidence before project acceleration." },
    { id: "02", tier: "Operational", title: "Operating systems", summary: "Design calm working surfaces for prioritisation, handoffs, review rhythms, and the small decisions that determine whether complex work keeps moving.", scope: "Prioritisation cadence, backlog structure, handoff protocols, and workflow rhythm.", artifacts: "Priority matrix, dependency map, and review-rhythm schedule.", boundary: "Supports team coordination; does not replace direct accountability.", review: "Weekly operating sync and blocked-item audit." },
    { id: "03", tier: "Executive", title: "Decision preparation", summary: "Prepare the brief, comparison, and review trail that a decision needs. The system supports judgement; it does not replace responsibility.", scope: "Scenario comparison, underwriting metrics, decision briefs, and review trails.", artifacts: "Screening memo, scenario matrix, and deterministic calculation audit.", boundary: "Prepares comparison materials; does not execute transactions or approve deals.", review: "Named decision-owner sign-off on scenario inputs and sensitivities." },
    { id: "04", tier: "Gated", title: "Protected AI practice", summary: "Create bounded AI-assisted workflows with clear inputs, explicit review gates, and a firm line between support, recommendation, and execution.", scope: "AI tool boundaries, prompt governance, output review gates, and risk logging.", artifacts: "AI boundary policy, prompt evaluation set, and human review log.", boundary: "Strict separation between automated draft generation and human sign-off.", review: "Mandatory human review before an automated draft is promoted." },
  ];

  const studies = [
    { id: "mind-reply-core", kind: "Product system", period: "Published surface", title: "MindReply Core", summary: "A documented operating surface for structuring projects, evidence, and accountable handoffs.", evidence: "Public repository and deployment structure document the product surface and its boundaries.", scope: "Product-system record", practice: "Structured public communication around scope, documentation, and human review.", boundary: "This record describes a public surface; it does not claim client outcomes or autonomous action.", source: "https://github.com/angellllkr-eng/mind-reply-core", label: "View documented source" },
    { id: "enterprise-radar", kind: "Research record", period: "Published surface", title: "Enterprise Engine Radar", summary: "A research-facing surface for organising signals, source pathways, and questions that require review.", evidence: "The published project surface and source estate show a bounded research workflow.", scope: "Research record", practice: "Separate discovery inputs from decision-ready material and mark limits of evidence.", boundary: "Research references are not investment advice, verified recommendations, or performance claims.", source: "https://github.com/angellllkr-eng/enterprise-engine-radar", label: "View documented source" },
    { id: "a11k-ledger", kind: "Decision practice", period: "Published surface", title: "A11-K Decision Ledger", summary: "A decision-support workspace with documented calculations, scenario comparison, and review flags.", evidence: "The public release record documents deterministic calculations and explicit review constraints.", scope: "Decision-practice record", practice: "Make inputs, formulas, assumptions, and pending human review visible in one place.", boundary: "Decision support is not transactional execution or a substitute for professional judgement.", source: "#services", label: "Inspect service architecture" },
    { id: "architecture-record", kind: "Architecture record", period: "Public foundation", title: "Civic Signal Archive", summary: "The public foundation makes the boundary between explanation and protected operating work legible by design.", evidence: "This public site exposes only scope, governance tiers, and documented practice—not private workspaces or client data.", scope: "Architecture record", practice: "Use a clear public/private split, non-indexed protected routes, and evidence-led service descriptions.", boundary: "The archive is not a public data room and does not expose internal decision material.", source: "#method", label: "Read the working method" },
    { id: "field-method", kind: "Research record", period: "Field note", title: "Evidence Path Method", summary: "A public note on converting incomplete context into a reviewable path without claiming false certainty.", evidence: "The method is described on this foundation: frame the question, build the evidence path, and prepare the handoff.", scope: "Research record", practice: "Name what is missing before acceleration, then keep ownership and review visible.", boundary: "The method is a framework, not a promise of a particular outcome.", source: "#principles", label: "Read operating principles" },
  ];

  const state = { tier: "All", query: "", compare: [], kind: "All", selected: null, activeStudy: studies[0].id };
  const app = document.querySelector("#app");
  const nav = document.querySelector("#nav");
  const canvas = document.querySelector("#space");
  const footer = document.querySelector("body > footer");

  const toTitle = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[char]));
  const meta = (name, content) => { let node = document.querySelector(`meta[name="${name}"]`); if (!node) { node = document.createElement("meta"); node.name = name; document.head.appendChild(node); } node.content = content; };
  const addCss = () => { const link = document.createElement("link"); link.rel = "stylesheet"; link.href = "/foundation.css"; document.head.appendChild(link); };
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  function serviceCard(s) {
    const compared = state.compare.includes(s.id);
    return `<article class="service-card" data-service="${s.id}" tabindex="0">
      <div class="card-top"><span class="record-id">${s.id}</span><span class="tier-badge">${s.tier}</span></div>
      <h3>${s.title}</h3><p>${s.summary}</p>
      <div class="card-actions"><span>Inspect architecture <b>↗</b></span><label class="compare-toggle"><input type="checkbox" data-compare="${s.id}" ${compared ? "checked" : ""}> Compare</label></div>
    </article>`;
  }

  function studyCard(s) {
    return `<button class="study-card ${state.activeStudy === s.id ? "active" : ""}" data-study="${s.id}"><span>${s.kind}</span><small>${s.period}</small><h3>${s.title}</h3><p>${s.summary}</p><b>Open record →</b></button>`;
  }

  function renderServiceList() {
    const query = state.query.trim().toLowerCase();
    const visible = services.filter((s) => (state.tier === "All" || s.tier === state.tier) && (!query || [s.title, s.summary, s.tier, s.scope, s.artifacts].join(" ").toLowerCase().includes(query)));
    document.querySelector("#service-grid").innerHTML = visible.length ? visible.map(serviceCard).join("") : `<div class="empty-record"><b>No service lines match this record.</b><p>Adjust the query or return to all governance tiers.</p><button data-reset-services>Reset filters</button></div>`;
    document.querySelector("#compare-trigger").innerHTML = state.compare.length ? `Compare ${state.compare.length}/3 <b>→</b>` : "Comparison ledger <b>→</b>";
    document.querySelector("#compare-trigger").classList.toggle("active", Boolean(state.compare.length));
  }

  function renderStudies() {
    const visible = state.kind === "All" ? studies : studies.filter((s) => s.kind === state.kind);
    if (!visible.some((s) => s.id === state.activeStudy)) state.activeStudy = visible[0]?.id || studies[0].id;
    const active = studies.find((s) => s.id === state.activeStudy) || studies[0];
    document.querySelector("#study-list").innerHTML = visible.map(studyCard).join("");
    document.querySelector("#study-detail").innerHTML = `<div class="folio-head"><span>Active record</span><i>${active.kind}</i></div><h3>${active.title}</h3><p class="folio-summary">${active.summary}</p><div class="evidence-callout"><b>Published evidence</b><p>${active.evidence}</p></div><dl><div><dt>Scope</dt><dd>${active.scope}</dd></div><div><dt>Documented practice</dt><dd>${active.practice}</dd></div><div><dt>Boundary</dt><dd>${active.boundary}</dd></div></dl><a class="source-link" href="${active.source}" ${active.source.startsWith("http") ? "target=\"_blank\" rel=\"noreferrer\"" : ""}>${active.label} ↗</a>`;
  }

  function closeModal() { document.querySelector("#modal-layer").innerHTML = ""; document.body.classList.remove("modal-open"); }
  function modal(content, type) { document.querySelector("#modal-layer").innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal-card ${type}" role="dialog" aria-modal="true" aria-label="A11-K service information"><button class="modal-close" data-close-modal aria-label="Close">×</button>${content}</section></div>`; document.body.classList.add("modal-open"); }
  function openService(id) { const s = services.find((x) => x.id === id); if (!s) return; modal(`<p class="micro">Service ${s.id} · ${s.tier} tier</p><h2>${s.title}</h2><p class="modal-summary">${s.summary}</p><div class="detail-list"><div><b>Operating scope</b><p>${s.scope}</p></div><div><b>Standard artifacts</b><p>${s.artifacts}</p></div><div><b>Governance boundary</b><p>${s.boundary}</p></div><div><b>Review protocol</b><p>${s.review}</p></div></div><button class="modal-cta" data-briefing>Request a briefing →</button>`, "detail"); }
  function openComparison() { const selected = services.filter((s) => state.compare.includes(s.id)); if (!selected.length) return; modal(`<p class="micro">Side-by-side analysis</p><h2>Service comparison ledger</h2><p class="modal-summary">A structured contrast of scope, artifacts, boundaries, and review protocols. This comparison prepares discussion; it does not select a service automatically.</p><div class="comparison-grid">${selected.map((s) => `<article><span>${s.id} · ${s.tier}</span><h3>${s.title}</h3><p>${s.summary}</p><dl><div><dt>Scope</dt><dd>${s.scope}</dd></div><div><dt>Artifacts</dt><dd>${s.artifacts}</dd></div><div><dt>Boundary</dt><dd>${s.boundary}</dd></div><div><dt>Review</dt><dd>${s.review}</dd></div></dl><button data-remove-compare="${s.id}">Remove</button></article>`).join("")}</div><div class="modal-footer"><button data-clear-compare>Clear comparison</button><button class="modal-cta" data-close-modal>Done comparing</button></div>`, "compare"); }

  function bind() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-service],[data-compare],[data-tier],[data-kind],[data-study],[data-close-modal],[data-reset-services],[data-clear-compare],[data-remove-compare],[data-briefing]");
      if (!target) return;
      if (target.dataset.service && !event.target.closest(".compare-toggle")) return openService(target.dataset.service);
      if (target.dataset.compare) { const id = target.dataset.compare; state.compare = state.compare.includes(id) ? state.compare.filter((x) => x !== id) : [...state.compare.slice(-2), id]; renderServiceList(); return; }
      if (target.dataset.tier) { state.tier = target.dataset.tier; document.querySelectorAll("[data-tier]").forEach((b) => b.classList.toggle("selected", b.dataset.tier === state.tier)); renderServiceList(); return; }
      if (target.dataset.kind) { state.kind = target.dataset.kind; document.querySelectorAll("[data-kind]").forEach((b) => b.classList.toggle("selected", b.dataset.kind === state.kind)); renderStudies(); return; }
      if (target.dataset.study) { state.activeStudy = target.dataset.study; renderStudies(); return; }
      if (target.dataset.resetServices) { state.tier = "All"; state.query = ""; document.querySelector("#service-search").value = ""; document.querySelectorAll("[data-tier]").forEach((b) => b.classList.toggle("selected", b.dataset.tier === "All")); renderServiceList(); return; }
      if (target.dataset.removeCompare) { state.compare = state.compare.filter((x) => x !== target.dataset.removeCompare); if (state.compare.length) openComparison(); else closeModal(); renderServiceList(); return; }
      if (target.dataset.clearCompare !== undefined) { state.compare = []; closeModal(); renderServiceList(); return; }
      if (target.dataset.briefing !== undefined) { closeModal(); scrollTo("#entry"); return; }
      if (target.dataset.closeModal !== undefined) closeModal();
    });
    document.querySelector("#service-search").addEventListener("input", (event) => { state.query = event.target.value; renderServiceList(); });
    document.querySelector("#compare-trigger").addEventListener("click", openComparison);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  }

  function renderConsoleBoundary() {
    document.title = "A11–K · Protected Console";
    meta("robots", "noindex, nofollow, noarchive");
    nav.innerHTML = `<a class="wordmark" href="/">A11<span>–</span>K <small>Protected workspace</small></a>`;
    app.innerHTML = `<main class="console-boundary"><p class="micro">Protected workspace</p><h1>Access belongs<br><em>with the record.</em></h1><p>This route is intentionally excluded from public indexing. Approved internal workflows may contain research, prioritisation, calculation, and review tools; they are not a public data room or an autonomous decision engine.</p><a href="/">Return to the public foundation →</a></main>`;
  }

  function renderFoundation() {
    document.title = "A11–K · Evidence-led operating foundation";
    meta("description", "A11-K is an evidence-led operating foundation for complex work, consequential choices, and humanly reviewable systems.");
    meta("robots", "index, follow");
    canvas?.remove(); footer?.remove(); nav.innerHTML = `<a class="wordmark" href="#top">A11<span>–</span>K <small>Evidence-led operating foundation</small></a><div class="top-links"><a href="#mission">Mandate</a><a href="#services">Services</a><a href="#method">Method</a><a href="#records">Records</a><a href="#trust">Trust</a></div><a class="brief-link" href="#entry">Start with a briefing ↗</a>`;
    app.innerHTML = `<main class="foundation" id="top">
      <section class="hero"><div class="hero-copy"><p class="micro">A11-K public foundation</p><h1>Make the work <em>clear</em><br>enough to carry.</h1><p class="hero-lede">A11-K is an evidence-led operating foundation for people navigating complex work, consequential choices, and systems that need to remain humanly reviewable.</p><div class="hero-actions"><a class="primary" href="#services">See service lines ↓</a><a class="text-link" href="#records">Read published records →</a></div></div><div class="signal-field"><span>01</span><div class="signal-grid"><i></i><i></i><i></i><b>A11<br><small>signal<br>archive</small></b></div><p>Public mandate<br>Protected depth</p></div></section>
      <section class="mandate" id="mission"><p class="micro">The mandate</p><div><h2>We build the space between pressure and action.</h2><p>A11-K brings structure to moments where information is incomplete, responsibilities cross, and a rushed response would create more work later. The goal is not more dashboards or louder automation. It is a system where context can become evidence, evidence can become a reviewable path, and the next move can be made with care.</p></div><aside><span>First question</span><b>What must be true before this can move?</b></aside></section>
      <section class="services-section" id="services"><div class="section-head"><div><p class="micro">Core service lines</p><h2>Four ways to give complex work a durable shape.</h2></div><p>Each line creates a visible operating record, not a black box. They can stand alone or connect as one disciplined foundation.</p></div><div class="controls"><div class="tier-control"><span>Governance tier</span>${["All", "Foundational", "Operational", "Executive", "Gated"].map((tier) => `<button data-tier="${tier}" class="${tier === "All" ? "selected" : ""}">${tier}</button>`).join("")}</div><div class="search-control"><label for="service-search">Search service lines</label><input id="service-search" type="search" placeholder="Search by scope or tier"></div><button id="compare-trigger">Comparison ledger <b>→</b></button></div><div class="service-grid" id="service-grid"></div></section>
      <section class="method" id="method"><div class="method-graphic"><span>FIELD<br>METHOD</span><div class="line-map"><i></i><i></i><i></i><i></i></div><b>A11</b></div><div><p class="micro">Working method</p><h2>A system is only useful when the next person can see where it came from.</h2><ol><li><b>Frame the question.</b><span>Identify the operating question, decision boundary, and information that must not be assumed.</span></li><li><b>Build the evidence path.</b><span>Organise inputs, sources, dependencies, and review gates so the work can be inspected.</span></li><li><b>Prepare the handoff.</b><span>Turn the result into a clear record of what changed, what remains open, and what needs accountable human review.</span></li></ol></div></section>
      <section class="principles" id="principles"><div><p class="micro">Operating principles</p><h2>Capability should arrive with a boundary.</h2><p>Public explanation is not a substitute for governance. A11-K makes the boundary visible before a workflow reaches a sensitive handoff.</p></div><div class="principle-list"><article><span>01</span><div><h3>Evidence before momentum</h3><p>A quick answer is not the same as a dependable one. Name missing evidence before accelerating the work.</p></div></article><article><span>02</span><div><h3>The boundary is part of the product</h3><p>Privacy, access, and accountability are treated as design material. Protected workspaces hold the record.</p></div></article><article><span>03</span><div><h3>A clear next step beats an inflated promise</h3><p>Favour traceable progress over autonomous theatre. Every handoff should show what changed, what remains open, and who reviews it.</p></div></article></div></section>
      <section class="records" id="records"><div class="section-head"><div><p class="micro">Case studies & field notes</p><h2>Published work, with the evidence left in view.</h2></div><p>These public records describe an operating question, documented practice, and boundary. They do not claim customer outcomes, confidential results, or autonomous decision-making.</p></div><div class="record-filter">${["All", "Product system", "Research record", "Decision practice", "Architecture record"].map((kind) => `<button data-kind="${kind}" class="${kind === "All" ? "selected" : ""}">${kind}</button>`).join("")}</div><div class="record-layout"><div class="study-list" id="study-list"></div><article class="study-detail" id="study-detail"></article></div><div class="field-notes"><article><span>01</span><h3>Source first</h3><p>Bring evidence and context before recommendation. A source map can make uncertainty legible.</p></article><article><span>02</span><h3>Review is a feature</h3><p>Every protected decision path needs a named owner and a visible condition for stopping.</p></article><article><span>03</span><h3>Public does not mean exposed</h3><p>Explain the method without exposing internal records, private workspaces, or client materials.</p></article></div></section>
      <section class="trust" id="trust">
        <div class="section-head">
          <div>
            <p class="micro">Founder / Trust</p>
            <h2>Who built it, and what is actually true.</h2>
          </div>
          <p>Ambition can be enormous. Claims cannot exceed evidence. This section states the current public reality without inflation.</p>
        </div>
        <div class="trust-grid">
          <article>
            <span>Builder</span>
            <h3>Angel L. Krastev · A.K.</h3>
            <p>Operator of Mind-Reply and the A11-K evidence-led foundation. Organisation: Mind-Reply / Sofia Tech Register EOOD.</p>
          </article>
          <article>
            <span>Live</span>
            <h3>Public surfaces that respond</h3>
            <p>a11-k.space (this foundation) · mind-reply.com · documented repositories on GitHub under angellllkr-eng and Mind-Reply.</p>
          </article>
          <article>
            <span>Fixture</span>
            <h3>Illustrative or staging material</h3>
            <p>Demo scenarios, comparison ledgers, and field notes shown for method clarity. They are not live client results or autonomous decisions.</p>
          </article>
          <article>
            <span>Blocked</span>
            <h3>Not yet public or not yet verified</h3>
            <p>Protected console routes · internal decision ledgers · any surface still behind Vercel SSO or missing required environment configuration.</p>
          </article>
          <article>
            <span>Verified</span>
            <h3>Evidence on record</h3>
            <p>Canonical monorepo · 43-target operating machine · SEO technical base for this domain · public service boundaries · human-review protocol.</p>
          </article>
        </div>
        <p class="trust-note">Every public claim on this foundation is intended to be checkable. If a statement cannot be verified from a live URL, commit, or explicit boundary note, treat it as open rather than settled.</p>
      </section>
      <section class="entry" id="entry"><div><p class="micro">Entry point</p><h2>Bring the pressure.<br><em>We return the structure.</em></h2></div><aside><p>Start with a concise briefing: the operating question, relevant context, the decision owner, and the date it needs review.</p><a class="primary" href="mailto:info@mind-reply.com?subject=A11-K%20briefing">Request an A11-K briefing ↗</a><small>Private material should be shared only through an approved route.</small></aside></section>
      <footer class="foundation-footer"><a class="wordmark" href="#top">A11<span>–</span>K</a><p>Evidence-led operating foundation. Public explanation, protected work.</p><div><a href="#top">Back to top</a><a href="https://www.mind-reply.com" target="_blank" rel="noreferrer">MindReply ↗</a></div></footer>
    </main><div id="modal-layer"></div>`;
    renderServiceList(); renderStudies(); bind();
  }

  addCss();
  if (location.pathname.startsWith("/console")) renderConsoleBoundary(); else renderFoundation();
})();
