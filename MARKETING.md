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

## Working assumptions

* A11-K is a voice-first AI companion surface designed for natural, calm interaction.
* Copy must describe the intended experience without promising unverified performance, availability, privacy, security, or outcomes.
* No advertising spend, public signup, tracking, or production claim should be activated until the corresponding destination and owner-controlled configuration are verified.
* The public brand should not expose private owner details or internal infrastructure.

## Documents

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

## Current release state

The repository now contains the initial marketing system and a static preview concept. This is not a statement that the production site, campaigns, signup flow, or SEO indexing are live.
