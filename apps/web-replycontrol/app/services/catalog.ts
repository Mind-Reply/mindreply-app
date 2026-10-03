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
  { slug: "innovation-intelligence", number: "01", title: "Innovation & Intelligence", promise: "Use artificial intelligence and machine learning to turn complex signals into predictive insight, intelligent workflows and measurable competitive advantage.", outcomes: ["AI & ML strategy", "Predictive intelligence", "Intelligent workflow automation"], delivery: ["Use-case and signal discovery", "Data and model readiness", "Workflow implementation", "Outcome measurement"], evidence: ["Decision log", "Workflow run evidence", "Outcome metrics"] },
  { slug: "data-analytics", number: "02", title: "Data & Analytics", promise: "Unlock the full value of your data with robust architectures, trusted analytics and decision-ready information.", outcomes: ["Data architecture", "Analytics foundations", "Executive visibility"], delivery: ["Source and lineage mapping", "Data quality controls", "Dashboards and reporting", "Forecasting and decision models"], evidence: ["Data lineage", "Quality checks", "Report provenance"] },
  { slug: "infrastructure-modernisation", number: "03", title: "IT Infrastructure Modernisation", promise: "Future-proof operations with scalable, resilient and cost-conscious cloud or hybrid infrastructure.", outcomes: ["Cloud transformation", "Resilience engineering", "Infrastructure optimisation"], delivery: ["Estate assessment", "Target architecture", "Migration execution", "Observability and recovery"], evidence: ["Architecture baseline", "Deployment records", "Recovery validation"] },
  { slug: "application-modernisation", number: "04", title: "Application Modernisation & Development", promise: "Revitalise legacy systems or build cloud-native applications that improve performance, experience and operational agility.", outcomes: ["Legacy modernisation", "Cloud-native development", "Product engineering"], delivery: ["Application assessment", "Architecture and build", "Automated testing", "Release and rollback"], evidence: ["CI results", "Release evidence", "Runtime health"] },
  { slug: "security", number: "05", title: "Security", promise: "Protect digital assets with proactive defence, threat intelligence and zero-trust architecture designed around real operational risk.", outcomes: ["Security architecture", "Threat intelligence", "Zero-trust controls"], delivery: ["Exposure assessment", "Identity and access controls", "Secret and dependency hygiene", "Security monitoring"], evidence: ["Control inventory", "Scan results", "Remediation record"] },
  { slug: "managed-services", number: "06", title: "Managed Services", promise: "Keep critical systems monitored, maintained and continuously optimised so teams can stay focused on the core business.", outcomes: ["Service monitoring", "Operational optimisation", "Release assurance"], delivery: ["Health monitoring", "Incident workflows", "Maintenance", "Continuous improvement"], evidence: ["Uptime signals", "Incident history", "Change record"] },
  { slug: "digital-workplace", number: "07", title: "Digital Workplace", promise: "Equip teams with secure, collaborative digital workplaces that keep people, applications and information connected.", outcomes: ["Workplace architecture", "Collaboration", "Secure access"], delivery: ["Workplace assessment", "Identity and access", "Collaboration design", "Adoption measurement"], evidence: ["Access posture", "Adoption metrics", "Service health"] },
  { slug: "training", number: "08", title: "Training", promise: "Bridge the digital skills gap with practical enablement that helps teams maximise the value of their technology investments.", outcomes: ["Role-based enablement", "Technical training", "Adoption programmes"], delivery: ["Capability assessment", "Role-based curriculum", "Hands-on enablement", "Competency checks"], evidence: ["Completion record", "Assessment results", "Adoption measures"] },
];

export const regions = [
  { slug: "global", name: "Global", mode: "Cross-border delivery" },
  { slug: "europe", name: "Europe", mode: "Digital transformation and resilience" },
  { slug: "bulgaria", name: "Bulgaria", mode: "SME digitalisation and capability uplift" },
  { slug: "uk-global", name: "UK / Global", mode: "Enterprise modernisation and managed operations" },
];

export function getService(slug: string) { return services.find((service) => service.slug === slug); }
