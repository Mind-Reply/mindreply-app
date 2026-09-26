# Kafka + Neo4j Infrastructure Runbook

## Quick Start

### Prerequisites
- Docker & Docker Compose 2.20+
- 8GB+ RAM available
- Ports available: 9091-9093 (Kafka), 7474 (Neo4j Browser), 7687 (Neo4j Bolt), 8081 (Kafka UI)

### Start Full Stack

```bash
# Start all services: Kafka cluster (3 brokers) + Neo4j + Consumer + Monitoring
docker compose -f docker-compose.kafka.yml up -d

# Wait ~30 seconds for services to be healthy
sleep 30

# Verify all services are healthy
docker compose -f docker-compose.kafka.yml ps
```

### Initialize Schema

```bash
# Apply Neo4j constraints and indexes
docker compose -f docker-compose.kafka.yml exec neo4j cypher-shell \
  -u neo4j -p mind-reply-neo4j-pass \
  < services/neo4j/migrations/001-init-schema.cypher
```

### Create Kafka Topics

```bash
# Create all topics with retention policies
docker compose -f docker-compose.kafka.yml exec kafka-broker-1 \
  bash services/kafka/init-topics.sh
```

### Test End-to-End

```bash
# Send test messages and verify ingestion
docker compose -f docker-compose.kafka.yml exec kafka-broker-1 \
  bash services/ingestion/e2e-test.sh
```

---

## Service Descriptions

### Kafka Cluster (KRaft Mode)

**3 brokers** running in KRaft consensus mode (no Zookeeper):
- **kafka-broker-1** → Port 9091 (external), 29091 (internal)
- **kafka-broker-2** → Port 9092 (external), 29092 (internal)
- **kafka-broker-3** → Port 9093 (external), 29093 (internal)

Each broker is also a controller for quorum voting.

**Kafka Topics** (auto-created on first message or manual creation):
| Topic | Partitions | Replication | Retention | Purpose |
|-------|-----------|-------------|-----------|---------|
| `telemetry-events` | 3 | 3 | 7 days | Device/user activity |
| `order-lifecycle` | 3 | 3 | 30 days | Order state changes |
| `domain-provisioning` | 3 | 3 | 30 days | Domain registry updates |
| `audit-trail` | 3 | 3 | 1 year | NIS2/LCCP/AML compliance |
| `stripe-webhooks` | 3 | 3 | 30 days | Stripe payment events |
| `dlq-ingestion-errors` | 3 | 3 | 7 days | Failed ingestion messages |

**JMX Monitoring**:
- Metrics available at ports 9101, 9102, 9103
- Can be scraped by Prometheus for performance dashboards

### Neo4j Graph Database

**Port 7687** (Bolt protocol) — Driver connections
**Port 7474** (HTTP) — Browser UI at http://localhost:7474

**Credentials**: 
- User: `neo4j`
- Password: `mind-reply-neo4j-pass`

**Memory Configuration**:
- Heap: 1GB initial, 2GB max
- Page cache: 1GB
- Adjust in `docker-compose.kafka.yml` for larger graphs

**Volumes**:
- `/var/lib/neo4j/data` → Graph database files
- `/var/lib/neo4j/logs` → Query/error logs
- `/var/lib/neo4j/import/migrations` → Cypher migration scripts

**Schema**:
- 8 node types (Order, Domain, Customer, Payment, Audit, Registrar, Device, Event)
- 20+ constraints (uniqueness, property requirements)
- 24+ indexes (single-property + composite + full-text)

### Kafka → Neo4j Consumer

**Container**: `kafka-neo4j-consumer`

**Responsibilities**:
- Subscribe to all 5 Kafka topics
- Deserialize JSON messages
- Validate schemas with Pydantic
- UPSERT nodes/relationships into Neo4j (idempotent)
- Handle errors → dead-letter queue
- Log metrics every 100 messages

**Consumer Group**: `neo4j-ingestion-group`
**Offset Management**: Auto-commit (earliest offset)

### Kafka UI (Optional Web Console)

**Port 8081** → http://localhost:8081

Web-based UI for:
- Browsing topics and partitions
- Viewing consumer groups and lag
- Publishing test messages
- Monitoring broker metrics

### Infrastructure Monitor

Runs health checks every 60 seconds:
- Kafka broker JMX ports (9101, 9102, 9103)
- Neo4j Bolt protocol (7687)
- Kafka UI (8081)

---

## Common Operations

### Check Broker Health

```bash
# List all brokers and their status
docker exec kafka-broker-1 kafka-metadata.sh \
  --snapshot /var/lib/kafka/data/__cluster_metadata-0/00000000000000000000.log

# Or simple API version check
docker exec kafka-broker-1 \
  kafka-broker-api-versions.sh --bootstrap-server localhost:9091
```

### List Topics

```bash
docker exec kafka-broker-1 kafka-topics.sh \
  --bootstrap-server localhost:9091 \
  --list
```

### Describe Topic Details

```bash
docker exec kafka-broker-1 kafka-topics.sh \
  --bootstrap-server localhost:9091 \
  --describe --topic telemetry-events
```

### View Consumer Group Status

```bash
docker exec kafka-broker-1 kafka-consumer-groups.sh \
  --bootstrap-server localhost:9091 \
  --group neo4j-ingestion-group \
  --describe
```

### Reset Consumer Group Offset (Full Replay)

```bash
# Reset to earliest (replay all messages)
docker exec kafka-broker-1 kafka-consumer-groups.sh \
  --bootstrap-server localhost:9091 \
  --group neo4j-ingestion-group \
  --reset-offsets --to-earliest --execute

# Or reset to latest (skip old messages)
docker exec kafka-broker-1 kafka-consumer-groups.sh \
  --bootstrap-server localhost:9091 \
  --group neo4j-ingestion-group \
  --reset-offsets --to-latest --execute
```

### Produce Test Message (Manual)

```bash
docker exec -it kafka-broker-1 kafka-console-producer.sh \
  --broker-list localhost:9091 \
  --topic telemetry-events \
  --property "parse.key=true" \
  --property "key.separator=:"

# Then type: key1:{"event_id":"evt-001","device_id":"dev-001",...}
# Press Ctrl+D to exit
```

### Consume Messages (Verify Ingestion)

```bash
# Read last 10 messages from telemetry-events
docker exec kafka-broker-1 kafka-console-consumer.sh \
  --bootstrap-server localhost:9091 \
  --topic telemetry-events \
  --from-beginning \
  --max-messages 10 \
  --timeout-ms 5000
```

### Query Neo4j

```bash
# Open Neo4j Browser: http://localhost:7474
# Login: neo4j / mind-reply-neo4j-pass
# Run queries:

# Count all nodes by type
MATCH (n) RETURN labels(n) AS type, count(*) AS count

# Find all orders
MATCH (o:Order) RETURN o.order_id, o.status, o.tier LIMIT 10

# Find orders with their customers
MATCH (o:Order)-[:BELONGS_TO_CUSTOMER]->(c:Customer)
RETURN o.order_id, c.email, o.status

# Find domain provisioning chain
MATCH (o:Order)-[:PROVISIONS_DOMAIN]->(d:Domain)-[:MANAGED_BY]->(r:Registrar)
RETURN o.order_id, d.domain_name, r.name

# Find compliance audits
MATCH (a:ComplianceAudit)-[:AUDITS_CUSTOMER]->(c:Customer)
WHERE a.compliance_standard = "NIS2"
RETURN c.email, a.audit_id, a.status
```

### Monitor Consumer Logs

```bash
# Real-time logs
docker logs -f kafka-neo4j-consumer

# Last 100 lines
docker logs kafka-neo4j-consumer | tail -100
```

### Scale Kafka (Add Broker)

```bash
# Edit docker-compose.kafka.yml to add kafka-broker-4
# Adjust KAFKA_BROKER_ID, KAFKA_NODE_ID, ports, volumes
# Restart compose
docker compose -f docker-compose.kafka.yml up -d --no-deps kafka-broker-4
```

### Backup Neo4j

```bash
# Create backup snapshot
docker exec neo4j neo4j-admin database dump neo4j /var/lib/neo4j/data/backup.dump

# Copy to host
docker cp neo4j:/var/lib/neo4j/data/backup.dump ./backup.dump
```

### Restore Neo4j

```bash
# Copy backup to container
docker cp ./backup.dump neo4j:/var/lib/neo4j/data/backup.dump

# Restore (stop Neo4j first)
docker compose -f docker-compose.kafka.yml stop neo4j
docker exec neo4j neo4j-admin database load neo4j --from-dump /var/lib/neo4j/data/backup.dump
docker compose -f docker-compose.kafka.yml start neo4j
```

---

## Troubleshooting

### Kafka Brokers Not Starting

```bash
# Check logs
docker logs kafka-broker-1

# Common issue: KRaft metadata not initialized
# Solution: Ensure CLUSTER_ID is set (MkQkSWZyeWNrQWFQc0RBaQ==)
# And all brokers have same ID in quorum voters
```

### Neo4j Not Connecting

```bash
# Verify container is running
docker ps | grep neo4j

# Check logs
docker logs neo4j

# Test Bolt connection
docker exec neo4j cypher-shell -u neo4j -p mind-reply-neo4j-pass "RETURN 1"
```

### Consumer Lagging

```bash
# Check consumer group lag
docker exec kafka-broker-1 kafka-consumer-groups.sh \
  --bootstrap-server localhost:9091 \
  --group neo4j-ingestion-group \
  --describe

# If LAG is high, check consumer logs
docker logs kafka-neo4j-consumer | tail -50

# If Neo4j is bottleneck, check its slow queries
# In Neo4j Browser: :queries
```

### Neo4j Disk Full

```bash
# Check disk usage
docker exec neo4j df -h /var/lib/neo4j/data

# Clean up old transactions/logs
docker exec neo4j neo4j-admin database optimize neo4j
```

### Consumer Crashes on Startup

```bash
# Likely cause: Neo4j not ready
# Wait longer:
docker compose -f docker-compose.kafka.yml up -d
sleep 60
docker logs kafka-neo4j-consumer

# Or rebuild consumer image
docker compose -f docker-compose.kafka.yml build --no-cache kafka-neo4j-consumer
docker compose -f docker-compose.kafka.yml up -d kafka-neo4j-consumer
```

---

## Performance Tuning

### Kafka Broker Performance

Edit `docker-compose.kafka.yml`:
```yaml
KAFKA_NUM_IO_THREADS: 8          # Default 8, increase for high throughput
KAFKA_NUM_NETWORK_THREADS: 5     # Default 3, increase for many connections
KAFKA_LOG_FLUSH_INTERVAL_MESSAGES: 10000
KAFKA_LOG_CLEANUP_POLICY: "delete"
```

### Neo4j Query Performance

```bash
# Enable query logging
docker exec neo4j cypher-shell -u neo4j -p mind-reply-neo4j-pass \
  "CALL dbms.queryJmxAttribute('Queries')"

# Analyze slow queries
# In Neo4j Browser: :queries
# Then PROFILE your query to see execution plan
PROFILE MATCH (o:Order)-[:BELONGS_TO_CUSTOMER]->(c:Customer) RETURN o, c
```

### Consumer Batching

Edit `services/ingestion/kafka_neo4j_consumer.py`:
```python
max_poll_records=500      # Default 100, increase for batch efficiency
max_poll_interval_ms=600000  # 10 minutes, increase if Neo4j is slow
```

---

## Production Deployment

### To Google Cloud Platform (GCP)

1. **Push images to Artifact Registry**:
   ```bash
   docker tag kafka-neo4j-consumer gcr.io/mind-reply-496111/kafka-neo4j-consumer:v1
   docker push gcr.io/mind-reply-496111/kafka-neo4j-consumer:v1
   ```

2. **Deploy Kafka cluster to Cloud Pub/Sub** (managed) or VM instances

3. **Deploy Neo4j to Cloud Run with persistent disk** or Compute Engine

4. **Update docker-compose.kafka.yml** with GCP endpoints

5. **Run migrations**:
   ```bash
   gcloud compute ssh neo4j-instance -- \
     "docker exec neo4j cypher-shell -u neo4j -p <PASSWORD> < migrations.cypher"
   ```

### Monitoring & Alerting

- **Prometheus** → Scrape Kafka JMX (9101-9103) and Neo4j metrics
- **Grafana** → Dashboard for cluster health
- **PagerDuty/Slack** → Alert on consumer lag > 1000 or Neo4j query time > 5s

---

## Next Steps

1. ✅ Start infrastructure: `docker compose -f docker-compose.kafka.yml up -d`
2. ✅ Initialize schema: Apply `001-init-schema.cypher`
3. ✅ Create topics: Run `init-topics.sh`
4. ✅ Run end-to-end test: Execute `e2e-test.sh`
5. ✅ Monitor: Check Kafka UI (http://localhost:8081) and Neo4j Browser (http://localhost:7474)
6. ⏭️ Integrate with ResellerPro: Wire order/domain/audit events to Kafka topics
7. ⏭️ Set up Prometheus + Grafana for real-time dashboards
8. ⏭️ Deploy to GCP Cloud Run / Compute Engine

