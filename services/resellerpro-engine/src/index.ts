import express, { Request, Response } from "express";
import expressAsyncErrors from "express-async-errors";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import dotenv from "dotenv";
import pinoHttp from "pino-http";
import { z } from "zod";

dotenv.config();
expressAsyncErrors();

// === CONFIGURATION ===
const PORT = parseInt(process.env.PORT || "8080", 10);
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const IONOS_API_KEY = process.env.IONOS_API_KEY || "";
const IONOS_API_SECRET = process.env.IONOS_API_SECRET || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: "2024-11-20",
});

const app = express();

// === LOGGING ===
const logger = pinoHttp();
app.use(logger);
app.use(express.json({ limit: "10mb" }));

// === VALIDATION SCHEMAS ===
const OrderSchema = z.object({
  order_id: z.string().uuid().optional(),
  customer_email: z.string().email(),
  tier: z.enum(["starter", "professional", "enterprise"]),
  domain_name: z.string().min(3).max(63),
  status: z.enum(["pending", "provisioned", "failed"]).optional(),
});

const StripeWebhookPayload = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.object({
      id: z.string(),
      metadata: z.record(z.string()).optional(),
    }),
  }),
});

// === TYPES ===
interface ResellerOrder {
  order_id: string;
  customer_email: string;
  tier: "starter" | "professional" | "enterprise";
  domain_name: string;
  status: "pending" | "provisioned" | "failed";
  provisioned_at?: string;
}

interface DomainRecord {
  domain_id: string;
  domain_name: string;
  registrar: string;
  renewal_date: string;
  auto_renew: boolean;
  dns_records: Record<string, string>;
}

// === TIER PRICING ===
const TIER_PRICING: Record<string, number> = {
  starter: 29900, // €299 in cents
  professional: 49900, // €499
  enterprise: 89900, // €899
};

const TIER_FEATURES: Record<string, { domains: number; audits: number }> = {
  starter: { domains: 5, audits: 2 },
  professional: { domains: 20, audits: 5 },
  enterprise: { domains: 100, audits: 20 },
};

// === DOMAIN AVAILABILITY CHECK ===
async function checkDomainAvailability(
  domain: string
): Promise<{ available: boolean; registrar: string }> {
  const [name, tld] = domain.split(".");

  // IONOS API check (primary)
  if (tld === "bg" || tld === "com" || tld === "eu") {
    try {
      const response = await fetch(
        `https://api.ionos.com/v1/domains/${domain}/checks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${IONOS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ domains: [domain] }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const available =
          result.available || result.domainChecks?.[0]?.available;
        if (available) {
          return { available: true, registrar: "ionos" };
        }
      }
    } catch (err) {
      console.error(`IONOS check failed for ${domain}:`, err);
    }
  }

  // Fallback: Bulgarian domain registry (CCTLD.BG)
  if (tld === "bg") {
    try {
      const response = await fetch(`https://www.register.bg/whois/${domain}`);
      const text = await response.text();
      // If "not found" in response, domain is available
      if (!text.includes("Domain Status: ok") && !text.includes("registered")) {
        return { available: true, registrar: "cctld-bg" };
      }
    } catch (err) {
      console.error(`CCTLD.BG check failed for ${domain}:`, err);
    }
  }

  return { available: false, registrar: "unknown" };
}

// === IDEMPOTENT ORDER PROVISIONING ===
async function provisionOrder(order: ResellerOrder): Promise<void> {
  const { order_id, domain_name, tier, customer_email } = order;

  console.log(`[PROVISION] Starting for order ${order_id}: ${domain_name}`);

  // 1. Check domain availability
  const { available, registrar } = await checkDomainAvailability(domain_name);
  if (!available) {
    console.warn(
      `[PROVISION] Domain ${domain_name} unavailable, marking order as failed`
    );
    await supabase
      .from("resellerpro_orders")
      .update({ status: "failed" })
      .eq("order_id", order_id);
    return;
  }

  console.log(`[PROVISION] Domain ${domain_name} available via ${registrar}`);

  // 2. Create domain record (idempotent via UPSERT)
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  const { error: domainError } = await supabase
    .from("resellerpro_domains")
    .upsert(
      {
        domain_name,
        registrar,
        renewal_date: renewalDate.toISOString(),
        auto_renew: true,
        dns_records: {
          A: "1.1.1.1",
          MX: "mail.example.com",
          TXT: `v=spf1 include:_spf.google.com ~all`,
        },
      },
      { onConflict: "domain_name" }
    );

  if (domainError) {
    console.error(`[PROVISION] Failed to create domain record:`, domainError);
    await supabase
      .from("resellerpro_orders")
      .update({ status: "failed" })
      .eq("order_id", order_id);
    return;
  }

  // 3. Update order status to provisioned
  const now = new Date().toISOString();
  const { error: orderError } = await supabase
    .from("resellerpro_orders")
    .update({
      status: "provisioned",
      provisioned_at: now,
    })
    .eq("order_id", order_id);

  if (orderError) {
    console.error(`[PROVISION] Failed to update order:`, orderError);
    return;
  }

  console.log(`[PROVISION] ✓ Order ${order_id} provisioned successfully`);
}

// === STRIPE WEBHOOK HANDLER ===
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig as string,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`[WEBHOOK] Invalid signature: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[WEBHOOK] Received event: ${event.type}`);

  // Handle Checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const { order_id, tier, domain_name, customer_email } = metadata as any;

    if (!order_id || !tier || !domain_name || !customer_email) {
      console.warn(`[WEBHOOK] Missing metadata on checkout session ${session.id}`);
      return res.status(400).json({ error: "Missing order metadata" });
    }

    const newOrder: ResellerOrder = {
      order_id,
      tier: tier as "starter" | "professional" | "enterprise",
      domain_name,
      customer_email,
      status: "pending",
    };

    // Idempotent UPSERT: if order_id already exists, skip
    const { error, data } = await supabase
      .from("resellerpro_orders")
      .upsert([newOrder], { onConflict: "order_id" })
      .select();

    if (error) {
      console.error(`[WEBHOOK] UPSERT failed:`, error);
      return res.status(500).json({ error: "Database error" });
    }

    console.log(`[WEBHOOK] ✓ Order inserted/updated: ${order_id}`);

    // Trigger provisioning (async, non-blocking)
    setImmediate(() => provisionOrder(newOrder));

    return res.status(200).json({ received: true });
  }

  // Handle payment intent failed
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.warn(`[WEBHOOK] Payment failed: ${intent.id}`);
    return res.status(200).json({ received: true });
  }

  res.status(200).json({ received: true });
});

// === REST ENDPOINTS ===

// GET /api/health - Kubernetes/Docker healthcheck
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// POST /api/orders - Create a Stripe checkout session
app.post("/api/orders", async (req: Request, res: Response) => {
  const { customer_email, tier, domain_name } = OrderSchema.parse(req.body);

  const priceInCents = TIER_PRICING[tier];
  const features = TIER_FEATURES[tier];

  if (!priceInCents) {
    return res.status(400).json({ error: "Invalid tier" });
  }

  try {
    // Generate idempotent order ID
    const order_id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `ResellerPro ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
              description: `${features.domains} domains, ${features.audits} NIS2 audits`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/cancel`,
      metadata: {
        order_id,
        tier,
        domain_name,
        customer_email,
      },
    });

    console.log(`[ORDER] Created checkout session: ${session.id}`);
    res.status(201).json({
      order_id,
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (err: any) {
    console.error(`[ORDER] Stripe error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:order_id - Fetch order status
app.get("/api/orders/:order_id", async (req: Request, res: Response) => {
  const { order_id } = req.params;

  const { data, error } = await supabase
    .from("resellerpro_orders")
    .select("*")
    .eq("order_id", order_id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.status(200).json(data);
});

// GET /api/domains/:domain_name - Fetch domain record
app.get("/api/domains/:domain_name", async (req: Request, res: Response) => {
  const { domain_name } = req.params;

  const { data, error } = await supabase
    .from("resellerpro_domains")
    .select("*")
    .eq("domain_name", domain_name)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Domain not found" });
  }

  res.status(200).json(data);
});

// === ERROR HANDLING ===
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("[ERROR]", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
);

// === SERVER START ===
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[SERVER] ResellerPro engine running on port ${PORT}`);
  console.log(`[CONFIG] Supabase: ${SUPABASE_URL}`);
  console.log(`[CONFIG] Stripe: ${STRIPE_SECRET?.substring(0, 8)}...`);
});

export default app;
