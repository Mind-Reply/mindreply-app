"use client";

import { useEffect, useMemo, useState } from "react";

type Persona = { id: string; name: string; voice: "Female" | "Male" | "Neutral"; role: string; style: string; greeting: string };
const personas: Persona[] = [
  { id: "V01", name: "Maya", voice: "Female", role: "Front-desk lead", style: "Warm · composed", greeting: "Hello, thank you for calling. You’re speaking with Maya. How may I help you today?" },
  { id: "V02", name: "Oliver", voice: "Male", role: "Front-desk lead", style: "Clear · assured", greeting: "Good day, thank you for calling. Oliver speaking. How can I direct your enquiry?" },
  { id: "V03", name: "Sofia", voice: "Female", role: "Appointments", style: "Friendly · organised", greeting: "Hello, this is Sofia at reception. I can help you with an appointment or a general enquiry." },
  { id: "V04", name: "Theo", voice: "Male", role: "Appointments", style: "Calm · efficient", greeting: "Hello, Theo here. I can help arrange an appointment or take a message for the team." },
  { id: "V05", name: "Amara", voice: "Female", role: "Customer care", style: "Empathetic · patient", greeting: "Hello, you’ve reached Amara. I’m here to help. Could you tell me a little about what you need?" },
  { id: "V06", name: "Daniel", voice: "Male", role: "Customer care", style: "Steady · reassuring", greeting: "Thank you for calling. Daniel speaking. I’ll do my best to get you to the right person." },
  { id: "V07", name: "Elena", voice: "Female", role: "Executive office", style: "Polished · discreet", greeting: "Good morning, Elena speaking. May I ask the purpose of your call so I can route it appropriately?" },
  { id: "V08", name: "Adrian", voice: "Male", role: "Executive office", style: "Formal · concise", greeting: "Good morning, Adrian at reception. How may I assist with your call?" },
  { id: "V09", name: "Nina", voice: "Female", role: "Sales enquiries", style: "Bright · attentive", greeting: "Hi, this is Nina. Thanks for reaching out. Are you enquiring about a service or an existing request?" },
  { id: "V10", name: "Lucas", voice: "Male", role: "Sales enquiries", style: "Engaging · direct", greeting: "Hello, Lucas here. I can help with a new enquiry or connect you with the right team." },
  { id: "V11", name: "Isla", voice: "Female", role: "Service desk", style: "Precise · helpful", greeting: "Hello, Isla at the service desk. Please tell me what you need help with, and I’ll guide you." },
  { id: "V12", name: "Marcus", voice: "Male", role: "Service desk", style: "Practical · focused", greeting: "Hello, Marcus speaking. Tell me briefly what’s happening and I’ll identify the next step." },
  { id: "V13", name: "Freya", voice: "Female", role: "Hospitality", style: "Elegant · welcoming", greeting: "Welcome, and thank you for calling. Freya speaking. How may I make your experience easier today?" },
  { id: "V14", name: "Gabriel", voice: "Male", role: "Hospitality", style: "Warm · articulate", greeting: "Hello, and welcome. Gabriel here. How can I assist you today?" },
  { id: "V15", name: "Lena", voice: "Female", role: "Multilingual desk", style: "Adaptable · clear", greeting: "Hello, this is Lena. I can help with your enquiry and keep the next steps clear." },
  { id: "V16", name: "Mateo", voice: "Male", role: "Multilingual desk", style: "Relaxed · clear", greeting: "Hello, Mateo speaking. What can I help you with today?" },
  { id: "V17", name: "Zara", voice: "Female", role: "Priority routing", style: "Decisive · calm", greeting: "Hello, Zara at reception. I’ll ask a couple of quick questions to route your call correctly." },
  { id: "V18", name: "Ethan", voice: "Male", role: "Priority routing", style: "Measured · decisive", greeting: "Hello, Ethan speaking. I can help determine the right team for your enquiry." },
  { id: "V19", name: "Ava", voice: "Female", role: "Message taking", style: "Attentive · reassuring", greeting: "Hello, Ava here. If the team is unavailable, I can take a message and explain what happens next." },
  { id: "V20", name: "Noah", voice: "Male", role: "Message taking", style: "Patient · dependable", greeting: "Hello, Noah at reception. I can take the details of your message for the team." },
  { id: "V21", name: "Clara", voice: "Female", role: "After-hours", style: "Quiet · professional", greeting: "Thank you for calling after hours. Clara speaking. I can record the purpose of your enquiry for follow-up." },
  { id: "V22", name: "James", voice: "Male", role: "After-hours", style: "Low-key · professional", greeting: "Thank you for calling. James here. The team may be unavailable, but I can help capture your message." },
  { id: "V23", name: "Alex", voice: "Neutral", role: "Accessibility & fallback", style: "Plain · accessible", greeting: "Hello, you’ve reached reception. Tell me what you need, and I’ll help with the next step." } as Persona,
];

export default function VoicePersonasLab() {
  const [selected, setSelected] = useState("V01");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [filter, setFilter] = useState("All");
  const [testText, setTestText] = useState("Hello, thank you for calling. How may I help you today?");
  const [events, setEvents] = useState<string[]>(["Lab initialised. No external call has been placed."]);
  const [scenario, setScenario] = useState("New service enquiry");
  const [step, setStep] = useState(0);
  const [micState, setMicState] = useState("Not started");
  const current = personas.find((p) => p.id === selected) ?? personas[0];
  const filtered = useMemo(() => personas.filter((p) => filter === "All" || p.voice === filter), [filter]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  function log(message: string) { setEvents((old) => [new Date().toLocaleTimeString() + " · " + message, ...old].slice(0, 8)); }
  function speak(text: string) {
    if (!("speechSynthesis" in window)) { log("Speech synthesis is unavailable in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const matching = voices.find((v) => current.voice === "Female" ? /female|woman|samantha|victoria|zira|karen|moira|tessa|ava|susan/i.test(v.name) : current.voice === "Male" ? /male|man|daniel|alex|david|mark|james|george/i.test(v.name) : false);
    const english = voices.find((v) => /^en(-|_)/i.test(v.lang));
    utterance.voice = matching ?? english ?? null;
    utterance.rate = 0.96;
    utterance.pitch = current.voice === "Female" ? 1.08 : current.voice === "Male" ? 0.92 : 1;
    utterance.onstart = () => log("Playback started · " + (utterance.voice?.name ?? "browser default voice"));
    utterance.onend = () => log("Playback completed.");
    utterance.onerror = (e) => log("Playback error · " + e.error);
    window.speechSynthesis.speak(utterance);
  }
  const scenarioLines = [
    ["Receptionist", current.greeting],
    ["Caller", "I’d like to ask about your services and availability."],
    ["Receptionist", "Certainly. I can capture your enquiry and route it to the right team. What service are you interested in?"],
    ["Caller", "Could someone follow up with me?"],
    ["Receptionist", "Of course. I can prepare a message for the team. In this demo, no message is sent and no booking is made."],
  ];

  return (
    <main className="vpl-shell">
      <header className="vpl-top">
        <a href="/" className="vpl-brand">MINDREPLY <span>VOICE LAB</span></a>
        <div className="vpl-topright"><span className="vpl-dot" /> LOCAL BROWSER PREVIEW <a href="https://github.com/Mind-Reply/mindreply-app">SOURCE ↗</a></div>
      </header>
      <section className="vpl-hero">
        <div><p className="vpl-kicker">2027 RELEASE TRACK · VOICE OPERATIONS</p><h1>Reception, <em>reimagined.</em></h1><p className="vpl-lead">A focused voice bench for persona selection, spoken previews and receptionist-flow rehearsal. Pick a voice identity, hear a greeting, then step through a safe simulated call.</p></div>
        <div className="vpl-score"><span>PERSONA ROSTER</span><strong>23</strong><div><b>11</b> female-labelled <i /> <b>11</b> male-labelled <i /> <b>1</b> neutral</div><small>Voice output depends on voices installed in your browser/device.</small></div>
      </section>
      <section className="vpl-metrics"><div><span>01 / PERSONAS</span><b>23 defined</b><small>Names · roles · delivery styles</small></div><div><span>02 / SPEECH</span><b>Browser-native</b><small>Local preview only; no WaveNet connection yet</small></div><div><span>03 / CALL FLOW</span><b>Simulation</b><small>No telephony, bookings or outbound messages</small></div><div><span>04 / RELEASE GATE</span><b>Not verified</b><small>Build, provider and deployment checks remain</small></div></section>
      <section className="vpl-workspace">
        <aside className="vpl-roster">
          <div className="vpl-sectionhead"><div><p className="vpl-kicker">VOICE DIRECTORY</p><h2>Choose a persona</h2></div><span>23 / 23</span></div>
          <div className="vpl-filters">{["All","Female","Male","Neutral"].map((f) => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
          <div className="vpl-list">{filtered.map((p) => <button key={p.id} onClick={() => { setSelected(p.id); setTestText(p.greeting); setStep(0); }} className={"vpl-persona " + (selected === p.id ? "selected" : "")}><span className="vpl-avatar">{p.name.slice(0,1)}</span><span className="vpl-personainfo"><b>{p.name}</b><small>{p.role}</small></span><span className="vpl-gender">{p.voice === "Female" ? "F" : p.voice === "Male" ? "M" : "N"}</span></button>)}</div>
        </aside>
        <div className="vpl-detail">
          <div className="vpl-profile"><div className="vpl-profileicon">{current.name.slice(0,1)}</div><div><p className="vpl-kicker">{current.id} · SELECTED PERSONA</p><h2>{current.name}</h2><p>{current.role} <span> / </span> {current.style}</p></div><span className="vpl-pill">{current.voice}</span></div>
          <div className="vpl-panel"><div className="vpl-panelhead"><h3>Voice preview</h3><span>01 — LISTEN</span></div><label htmlFor="vpl-script">Greeting script</label><textarea id="vpl-script" value={testText} onChange={(e) => setTestText(e.target.value)} rows={3} maxLength={600}/><div className="vpl-actions"><button className="vpl-primary" onClick={() => speak(testText)}>▶ Play preview</button><button className="vpl-secondary" onClick={() => { window.speechSynthesis?.cancel(); log("Playback stopped by operator."); }}>Stop</button><span>{voices.length} device voices detected</span></div><p className="vpl-note">This uses your browser’s speech synthesis, not Google WaveNet. Available voices and gender matching vary by device.</p></div>
          <div className="vpl-panel"><div className="vpl-panelhead"><h3>Receptionist rehearsal</h3><span>02 — SIMULATE</span></div><label htmlFor="vpl-scenario">Test scenario</label><select id="vpl-scenario" value={scenario} onChange={(e) => { setScenario(e.target.value); setStep(0); }}><option>New service enquiry</option><option>Appointment request</option><option>Urgent request routing</option><option>After-hours message</option><option>Unknown question / safe fallback</option></select><div className="vpl-flow"><div className="vpl-flowstep done"><b>1</b><span>Greeting</span></div><div className={step >= 1 ? "vpl-flowstep done" : "vpl-flowstep"}><b>2</b><span>Clarify need</span></div><div className={step >= 2 ? "vpl-flowstep done" : "vpl-flowstep"}><b>3</b><span>Route or message</span></div><div className={step >= 3 ? "vpl-flowstep done" : "vpl-flowstep"}><b>4</b><span>Confirm next step</span></div></div><div className="vpl-transcript">{scenarioLines.slice(0, Math.min(5, step + 2)).map(([speaker, line], i) => <div key={i} className="vpl-line"><span>{speaker === "Caller" ? "CALLER" : current.name.toUpperCase()}</span><p>{speaker === "Receptionist" && i === 0 ? current.greeting : line}</p></div>)}</div><div className="vpl-actions"><button className="vpl-primary" onClick={() => { const next = Math.min(step + 1, 3); setStep(next); log(scenario + " · simulation step " + (next + 1)); speak(scenarioLines[Math.min(next * 2, scenarioLines.length - 1)][1]); }}>Next step →</button><button className="vpl-secondary" onClick={() => { setStep(0); setMicState("Not started"); log("Simulation reset."); }}>Reset</button><span>{step + 1} / 4 steps</span></div><p className="vpl-note">Scenario: {scenario}. Simulation only; no real caller, saved transcript, appointment, or message.</p></div>
          <div className="vpl-panel"><div className="vpl-panelhead"><h3>Runtime checks</h3><span>03 — OBSERVE</span></div><div className="vpl-checks"><div><span>Browser speech API</span><b>{typeof window !== "undefined" && "speechSynthesis" in window ? "Available" : "Check browser"}</b></div><div><span>Device voices</span><b>{voices.length ? "Loaded" : "Loading / unavailable"}</b></div><div><span>Microphone / live call</span><b>{micState}</b></div><div><span>WaveNet provider</span><b>Not connected</b></div><div><span>Integrity / CI evidence</span><b>Pending</b></div></div></div>
          <div className="vpl-panel"><div className="vpl-panelhead"><h3>Event trace</h3><span>LOCAL · EPHEMERAL</span></div><div className="vpl-events">{events.map((event, i) => <p key={i}>{event}</p>)}</div></div>
        </div>
      </section>
      <footer className="vpl-footer"><span>MINDREPLY · VOICE OPERATIONS / 2027</span><span>Preview environment · no production changes</span></footer>
      <style jsx global>{`
        .vpl-shell{--vb:#0b0e13;--vs:#111720;--vl:#ffffff16;--vi:#f0f3f8;--vm:#8792a4;--va:#9ac5ff;max-width:1440px;margin:0 auto;padding:0 34px 28px;color:var(--vi);font:14px/1.5 "IBM Plex Sans",system-ui,sans-serif;position:relative}
        .vpl-shell *{box-sizing:border-box}.vpl-top{height:76px;border-bottom:1px solid var(--vl);display:flex;align-items:center;justify-content:space-between}.vpl-brand{font-weight:800;letter-spacing:.12em;font-size:13px}.vpl-brand span{color:var(--va);margin-left:10px;font:10px "IBM Plex Mono",monospace}.vpl-topright{display:flex;gap:14px;align-items:center;color:var(--vm);font:10px "IBM Plex Mono",monospace;letter-spacing:.06em}.vpl-dot{width:7px;height:7px;background:#d8c08d;border-radius:50%}.vpl-hero{padding:60px 0 42px;display:grid;grid-template-columns:1fr 300px;gap:40px;align-items:end}.vpl-kicker{color:var(--va);font:10px "IBM Plex Mono",monospace;letter-spacing:.16em;margin:0 0 12px}.vpl-hero h1{font-size:clamp(42px,6vw,72px);line-height:.98;letter-spacing:-.055em;margin:0 0 18px;max-width:760px}.vpl-hero h1 em{font-style:normal;color:var(--va)}.vpl-lead{max-width:660px;color:#a4adbb;font-size:16px;line-height:1.8}.vpl-score{padding:22px;border:1px solid var(--vl);border-radius:14px;background:linear-gradient(145deg,#18202b,#0e1218)}.vpl-score>span,.vpl-metrics span{display:block;color:var(--vm);font:10px "IBM Plex Mono",monospace;letter-spacing:.1em}.vpl-score strong{display:block;font-size:64px;line-height:1.2;letter-spacing:-.06em}.vpl-score div{display:flex;gap:7px;align-items:center;flex-wrap:wrap;color:var(--vm);font-size:10px}.vpl-score b{color:var(--vi)}.vpl-score i{height:3px;width:3px;border-radius:50%;background:var(--va)}.vpl-score small{display:block;margin-top:14px;color:var(--vm);font-size:11px}.vpl-metrics{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--vl);border-radius:12px;margin-bottom:28px}.vpl-metrics>div{padding:18px 20px;border-right:1px solid var(--vl)}.vpl-metrics>div:last-child{border:0}.vpl-metrics b{display:block;margin:8px 0 3px;font-size:15px}.vpl-metrics small{color:var(--vm);font-size:11px}.vpl-workspace{display:grid;grid-template-columns:310px minmax(0,1fr);gap:26px;align-items:start}.vpl-roster,.vpl-panel{border:1px solid var(--vl);border-radius:12px;background:#ffffff03}.vpl-roster{overflow:hidden;position:sticky;top:12px}.vpl-sectionhead,.vpl-panelhead{padding:18px 20px;border-bottom:1px solid var(--vl);display:flex;align-items:center;justify-content:space-between;gap:12px}.vpl-sectionhead h2,.vpl-profile h2{font-size:19px;margin:0;letter-spacing:-.03em}.vpl-sectionhead>span,.vpl-panelhead>span{color:var(--vm);font:9px "IBM Plex Mono",monospace}.vpl-sectionhead .vpl-kicker{margin-bottom:6px}.vpl-filters{padding:12px 14px;display:flex;gap:5px;border-bottom:1px solid var(--vl)}.vpl-shell button,.vpl-shell select,.vpl-shell textarea{font:inherit}.vpl-filters button,.vpl-secondary{background:transparent;border:1px solid var(--vl);border-radius:7px;padding:7px 10px;color:#aeb8c7;cursor:pointer}.vpl-filters button.active{background:#9ac5ff18;border-color:#9ac5ff66;color:var(--va)}.vpl-list{max-height:690px;overflow:auto;padding:5px}.vpl-persona{display:flex;width:100%;align-items:center;text-align:left;gap:10px;border:1px solid transparent;background:transparent;padding:10px;border-radius:8px;color:var(--vi);cursor:pointer}.vpl-persona:hover{background:#ffffff07}.vpl-persona.selected{background:#9ac5ff0d;border-color:#9ac5ff4d}.vpl-avatar,.vpl-profileicon{display:grid;place-items:center;flex:none;background:#202b39;border:1px solid #ffffff16;border-radius:9px;color:var(--va);font-weight:700}.vpl-avatar{width:34px;height:34px}.vpl-personainfo{display:flex;flex-direction:column;flex:1;min-width:0}.vpl-personainfo b{font-size:12px}.vpl-personainfo small{color:var(--vm);font-size:10px}.vpl-gender{font:10px "IBM Plex Mono",monospace;color:var(--vm);border:1px solid var(--vl);border-radius:5px;padding:3px 5px}.vpl-detail{display:grid;gap:16px;min-width:0}.vpl-profile{display:flex;align-items:center;gap:15px;padding:8px 2px 14px}.vpl-profileicon{width:58px;height:58px;font-size:22px;border-radius:13px}.vpl-profile h2{font-size:28px}.vpl-profile p:last-child{margin:3px 0 0;color:var(--vm);font-size:12px}.vpl-profile p span{color:#4c5b70}.vpl-pill{margin-left:auto;border:1px solid var(--vl);border-radius:20px;padding:5px 10px;color:var(--vm);font-size:10px}.vpl-panel{overflow:hidden}.vpl-panelhead{padding:15px 18px}.vpl-panelhead h3{font-size:13px;margin:0;font-weight:650}.vpl-panel label{display:block;margin:16px 18px 7px;color:var(--vm);font-size:11px}.vpl-panel textarea,.vpl-panel select{display:block;width:calc(100% - 36px);margin:0 18px;padding:12px;border:1px solid var(--vl);border-radius:8px;background:#0a0d12;color:var(--vi);resize:vertical;outline-offset:2px}.vpl-panel textarea:focus,.vpl-panel select:focus{outline:1px solid var(--va)}.vpl-panel select{max-width:430px}.vpl-actions{display:flex;align-items:center;gap:9px;flex-wrap:wrap;padding:14px 18px 0}.vpl-primary{background:var(--va);color:#0b121b;border:0;border-radius:7px;padding:10px 14px;font-weight:700;cursor:pointer}.vpl-secondary{padding:9px 13px}.vpl-actions>span{color:var(--vm);font-size:10px;margin-left:auto}.vpl-note{margin:12px 18px 17px;color:var(--vm);font-size:11px;line-height:1.7}.vpl-flow{display:grid;grid-template-columns:repeat(4,1fr);padding:18px;gap:8px}.vpl-flowstep{display:flex;align-items:center;gap:7px;color:var(--vm);font-size:10px}.vpl-flowstep b{width:23px;height:23px;display:grid;place-items:center;border:1px solid var(--vl);border-radius:50%;font:10px "IBM Plex Mono",monospace}.vpl-flowstep.done b{background:#9ac5ff1b;border-color:#9ac5ff88;color:var(--va)}.vpl-transcript{margin:0 18px;border:1px solid var(--vl);border-radius:8px;padding:5px 13px}.vpl-line{padding:11px 0;border-bottom:1px solid var(--vl)}.vpl-line:last-child{border-bottom:0}.vpl-line span{font:9px "IBM Plex Mono",monospace;color:var(--va);letter-spacing:.1em}.vpl-line p{margin:4px 0 0;color:#c8d0dc;font-size:12px}.vpl-checks{padding:5px 18px}.vpl-checks div{display:flex;justify-content:space-between;gap:20px;padding:10px 0;border-bottom:1px solid var(--vl);font-size:11px}.vpl-checks div:last-child{border-bottom:0}.vpl-checks span{color:var(--vm)}.vpl-checks b{font-weight:550;text-align:right}.vpl-events{padding:10px 18px 14px}.vpl-events p{font:10px "IBM Plex Mono",monospace;color:#a8b5c6;border-bottom:1px solid #ffffff0b;padding:7px 0;margin:0}.vpl-footer{display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--vl);margin-top:36px;padding-top:18px;color:var(--vm);font:9px "IBM Plex Mono",monospace;letter-spacing:.06em}
        @media(max-width:900px){.vpl-shell{padding:0 18px 24px}.vpl-hero{grid-template-columns:1fr;gap:22px;padding-top:42px}.vpl-score{max-width:none}.vpl-metrics{grid-template-columns:repeat(2,1fr)}.vpl-metrics>div:nth-child(2){border-right:0}.vpl-metrics>div:nth-child(-n+2){border-bottom:1px solid var(--vl)}.vpl-workspace{grid-template-columns:1fr}.vpl-roster{position:static}.vpl-list{max-height:330px}.vpl-topright{font-size:8px;gap:8px}.vpl-flow{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.vpl-top{height:62px}.vpl-topright{max-width:155px;flex-wrap:wrap;justify-content:flex-end}.vpl-hero h1{font-size:43px}.vpl-metrics>div{padding:13px}.vpl-metrics small{font-size:10px}.vpl-flow{grid-template-columns:1fr 1fr}.vpl-footer{flex-direction:column}}
      `}</style>
    </main>
  );
}
