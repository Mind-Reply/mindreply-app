// ============================================================================
// Neo4j Graph Schema: Constraints, Indexes, and Initialization
// File: services/neo4j/migrations/001-init-schema.cypher
// Purpose: Define all node types, relationships, constraints, and indexes
// ============================================================================

// --- CONSTRAINTS: Uniqueness & Property Requirements ---

// Order constraints
CREATE CONSTRAINT order_id_unique FOR (o:Order) REQUIRE o.order_id IS UNIQUE;
CREATE CONSTRAINT order_status_required FOR (o:Order) REQUIRE o.status IS NOT NULL;

// Domain constraints
CREATE CONSTRAINT domain_name_unique FOR (d:Domain) REQUIRE d.domain_name IS UNIQUE;
CREATE CONSTRAINT domain_registrar_required FOR (d:Domain) REQUIRE d.registrar IS NOT NULL;

// Customer constraints
CREATE CONSTRAINT customer_email_unique FOR (c:Customer) REQUIRE c.email IS UNIQUE;
CREATE CONSTRAINT customer_email_required FOR (c:Customer) REQUIRE c.email IS NOT NULL;

// Payment constraints
CREATE CONSTRAINT payment_id_unique FOR (p:PaymentIntent) REQUIRE p.payment_id IS UNIQUE;
CREATE CONSTRAINT payment_status_required FOR (p:PaymentIntent) REQUIRE p.status IS NOT NULL;

// Compliance audit constraints
CREATE CONSTRAINT audit_id_unique FOR (a:ComplianceAudit) REQUIRE a.audit_id IS UNIQUE;
CREATE CONSTRAINT audit_standard_required FOR (a:ComplianceAudit) REQUIRE a.compliance_standard IS NOT NULL;

// Registrar constraints
CREATE CONSTRAINT registrar_name_unique FOR (r:Registrar) REQUIRE r.name IS UNIQUE;

// Device constraints
CREATE CONSTRAINT device_id_unique FOR (d:Device) REQUIRE d.device_id IS UNIQUE;

// Event constraints
CREATE CONSTRAINT event_id_unique FOR (e:Event) REQUIRE e.event_id IS UNIQUE;
CREATE CONSTRAINT event_timestamp_required FOR (e:Event) REQUIRE e.timestamp IS NOT NULL;

// --- INDEXES: Single-Property Lookups ---

// Order indexes
CREATE INDEX order_status_idx FOR (o:Order) ON (o.status);
CREATE INDEX order_customer_email_idx FOR (o:Order) ON (o.customer_email);
CREATE INDEX order_created_idx FOR (o:Order) ON (o.created_at);
CREATE INDEX order_tier_idx FOR (o:Order) ON (o.tier);

// Domain indexes
CREATE INDEX domain_registrar_idx FOR (d:Domain) ON (d.registrar);
CREATE INDEX domain_auto_renew_idx FOR (d:Domain) ON (d.auto_renew);
CREATE INDEX domain_renewal_date_idx FOR (d:Domain) ON (d.renewal_date);

// Customer indexes
CREATE INDEX customer_tier_idx FOR (c:Customer) ON (c.tier);
CREATE INDEX customer_created_idx FOR (c:Customer) ON (c.created_at);
CREATE INDEX customer_company_idx FOR (c:Customer) ON (c.company_name);

// Payment indexes
CREATE INDEX payment_status_idx FOR (p:PaymentIntent) ON (p.status);
CREATE INDEX payment_created_idx FOR (p:PaymentIntent) ON (p.created_at);

// Compliance audit indexes
CREATE INDEX audit_standard_idx FOR (a:ComplianceAudit) ON (a.compliance_standard);
CREATE INDEX audit_status_idx FOR (a:ComplianceAudit) ON (a.status);
CREATE INDEX audit_timestamp_idx FOR (a:ComplianceAudit) ON (a.timestamp);

// Event indexes
CREATE INDEX event_type_idx FOR (e:Event) ON (e.event_type);
CREATE INDEX event_timestamp_idx FOR (e:Event) ON (e.timestamp);
CREATE INDEX event_device_id_idx FOR (e:DeviceEvent) ON (e.device_id);

// Device indexes
CREATE INDEX device_created_idx FOR (d:Device) ON (d.created_at);

// Registrar indexes
CREATE INDEX registrar_created_idx FOR (r:Registrar) ON (r.created_at);

// --- COMPOSITE INDEXES: Multi-Property Queries ---

// Order + Customer + Status
CREATE INDEX order_customer_status_idx FOR (o:Order) ON (o.customer_email, o.status);

// Domain + Renewal
CREATE INDEX domain_renewal_idx FOR (d:Domain) ON (d.auto_renew, d.renewal_date);

// Domain + Registrar
CREATE INDEX domain_registrar_name_idx FOR (d:Domain) ON (d.registrar, d.domain_name);

// Compliance audit search
CREATE INDEX audit_compliance_search_idx FOR (a:ComplianceAudit) ON (a.compliance_standard, a.status);

// Payment + Status + Date
CREATE INDEX payment_status_date_idx FOR (p:PaymentIntent) ON (p.status, p.created_at);

// Event + Type + Timestamp
CREATE INDEX event_type_timestamp_idx FOR (e:Event) ON (e.event_type, e.timestamp);

// --- FULL-TEXT INDEXES: Search Capabilities ---

// Domain name search (exact matches + full-text)
CREATE FULLTEXT INDEX domain_search_idx FOR (d:Domain) ON EACH [d.domain_name, d.description];

// Customer search (email + company)
CREATE FULLTEXT INDEX customer_search_idx FOR (c:Customer) ON EACH [c.email, c.company_name];

// --- QUERY VALIDATION: Test Schema Integrity ---

// Return all constraints (should match 11 total)
SHOW CONSTRAINTS;

// Return all indexes (should match 24+ total)
SHOW INDEXES;

// Verify constraint enforcement (this should succeed)
MATCH (o:Order) WHERE o.order_id IS NULL RETURN count(o) AS null_order_ids;

// Return schema summary
CALL apoc.schema.visualization() YIELD relationships, nodes
RETURN nodes, relationships;
