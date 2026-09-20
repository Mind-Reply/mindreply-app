# Command Atelier — Enterprise Visual Frontier

Issue: #27

## Direction

Command Atelier is not another dark AI dashboard. It is an operating environment with editorial authority, spatial intelligence, and visible evidence.

The estate should feel like a world-class command instrument assembled from six distinct rooms. Each room has its own geometry, tempo, and interaction model while sharing one unmistakable institutional identity.

## Shared visual grammar

### Materials

- **Obsidian field:** `#070809` — the working plane, never a decorative gradient.
- **Mineral paper:** `#ECEAE4` — high-contrast editorial moments and evidence panels.
- **Cobalt signal:** `#4169FF` — active decisions, links, focus, and trusted motion.
- **Volt marker:** `#C8FF3D` — sparse status and approval accents only.
- **Oxide warning:** `#FF5A44` — risk, stop rules, and failed gates.
- **Graphite line:** `rgba(236,234,228,.14)` — architecture, not decoration.

### Typography

- Display: compressed, editorial grotesk with severe scale changes.
- Interface: neutral grotesk with clear numerals.
- Evidence: monospaced labels and provenance trails.
- Never render an entire interface in monospace or all caps.

### Composition

- Asymmetric editorial grids rather than centered hero templates.
- One dominant visual statement per viewport.
- Operational rails, evidence drawers, and spatial maps instead of generic cards.
- Deliberate negative space and large type balanced by dense, useful instrumentation.
- Borders represent relationships or containment; never add boxes without meaning.

### Motion

- Motion explains state: routing, passage, approval, evidence, or rollback.
- Use directional wipes, line tracing, controlled parallax, and state interpolation.
- No floating blobs, random particles, perpetual orbit animations, or glowing decoration.
- Every animation has a reduced-motion equivalent.

## Six distinct rooms

### MindReply — The Institution

A board-level editorial presence. The opening viewport behaves like a live operating thesis, not a startup landing page. Commercial entry is quiet, direct, and evidence-led.

### A11-K — The Atlas

A spatial estate map. The four products are territories connected through an animated topology. Navigation is geographic and purposeful—not a row of product cards.

### Chat — The Briefing Chamber

A focused drafting table. The objective, evidence, authority line, and proof standard occupy distinct planes. Local state is visible and controllable.

### Nexus — The Decision Observatory

A real topology interface. Agent groups, gates, queued/running states, and human decision points are represented accurately. Never imply that queued fleet slots are live.

### Forge — The Release Foundry

A passage system where a release physically moves through evidence, security, ownership, observability, rollback, and approval gates.

### Studio — The Signal Press

A visual editorial workspace. Positioning, proof, boundaries, composition, preview, and export behave like an intelligent publication desk.

## Product rules

1. No dead control, placeholder navigation, or simulated backend response.
2. Every public claim must map to evidence or be marked as intention.
3. Local-only behavior must be visibly local-only.
4. Destructive, external, paid, or production actions require an explicit owner gate.
5. Desktop and mobile are separate compositions, not automatic shrinkage.
6. A platform is not ready until its deployed preview has been inspected.

## Technical strategy

- `apps/web-replycontrol`: Next.js 16 / React 19 implementation.
- A11-K surfaces: v0 produces reusable React compositions; implementation may remain static only if interaction and accessibility parity are preserved.
- Each platform remains independently deployable on Vercel.
- Shared tokens may be duplicated at build time, but no subdomain may depend on a production-domain stylesheet for preview rendering.
- No token, credential, private endpoint, or internal control logic may enter v0 prompts or generated code.
