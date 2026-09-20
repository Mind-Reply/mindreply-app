# Elysium Frontend Brief — v0 & Lovable Templates

**Purpose:** Production-grade visual redesign of each public surface, mapped to Elysium layers.  
**Related:** Epic #38, Visual Frontiers #27, packages aurelia / lumenforge / veridex.

## Recommendation matrix

| Surface | Domain | Elysium layer | Prefer | Why |
|---------|--------|---------------|--------|-----|
| mindreply.com | Corporate + €3k CTA | Core + commercial | **v0** | Enterprise marketing + conversion; needs precise layout, typography, proof blocks |
| a11-k.space | Estate command | Core routing | **v0** | Shared shell, multi-route IA, accessibility |
| chat.a11-k.space | Objective briefs | **Aurelia** | **v0** then Lovable polish | Local-first UX; complex form + history; v0 for structure |
| nexus.a11-k.space | Decision topology | **Veridex** | **v0** | Graph/topology visualization + proof gates |
| forge.a11-k.space | Release manifests | **Lumenforge** | **v0** | Gate states, checklists, rollback UX |
| studio.a11-k.space | Narrative production | **Aurelia** | **Lovable** or v0 | Narrative canvas; Lovable strong for rapid visual iteration |
| Operator / Elysium status | Internal | All layers | **v0** | Dense status + contract inspector |

**Rule of thumb**
- Use **v0** when the surface is enterprise-facing, multi-route, or needs WCAG-tight components and real Next.js export.
- Use **Lovable** when you need fast visual exploration of a single-screen canvas (Studio narrative, experimental marketing).
- Always re-integrate into this monorepo; do not leave production only on hosted builder URLs.

---

## Layer → surface mapping (runtime truth)

```
Intent (Aurelia)     → Chat compose + Studio narrative
Contract (Lumenforge)→ Forge proof gates + /api/elysium/gate
Ledger (Veridex)     → Nexus topology evidence + envelope receipts
Core control         → mindreply.com CTA + a11-k.space routing + status API
```

---

## v0 prompts (copy into v0)

### 1. mindreply.com — Corporate presence
```
Enterprise dark marketing site for MindReply. Proof-bearing intelligence systems.
Hero: "Make intelligence answerable to the work." Primary CTA books a €3,000
seven-day GitHub+Python audit (external Stripe). Secondary link to a11-k.space.
Sections: Estate cards (Crownwork, A11-K, Repository Clarity), Operating principles
(Proof before permission, Human command visible, Private machinery private),
Elysium Stack (Aurelia / Lumenforge / Veridex) as three compact cards.
No generic AI gradients. High contrast WCAG AA. Desktop + 390px. Next.js App Router.
```

### 2. a11-k.space — Estate command
```
Dark estate command hub routing to Chat, Nexus, Forge, Studio. Distinctive,
minimal, high-signal. Show purpose of each platform in one sentence. Status chip
"EVIDENCE-GATED · HUMAN-ACCOUNTABLE". No fake live agent counters. Responsive.
```

### 3. chat.a11-k.space — Aurelia intent surface
```
Local-first objective brief workspace. Compose: objective, verified context,
proof standard, authority line. Local history only. Explicit boundary: no model
call simulated. Map UI copy to "Aurelia — intent capture". Export/copy brief.
Desktop + mobile. Keyboard accessible.
```

### 4. nexus.a11-k.space — Veridex topology
```
Decision topology surface. Compose route from scenario + lens. Show visible cells,
proof gates, single human decision node. Label as "Veridex-aligned routing plan"
— plan only, no dispatch. Clean node grid, no decorative dashboard noise.
```

### 5. forge.a11-k.space — Lumenforge gates
```
Release engineering workspace. Manifest builder + proof gate checklist
(Evidence, Security, Ownership, Rollback, Observability, Approval).
Map to "Lumenforge — quality as executable law". Manifest is not approval.
Markdown export. Reversible-by-design language throughout.
```

### 6. studio.a11-k.space — Aurelia narrative
```
Narrative production: positioning, verified proof, explicit boundary, one action.
Preview + copy markdown. "Clarity before amplification." Prefer calm editorial
layout. Suitable for Lovable rapid visual pass then export to static/Next.
```

---

## Lovable prompts (optional rapid pass)

Use Lovable for **Studio** and **experimental marketing** first:

```
Build a single-page dark editorial narrative studio for A11-K.
Fields: Positioning, Verified proof, Explicit boundary, One action.
Live markdown preview. Copy button. Footer: PROOF · BOUNDARY · ACTION.
No backend. Mobile responsive.
```

Do **not** use Lovable as the system of record for mindreply.com conversion path until design is ported into `apps/web-replycontrol`.

---

## Integration checklist (after v0 / Lovable)

- [ ] Export or rebuild into monorepo apps/*
- [ ] Preserve Stripe CTA URL exactly
- [ ] Desktop + 390px screenshots attached to PR
- [ ] Keyboard + contrast check
- [ ] No fake "agents running" or unverified claims
- [ ] Link Elysium status: `/api/elysium/status` only on operator-safe surfaces
- [ ] Owner approval before production domain switch

## Current code state (pre-v0)

Static HTML shells exist under `apps/a11k-*`. web-replycontrol has Next page + Elysium section + gate APIs. This brief is the handoff for Visual Frontiers (#27) execution with v0/Lovable.
