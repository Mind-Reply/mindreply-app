# 2027 Voice Persona Lab — implementation notes

## Route
- Preview route: `/voice-lab`
- Canonical repository: `Mind-Reply/mindreply-app`
- Working branch: `feat/voice-personas-2027`

## Included in this change
- A 23-entry persona directory with distinct names, role labels, and delivery styles.
- Filters for female-labelled, male-labelled, neutral, and all personas.
- Editable greeting text and browser-native speech preview.
- A five-turn scripted receptionist rehearsal with selectable scenarios and step controls.
- Local event trace and runtime/provider status panel.
- No telephony, outbound contact, booking, persistence, or production configuration changes.

## Voice provider boundary
The current preview uses the browser's `SpeechSynthesis` API and installed device voices. It is **not a Google WaveNet integration** and does not establish that any particular 2027 model is available. Browser voice names are not a reliable gender classification, so the voice matching is best-effort. Provider integration should be added behind a server-side adapter after the selected provider, credentials mechanism, privacy handling, and quota controls are approved.

## Release gates still required
1. Run frozen-lockfile install, typecheck/lint, tests, and production build on this branch.
2. Fix any integration errors revealed by those checks.
3. Validate route in a preview deployment and run a browser smoke test on desktop and mobile.
4. Validate speech API availability, no-voice fallback, stop/cancel behavior, and accessibility.
5. Add deterministic tests for scenario progression and safe failure behavior.
6. Integrate a real speech provider only after confirming the chosen provider and its supported voice catalogue.
7. Verify deployment evidence before describing the route as live.

## Current status
Implementation files have been committed to the feature branch. CI/build, browser smoke, provider integration, and deployment are not yet verified. Do not merge or claim production readiness until the checks above pass and the owner reviews the evidence.
