export default function BillingSuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string; status?: string };
}) {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <h1>Payment successful</h1>
      <p>Your checkout was started successfully.</p>
      <p>
        Session ID: <strong>{searchParams?.session_id ?? "not provided"}</strong>
      </p>
      <p>
        In production, this page is informational only. The system must verify the Stripe webhook before granting access or marking the work as paid.
      </p>
    </main>
  );
}
