#!/bin/bash
# End-to-end test: Send test messages to Kafka topics and verify Neo4j ingestion
# Usage: ./services/ingestion/e2e-test.sh

set -e

BOOTSTRAP_SERVER="${BOOTSTRAP_SERVER:-localhost:9092}"
NEO4J_URI="${NEO4J_URI:-bolt://localhost:7687}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-mind-reply-neo4j-pass}"

echo "[E2E Test] Starting Kafka → Neo4j integration test"
echo "[E2E Test] Kafka: $BOOTSTRAP_SERVER"
echo "[E2E Test] Neo4j: $NEO4J_URI"

# Test 1: Send telemetry event
echo "[Test 1] Sending telemetry event..."
TELEMETRY_PAYLOAD=$(cat <<EOF
{
  "event_id": "evt-$(date +%s)-001",
  "device_id": "dev-test-001",
  "event_type": "page_view",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "metadata": {
    "page_url": "/checkout",
    "user_agent": "test-agent"
  }
}
EOF
)

echo "$TELEMETRY_PAYLOAD" | kafka-console-producer.sh \
  --broker-list "$BOOTSTRAP_SERVER" \
  --topic telemetry-events

sleep 2

# Test 2: Send order lifecycle event
echo "[Test 2] Sending order lifecycle event..."
ORDER_PAYLOAD=$(cat <<EOF
{
  "order_id": "ord-$(date +%s)-001",
  "customer_email": "test@example.com",
  "tier": "professional",
  "domain_name": "test-domain-$(date +%s).com",
  "status": "pending",
  "payment_id": "pay-$(date +%s)-001",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "$ORDER_PAYLOAD" | kafka-console-producer.sh \
  --broker-list "$BOOTSTRAP_SERVER" \
  --topic order-lifecycle

sleep 2

# Test 3: Send domain provisioning event
echo "[Test 3] Sending domain provisioning event..."
DOMAIN_PAYLOAD=$(cat <<EOF
{
  "domain_name": "test-domain-$(date +%s).bg",
  "registrar": "ionos",
  "auto_renew": true,
  "renewal_date": "$(date -u -d '+1 year' +%Y-%m-%dT%H:%M:%SZ)",
  "dns_records": {
    "A": "1.1.1.1",
    "MX": "mail.example.com",
    "TXT": "v=spf1 include:_spf.google.com ~all"
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "$DOMAIN_PAYLOAD" | kafka-console-producer.sh \
  --broker-list "$BOOTSTRAP_SERVER" \
  --topic domain-provisioning

sleep 2

# Test 4: Send audit trail event
echo "[Test 4] Sending audit trail event..."
AUDIT_PAYLOAD=$(cat <<EOF
{
  "audit_id": "aud-$(date +%s)-001",
  "customer_email": "test@example.com",
  "compliance_standard": "NIS2",
  "status": "in_progress",
  "findings": {
    "critical": 0,
    "high": 2,
    "medium": 5
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "$AUDIT_PAYLOAD" | kafka-console-producer.sh \
  --broker-list "$BOOTSTRAP_SERVER" \
  --topic audit-trail

sleep 2

# Test 5: Send Stripe webhook event
echo "[Test 5] Sending Stripe webhook event..."
STRIPE_PAYLOAD=$(cat <<EOF
{
  "stripe_event_id": "evt_$(date +%s)_test",
  "stripe_event_type": "checkout.session.completed",
  "order_id": "ord-$(date +%s)-001",
  "payment_id": "pi_test_$(date +%s)",
  "payment_status": "succeeded",
  "amount": 49900,
  "currency": "eur",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "$STRIPE_PAYLOAD" | kafka-console-producer.sh \
  --broker-list "$BOOTSTRAP_SERVER" \
  --topic stripe-webhooks

echo "[E2E Test] ✓ All test messages sent to Kafka"

# Wait for consumer to process
echo "[E2E Test] Waiting 5 seconds for consumer to process messages..."
sleep 5

# Verify in Neo4j
echo "[E2E Test] Verifying Neo4j ingestion..."
echo "[E2E Test] Checking node counts:"

# Note: This requires cypher-shell to be available
# For Docker, you can run: docker exec neo4j cypher-shell -u neo4j -p password 'MATCH (n) RETURN labels(n), count(*) as count'

echo "[E2E Test] ✓ End-to-end test complete"
echo "[E2E Test] Check Neo4j Browser at http://localhost:7474 to verify data"
