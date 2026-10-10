export type Service = {
  slug: string; number: string; title: string; promise: string;
  outcomes: string[]; delivery: string[]; evidence: string[];
  systems: string[]; regional: string[];
};
const regionalModel = [
  "Global: one shared core; regional data, language, provider and support adapters.",
  "Bulgaria & Balkans: local-language SME delivery; confirm local entity and tax details.",
  "EU/EEA and UK: assess privacy, AI, consumer, transfer and sector duties per service.",
  "Other markets: verify country-specific contracts, data, procurement and support before launch."
];
type Definition = [string,string,string,string,string[],string[],string[],string[]];
const definitions: Definition[] = [
["innovation-intelligence","01","Innovation & Intelligence","Govern AI/ML use cases and measure outcomes.",["AI/ML strategy","Predictive workflows"],["Use-case discovery","Human review"],["Evaluation log","Outcome metrics"],["Model registry","Approval workflow"]],
["data-analytics","02","Data & Analytics","Build trusted data and decision-ready reporting.",["Data lineage","Executive analytics"],["Quality controls","Forecast validation"],["Lineage record","Quality results"],["Data catalogue","Metric layer"]],
["infrastructure-modernisation","03","IT Infrastructure Modernisation","Modernise cloud and hybrid systems for resilience and cost.",["Cloud transformation","Recovery"],["Estate assessment","Migration tests"],["Architecture baseline","Restore results"],["Environment patterns","Health telemetry"]],
["application-modernisation","04","Application Modernisation & Development","Build maintainable products with tested releases.",["Legacy modernisation","Product engineering"],["Automated tests","Release/rollback"],["Build evidence","Runtime checks"],["Canonical source","CI release gates"]],
["security","05","Security","Reduce exposure with access controls and incident readiness.",["Security architecture","Least privilege"],["Threat assessment","Remediation retest"],["Scan results","Closure evidence"],["Access review","Incident records"]],
["managed-services","06","Managed Services","Operate services with explicit objectives and controlled change.",["Service health","Reliability"],["Health probes","Incident workflow"],["Health signals","Incident history"],["Service catalogue","Escalation routing"]],
["digital-workplace","07","Digital Workplace","Connect teams, applications and information securely.",["Workplace design","Adoption"],["Identity/device review","Collaboration setup"],["Access baseline","Adoption measures"],["Identity patterns","Support workflows"]],
["training","08","Training","Build role-based skills through practice and measurement.",["Technical enablement","Competency"],["Curriculum","Hands-on labs"],["Assessment results","Completion record"],["Skills matrix","Learning modules"]]
];
export const services: Service[] = definitions.map(([slug,number,title,promise,outcomes,delivery,evidence,systems]) => ({slug,number,title,promise,outcomes,delivery,evidence,systems,regional:regionalModel}));
export const regions = [
{slug:"global",name:"Global",mode:"Shared core with local adapters and launch evidence."},
{slug:"europe",name:"Europe / EU-EEA",mode:"Transformation with service-specific privacy and sector review."},
{slug:"bulgaria",name:"Bulgaria & Balkans",mode:"Local-language SME delivery; confirm legal and tax details."},
{slug:"uk-global",name:"United Kingdom",mode:"UK-specific contract, privacy and support review."},
{slug:"nordics-switzerland",name:"Nordics & Switzerland",mode:"Country-specific data, procurement and support needs."},
{slug:"north-america",name:"North America",mode:"Local contract, privacy, tax and support assessment."}
];
export function getService(slug: string) { return services.find((service) => service.slug === slug); }
