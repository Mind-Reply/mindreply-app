# A11-K Marketing System

> Brand, creative, campaign, SEO, design, and measurement foundation for A11-K.

**Owner:** Angel Krastev (`angellllkr-eng`)  
**Builder:** MindReply  
**Status:** Foundation created; the marketing site is a concept preview. Production availability, analytics, signup flow, and campaign activation are not yet verified.

## Scope

This workstream is intentionally separate from the paused chat implementation. It covers:

* Brand platform and public-safe messaging
* Visual direction and reusable design rules
* Landing-page and campaign concepts
* Advertising copy and creative territories
* SEO structure and content planning
* Launch operations, measurement, and approval gates
* Evidence-led lead diagnostics, regional funnels, events and RSVP operations, verified billing handoff, and operational failure controls

## Working assumptions

* A11-K is a voice-first AI companion surface designed for natural, calm interaction.
* Copy must describe the intended experience without promising unverified performance, availability, privacy, security, or outcomes.
* No advertising spend, public signup, tracking, or production claim should be activated until the corresponding destination and owner-controlled configuration are verified.
* The public brand should not expose private owner details or internal infrastructure.
* Competitor claims must be sourced and dated; estimates and hypotheses must be labelled. No synthetic testimonials, customer counts, revenue, conversion, or performance evidence.
* Outbound messaging, event invitations, analytics, and retargeting must respect consent, regional law, opt-outs, suppression lists, and approved budgets.

## Documents

* [HighStrike Campaign Orchestrator](docs/HIGHSTRIKE_CAMPAIGN_ORCHESTRATOR.md) — operational pipeline, regional funnels, diagnostic outreach, event/RSVP controls, Stripe handoff, webhook security, durable audit requirements, escalation, stop conditions, and release gates.
* [Brand platform](marketing/brand/brand-platform.md)
* [Messaging system](marketing/brand/messaging.md)
* [Visual system](marketing/brand/visual-system.md)
* [Landing-page design](marketing/design/landing-page-spec.md)
* [Launch campaign brief](marketing/campaigns/launch-brief.md)
* [Advertising copy](marketing/campaigns/ad-copy.md)
* [SEO strategy](marketing/seo/strategy.md)
* [Content calendar](marketing/operations/content-calendar.md)
* [Measurement plan](marketing/operations/measurement.md)
* [Preview site](marketing/site/index.html)

## Live-release sequence

1. Confirm the product experience, audience, public domain, support route, and access model.
2. Connect and verify the signup destination and consent language.
3. Add analytics only after the event taxonomy and privacy approach are approved.
4. Run accessibility, responsive, metadata, link, and performance checks.
5. Deploy a preview and inspect it on mobile and desktop.
6. Approve final copy and creative.
7. Deploy the production site under the owner-controlled domain.
8. Verify the production URL, canonical tags, sitemap, redirects, forms, and analytics events.
9. Activate campaigns with controlled budgets and UTMs.
10. Review results before expanding distribution.

## Activation gates

Before a HighStrike campaign can be activated, the team must verify the live regional URL, a working server-side intake, consent/opt-out enforcement, evidence and claim review, approved offer and budget, end-to-end attribution, payment/webhook reconciliation where applicable, a tested pause/escalation route, and a named owner. Drafts, repository files, previews, and successful builds do not prove live operation.

## Current release state

The repository contains the initial marketing system and a static preview concept. The HighStrike specification documents the target operating model and the existing gaps; it does not claim that production campaigns, signup capture, event operations, immutable storage, analytics, or escalation are live.
