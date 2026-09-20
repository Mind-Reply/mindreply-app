# Marketing Measurement Plan

## Measurement status

Event names and reporting logic are defined. No analytics connection or live data is claimed here.

## Funnel events

| Event | Trigger | Safe properties |
|---|---|---|
| `marketing_page_view` | Approved marketing page loads | `page`, `environment` |
| `marketing_cta_click` | User selects a CTA | `cta_name`, `page`, `destination` |
| `access_form_start` | User focuses the access form | `page`, `form_name` |
| `access_form_submit` | Verified form succeeds | `form_name`, `source`, `campaign` |
| `access_form_error` | Form returns a user-visible error | `form_name`, `error_type` |

Do not send message text, email addresses, audio, identifiers, or other sensitive data as analytics properties.

## UTM convention

Use lowercase values:

* `utm_source`: channel or publisher, such as `google`, `meta`, `linkedin`, `newsletter`.
* `utm_medium`: `cpc`, `paid-social`, `organic-social`, `email`, `community`.
* `utm_campaign`: stable campaign slug, such as `natural-interface-launch`.
* `utm_content`: creative or variant slug, such as `voice-first-a`.
* `utm_term`: paid search term where applicable.

Example structure:

`https://verified-production-domain.example/?utm_source=google&utm_medium=cpc&utm_campaign=natural-interface-launch&utm_content=voice-first-a`

Replace the example domain before use.

## Reporting cadence

* Daily during the first controlled test: spend, delivery, errors, and destination health.
* Weekly: qualified visits, CTA rate, access intent, activation, and creative learning.
* After each experiment: hypothesis, result, confidence, decision, and next test.

## KPI definitions

* **Qualified visit:** a visit that reaches the intended page and meets the agreed quality rule.
* **CTA rate:** CTA clicks divided by qualified visits.
* **Access intent:** verified access-form starts or equivalent approved action.
* **Activation:** the first confirmed product action, defined only after the product flow is live.
* **CAC:** total approved acquisition cost divided by the agreed acquisition event.

Do not report these metrics until their source, window, attribution rule, and data quality are known.
