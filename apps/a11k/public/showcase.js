(() => {
  const root = document.getElementById('app');
  document.title = 'A11-K · Owner Showcase';
  const regions = [
    ['EU-27','27 countries','AI Act + sovereignty'],
    ['USA','50 states','Federal/state split'],
    ['Asia','48 markets','AI + infrastructure'],
  ];
  const signals = [
    {k:'EU', title:'AI governance is live', meta:'CONFIRMED · 02 AUG 2026', text:'Transparency and governance obligations are now an operating concern, not a future planning item.', tag:'REGULATORY'},
    {k:'SG', title:'Agentic systems move toward governed deployment', meta:'CONFIRMED · 2026', text:'Singapore is strengthening governance, cloud/cybersecurity requirements and AI infrastructure capacity.', tag:'OPPORTUNITY'},
    {k:'IN', title:'AI compute capacity keeps scaling', meta:'CONFIRMED · 2026', text:'India is expanding data-centre, AI-compute and sovereign capability.', tag:'MARKET'},
    {k:'AE', title:'UAE accelerates AI positioning', meta:'EMERGING · 2026', text:'Advanced-technology access and national agentic-AI initiatives improve the strategic outlook.', tag:'STRATEGY'},
  ];
  const queue = [
    ['🇸🇬 Singapore','Agentic-AI governance','HIGH','Verify policy → position governed operations'],
    ['🇮🇳 India','AI infrastructure expansion','HIGH','Map enterprise/partner opportunities'],
    ['🇪🇺 EU-27','Sovereignty + portability','HIGH','Prepare portable, auditable deployment story'],
    ['🇺🇸 USA','State-by-state AI rules','HIGH','Keep compliance modules jurisdiction-aware'],
    ['🇦🇪 UAE','AI infrastructure + government','MEDIUM','Track procurement and partnership openings'],
  ];
  const css = `
  :root{--ink:#edf3f7;--muted:#8fa0ab;--line:rgba(255,255,255,.09);--panel:rgba(12,22,28,.78);--accent:#75a7ff;--good:#43d6a2;--warn:#ffb44a;--danger:#ff6f7d;}
  *{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 80% 10%,rgba(117,167,255,.13),transparent 30%),radial-gradient(circle at 10% 40%,rgba(67,214,162,.08),transparent 35%),#071016;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .a11k{min-height:100vh}.top{position:sticky;top:0;z-index:5;background:rgba(7,16,22,.86);backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.topin{max-width:1400px;margin:auto;padding:18px 28px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.08em}.mark{width:26px;height:26px;border-radius:8px;background:conic-gradient(from 210deg,var(--accent),#9f86ff,var(--good),var(--accent));box-shadow:0 0 28px rgba(117,167,255,.28)}.live{display:flex;align-items:center;gap:8px;color:#b9c7ce;font-size:12px;text-transform:uppercase;letter-spacing:.14em}.dot{width:8px;height:8px;border-radius:50%;background:var(--good);box-shadow:0 0 14px var(--good)}
  .hero{max-width:1400px;margin:auto;padding:72px 28px 38px;display:grid;grid-template-columns:1.2fr .8fr;gap:32px;align-items:end}.eyebrow{color:#8fb0c5;text-transform:uppercase;letter-spacing:.2em;font-size:11px;margin-bottom:16px}.hero h1{font-size:clamp(48px,7vw,92px);line-height:.92;margin:0;letter-spacing:-.055em;max-width:800px}.serif{font-family:Georgia,serif;font-weight:400;font-style:italic}.hero p{color:var(--muted);font-size:18px;line-height:1.6;max-width:700px}.heroActions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.btn{border:1px solid rgba(117,167,255,.38);background:rgba(117,167,255,.12);color:#e9f3ff;padding:11px 16px;border-radius:12px;font-weight:700;cursor:pointer}.btn.alt{background:transparent;border-color:var(--line);color:#b7c4cb}.orbit{min-height:280px;border:1px solid var(--line);border-radius:30px;background:linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015));display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.orbit:before,.orbit:after{content:"";position:absolute;border:1px solid rgba(117,167,255,.2);border-radius:50%}.orbit:before{width:240px;height:240px}.orbit:after{width:160px;height:160px}.core{width:100px;height:100px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#bcd4ff,#536a9e 45%,#101b2c 70%);box-shadow:0 0 60px rgba(117,167,255,.24);z-index:2;text-align:center}.core b{display:block;font-size:18px}.core small{font-size:8px;letter-spacing:.18em;color:#dbe5ef}
  .wrap{max-width:1400px;margin:auto;padding:18px 28px 70px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;padding:20px}.metric{font-size:34px;font-weight:800}.metric span{display:block;color:var(--muted);font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-top:6px}.regionGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.region{padding:20px;border:1px solid var(--line);border-radius:18px;background:rgba(255,255,255,.025)}.region b{font-size:24px}.region p{color:var(--muted);margin:.5rem 0 0}.sec{display:flex;justify-content:space-between;align-items:end;margin:34px 0 14px}.sec h2{margin:0;font-size:28px;letter-spacing:-.03em}.sec span{color:var(--muted);font-size:12px}.signals{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.signal{padding:22px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015))}.badge{display:inline-flex;padding:6px 8px;border-radius:999px;background:rgba(67,214,162,.09);color:#89e5c0;font-size:10px;letter-spacing:.12em;font-weight:800;margin-bottom:12px}.signal h3{margin:0 0 8px;font-size:21px}.signal p{margin:0;color:var(--muted);line-height:1.55}.meta{margin-top:14px;color:#70808a;font-size:10px;letter-spacing:.1em}.queue{display:grid;gap:10px}.qrow{display:grid;grid-template-columns:1.2fr 1.2fr .45fr 2fr;gap:12px;align-items:center;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.02);font-size:13px}.qrow b{color:#e8f0f4}.priority{font-weight:800;color:#ffd27a}.action{color:#aebdc5}.footer{border-top:1px solid var(--line);padding:24px 28px;color:#6f7d84;font-size:11px;letter-spacing:.08em;text-transform:uppercase}.toast{position:fixed;right:22px;bottom:22px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:#0d1a21;box-shadow:0 18px 50px rgba(0,0,0,.35);display:none}.toast.on{display:block}@media(max-width:900px){.hero{grid-template-columns:1fr}.grid{grid-template-columns:repeat(2,1fr)}.signals,.regionGrid{grid-template-columns:1fr}.qrow{grid-template-columns:1fr 1fr}.orbit{min-height:220px}}@media(max-width:560px){.topin,.hero,.wrap{padding-left:18px;padding-right:18px}.grid{grid-template-columns:1fr}.hero{padding-top:42px}.hero h1{font-size:52px}.qrow{grid-template-columns:1fr}.sec{display:block}.sec span{display:block;margin-top:5px}}
  `;
  const html = `
  <div class="a11k"><style>${css}</style>
    <header class="top"><div class="topin"><div class="brand"><span class="mark"></span>A11-K / SHOWCASE</div><div class="live"><span class="dot"></span>LIVE SURFACE · OWNER-GATED</div></div></header>
    <main>
      <section class="hero"><div><div class="eyebrow">Owner control plane · regional intelligence · proof before amplification</div><h1>See the field.<br><span class="serif">Decide the move.</span></h1><p>A11-K is the conversation and evidence surface for the MindReply estate: live signals, regional opportunities, release posture, proof and explicit approval in one operating view.</p><div class="heroActions"><button class="btn" id="scan">Run signal scan</button><button class="btn alt" id="proof">Open proof view</button></div></div><div class="orbit"><div class="core"><div><b>A11-K</b><small>OWNER CORE</small></div></div></div></section>
      <section class="wrap">
        <div class="grid">
          <div class="panel"><div class="metric">EU-27</div><span>covered markets</span></div>
          <div class="panel"><div class="metric">USA</div><span>50-state watch</span></div>
          <div class="panel"><div class="metric">48</div><span>Asian markets</span></div>
          <div class="panel"><div class="metric">0</div><span>unsupported whispers published</span></div>
        </div>
        <div class="sec"><div><div class="eyebrow">Regional field</div><h2>Three operating lenses.</h2></div><span>Country records roll up here.</span></div>
        <div class="regionGrid">${regions.map(r=>`<div class="region"><div class="eyebrow">${r[0]}</div><b>${r[1]}</b><p>${r[2]}</p></div>`).join('')}</div>
        <div class="sec"><div><div class="eyebrow">Verified signal layer</div><h2>What changed.</h2></div><span>Announcements use confirmed evidence only.</span></div>
        <div class="signals">${signals.map(s=>`<article class="signal"><span class="badge">${s.tag}</span><h3>${s.k} · ${s.title}</h3><p>${s.text}</p><div class="meta">${s.meta}</div></article>`).join('')}</div>
        <div class="sec"><div><div class="eyebrow">Action queue</div><h2>What we do now.</h2></div><span>Signals stay separate from rumors.</span></div>
        <div class="queue">${queue.map(q=>`<div class="qrow"><b>${q[0]}</b><span>${q[1]}</span><span class="priority">${q[2]}</span><span class="action">${q[3]}</span></div>`).join('')}</div>
      </section>
    </main>
    <footer class="footer">A11-K · MINDREPLY · EVIDENCE-GATED · HUMAN-ACCOUNTABLE</footer><div id="toast" class="toast"></div>
  </div>`;
  root.innerHTML = html;
  const toast = t => { const el=document.getElementById('toast'); el.textContent=t; el.classList.add('on'); setTimeout(()=>el.classList.remove('on'),2200); };
  document.getElementById('scan').onclick=()=>toast('Signal scan queued for owner review');
  document.getElementById('proof').onclick=()=>toast('Proof view: confirmed sources only');
})();