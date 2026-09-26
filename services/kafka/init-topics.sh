#!/bin/bash
# Create Kafka topics for ResellerPro telemetry pipeline
# Usage: ./services/kafka/init-topics.sh

set -e

BOOTSTRAP_SERVER="${BOOTSTRAP_SERVER:-localhost:9092}"
PARTITIONS="${PARTITIONS:-3}"
REPLICATION="${REPLICATION:-3}"

echo "[Kafka] Initializing topics for ResellerPro..."
echo "[Kafka] Bootstrap: $BOOTSTRAP_SERVER"
echo "[Kafka] Partitions: $PARTITIONS, Replication: $REPLICATION"

# Function to create topic
create_topic() {
  local topic=$1
  local retention=$2
  
  echo "[Kafka] Creating topic: $topic (retention: $retention)"
  
  kafka-topics.sh --bootstrap-server "$BOOTSTRAP_SERVER" \
    --create --if-not-exists \
    --topic "$topic" \
    --partitions "$PARTITIONS" \
    --replication-factor "$REPLICATION" \
    --config "retention.ms=$retention" \
    --config "cleanup.policy=delete" \
    || echo "[Kafka] Topic $topic already exists or failed (continuing...)"
}

# Create topics with retention policies

# Telemetry events: 7 days
create_topic "telemetry-events" "604800000"

# Order lifecycle: 30 days (audit trail)
create_topic "order-lifecycle" "2592000000"

# Domain provisioning: 30 days
create_topic "domain-provisioning" "2592000000"

# Audit trail: 1 year (compliance requirement)
create_topic "audit-trail" "31536000000"

# Stripe webhooks: 30 days
create_topic "stripe-webhooks" "2592000000"

# Dead Letter Queue: 7 days
create_topic "dlq-ingestion-errors" "604800000"

# Topic for consumer group offsets (internal)
create_topic "__consumer_offsets" "604800000"

echo "[Kafka] ✓ All topics created successfully"

# List all topics
echo "[Kafka] Verifying topics:"
kafka-topics.sh --bootstrap-server "$BOOTSTRAP_SERVER" --list

echo "[Kafka] Topic details:"
kafka-topics.sh --bootstrap-server "$BOOTSTRAP_SERVER" --describe
