# Kafka + Neo4j Infrastructure Implementation
## MindReply Real-Time Telemetry & Graph Data Pipeline

---

## Phase 1: Infrastructure Setup

### 1.1 Deploy Local Kafka Cluster

**Objective**: Establish a 3-broker Kafka cluster with persistent volumes for development/testing.

**Tasks**:
- [ ] **Create `docker-compose.kafka.yml`** with:
  - Zookeeper (for broker coordination, deprecated but stable for dev)
  - 3 Kafka brokers (ports 9091, 9092, 9093 for external; 29091, 29092, 29093 for JMX)
  - Kraft mode alternative (single controller, no Zookeeper) — TBD
  - Persistent volumes for broker logs
  - Healthchecks for broker readiness

- [ ] **Create Kafka topics**:
  ```bash
  docker exec kafka-broker-1 kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --topic telemetry-events \
    --partitions 3 --replication-factor 3 --config retention.ms=604800000
  ```
  - `telemetry-events` — Device/user activity stream
  - `order-lifecycle` — ResellerPro order state changes
  - `domain-provisioning` — Domain registry updates
  - `audit-trail` — Compliance/NIS2 audit logs
  - `stripe-webhooks` — Raw Stripe payment events

- [ ] **Verify broker cluster health**:
  ```bash
  docker exec kafka-broker-1 kafka-broker-api-versions.sh \
    --bootstrap-server localhost:9092
  ```

- [ ] **Optional: Deploy Kafka UI** (web console on port 8081):
  - Image: `provectuslabs/kafka-ui:latest`
  - Connects to broker cluster for topic/consumer monitoring

**Deliverables**:
- `docker-compose.kafka.yml` (Zookeeper + 3 brokers)
- 5 pre-created topics with retention policies
- Healthcheck verification script

---

### 1.2 Deploy Neo4j Graph Database

**Objective**: Single Neo4j instance with persistent graph store, indexed node properties.

**Tasks**:
- [ ] **Create Neo4j service** in `docker-compose.kafka.yml`:
  - Image: `neo4j:5.24-community` (latest stable)
  - Port 7687 (Bolt protocol for driver connections)
  - Port 7474 (Browser UI)
  - Volume: `/data` persistent storage
  - Environment: `NEO4J_AUTH=neo4j/mind-reply-neo4j-pass`
  - Healthcheck: Bolt port readiness

- [ ] **Initialize Neo4j constraints & indexes**:
  - Run `CONSTRAINT` statements for node uniqueness
  - Create composite indexes on frequently queried properties
  - (Detailed schema in Phase 2)

- [ ] **Verify graph connectivity**:
  ```bash
  docker exec neo4j neo4j-admin dbms cypher-shell -u neo4j -p <PASSWORD>
  # RETURN apoc.version()
  ```

**Deliverables**:
- Neo4j service in docker-compose
- Cypher initialization script
- Neo4j Browser accessible at `http://localhost:7474`

---

### 1.3 Wire Kafka ↔ Neo4j Infrastructure

**Objective**: Establish network connectivity and verify message flow.

**Tasks**:
- [ ] **Update `docker-compose.yml`** to include:
  - Shared network `app-network` for all services (Kafka, Neo4j, ResellerPro)
  - Volume mounts for Kafka log persistence
  - Neo4j data volume

- [ ] **Create health orchestration script**:
  ```bash
  # services/infrastructure/health-check.sh
  - Check Kafka broker cluster status
  - Check Neo4j graph database status
  - Verify inter-service network connectivity (curl from Kafka to Neo4j)
  ```

- [ ] **Test local infrastructure startup**:
  ```bash
  docker compose -f docker-compose.kafka.yml up -d
  sleep 30s
  # Verify all services healthy
  ```

**Deliverables**:
- Updated `docker-compose.yml` with Kafka + Neo4j services
- Health check script
- Verified local cluster startup

---

## Phase 2: Graph Schema Cleanup & Indexing

### 2.1 Define Core Node Types & Relationships

**Objective**: Model the graph for real-time telemetry and compliance audits.

**Node Types**:
```
Order
├── :HAS_PAYMENT → PaymentIntent (Stripe)
├── :PROVISIONS_DOMAIN → Domain
├── :BELONGS_TO_CUSTOMER → Customer
└── :AUDITED_BY → ComplianceAudit

Domain
├── :MANAGED_BY → Registrar (IONOS, CCTLD.BG)
├── :HAS_DNS_RECORD → DNSRecord
├── :RENEWS_WITH → RenewalEvent
└── :EXPIRES_ON → ExpirationDate (temporal)

Customer
├── :PLACED_ORDER → Order
├── :HAS_AUDIT_PROFILE → AuditProfile (NIS2, LCCP, AML)
├── :LOCATED_IN → GeoRegion
└── :PAYMENT_METHOD → PaymentMethod

Event (Telemetry Base)
├── DeviceEvent
│   ├── :GENERATED_ON_DEVICE → Device
│   ├── :AT_TIMESTAMP → Timestamp
│   └── :FLOWS_TO → AnalyticsAggregator
├── OrderLifecycleEvent
│   ├── :TRANSITIONS_ORDER_STATE → Order
│   └── :AUDIT_LOGGED → ComplianceRecord
└── AuditTrailEvent
    ├── :CONCERNS_ENTITY → (Order | Domain | Customer)
    └── :COMPLIANCE_CHECKPOINT → NIS2Checkpoint

Registrar (IONOS, CCTLD.BG, etc.)
├── :MANAGES_DOMAINS → Domain
└── :RATE_LIMIT → RateLimitPolicy

ComplianceAudit (NIS2, LCCP, AML, RTS)
├── :AUDITS_CUSTOMER → Customer
├── :GENERATED_AT → Timestamp
├── :REFERENCES_STANDARDS → ComplianceStandard
└── :STATUS → (pending | in_progress | passed | failed)
```

**Relationship Constraints** (Cypher):
```cypher
-- Node uniqueness
CREATE CONSTRAINT order_id_unique FOR (o:Order) REQUIRE o.order_id IS UNIQUE;
CREATE CONSTRAINT domain_name_unique FOR (d:Domain) REQUIRE d.domain_name IS UNIQUE;
CREATE CONSTRAINT customer_email_unique FOR (c:Customer) REQUIRE c.email IS UNIQUE;

-- Property existence
CREATE CONSTRAINT order_has_status FOR (o:Order) REQUIRE o.status IS NOT NULL;
CREATE CONSTRAINT domain_has_registrar FOR (d:Domain) REQUIRE d.registrar IS NOT NULL;
```

### 2.2 Create Composite Indexes for Query Optimization

**Objective**: Reduce Cypher query latency on hot paths.

**High-Priority Indexes**:
```cypher
-- Single-property indexes
CREATE INDEX order_status_idx FOR (o:Order) ON (o.status);
CREATE INDEX domain_registrar_idx FOR (d:Domain) ON (d.registrar);
CREATE INDEX event_timestamp_idx FOR (e:Event) ON (e.timestamp);
CREATE INDEX customer_tier_idx FOR (c:Customer) ON (c.tier);

-- Composite indexes (multi-property searches)
CREATE INDEX order_customer_status_idx FOR (o:Order) ON (o.customer_email, o.status);
CREATE INDEX domain_renewal_idx FOR (d:Domain) ON (d.auto_renew, d.renewal_date);
CREATE INDEX audit_compliance_idx FOR (a:ComplianceAudit) ON (a.compliance_standard, a.status);

-- Full-text search indexes (for domain/customer search)
CREATE FULLTEXT INDEX domain_search_idx FOR (d:Domain) ON EACH [d.domain_name, d.description];
CREATE FULLTEXT INDEX customer_search_idx FOR (c:Customer) ON EACH [c.email, c.company_name];
```

### 2.3 Validate Schema & Run Migration

**Objective**: Apply schema to Neo4j instance without data loss.

**Tasks**:
- [ ] **Create `services/neo4j/migrations/001-init-schema.cypher`**:
  - All CONSTRAINT statements
  - All INDEX statements
  - Test MATCH queries to verify integrity

- [ ] **Create Neo4j schema validation script** (`services/neo4j/validate-schema.sh`):
  ```bash
  neo4j-admin dbms cypher-shell -u neo4j -p ${NEO4J_PASSWORD} < migrations/001-init-schema.cypher
  # Verify all constraints exist
  SHOW CONSTRAINTS;
  SHOW INDEXES;
  ```

- [ ] **Run on live instance**:
  ```bash
  docker compose exec neo4j bash -c 'cat migrations/001-init-schema.cypher | cypher-shell -u neo4j -p <PASSWORD>'
  ```

**Deliverables**:
- Cypher migration scripts
- Schema validation test suite
- Index performance baseline

---

## Phase 3: Python Ingestion Script Execution

### 3.1 Develop Kafka Consumer Pipeline

**Objective**: Build Python consumer that reads from Kafka topics and writes to Neo4j.

**Script Structure** (`services/ingestion/kafka_neo4j_consumer.py`):

```python
from kafka import KafkaConsumer
from neo4j import GraphDatabase
import json
import logging
from datetime import datetime
from typing import Dict, Any

class KafkaNeo4jConsumer:
    def __init__(self, kafka_bootstrap, neo4j_uri, neo4j_auth):
        self.consumer = KafkaConsumer(
            bootstrap_servers=kafka_bootstrap,
            group_id='neo4j-ingestion-group',
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            auto_offset_reset='earliest',
            enable_auto_commit=True,
            session_timeout_ms=30000,
            heartbeat_interval_ms=10000,
        )
        self.driver = GraphDatabase.driver(neo4j_uri, auth=neo4j_auth)
        self.logger = logging.getLogger(__name__)

    def subscribe_and_consume(self, topics: list):
        """Subscribe to Kafka topics and consume messages."""
        self.consumer.subscribe(topics)
        self.logger.info(f"Subscribed to topics: {topics}")

        for message in self.consumer:
            try:
                self._process_message(message)
            except Exception as e:
                self.logger.error(f"Error processing message: {e}")
                # Dead-letter queue or retry logic here

    def _process_message(self, message):
        """Route messages to appropriate Neo4j ingestion handler."""
        topic = message.topic
        payload = message.value

        if topic == 'telemetry-events':
            self._ingest_telemetry(payload)
        elif topic == 'order-lifecycle':
            self._ingest_order(payload)
        elif topic == 'domain-provisioning':
            self._ingest_domain(payload)
        elif topic == 'audit-trail':
            self._ingest_audit(payload)
        elif topic == 'stripe-webhooks':
            self._ingest_stripe_webhook(payload)

    def _ingest_telemetry(self, event: Dict[str, Any]):
        """Create DeviceEvent node linked to Device and analytics flow."""
        query = """
        MERGE (device:Device {device_id: $device_id})
        CREATE (event:DeviceEvent {
            event_id: $event_id,
            event_type: $event_type,
            timestamp: $timestamp,
            metadata: $metadata
        })
        CREATE (event)-[:GENERATED_ON_DEVICE]->(device)
        RETURN event, device
        """
        with self.driver.session() as session:
            session.run(query, event)

    def _ingest_order(self, event: Dict[str, Any]):
        """Upsert Order node and link to Customer, Payment, Domain."""
        query = """
        MERGE (customer:Customer {email: $customer_email})
        MERGE (order:Order {order_id: $order_id})
        SET order.status = $status, order.tier = $tier, order.updated_at = $timestamp
        MERGE (payment:PaymentIntent {payment_id: $payment_id})
        MERGE (domain:Domain {domain_name: $domain_name})
        MERGE (order)-[:BELONGS_TO_CUSTOMER]->(customer)
        MERGE (order)-[:HAS_PAYMENT]->(payment)
        MERGE (order)-[:PROVISIONS_DOMAIN]->(domain)
        RETURN order, customer, payment, domain
        """
        with self.driver.session() as session:
            session.run(query, event)

    def _ingest_domain(self, event: Dict[str, Any]):
        """Upsert Domain node with registrar and DNS records."""
        query = """
        MERGE (registrar:Registrar {name: $registrar})
        MERGE (domain:Domain {domain_name: $domain_name})
        SET domain.auto_renew = $auto_renew, domain.renewal_date = $renewal_date
        MERGE (domain)-[:MANAGED_BY]->(registrar)
        RETURN domain, registrar
        """
        with self.driver.session() as session:
            session.run(query, event)

    def _ingest_audit(self, event: Dict[str, Any]):
        """Create ComplianceAudit and link to Customer/Order."""
        query = """
        MATCH (customer:Customer {email: $customer_email})
        CREATE (audit:ComplianceAudit {
            audit_id: $audit_id,
            compliance_standard: $compliance_standard,
            status: $status,
            timestamp: $timestamp,
            findings: $findings
        })
        CREATE (audit)-[:AUDITS_CUSTOMER]->(customer)
        RETURN audit, customer
        """
        with self.driver.session() as session:
            session.run(query, event)

    def _ingest_stripe_webhook(self, event: Dict[str, Any]):
        """Handle Stripe webhook events (payment updates, refunds, etc.)."""
        query = """
        MATCH (order:Order {order_id: $order_id})
        MERGE (payment:PaymentIntent {payment_id: $payment_id})
        SET payment.status = $payment_status, payment.amount = $amount, payment.updated_at = $timestamp
        MERGE (order)-[:HAS_PAYMENT]->(payment)
        RETURN order, payment
        """
        with self.driver.session() as session:
            session.run(query, event)

    def close(self):
        """Close Kafka consumer and Neo4j driver."""
        self.consumer.close()
        self.driver.close()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    consumer = KafkaNeo4jConsumer(
        kafka_bootstrap='kafka-broker-1:9092,kafka-broker-2:9092,kafka-broker-3:9092',
        neo4j_uri='bolt://neo4j:7687',
        neo4j_auth=('neo4j', 'mind-reply-neo4j-pass')
    )
    topics = [
        'telemetry-events',
        'order-lifecycle',
        'domain-provisioning',
        'audit-trail',
        'stripe-webhooks'
    ]
    consumer.subscribe_and_consume(topics)
```

### 3.2 Error Handling & Retry Logic

**Objective**: Ensure no messages are lost in case of transient failures.

**Implementation** (`services/ingestion/error_handlers.py`):
- **Dead Letter Queue (DLQ)**: Failed messages → `dlq-ingestion-errors` topic
- **Exponential backoff**: Retry up to 3 times with 2s, 4s, 8s delays
- **Idempotency**: Use message keys to deduplicate retries
- **Monitoring**: Emit metrics to Prometheus (message lag, error rate)

### 3.3 Run Ingestion Pipeline

**Objective**: Execute consumer in production-ready container.

**Tasks**:
- [ ] **Create `services/ingestion/Dockerfile`**:
  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install -r requirements.txt
  COPY kafka_neo4j_consumer.py .
  CMD ["python", "kafka_neo4j_consumer.py"]
  ```

- [ ] **Create `requirements.txt`**:
  ```
  kafka-python==2.0.2
  neo4j==5.24.0
  python-dotenv==1.0.0
  pydantic==2.5.0
  prometheus-client==0.19.0
  ```

- [ ] **Add to `docker-compose.kafka.yml`**:
  ```yaml
  kafka-neo4j-consumer:
    build:
      context: .
      dockerfile: services/ingestion/Dockerfile
    container_name: kafka-neo4j-consumer
    depends_on:
      - kafka-broker-1
      - kafka-broker-2
      - kafka-broker-3
      - neo4j
    environment:
      KAFKA_BOOTSTRAP: kafka-broker-1:9092,kafka-broker-2:9092,kafka-broker-3:9092
      NEO4J_URI: bolt://neo4j:7687
      NEO4J_USER: neo4j
      NEO4J_PASSWORD: ${NEO4J_PASSWORD}
    networks:
      - app-network
    restart: unless-stopped
  ```

- [ ] **Test end-to-end**:
  ```bash
  # Produce test message to telemetry-events
  docker exec kafka-broker-1 kafka-console-producer.sh \
    --broker-list localhost:9092 \
    --topic telemetry-events <<EOF
  {"event_id": "evt-001", "device_id": "dev-123", "event_type": "page_view", "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"}
  EOF

  # Verify in Neo4j Browser
  # MATCH (d:DeviceEvent) RETURN d LIMIT 10
  ```

**Deliverables**:
- Python Kafka consumer script
- Error handling & retry framework
- Ingestion container + docker-compose service
- End-to-end test verification

---

## Summary: Implementation Timeline

| Phase | Component | Est. Time | Priority |
|-------|-----------|-----------|----------|
| 1.1 | Kafka cluster + topics | 2h | HIGH |
| 1.2 | Neo4j setup + initialization | 1h | HIGH |
| 1.3 | Infrastructure health checks | 1h | MEDIUM |
| 2.1 | Graph schema design | 2h | HIGH |
| 2.2 | Indexes & constraints | 1h | HIGH |
| 2.3 | Schema migration & validation | 1h | MEDIUM |
| 3.1 | Python consumer pipeline | 3h | HIGH |
| 3.2 | Error handling & retry logic | 1.5h | MEDIUM |
| 3.3 | End-to-end testing | 1.5h | MEDIUM |
| **TOTAL** | | **~14h** | |

---

## Success Criteria

- ✅ Kafka cluster healthy: 3 brokers, 5 topics, verified with `kafka-topics.sh`
- ✅ Neo4j instance running: Browser accessible, schema applied, indexes created
- ✅ Consumer pipeline: Reading from all 5 Kafka topics, writing to Neo4j without errors
- ✅ Test ingestion: 100+ test messages from each topic successfully stored in graph
- ✅ Query validation: Cypher queries return expected node relationships

---

## Next Steps

1. **Immediate**: Phase 1.1 (Kafka cluster setup)
2. **Follow**: Phase 2.1 (Graph schema finalization)
3. **Execute**: Phase 3.1 (Consumer pipeline deployment)
4. **Monitor**: Set up Prometheus + Grafana for real-time metrics
5. **Document**: Runbooks for topic/consumer management

