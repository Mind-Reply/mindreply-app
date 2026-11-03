-- Add durable Stripe event receipt, usage attribution and invoice/adjustment projections.
-- Apply only through the phone-first-saas-starter Prisma migration workflow in an isolated DB.

CREATE TABLE "StripeEvent" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "objectId" TEXT,
  "livemode" BOOLEAN NOT NULL,
  "apiVersion" TEXT,
  "status" TEXT NOT NULL DEFAULT 'RECEIVED',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StripeEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StripeEvent_status_updatedAt_idx" ON "StripeEvent"("status", "updatedAt");
CREATE INDEX "StripeEvent_type_receivedAt_idx" ON "StripeEvent"("type", "receivedAt");
CREATE INDEX "StripeEvent_livemode_receivedAt_idx" ON "StripeEvent"("livemode", "receivedAt");

CREATE TABLE "UsageMeterEvent" (
  "id" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "clerkId" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "workloadType" TEXT NOT NULL,
  "quantity" DECIMAL(24,8) NOT NULL,
  "unit" TEXT NOT NULL,
  "stripeCustomerId" TEXT,
  "stripeMeterName" TEXT,
  "stripeMeterEventIdentifier" TEXT,
  "submittedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "status" TEXT NOT NULL DEFAULT 'RECORDED_PENDING_METER',
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UsageMeterEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UsageMeterEvent_idempotencyKey_key" ON "UsageMeterEvent"("idempotencyKey");
CREATE UNIQUE INDEX "UsageMeterEvent_stripeMeterEventIdentifier_key" ON "UsageMeterEvent"("stripeMeterEventIdentifier");
CREATE INDEX "UsageMeterEvent_organizationId_createdAt_idx" ON "UsageMeterEvent"("organizationId", "createdAt");
CREATE INDEX "UsageMeterEvent_status_createdAt_idx" ON "UsageMeterEvent"("status", "createdAt");
CREATE INDEX "UsageMeterEvent_department_workloadType_occurredAt_idx" ON "UsageMeterEvent"("department", "workloadType", "occurredAt");

CREATE TABLE "StripeInvoice" (
  "id" TEXT NOT NULL,
  "stripeInvoiceId" TEXT NOT NULL,
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT,
  "status" TEXT NOT NULL,
  "amountDue" INTEGER NOT NULL,
  "amountPaid" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "livemode" BOOLEAN NOT NULL,
  "dueAt" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "hostedInvoiceUrl" TEXT,
  "invoicePdf" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StripeInvoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StripeInvoice_stripeInvoiceId_key" ON "StripeInvoice"("stripeInvoiceId");
CREATE INDEX "StripeInvoice_stripeCustomerId_createdAt_idx" ON "StripeInvoice"("stripeCustomerId", "createdAt");
CREATE INDEX "StripeInvoice_status_createdAt_idx" ON "StripeInvoice"("status", "createdAt");
CREATE INDEX "StripeInvoice_livemode_createdAt_idx" ON "StripeInvoice"("livemode", "createdAt");

CREATE TABLE "StripeAdjustment" (
  "id" TEXT NOT NULL,
  "stripeObjectId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "paymentIntentId" TEXT,
  "stripeChargeId" TEXT,
  "amount" INTEGER NOT NULL,
  "currency" TEXT,
  "status" TEXT NOT NULL,
  "livemode" BOOLEAN NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StripeAdjustment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StripeAdjustment_stripeObjectId_key" ON "StripeAdjustment"("stripeObjectId");
CREATE INDEX "StripeAdjustment_paymentIntentId_createdAt_idx" ON "StripeAdjustment"("paymentIntentId", "createdAt");
CREATE INDEX "StripeAdjustment_kind_createdAt_idx" ON "StripeAdjustment"("kind", "createdAt");
