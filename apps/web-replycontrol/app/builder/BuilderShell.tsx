"use client";

import { useMemo, useState } from "react";
import styles from "./BuilderShell.module.css";

type Tab = "website" | "brand" | "domain" | "inbox" | "code" | "database" | "analytics" | "security";

const starter = {
  business: "A premium local digital studio",
  goal: "A fast, trustworthy site that turns visitors into qualified enquiries.",
  domain: "yourbrand.com",
};

const tabs: { id: Tab; label: string }[] = [
  { id: "website", label: "Website" },
  { id: "brand", label: "Brand" },
  { id: "domain", label: "Domain" },
  { id: "inbox", label: "Inbox" },
  { id: "code", label: "Code" },
  { id: "database", label: "Database" },
  { id: "analytics", label: "Analytics" },
  { id: "security", label: "Security" },
];

export function BuilderShell() {
  const [prompt, setPrompt] = useState("");
  const [business, setBusiness] = useState(starter.business);
  const [goal, setGoal] = useState(starter.goal);
  const [domain, setDomain] = useState(starter.domain);
  const [tab, setTab] = useState<Tab>("website");
  const [built, setBuilt] = useState(false);
  const [published, setPublished] = useState(false);
  const [editing, setEditing] = useState(false);

  const previewTitle = useMemo(() => business || "Your new business", [business]);

  function build() {
    const value = prompt.trim();
    if (value) {
      setBusiness(value.split(/[,.]/)[0].slice(0, 58));
      setGoal(value);
    }
    setBuilt(true);
    setTab("website");
  }

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <a className={styles.logo} href="/">ResellerPro<span>BUILDER</span></a>
        <div className={styles.topActions}>
          <span className={styles.liveDot}><i /> Workspace ready</span>
          <button className={styles.ghost} onClick={() => setBuilt(false)}>New project</button>
          <button className={styles.publish} onClick={() => setPublished(true)}>{published ? "Published" : "Publish"}</button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.promptBox}>
            <span>BUILD WITH A BRIEF</span>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website, store, app or dashboard you want..."
              aria-label="Describe your project"
            />
            <button className={styles.buildButton} onClick={build}>Build / update <b>↗</b></button>
            <small>Builds can continue while you work. Nothing publishes without the Publish action.</small>
          </div>

          <nav className={styles.tabs} aria-label="Builder tools">
            {tabs.map((item) => (
              <button key={item.id} className={tab === item.id ? styles.activeTab : ""} onClick={() => setTab(item.id)}>
                <span className={styles.tabIcon}>{item.label.slice(0, 1)}</span>{item.label}
              </button>
            ))}
          </nav>

          <div className={styles.sideFoot}>
            <span>PROJECT STATE</span>
            <b>{published ? "LIVE" : built ? "READY TO PUBLISH" : "DRAFT"}</b>
          </div>
        </aside>

        <section className={styles.workspace}>
          <div className={styles.workspaceHead}>
            <div>
              <span className={styles.eyebrow}>RESellerPRO / {tab.toUpperCase()}</span>
              <h1>{tab === "website" ? "Build, see, adjust, publish." : tabs.find((x) => x.id === tab)?.label}</h1>
            </div>
            <div className={styles.viewActions}>
              <button className={editing ? styles.activeSmall : ""} onClick={() => setEditing(!editing)}>Quick Edit</button>
              <button onClick={() => setTab("website")}>Preview</button>
              <button onClick={() => setTab("code")}>Code</button>
            </div>
          </div>

          {tab === "website" && (
            <div className={styles.canvasWrap}>
              <div className={styles.canvasToolbar}>
                <span>Desktop</span><span>Mobile</span><span className={styles.canvasStatus}>{published ? "● LIVE" : "● LOCAL PREVIEW"}</span>
              </div>
              <article className={styles.sitePreview}>
                <nav className={styles.siteNav}><b>{previewTitle}</b><span>Services</span><span>About</span><span>Contact</span><button>Get started</button></nav>
                <section className={styles.siteHero}>
                  <span>BUILT WITH RESELLERPRO</span>
                  <h2>{previewTitle}</h2>
                  <p>{goal}</p>
                  <div><button>Start a project</button><button className={styles.outline}>See how it works</button></div>
                </section>
                <section className={styles.siteCards}>
                  {[
                    ["01", "Clear offer", "A focused proposition designed to convert without friction."],
                    ["02", "Fast delivery", "A production surface ready for content, forms and commerce."],
                    ["03", "Owned platform", "Domain, code, data, analytics and publishing in one workspace."],
                  ].map(([n, title, body]) => <div key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></div>)}
                </section>
                <footer className={styles.siteFooter}><span>{domain}</span><span>Privacy · Terms · Status</span></footer>
              </article>
            </div>
          )}

          {tab !== "website" && <ToolPanel tab={tab} domain={domain} setDomain={setDomain} business={business} setBusiness={setBusiness} />}
        </section>
      </div>

      <div className={styles.statusbar}>
        <span><i /> {published ? "Production published" : built ? "Build complete" : "Ready"}</span>
        <span>{domain}</span>
        <span>HTTPS · SEO · Sitemap · Rollback ready</span>
      </div>
    </main>
  );
}

function ToolPanel({ tab, domain, setDomain, business, setBusiness }: { tab: Tab; domain: string; setDomain: (v: string) => void; business: string; setBusiness: (v: string) => void }) {
  if (tab === "domain") return <div className={styles.toolPanel}><span className={styles.eyebrow}>DOMAIN MANAGEMENT</span><h2>Connect the real domain.</h2><p>Keep the temporary preview until the production checks pass, then connect the customer-owned domain.</p><label>Production domain<input value={domain} onChange={(e) => setDomain(e.target.value)} /></label><div className={styles.checkGrid}><b>✓ DNS readiness</b><b>✓ HTTPS</b><b>✓ Redirect plan</b></div></div>;
  if (tab === "brand") return <div className={styles.toolPanel}><span className={styles.eyebrow}>BRAND KIT</span><h2>One identity across every surface.</h2><p>Set the business name, visual direction and reusable identity once.</p><label>Business name<input value={business} onChange={(e) => setBusiness(e.target.value)} /></label><div className={styles.brandPreview}><strong>{business}</strong><span>Primary · Secondary · Neutral · Type</span></div></div>;
  if (tab === "inbox") return <div className={styles.toolPanel}><span className={styles.eyebrow}>INBOX</span><h2>Every customer conversation in one place.</h2><div className={styles.rows}><b>New enquiry <small>2m ago</small></b><p>“I need a website and booking system for my studio.”</p><b>Quote request <small>18m ago</small></b><p>“Can you connect my existing domain?”</p></div></div>;
  if (tab === "code") return <div className={styles.toolPanel}><span className={styles.eyebrow}>CODE</span><h2>Production code stays inspectable.</h2><pre>{`app/
  page.tsx
  api/
  components/
public/
  brand/
  media/

✓ TypeScript
✓ Build checks
✓ Git-backed history`}</pre></div>;
  if (tab === "database") return <div className={styles.toolPanel}><span className={styles.eyebrow}>DATABASE</span><h2>Structured data behind the experience.</h2><div className={styles.schema}><b>leads</b><span>id · name · email · status</span><b>orders</b><span>id · customer · total · state</span><b>content</b><span>id · slug · title · published</span></div></div>;
  if (tab === "analytics") return <div className={styles.toolPanel}><span className={styles.eyebrow}>ANALYTICS</span><h2>Know what the live site is doing.</h2><div className={styles.metrics}><div><b>1,284</b><span>Visitors</span></div><div><b>8.4%</b><span>Enquiry rate</span></div><div><b>99.98%</b><span>Uptime</span></div></div></div>;
  return <div className={styles.toolPanel}><span className={styles.eyebrow}>SECURITY</span><h2>Release with visible checks.</h2><div className={styles.security}><b>✓ Dependencies</b><b>✓ Secrets boundary</b><b>✓ Headers</b><b>✓ HTTPS</b><b>✓ Rollback point</b></div></div>;
}
