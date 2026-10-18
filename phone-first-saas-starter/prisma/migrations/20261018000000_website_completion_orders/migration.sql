CREATE TABLE "OneTimeOrder" (
    "id" TEXT NOT NULL,
    "packageKey" TEXT NOT NULL,
    "offerVersion" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "customerEmail" TEXT,
    "amountTotal" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "livemode" BOOLEAN NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OneTimeOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OneTimeOrder_stripeCheckoutSessionId_key"
    ON "OneTimeOrder"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "OneTimeOrder_stripePaymentIntentId_key"
    ON "OneTimeOrder"("stripePaymentIntentId");
CREATE INDEX "OneTimeOrder_packageKey_paymentStatus_idx"
    ON "OneTimeOrder"("packageKey", "paymentStatus");
