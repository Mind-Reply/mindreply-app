# Landing-Page Design Specification

## Purpose

Create a calm, focused introduction to A11-K without pretending that the production product or access flow is already live.

## Page structure

### 1. Header

* A11-K mark and wordmark.
* Navigation: Experience, Principles, Launch.
* Single high-contrast CTA.
* On small screens, keep the navigation compact and keyboard accessible.

### 2. Hero

* Small label: “A voice-first companion surface”.
* Headline: “Speak naturally. Think clearly.”
* One short paragraph explaining the intended experience.
* Primary CTA connected only when a verified access destination exists.
* Secondary link to the experience section.
* Abstract mark or quiet waveform-inspired graphic, never a fake product screenshot.

### 3. Use-case strip

Present three exploratory use cases:

* Think out loud.
* Shape an idea.
* Find the next step.

Use “explore” language rather than promising a particular outcome.

### 4. Experience principles

Three cards:

* **Natural first:** conversation can begin before the perfect wording exists.
* **Calm by design:** the interface gives the thought room to develop.
* **Your direction:** the user decides the purpose and the next move.

### 5. Product walkthrough

Use real screenshots only after the corresponding production flows are verified. Until then, use labelled concept panels:

* Voice entry
* Conversation thread
* Thought-to-next-step transition

### 6. Trust and clarity

Explain what is known, what is being developed, and how access works. Do not add privacy, security, accuracy, or availability language without current evidence.

### 7. Access CTA

* State the access model clearly.
* Provide a working form or verified destination.
* Include consent and contact expectations.
* Show a useful confirmation state.
* Do not collect personal data in a concept preview.

### 8. Footer

* A11-K and MindReply.
* Contact route.
* Privacy and terms links once published and reviewed.
* Copyright and current version.

## Responsive behaviour

* Mobile-first layout with one-column content.
* Keep the hero readable without requiring horizontal scrolling.
* Preserve focus order and touch-target size.
* Avoid autoplay audio or video.
* Test at narrow mobile, tablet, laptop, and wide desktop widths.

## SEO requirements

* One descriptive `<h1>`.
* Unique title and meta description.
* Canonical URL only after the production domain is verified.
* Open Graph and social image with accurate copy.
* `robots` set to `noindex, nofollow` for the concept preview.
* Sitemap and indexable structured data only for the approved production site.

## Measurement requirements

Before production activation, define and test:

* `marketing_page_view`
* `marketing_cta_click`
* `access_form_start`
* `access_form_submit`
* `access_form_error`

Record consent state and avoid sending message text or other sensitive content as analytics properties.
