"use client";

import { useEffect, useState } from "react";

type Service = { id: string; name: string; path: string; status: string };
type State = { loading: boolean; ok: boolean; services: Service[]; version?: string; commit?: string; error?: string };

export default function StatusPage() {
  const [state, setState] = useState<State>({ loading: true, ok: false, services: [] });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [servicesRes, healthRes, versionRes] = await Promise.all([
          fetch("/api/services", { cache: "no-store" }),
          fetch("/api/health", { cache: "no-store" }),
          fetch("/api/version", { cache: "no-store" }),
        ]);
        const services = await servicesRes.json();
        const health = await healthRes.json();
        const version = await versionRes.json();
        if (!active) return;
        setState({
          loading: false,
          ok: servicesRes.ok && healthRes.ok && versionRes.ok,
          services: services.services ?? [],
          version: version.version,
          commit: version.commit,
        });
      } catch (error) {
        if (!active) return;
        setState({ loading: false, ok: false, services: [], error: error instanceof Error ? error.message : "status request failed" });
      }
    }
    load();
    return () => { active = false; };
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px", background: "#070707", color: "#f5f5f5", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ width: "min(920px, 100%)", margin: "0 auto" }}>
        <a href="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: ".12em" }}>MINDREPLY</a>
        <header style={{ margin: "72px 0 42px" }}>
          <p style={{ fontSize: 11, letterSpacing: ".2em", opacity: .45, textTransform: "uppercase" }}>Operations / Status</p>
          <h1 style={{ fontSize: "clamp(48px, 9vw, 92px)", lineHeight: .9, letterSpacing: "-.06em", fontWeight: 300, margin: "14px 0" }}>Live system<br /><span style={{ opacity: .3 }}>state.</span></h1>
          <p style={{ maxWidth: 620, fontSize: 16, lineHeight: 1.7, opacity: .58 }}>A public health surface for MindReply services. Values are read from live application endpoints rather than hard-coded release claims.</p>
        </header>

        <section style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
          {state.loading ? <p style={{ padding: "26px 0", opacity: .55 }}>Checking services…</p> : state.services.map((service) => (
            <div key={service.id} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <div><strong style={{ fontSize: 17, fontWeight: 400 }}>{service.name}</strong><div style={{ marginTop: 6, fontSize: 12, opacity: .4 }}>{service.path}</div></div>
              <span style={{ alignSelf: "center", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: service.status === "operational" ? "#9ef7bb" : "#d7d7d7" }}>{service.status}</span>
            </div>
          ))}
        </section>

        <section style={{ marginTop: 42, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
          <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 20 }}><span style={{ opacity: .4, fontSize: 11 }}>OVERALL</span><strong style={{ display: "block", marginTop: 24, fontSize: 28, fontWeight: 300 }}>{state.ok ? "Operational" : "Check required"}</strong></div>
          <div style={{ border: "1px solid rgba(255,255,255,.1)", borderRadius: 18, padding: 20 }}><span style={{ opacity: .4, fontSize: 11 }}>VERSION</span><strong style={{ display: "block", marginTop: 24, fontSize: 20, fontWeight: 300 }}>{state.version ?? "—"}</strong><small style={{ display: "block", marginTop: 8, opacity: .35, overflow: "hidden", textOverflow: "ellipsis" }}>{state.commit ?? "—"}</small></div>
        </section>

        {state.error && <p style={{ marginTop: 24, color: "#ff9a9a" }}>{state.error}</p>}
        <footer style={{ marginTop: 72, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.08)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", opacity: .3 }}>MindReply · Live service telemetry</footer>
      </div>
    </main>
  );
}
