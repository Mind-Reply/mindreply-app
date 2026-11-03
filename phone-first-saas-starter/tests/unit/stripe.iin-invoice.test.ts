import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  userFindUnique: vi.fn(),
  subscriptionFindUnique: vi.fn(),
  iinOrderFindFirst: vi.fn(),
  getStripe: vi.fn(),
  invoiceCreate: vi.fn(),
  invoiceItemCreate: vi.fn(),
  invoiceRetrieve: vi.fn(),
  stripeInvoiceUpsert: vi.fn(),
  resolveIINOffer: vi.fn(),
}));

vi.mock("@/lib/clerk", () => ({ requireAuth: mocks.requireAuth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mocks.userFindUnique },
    subscription: { findUnique: mocks.subscriptionFindUnique },
    iINOrder: { findFirst: mocks.iinOrderFindFirst },
    stripeInvoice: { upsert: mocks.stripeInvoiceUpsert },
  },
}));
vi.mock("@/lib/stripe", () => ({ getStripe: mocks.getStripe }));
vi.mock("@/server/stripe/catalog", () => ({
  isIINOfferKey: (value: unknown) => value === "research_service",
  resolveIINOffer: mocks.resolveIINOffer,
}));

import { POST } from "@/app/api/stripe/invoices/draft/route";

function makeRequest(body: unknown, key = "invoice_req_12345678") {
  return new Request("https://example.test/api/stripe/invoices/draft", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body),
  });
}

describe("POST /api/stripe/invoices/draft", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.requireAuth.mockResolvedValue("clerk_admin_1");
    mocks.userFindUnique.mockResolvedValue({ clerkId: "clerk_admin_1", role: "ADMIN" });
    mocks.subscriptionFindUnique.mockResolvedValue(null);
    mocks.iinOrderFindFirst.mockResolvedValue({ stripeCustomerId: "cus_test_123" });
    mocks.resolveIINOffer.mockResolvedValue({
      key: "research_service",
      department: "research_discovery",
      mode: "payment",
      price: { id: "price_test_research" },
      product: { id: "prod_test_research" },
    });
    mocks.invoiceCreate.mockResolvedValue({ id: "in_test_123", status: "draft" });
    mocks.invoiceItemCreate.mockResolvedValue({ id: "ii_test_123" });
    mocks.invoiceRetrieve.mockResolvedValue({
      id: "in_test_123",
      status: "draft",
      amount_due: 15_000,
      amount_paid: 0,
      total: 15_000,
      currency: "eur",
      due_date: null,
      status_transitions: { paid_at: null },
      hosted_invoice_url: null,
      invoice_pdf: null,
    });
    mocks.stripeInvoiceUpsert.mockResolvedValue({});
    mocks.getStripe.mockReturnValue({
      invoices: { create: mocks.invoiceCreate, retrieve: mocks.invoiceRetrieve },
      invoiceItems: { create: mocks.invoiceItemCreate },
    });
  });

  it("rejects non-admin callers before any Stripe write", async () => {
    mocks.userFindUnique.mockResolvedValue({ clerkId: "clerk_user_1", role: "USER" });
    const response = await POST(makeRequest({
      organizationId: "org_123",
      items: [{ offerKey: "research_service", quantity: 1 }],
    }));

    expect(response.status).toBe(403);
    expect(mocks.invoiceCreate).not.toHaveBeenCalled();
    expect(mocks.invoiceItemCreate).not.toHaveBeenCalled();
  });

  it("requires a caller idempotency key", async () => {
    const response = await POST(makeRequest({
      organizationId: "org_123",
      items: [{ offerKey: "research_service", quantity: 1 }],
    }, "bad"));

    expect(response.status).toBe(400);
    expect(mocks.invoiceCreate).not.toHaveBeenCalled();
  });

  it("creates a draft-only invoice from server-resolved Price IDs", async () => {
    const response = await POST(makeRequest({
      organizationId: "org_123",
      items: [{ offerKey: "research_service", quantity: 3 }],
    }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      invoiceId: "in_test_123",
      status: "draft",
      amountDue: 15_000,
      currency: "eur",
      finalized: false,
      sent: false,
      paymentCollectionStarted: false,
    });
    expect(mocks.invoiceCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_test_123",
        collection_method: "send_invoice",
        auto_advance: false,
        metadata: expect.objectContaining({
          billing_environment: "test",
          organization_id: "org_123",
          workflow: "owner_review_draft",
        }),
      }),
      { idempotencyKey: "iin-invoice-draft-clerk_admin_1-invoice_req_12345678" },
    );
    expect(mocks.invoiceItemCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_test_123",
        invoice: "in_test_123",
        pricing: {
          type: "price_details",
          price_details: { price: "price_test_research", product: "prod_test_research" },
          unit_amount_decimal: null,
        },
        quantity: 3,
        metadata: expect.objectContaining({
          offer_key: "research_service",
          department: "research_discovery",
        }),
      }),
      { idempotencyKey: "iin-invoice-line-clerk_admin_1-invoice_req_12345678-0" },
    );
    expect(mocks.stripeInvoiceUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { stripeInvoiceId: "in_test_123" },
      create: expect.objectContaining({
        stripeCustomerId: "cus_test_123",
        status: "draft",
        amountDue: 15_000,
        amountPaid: 0,
        currency: "eur",
        livemode: false,
        metadata: expect.objectContaining({
          workflow: "owner_review_draft",
          organization_id: "org_123",
        }),
      }),
    }));
    // The route intentionally stops after creating the draft and its line items.
    expect(mocks.invoiceCreate).toHaveBeenCalledTimes(1);
    expect(mocks.invoiceItemCreate).toHaveBeenCalledTimes(1);
  });

  it("rejects subscription Prices from the draft service-invoice path", async () => {
    mocks.resolveIINOffer.mockResolvedValue({
      key: "research_service",
      department: "research_discovery",
      mode: "subscription",
      price: { id: "price_test_subscription" },
      product: { id: "prod_test_subscription" },
    });
    const response = await POST(makeRequest({
      organizationId: "org_123",
      items: [{ offerKey: "research_service", quantity: 1 }],
    }));

    expect(response.status).toBe(400);
    expect(mocks.invoiceCreate).not.toHaveBeenCalled();
  });

  it("fails closed when an offer Price is not configured", async () => {
    mocks.resolveIINOffer.mockRejectedValue(new Error("BILLING_NOT_CONFIGURED:STRIPE_PRICE_ID_RESEARCH_SERVICE"));
    const response = await POST(makeRequest({
      organizationId: "org_123",
      items: [{ offerKey: "research_service", quantity: 1 }],
    }));

    expect(response.status).toBe(503);
    expect(mocks.invoiceCreate).not.toHaveBeenCalled();
  });
});
