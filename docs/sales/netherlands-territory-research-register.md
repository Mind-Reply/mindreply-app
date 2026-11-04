# Netherlands Territory Research Register — v0.1
**Programme:** A11-K ENERGY × COMPUTE GRID  
**Parent workstream:** [Issue #145](https://github.com/Mind-Reply/mindreply-app/issues/145)  
**Branch:** `a11k/sales-territory-operations-planning`  
**Status:** CONTINUE — desk research only; no outreach or customer qualification  
**Research date:** 2026-11-04

## Purpose and interpretation

This is a source-backed **market and ecosystem map**, not a qualified sales pipeline. Inclusion means only that a public source identifies an organisation or its role in the Dutch data-centre, energy, grid or industrial-port ecosystem. It does not mean the organisation has expressed interest, is a prospect, is available to contract, or has capacity to offer.

No individuals, private contact details, buying intent, commercial relationship, available power, land availability or revenue are inferred.

## A. Data-centre and digital infrastructure ecosystem

| Organisation | Publicly evidenced footprint / role | Potential research relevance (hypothesis only) | Evidence status |
|---|---|---|---|
| NorthC Datacenters | Dutch regional operator; association profile lists facilities including Groningen, Amsterdam, Rotterdam, Eindhoven and others | Regional compute infrastructure, connectivity, heat reuse and operational requirements | VERIFIED — public footprint; no opportunity qualified |
| Equinix | Dutch Data Center Association profile lists multiple Amsterdam facilities and locations in Enschede and Zwolle | Interconnection ecosystem and infrastructure benchmarking | VERIFIED — public footprint; no opportunity qualified |
| Digital Realty / Interxion | Listed among Amsterdam data-centre operators in market directories | Colocation and interconnection ecosystem mapping | CONTINUE — validate facility footprint against operator primary sources |
| Google | Named by Groningen Seaports among large businesses in the Delfzijl/Eemshaven port area | Regional data-centre ecosystem mapping | VERIFIED — named in port authority's business-area overview; no buying intent inferred |
| QTS | Named by Groningen Seaports among large businesses in the port area | Regional data-centre ecosystem mapping | VERIFIED — named in port authority's business-area overview; no buying intent inferred |

Sources:
- NorthC profile: https://www.dutchdatacenters.nl/en/participants/northc-datacenters/
- Equinix profile: https://www.dutchdatacenters.nl/en/participants/equinix/
- Groningen Seaports business-area overview: https://www.groningen-seaports.com/en/for-businesses/industries/sme-business-park/
- AMS-IX connection locations: https://www.ams-ix.net/ams/where-to-connect

## B. Energy and grid ecosystem

| Organisation | Publicly evidenced role | Research relevance | Evidence status |
|---|---|---|---|
| TenneT | National electricity transmission system operator; manages the high-voltage grid | Transmission connection process, capacity constraints and system planning | VERIFIED — statutory/system role; site capacity must be checked directly |
| Enexis | Regional electricity distribution system operator | Distribution-level connection and congestion assessment in its service area | VERIFIED — operator role; exact site jurisdiction and capacity require confirmation |
| Liander | Regional electricity distribution system operator | Distribution-level connection and congestion assessment in its service area | VERIFIED — operator role; exact site jurisdiction and capacity require confirmation |
| Stedin | Regional electricity distribution system operator | Distribution-level connection and congestion assessment in its service area | VERIFIED — operator role; exact site jurisdiction and capacity require confirmation |
| Westland Infra | Regional electricity distribution system operator | Distribution-level connection and congestion assessment in its service area | VERIFIED — operator role; exact site jurisdiction and capacity require confirmation |
| Coteq and Rendo | Regional electricity distribution system operators | Distribution-level connection and congestion assessment in their service areas | VERIFIED — operator roles; exact site jurisdiction and capacity require confirmation |
| Gasunie | National gas network operator | Relevant only if a future site-energy study includes gas-network infrastructure | VERIFIED — operator role; no gas requirement assumed |

Sources:
- Netherlands Enterprise Agency (RVO), roles of grid operators: https://english.rvo.nl/topics/grid-congestion/what-parties-are-working-together-address-grid-congestion
- National indicative electricity capacity map: https://capaciteitskaart.netbeheernederland.nl/info/algemene-info/

**Critical constraint:** The national capacity map is indicative and time-sensitive. Installed generation, nearby substations, port claims or regional energy production do not establish spare transport capacity, a connection offer, a connection date or a right to consume power. A project-specific written response from the responsible network operator is required.

## C. Port and industrial clusters

| Organisation / cluster | Publicly evidenced footprint | Research relevance | Evidence status |
|---|---|---|---|
| Groningen Seaports | Port authority for Eemshaven and Delfzijl; identifies energy, data and offshore wind as key Eemshaven sectors | Primary ecosystem and site-information source for the first candidate region | VERIFIED — regional role; plot/grid availability not verified |
| Port of Moerdijk | Port authority; reports around 400 businesses across industrial, energy, recycling and logistics clusters | Alternative industrial and flexibility ecosystem | VERIFIED — cluster footprint; site/grid availability not verified |
| Port of Rotterdam | Nationally significant port and industrial ecosystem | Later-stage industrial partnerships, logistics and potential heat-network research | CONTINUE — partner and site scope not yet mapped |
| Port of Amsterdam | Nationally significant port ecosystem | Later-stage connectivity and industrial market mapping | CONTINUE — partner and site scope not yet mapped |
| North Sea Port (Dutch area) | Nationally significant port ecosystem including Vlissingen and Terneuzen | Later-stage industrial and energy cluster mapping | CONTINUE — partner and site scope not yet mapped |

Sources:
- Groningen Seaports — Eemshaven: https://www.groningen-seaports.com/en/for-businesses/sites/eemshaven/
- Groningen Seaports — business area: https://www.groningen-seaports.com/en/for-businesses/industries/sme-business-park/
- Port of Moerdijk — companies: https://www.portofmoerdijk.nl/en/business/companies
- Dutch Seaports Association: https://www.boz.nl/
- Statistics Netherlands (CBS), Dutch seaports: https://www.cbs.nl/nl-nl/visualisaties/verkeer-en-vervoer/vervoermiddelen-en-infrastructuur/zeehavens

## D. Territory sequencing

1. **Eemshaven / Delfzijl — first research zone.** Strong publicly documented energy, data-centre and offshore-wind ecosystem. This is a research priority, not a site selection or capacity finding.
2. **Moerdijk — alternative research zone.** Established industrial, energy, recycling and logistics clusters; useful for testing industrial flexibility and storage hypotheses. No available capacity is assumed.
3. **Amsterdam / Rotterdam — ecosystem and connectivity research.** Map operators, connectivity and industrial users; do not infer these regions are preferred for the first physical build.
4. **Other Dutch regions — expand only when segment and delivery evidence justifies it.**

## E. Research register fields for the next iteration

Each organisation record should be expanded only with sourced information:
- Organisation name and official website
- Legal entity / group relationship, if confirmed
- Sector, geography and public footprint
- Source URL, source date and last-reviewed timestamp
- Publicly stated service or infrastructure facts
- Potential relevance hypothesis (explicitly labelled)
- Unknowns and validation questions
- Internal research owner and independent validator
- Evidence outcome: VERIFIED / READY / CONTINUE / CONTRIBUTION
- No contact activity unless separately authorised

## F. Next validation actions

| Action | Owner function | Required evidence | Status |
|---|---|---|---|
| Confirm official organisation profiles and legal entity names | Sales Research | Primary-source company pages / registry evidence | CONTINUE |
| Map Eemshaven site boundaries and planning constraints | Site Feasibility | Port authority and competent authority documentation | CONTINUE |
| Identify responsible network operator for each candidate plot | Energy & Grid | Plot-level jurisdiction confirmation | CONTINUE |
| Obtain project-specific connection and transport-capacity evidence | Energy & Grid | Written operator response; connection conditions and indicative timing | CONTINUE |
| Validate compute service requirements and load profile | Compute + Engineering | Workload, redundancy, cooling and connectivity specification | CONTINUE |
| Build an evidence-reviewed account register | Sales Operations | Deduplicated records with sources and ownership | READY |
| Review commercial relevance only after qualification | Finance + Sales Lead | Technical scope, cost basis, risk and owner approval | CONTRIBUTION |

## Guardrails

This research does not authorise outreach, customer qualification calls, proposals, contracts, payments, spending, production database writes, deployment, site acquisition or infrastructure commitments. Public ecosystem membership is not customer intent. All commercial opportunities must be independently qualified and approved.
