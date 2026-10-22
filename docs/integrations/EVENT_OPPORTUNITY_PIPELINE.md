# Event Opportunity Pipeline — Integration Contract

**Status:** DESIGN COMMITTED FOR REVIEW — not a running integration.  
**Owner repository:** `Mind-Reply/mindreply-app`  
**Tracking issue:** [#112](https://github.com/Mind-Reply/mindreply-app/issues/112)

## Purpose

Connect premium event discovery to the existing Creator, Recruitment, PR & Events operations pipeline without creating a second event database or implying a relationship with any discovery provider.

Seat Unique is a hospitality discovery source. Access to its connected discovery tools does not, by itself, grant a public API contract, affiliate rights, booking write access, or permission to claim a partnership.

## Provider-neutral record

Use one normalized record regardless of source. This is a proposed contract, not a database migration.

```ts
type OpportunityStage =
  | "DISCOVERED"
  | "RESEARCHING"
  | "QUALIFIED"
  | "PROPOSAL_DRAFT"
  | "AWAITING_OWNER_APPROVAL"
  | "APPROVED_FOR_EXECUTION"
  | "IN_EXECUTION"
  | "DELIVERED"
  | "EVIDENCE_REVIEW"
  | "CLOSED"
  | "DECLINED"
  | "BLOCKED";

type RelationshipStatus =
  | "UNCONTACTED"
  | "CONTACT_STAGED"
  | "COUNTERPART_CONFIRMED"
  | "CONTRACTED";

interface EventOpportunity {
  id: string;
  source: {
    provider: string;
    sourceUrl: string;
    retrievedAt: string; // ISO 8601
    sourceRecordId?: string;
  };
  event: {
    title: string;
    category?: "sport" | "music" | "theatre" | "culture" | "other";
    startsAt?: string; // ISO 8601 with timezone when known
    endsAt?: string;
    venue?: string;
    locality?: string;
    country?: string;
  };
  offer?: {
    title?: string;
    priceMinor?: number;
    currency?: string; // ISO 4217; never infer if absent
    inclusions?: string[];
    bookingUrl?: string;
    availabilityCheckedAt?: string;
  };
  fit: {
    targetBrand: string;
    objective: string;
    audienceRationale: string;
    proposedActivity?: string;
  };
  workflow: {
    stage: OpportunityStage;
    relationship: RelationshipStatus;
    owner: string;
    nextAction: string;
    dueAt?: string;
    approvalEvidenceUrl?: string;
    outcomeEvidenceUrls: string[];
  };
  dedupeKey: string;
  notes?: string;
}
```

## Data integrity rules

- Preserve source URL, retrieval time and provider record ID when available.
- Keep event date, offer price, currency and inclusions nullable when the source does not provide them. Never fabricate a price or availability.
- Prices use integer minor units and an explicit ISO currency code; provider adapters must convert from displayed values with tests.
- `dedupeKey` is derived from normalized provider + provider record ID when present; otherwise from normalized event title + event date + venue. A duplicate must be reviewed, not silently discarded when evidence differs.
- Event details and offers are time-sensitive. A previous result is not proof of current availability; record the last availability check separately.
- Store only information necessary for opportunity evaluation. Do not collect guest personal data in this record.

## Workflow and approval gates

`DISCOVERED → RESEARCHING → QUALIFIED → PROPOSAL_DRAFT → AWAITING_OWNER_APPROVAL → APPROVED_FOR_EXECUTION → IN_EXECUTION → DELIVERED → EVIDENCE_REVIEW → CLOSED`

`DECLINED` and `BLOCKED` are terminal operational outcomes; reopening requires an explicit recorded decision.

- Research and drafting may occur without external commitment.
- `APPROVED_FOR_EXECUTION` requires a recorded owner approval and a clearly scoped action.
- Booking, payment, sponsorship, contracts, outreach, publication and privileged access must each retain the applicable approval evidence.
- `COUNTERPART_CONFIRMED` requires evidence from the counterpart. `CONTRACTED` requires the executed agreement. A discovery listing, draft, or GitHub issue is not that evidence.
- Do not automate a booking, spend, external message, or public claim in the first implementation slice.

## Provider adapter boundary

A provider adapter may return normalized discovery records only through a documented and permitted interface. Until an official API/permission model is verified, Seat Unique results must enter via a clearly labelled research/import workflow with source URLs and retrieval timestamps. Do not scrape around access controls or infer API endpoints from UI behavior.

## Minimum test matrix before implementation is called verified

| Case | Expected result |
|---|---|
| Missing event date or price | Record remains valid; absent values stay null |
| Unknown currency | Reject price normalization or leave price unset; never assume GBP |
| Duplicate provider ID | Flag duplicate and retain source evidence |
| Same title, different date/venue | Keep distinct records |
| Stale availability | Mark availability unverified until refreshed |
| Provider timeout or malformed response | Fail closed; preserve existing records |
| Booking/spend/outreach without approval | Block action and emit an auditable reason |
| Prospect mistaken for partner | Keep relationship state unconfirmed |
| Cross-user access (if persisted per user) | Enforce authorization/RLS; test negative access |
| Source URL unavailable | Mark evidence retrieval failed; do not present the result as current |

## Release evidence required

Before this can be marked implemented or production-ready, attach:
1. A reviewed implementation PR and exact commit SHA.
2. Automated test output covering the matrix above.
3. Provider permission/API evidence or an approved manual-import path.
4. Security and authorization review for any persisted records.
5. A deployed URL and smoke-test evidence only if deployment is explicitly authorized.

**Current claim:** this document defines an implementation contract only. It does not claim an event adapter, database schema, user interface, booking flow, or production deployment exists.
