#!/usr/bin/env python3
"""
Kafka → Neo4j Real-Time Ingestion Consumer

Purpose: Subscribe to Kafka topics (telemetry, orders, domains, audits, Stripe webhooks)
and ingest events into Neo4j graph in real-time with idempotent UPSERT logic.

Topics:
  - telemetry-events: Device/user activity
  - order-lifecycle: ResellerPro order state changes
  - domain-provisioning: Domain registry updates
  - audit-trail: NIS2/LCCP/AML compliance events
  - stripe-webhooks: Stripe payment events
"""

import json
import logging
import os
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum

from kafka import KafkaConsumer
from kafka.errors import KafkaError
from neo4j import GraphDatabase, Session
from neo4j.exceptions import ServiceUnavailable, Neo4jError
from pydantic import BaseModel, Field

# ============================================================================
# CONFIGURATION
# ============================================================================

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "localhost:9092").split(",")
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Kafka topics to subscribe
KAFKA_TOPICS = [
    "telemetry-events",
    "order-lifecycle",
    "domain-provisioning",
    "audit-trail",
    "stripe-webhooks",
]

# Dead Letter Queue for failed messages
DLQ_TOPIC = "dlq-ingestion-errors"

# ============================================================================
# LOGGING SETUP
# ============================================================================

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="[%(asctime)s] %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger(__name__)

# ============================================================================
# PYDANTIC MODELS (Schema Validation)
# ============================================================================


class EventType(str, Enum):
    """Supported event types from Kafka topics."""

    TELEMETRY = "telemetry-events"
    ORDER = "order-lifecycle"
    DOMAIN = "domain-provisioning"
    AUDIT = "audit-trail"
    STRIPE = "stripe-webhooks"


class TelemetryEvent(BaseModel):
    """Device/user activity telemetry."""

    event_id: str
    device_id: str
    event_type: str
    timestamp: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class OrderLifecycleEvent(BaseModel):
    """Order state change event."""

    order_id: str
    customer_email: str
    tier: str
    domain_name: str
    status: str  # pending, provisioned, failed
    payment_id: Optional[str] = None
    timestamp: str


class DomainProvisioningEvent(BaseModel):
    """Domain registry event."""

    domain_name: str
    registrar: str
    auto_renew: bool
    renewal_date: str
    dns_records: Dict[str, str] = Field(default_factory=dict)
    timestamp: str


class AuditTrailEvent(BaseModel):
    """Compliance/NIS2 audit event."""

    audit_id: str
    customer_email: str
    compliance_standard: str  # NIS2, LCCP, AML, RTS
    status: str  # pending, in_progress, passed, failed
    findings: Dict[str, Any] = Field(default_factory=dict)
    timestamp: str


class StripeWebhookEvent(BaseModel):
    """Stripe webhook event payload."""

    stripe_event_id: str
    stripe_event_type: str
    order_id: str
    payment_id: str
    payment_status: str
    amount: int
    currency: str
    timestamp: str


# ============================================================================
# NEO4J INGESTION SERVICE
# ============================================================================


class KafkaNeo4jConsumer:
    """Main consumer class: reads from Kafka, writes to Neo4j."""

    def __init__(
        self,
        kafka_bootstrap: list,
        neo4j_uri: str,
        neo4j_user: str,
        neo4j_password: str,
    ):
        self.kafka_bootstrap = kafka_bootstrap
        self.neo4j_uri = neo4j_uri

        # Initialize Kafka consumer
        self.consumer = None
        self._init_kafka_consumer()

        # Initialize Neo4j driver
        self.driver = None
        self._init_neo4j_driver(neo4j_uri, neo4j_user, neo4j_password)

        # Metrics
        self.messages_processed = 0
        self.messages_failed = 0
        self.start_time = datetime.now()

    def _init_kafka_consumer(self):
        """Initialize Kafka consumer with error handling."""
        retries = 3
        for attempt in range(retries):
            try:
                logger.info(
                    f"[Attempt {attempt + 1}/{retries}] Connecting to Kafka: {self.kafka_bootstrap}"
                )
                self.consumer = KafkaConsumer(
                    bootstrap_servers=self.kafka_bootstrap,
                    group_id="neo4j-ingestion-group",
                    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                    auto_offset_reset="earliest",
                    enable_auto_commit=True,
                    session_timeout_ms=30000,
                    heartbeat_interval_ms=10000,
                    max_poll_records=100,
                    max_poll_interval_ms=300000,
                )
                logger.info("✓ Kafka consumer initialized successfully")
                return
            except Exception as e:
                logger.error(f"Kafka connection failed: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** (attempt + 1))  # Exponential backoff
                else:
                    raise

    def _init_neo4j_driver(self, uri: str, user: str, password: str):
        """Initialize Neo4j driver with error handling."""
        retries = 3
        for attempt in range(retries):
            try:
                logger.info(f"[Attempt {attempt + 1}/{retries}] Connecting to Neo4j: {uri}")
                self.driver = GraphDatabase.driver(uri, auth=(user, password))
                # Test connection
                with self.driver.session() as session:
                    session.run("RETURN 1")
                logger.info("✓ Neo4j driver initialized successfully")
                return
            except Exception as e:
                logger.error(f"Neo4j connection failed: {e}")
                if attempt < retries - 1:
                    time.sleep(2 ** (attempt + 1))
                else:
                    raise

    def subscribe_and_consume(self):
        """Subscribe to topics and consume messages in infinite loop."""
        logger.info(f"Subscribing to topics: {KAFKA_TOPICS}")
        self.consumer.subscribe(KAFKA_TOPICS)

        try:
            for message in self.consumer:
                try:
                    self._process_message(message)
                except Exception as e:
                    logger.error(f"Error processing message: {e}", exc_info=True)
                    self.messages_failed += 1
                    # Could send to DLQ here
        except KeyboardInterrupt:
            logger.info("Consumer interrupted by user")
        finally:
            self.close()

    def _process_message(self, message):
        """Route messages to appropriate ingestion handler."""
        topic = message.topic
        payload = message.value

        logger.debug(f"Processing message from topic '{topic}': {json.dumps(payload)[:100]}...")

        try:
            if topic == "telemetry-events":
                event = TelemetryEvent(**payload)
                self._ingest_telemetry(event)
            elif topic == "order-lifecycle":
                event = OrderLifecycleEvent(**payload)
                self._ingest_order(event)
            elif topic == "domain-provisioning":
                event = DomainProvisioningEvent(**payload)
                self._ingest_domain(event)
            elif topic == "audit-trail":
                event = AuditTrailEvent(**payload)
                self._ingest_audit(event)
            elif topic == "stripe-webhooks":
                event = StripeWebhookEvent(**payload)
                self._ingest_stripe_webhook(event)

            self.messages_processed += 1

            # Log metrics every 100 messages
            if self.messages_processed % 100 == 0:
                self._log_metrics()

        except ValueError as e:
            logger.error(f"Validation error for message from {topic}: {e}")
            self.messages_failed += 1

    # ========================================================================
    # INGESTION HANDLERS
    # ========================================================================

    def _ingest_telemetry(self, event: TelemetryEvent):
        """Create DeviceEvent node linked to Device."""
        query = """
        MERGE (device:Device {device_id: $device_id})
        ON CREATE SET device.created_at = datetime()
        
        CREATE (evt:DeviceEvent {
            event_id: $event_id,
            device_id: $device_id,
            event_type: $event_type,
            timestamp: $timestamp,
            metadata: $metadata
        })
        
        CREATE (evt)-[:GENERATED_ON_DEVICE]->(device)
        RETURN evt, device
        """

        with self.driver.session() as session:
            try:
                result = session.run(
                    query,
                    {
                        "event_id": event.event_id,
                        "device_id": event.device_id,
                        "event_type": event.event_type,
                        "timestamp": event.timestamp,
                        "metadata": event.metadata,
                    },
                )
                logger.debug(f"✓ Telemetry ingested: {event.event_id}")
            except Neo4jError as e:
                logger.error(f"Neo4j error ingesting telemetry: {e}")
                raise

    def _ingest_order(self, event: OrderLifecycleEvent):
        """Upsert Order node linked to Customer, Payment, Domain (idempotent)."""
        query = """
        MERGE (customer:Customer {email: $customer_email})
        ON CREATE SET customer.created_at = datetime()
        
        MERGE (order:Order {order_id: $order_id})
        SET order.status = $status,
            order.tier = $tier,
            order.customer_email = $customer_email,
            order.updated_at = datetime()
        
        MERGE (payment:PaymentIntent {payment_id: $payment_id})
        ON CREATE SET payment.created_at = datetime()
        SET payment.status = "pending"
        
        MERGE (domain:Domain {domain_name: $domain_name})
        ON CREATE SET domain.created_at = datetime()
        
        MERGE (order)-[:BELONGS_TO_CUSTOMER]->(customer)
        MERGE (order)-[:HAS_PAYMENT]->(payment)
        MERGE (order)-[:PROVISIONS_DOMAIN]->(domain)
        
        RETURN order, customer, payment, domain
        """

        with self.driver.session() as session:
            try:
                result = session.run(
                    query,
                    {
                        "order_id": event.order_id,
                        "customer_email": event.customer_email,
                        "tier": event.tier,
                        "domain_name": event.domain_name,
                        "status": event.status,
                        "payment_id": event.payment_id or f"pay-{event.order_id}",
                    },
                )
                logger.debug(f"✓ Order ingested: {event.order_id} -> {event.status}")
            except Neo4jError as e:
                logger.error(f"Neo4j error ingesting order: {e}")
                raise

    def _ingest_domain(self, event: DomainProvisioningEvent):
        """Upsert Domain node with registrar and renewal info (idempotent)."""
        query = """
        MERGE (registrar:Registrar {name: $registrar})
        ON CREATE SET registrar.created_at = datetime()
        
        MERGE (domain:Domain {domain_name: $domain_name})
        SET domain.registrar = $registrar,
            domain.auto_renew = $auto_renew,
            domain.renewal_date = $renewal_date,
            domain.dns_records = $dns_records,
            domain.updated_at = datetime()
        
        MERGE (domain)-[:MANAGED_BY]->(registrar)
        
        RETURN domain, registrar
        """

        with self.driver.session() as session:
            try:
                result = session.run(
                    query,
                    {
                        "domain_name": event.domain_name,
                        "registrar": event.registrar,
                        "auto_renew": event.auto_renew,
                        "renewal_date": event.renewal_date,
                        "dns_records": event.dns_records,
                    },
                )
                logger.debug(f"✓ Domain ingested: {event.domain_name}")
            except Neo4jError as e:
                logger.error(f"Neo4j error ingesting domain: {e}")
                raise

    def _ingest_audit(self, event: AuditTrailEvent):
        """Create ComplianceAudit node linked to Customer (idempotent)."""
        query = """
        MATCH (customer:Customer {email: $customer_email})
        
        MERGE (audit:ComplianceAudit {audit_id: $audit_id})
        SET audit.compliance_standard = $compliance_standard,
            audit.status = $status,
            audit.findings = $findings,
            audit.timestamp = $timestamp,
            audit.updated_at = datetime()
        
        MERGE (audit)-[:AUDITS_CUSTOMER]->(customer)
        
        RETURN audit, customer
        """

        with self.driver.session() as session:
            try:
                result = session.run(
                    query,
                    {
                        "audit_id": event.audit_id,
                        "customer_email": event.customer_email,
                        "compliance_standard": event.compliance_standard,
                        "status": event.status,
                        "findings": event.findings,
                        "timestamp": event.timestamp,
                    },
                )
                logger.debug(f"✓ Audit ingested: {event.audit_id}")
            except Neo4jError as e:
                logger.error(f"Neo4j error ingesting audit: {e}")
                raise

    def _ingest_stripe_webhook(self, event: StripeWebhookEvent):
        """Handle Stripe webhook events (payment updates) (idempotent)."""
        query = """
        MATCH (order:Order {order_id: $order_id})
        
        MERGE (payment:PaymentIntent {payment_id: $payment_id})
        SET payment.status = $payment_status,
            payment.amount = $amount,
            payment.currency = $currency,
            payment.stripe_event_id = $stripe_event_id,
            payment.updated_at = datetime()
        
        MERGE (order)-[:HAS_PAYMENT]->(payment)
        
        RETURN order, payment
        """

        with self.driver.session() as session:
            try:
                result = session.run(
                    query,
                    {
                        "order_id": event.order_id,
                        "payment_id": event.payment_id,
                        "payment_status": event.payment_status,
                        "amount": event.amount,
                        "currency": event.currency,
                        "stripe_event_id": event.stripe_event_id,
                    },
                )
                logger.debug(f"✓ Stripe webhook ingested: {event.stripe_event_id}")
            except Neo4jError as e:
                logger.error(f"Neo4j error ingesting Stripe webhook: {e}")
                raise

    # ========================================================================
    # UTILITIES
    # ========================================================================

    def _log_metrics(self):
        """Log ingestion metrics."""
        elapsed = (datetime.now() - self.start_time).total_seconds()
        rate = self.messages_processed / elapsed if elapsed > 0 else 0
        logger.info(
            f"[Metrics] Processed: {self.messages_processed} | "
            f"Failed: {self.messages_failed} | "
            f"Rate: {rate:.2f} msg/s | "
            f"Elapsed: {elapsed:.0f}s"
        )

    def close(self):
        """Close Kafka consumer and Neo4j driver."""
        logger.info("Closing connections...")
        if self.consumer:
            self.consumer.close()
        if self.driver:
            self.driver.close()
        logger.info("✓ All connections closed")


# ============================================================================
# MAIN ENTRY POINT
# ============================================================================


def main():
    """Main entry point."""
    logger.info("Starting Kafka → Neo4j Ingestion Consumer")
    logger.info(f"Kafka bootstrap: {KAFKA_BOOTSTRAP}")
    logger.info(f"Neo4j URI: {NEO4J_URI}")
    logger.info(f"Topics: {KAFKA_TOPICS}")

    try:
        consumer = KafkaNeo4jConsumer(
            kafka_bootstrap=KAFKA_BOOTSTRAP,
            neo4j_uri=NEO4J_URI,
            neo4j_user=NEO4J_USER,
            neo4j_password=NEO4J_PASSWORD,
        )
        consumer.subscribe_and_consume()
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
