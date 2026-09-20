export type Service = {
  slug: string;
  number: string;
  title: string;
  promise: string;
  outcomes: string[];
  delivery: string[];
  evidence: string[];
};

export const services: Service[] = [
  { slug: "innovation-intelligence", number: "01", title: "Innovation & Intelligence", promise: "Turn complex signals into practical decisions and controlled intelligent workflows.", outcomes: ["Decision intelligence", "Predictive insight", "Workflow automation"], delivery: ["Signal and use-case discovery", "Data/context readiness", "Workflow implementation", "Outcome measurement"], evidence: ["Decision log", "Workflow run evidence", "Outcome metrics"] },
  { slug: "data-analytics", number: "02", title: "Data & Analytics", promise: "Build a dependable path from source data to decision-ready information.", outcomes: ["Data architecture", "Analytics foundations", "Executive visibility"], delivery: ["Source mapping", "Data quality controls", "Dashboards and reporting", "Forecasting models"], evidence: ["Data lineage", "Quality checks", "Report provenance"] },
  { slug: "infrastructure-modernisation", number: "03", title: "IT Infrastructure Modernisation", promise: "Modernise infrastructure for resilience, scale, security and cost control.", outcomes: ["Cloud transformation", "Resilience engineering", "Infrastructure optimisation"], delivery: ["Estate assessment", "Target architecture", "Migration execution", "Observability and recovery"], evidence: ["Architecture baseline", "Deployment records", "Recovery validation"] },
  { slug: "application-modernisation", number: "04", title: "Application Modernisation & Development", promise: "Replace brittle legacy paths or build cloud-native products with production discipline.", outcomes: ["Legacy modernisation", "Cloud-native development", "Product engineering"], delivery: ["Application assessment", "Architecture and build", "Automated testing", "Release and rollback"], evidence: ["CI results", "Release evidence", "Runtime health"] },
  { slug: "security", number: "05", title: "Security", promise: "Reduce exposure through practical architecture, controls and threat-aware operations.", outcomes: ["Security architecture", "Threat readiness", "Zero-trust controls"], delivery: ["Exposure assessment", "Identity and access controls", "Secret and dependency hygiene", "Security monitoring"], evidence: ["Control inventory", "Scan results", "Remediation record"] },
  { slug: "managed-services", number: "06", title: "Managed Services", promise: "Keep critical systems monitored, maintained and continuously improved.", outcomes: ["Service monitoring", "Operational optimisation", "Release assurance"], delivery: ["Health monitoring", "Incident workflows", "Maintenance", "Continuous improvement"], evidence: ["Uptime signals", "Incident history", "Change record"] },
  { slug: "digital-workplace", number: "07", title: "Digital Workplace", promise: "Connect people, applications and information through secure productive work environments.", outcomes: ["Workplace architecture", "Collaboration", "Secure access"], delivery: ["Workplace assessment", "Identity and access", "Collaboration design", "Adoption measurement"], evidence: ["Access posture", "Adoption metrics", "Service health"] },
  { slug: "training", number: "08", title: "Training", promise: "Transfer practical capability so teams can operate the technology they deploy.", outcomes: ["Role-based enablement", "Technical training", "Adoption programmes"], delivery: ["Capability assessment", "Role-based curriculum", "Hands-on enablement", "Competency checks"], evidence: ["Completion record", "Assessment results", "Adoption measures"] },
];

export const regions = [
  { slug: "global", name: "Global", mode: "Cross-border delivery" },
  { slug: "europe", name: "Europe", mode: "Digital transformation and resilience" },
  { slug: "bulgaria", name: "Bulgaria", mode: "SME digitalisation and capability uplift" },
];

export function getService(slug: string) { return services.find((service) => service.slug === slug); }
