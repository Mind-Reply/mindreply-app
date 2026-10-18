import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { searchParams: { session_id?: string } };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  let paid = false;
  let pending = false;
  const sessionId = searchParams.session_id;

  if (sessionId && /^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (
        session.metadata?.package_key === "website_completion_gbp_600" &&
        session.mode === "payment" &&
        session.currency === "gbp" &&
        session.amount_total === 60_000
      ) {
        paid = session.payment_status === "paid";
        pending = session.payment_status === "unpaid";
      }
    } catch {
      // Never infer payment success from a redirect or expose provider errors.
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        {paid ? "Payment confirmed" : pending ? "Payment processing" : "Checkout status"}
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {paid
          ? "Your £600 Website Completion Package payment is confirmed. We will use the verified payment record to coordinate the next steps."
          : pending
            ? "Your payment has not yet been confirmed. Please allow time for the payment provider to finish processing. Do not submit another payment while this one is pending."
            : "We could not verify a completed payment from this link. Check your confirmation email or contact support before trying again."}
      </p>
      <p className="mt-8">
        <Link className="underline underline-offset-4" href="/">Return to MindReply</Link>
      </p>
    </main>
  );
}
